import { HttpException, Injectable } from '@nestjs/common';
import { FeedRepository } from './feed.repository';
import { Feed } from './feed.entity';
import { FeedModifyDto } from './dto/feed.modify.dto';
import { FeedTagRepository } from './feed-tag/feed-tag.repository';
import { FeedPictureRepository } from './feed-picture/feed-picture.repository';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FeedTag } from './feed-tag/feed-tag.entity';
import { FeedLikeRepository } from './feed-like/feed-like.repository';
import { FeedLike } from './feed-like/feed-like.entity';
import { FeedBookmark } from './feed-bookmark/feed-bookmark.entity';
import { FeedBookmarkRepository } from './feed-bookmark/feed-bookmark.repository';
import { FeedLikeService } from './feed-like/feed-like.service';
import { FeedCommentService } from './feed-comment/feed-comment.service';
import { FollowService } from '../user/follow/follow.service';
import { Follow } from '../user/follow/follow.entity';
import { FileService } from '../file/file.service';
import { FileDeleteDto } from '../file/dto/file.delete.dto';
import { FeedPicture } from './feed-picture/feed-picture.entity';
import { UserService } from '../user/user.service';
import { FeedBookmarkService } from './feed-bookmark/feed-bookmark.service';
import { FindFeedRepository } from './feed-dao/find-feed.repository';
import { FindFeedEntity } from './feed-dao/find-feed.entity';
import { Between, ILike, IsNull, LessThanOrEqual } from 'typeorm';
import { FeedFilteringDto } from './dto/feed.filtering.dto';

@Injectable()
export class FeedService {
  constructor(
    private feedRepository: FeedRepository,
    private feedTagRepository: FeedTagRepository,
    private feedPictureRepository: FeedPictureRepository,
    private feedLikeRepository: FeedLikeRepository,
    private feedBookmarkRepository: FeedBookmarkRepository,
    private feedLikeService: FeedLikeService,
    private feedCommentService: FeedCommentService,
    private fileService: FileService,
    private followService: FollowService,
    private userService: UserService,
    private feedBookmarkService: FeedBookmarkService,
    private findFeedRepository: FindFeedRepository,
  ) {}

  /**
   * 공개 피드 페이지 형식 조회
   * @param options { page, limit }
   * @param pageDate
   */
  async findByPage(
    options: IPaginationOptions,
    pageDate: Date,
  ): Promise<Pagination<any>> {
    const searchOptions: any = {
      relations: ['writer', 'writer.picture', 'tags'],
      where: {
        state: 'feed_state_posting',
        sortedAt: LessThanOrEqual(pageDate),
        deletedAt: IsNull(),
      },
      order: {
        sortedAt: 'DESC',
      },
    };

    const feedPage = await paginate<Feed>(
      this.feedRepository,
      options,
      searchOptions,
    );

    if (feedPage.items.length > 0) {
      for (const feed of feedPage.items) {
        // 사진 수
        feed.pictureCount = await this.feedPictureRepository.countBy({
          feedId: feed.id,
        });
        // 좋아요 수
        feed.likeCount = await this.feedLikeService.getCount(feed.id);
        // 댓글 수
        feed.commentCount = await this.feedCommentService.getCount(feed.id);
      }
    }

    return feedPage;
  }

  /**
   * 관리자 피드 페이지 조회
   * @param options { page, limit }
   */
  async findByPageAll(options: IPaginationOptions): Promise<Pagination<any>> {
    const searchOptions: any = {
      relations: ['writer', 'writer.picture', 'tags', 'pictures', 'likeUsers'],
      where: {
        state: 'feed_state_posting',
      },
      order: {
        sortedAt: 'DESC',
      },
    };

    const feedPage = await paginate<Feed>(
      this.feedRepository,
      options,
      searchOptions,
    );

    return feedPage;
  }

  /**
   * 피드 (로그인)
   * @param options { page, limit }
   * @param userId
   * @param pageDate
   */
  async findByPageWithUserBehavior(
    options: IPaginationOptions,
    userId: string,
    pageDate: Date,
  ): Promise<Pagination<any>> {
    const searchOptions: any = {
      relations: ['writer', 'writer.picture', 'tags'],
      where: {
        state: 'feed_state_posting',
        sortedAt: LessThanOrEqual(pageDate),
        deletedAt: IsNull(),
      },
      order: {
        sortedAt: 'DESC',
      },
    };

    const feedPage = await paginate<Feed>(
      this.feedRepository,
      options,
      searchOptions,
    );

    if (feedPage.items.length > 0) {
      const feedIds: string[] = feedPage.items.map((r) => r.id);
      const feedLikes: FeedLike[] =
        await this.feedLikeRepository.findFeedLikeInFeedIdsOfUser(
          feedIds,
          userId,
        );
      const feedBookmarks: FeedBookmark[] =
        await this.feedBookmarkRepository.findFeedBookmarkInFeedIdsOfUser(
          feedIds,
          userId,
        );

      for (const feed of feedPage.items) {
        feed.pictureCount = await this.feedPictureRepository.countBy({
          feedId: feed.id,
        });
        // 좋아요 수
        feed.likeCount = await this.feedLikeService.getCount(feed.id);
        // 댓글 수
        feed.commentCount = await this.feedCommentService.getCount(feed.id);

        if (feedLikes.length > 0) {
          const isLike = feedLikes.filter(
            (feedLike) => feedLike.feedId === feed.id,
          ).length;
          feed.isLike = isLike > 0;
        }
        if (feedBookmarks.length > 0) {
          const isBookmark = feedBookmarks.filter(
            (feedBookmark) => feedBookmark.feedId === feed.id,
          ).length;
          feed.isBookmark = isBookmark > 0;
        }
      }
    }

    // console.log('findByPageWithBookmarkAndLike : ', feedPage);

    return feedPage;
  }

  async findByPageOverFollow(
    options: IPaginationOptions,
    userId: string,
    pageDate: Date,
  ): Promise<Pagination<Feed>> {
    // 팔로우한 인원 조회
    const followUsers = await this.followService.getFollowUsers(userId);
    const followUserIds = followUsers.map((r) => r.toUser);

    const searchOptions: any = {
      join: {
        alias: 'feed',
      },
      relations: ['pictures', 'writer', 'writer.picture', 'tags'],
      where: (qb) => {
        qb.where({
          state: 'feed_state_posting',
          deletedAt: IsNull(),
          uploadedAt: LessThanOrEqual(pageDate),
        }).andWhere('feed.userId IN (:followUserIds)', {
          followUserIds: followUserIds,
        });
      },
    };

    // 피드 조회, userId in (followUserIds)
    const feedPage = await paginate<Feed>(
      this.feedRepository,
      options,
      searchOptions,
    );

    // 피드 상세 형식으로 추가로 불러야할 항목들 부르기
    if (feedPage.items.length > 0) {
      const feedIds: string[] = feedPage.items.map((r) => r.id);
      const feedLikes: FeedLike[] =
        await this.feedLikeRepository.findFeedLikeInFeedIdsOfUser(
          feedIds,
          userId,
        );
      const feedBookmarks: FeedBookmark[] =
        await this.feedBookmarkRepository.findFeedBookmarkInFeedIdsOfUser(
          feedIds,
          userId,
        );

      for (const feed of feedPage.items) {
        feed.likeCount = await this.feedLikeService.getCount(feed.id);
        feed.likeUsers = await this.feedLikeRepository.getFeedLikeUsersOfLimit(
          feed.id,
        );
        feed.commentCount = await this.feedCommentService.getCount(feed.id);

        if (feedLikes.length > 0) {
          const isLike = feedLikes.filter(
            (feedLike) => feedLike.feedId === feed.id,
          ).length;
          feed.isLike = isLike > 0;
        }
        if (feedBookmarks.length > 0) {
          const isBookmark = feedBookmarks.filter(
            (feedBookmark) => feedBookmark.feedId === feed.id,
          ).length;
          feed.isBookmark = isBookmark > 0;
        }
      }
    }
    return feedPage;
  }

  async findByPageOverBookmark(
    options: IPaginationOptions,
    userId: string,
  ): Promise<Pagination<Feed>> {
    // 북마크한 피드 조회
    const bookmarkFeeds = await this.feedBookmarkRepository.findBy({
      userId: userId,
    });

    const bookmarkCount = await this.feedBookmarkRepository.countBy({
      userId: userId,
    });

    const bookmarkFeedIds = bookmarkFeeds.map((r) => r.feedId);

    const searchOptions: any = {
      join: {
        alias: 'feed',
      },
      relations: ['writer', 'writer.picture', 'tags'],
      where: (qb) => {
        qb.where({
          state: 'feed_state_posting',
          deletedAt: IsNull(),
        }).andWhere('feed.id IN (:bookmarkFeedIds)', {
          bookmarkFeedIds: bookmarkFeedIds,
        });
      },
    };

    const feedPage = await paginate<Feed>(
      this.feedRepository,
      options,
      searchOptions,
    );

    feedPage.meta.totalCount = bookmarkCount;

    // 현재 화면상의 필요없는 데이터 주석처리
    if (feedPage.items.length > 0) {
      /*const feedIds: string[] = feedPage.items.map((r) => r.id);
      const feedLikes: FeedLike[] =
        await this.feedLikeRepository.findFeedLikeInFeedIdsOfUser(
          feedIds,
          userId,
        );*/

      for (const feed of feedPage.items) {
        // 필요없는 사진데이터 날리기
        if (feed.pictures){
          feed.pictures = new FeedPicture[''];
        }
        

        //그 외 표시 데이터 호출
        /*feed.likeCount = await this.feedLikeService.getCount(feed.id);
        feed.likeUsers = await this.feedLikeRepository.getFeedLikeUsersOfLimit(
          feed.id,
        );
        feed.commentCount = await this.feedCommentService.getCount(feed.id);

        if (feedLikes.length > 0) {
          const isLike = feedLikes.filter(
            (feedLike) => feedLike.feedId === feed.id,
          ).length;
          feed.isLike = isLike > 0;
        }*/

        // 북마크한 피드만 불렀기에 isBookmark 를 true 상태로 전환
        feed.isBookmark = true;
      }
    }
    return feedPage;
  }

  /**
   * 비로그인 피드 상세조회
   * @param feedId
   */
  async findByFeedId(feedId: string): Promise<Feed[]> {
    const feed: Feed[] = await this.feedRepository.findByFeedId(feedId);
    if (feed.length > 0) {
      feed[0].likeCount = await this.feedLikeService.getCount(feedId);
      feed[0].likeUsers = await this.feedLikeRepository.getFeedLikeUsersOfLimit(
        feedId,
      );
      feed[0].commentCount = await this.feedCommentService.getCount(feedId);
    }
    return feed;
  }

  /**
   * 로그인 피드 상세조회 (작업중)
   * @param feedId
   * @param userId
   */
  async findByFeedIdWithUserBehavior(
    feedId: string,
    userId: string,
  ): Promise<Feed[]> {
    const feed: Feed[] = await this.feedRepository.findByFeedId(feedId);

    if (feed.length > 0) {
      feed[0].likeCount = await this.feedLikeService.getCount(feedId);
      if (feed[0].likeCount > 0) {
        feed[0].likeUsers =
          await this.feedLikeRepository.getFeedLikeUsersOfLimit(feedId);
      }
      feed[0].commentCount = await this.feedCommentService.getCount(feedId);

      const feedLikes: FeedLike[] =
        await this.feedLikeRepository.findFeedLikeInFeedIdOfUser(
          feedId,
          userId,
        );
      const feedBookmarks: FeedBookmark[] =
        await this.feedBookmarkRepository.findFeedBookmarkInFeedIdOfUser(
          feedId,
          userId,
        );

      if (feedLikes.length > 0) {
        feed[0].isLike = true;
      }
      if (feedBookmarks.length > 0) {
        feed[0].isBookmark = true;
      }
    }

    feed[0].writer.isFollow = await this.followService.checkFollowUser(
      feed[0].userId,
      userId,
    );

    return feed;
  }

  /**
   * 피드 상세 하단 피드 목록 조회
   * 현재 게시글보다 오래된 게시물만 조회
   * @param options
   * @param feedId
   */
  async findByPageUnderDate(options: IPaginationOptions, feedId: string) {
    const feed = await this.feedRepository.findOneBy({ id: feedId });

    if(!feed){
      throw new HttpException(
        { code: 'failure', message: '피드를 조회할 수 없습니다.' },
        500,
      );
    }

    const searchOptions: any = {
      relations: ['writer', 'writer.picture', 'tags'],
      where: (qb) => {
        qb.where({
          state: 'feed_state_posting',
          deletedAt: IsNull(),
        }).andWhere('uploaded_at < :uploadedAt', {
          uploadedAt: feed.uploadedAt,
        });
      },
    };

    const feedPage = await paginate<Feed>(
      this.feedRepository,
      options,
      searchOptions,
    );

    if (feedPage.items.length > 0) {
      for (const feed of feedPage.items) {
        // 사진 수
        feed.pictureCount = await this.feedPictureRepository.countBy({
          feedId: feed.id,
        });
        // 좋아요 수
        feed.likeCount = await this.feedLikeService.getCount(feed.id);
        // 댓글 수
        feed.commentCount = await this.feedCommentService.getCount(feed.id);
      }
    }

    return feedPage;
  }

  /*
   * 피드생성 - 작업 중 중단
   * 기존 피드 있을 시, 해당 정보 리턴 해야함
   * */
  async createFeed(rewrite: string, userId: string): Promise<Feed> {
    let feedRows: Feed | null = await this.feedRepository.findOne(
      {
        where : {
        userId: userId,
        state: 'feed_state_pending',
        },
        relations: ['pictures', 'tags']
      },
    );

    // 피드 재생성 여부 확인
    if (rewrite === 'true' && feedRows) {
      //생성된 피드 삭제
      if (feedRows.pictures.length > 0) {
        for (const feedPicture of feedRows.pictures) {
          const fileInfo: FileDeleteDto = new FileDeleteDto();
          fileInfo.tag = 'feed';
          fileInfo.tagInId = feedRows.id;
          fileInfo.url = feedPicture.url;
          await this.fileService.deleteFile(fileInfo);
        }
      }

      if (feedRows.tags && feedRows.tags.length > 0) {
        await this.feedTagRepository.delete({ feedId: feedRows.id });
      }

      await this.feedRepository.delete({ id: feedRows.id });
      feedRows = null;
    }

    if (!feedRows || feedRows == null) {
      feedRows = await this.feedRepository.save({ userId: userId });
      feedRows = await this.feedRepository.findOne(
        {
          where : { id: feedRows.id },
          relations: ['pictures', 'tags'] 
        },
      );
    }

    return feedRows!;
  }

  /*
   * 피드 수정 - 작업 완료
   * 현재 웹 반응 => 피드 글쓰기 완료 시, 업데이트
   * */
  async updateFeed(id: string, feedModifyDto: FeedModifyDto): Promise<Feed> {
    const feedRows: Feed | null = await this.feedRepository.findOneBy({ id });

    if (!feedRows){
      throw new HttpException(
        { code: 'failure', message: '피드를 찾지 못하였습니다. 다시 시도해주세요.' },
        500,
      );
    }

    if ( feedModifyDto.content !== '') {
      feedRows.content = feedModifyDto.content;
    }
    if (feedModifyDto.picture !== '') {
      feedRows.picture = feedModifyDto.picture;
    }

    if (feedModifyDto.posting) {
      feedRows.state = 'feed_state_posting';
      feedRows.uploadedAt = new Date();
      feedRows.sortedAt = new Date();
    }

    return await this.feedRepository.save(feedRows);
  }

  /**
   * 피드 수정 버튼으로 인한 이벤트
   * @param feed
   */
  async modifyFeed(feed: Feed) {
    const feedRow = await this.feedRepository.save({
      id: feed.id,
      content: feed.content,
      picture: feed.picture,
    });

    feedRow.tags = await this.modifyFeedOnTags(feed);

    feedRow.pictures = await this.modifyFeedOnPictures(feed);

    return feedRow;
  }

  async modifyFeedOnTags(feed: Feed): Promise<FeedTag[]> {
    await this.feedTagRepository.delete({ feedId: feed.id });

    if (feed.tags){
      for (const tag of feed.tags) {
        await this.feedTagRepository.save({ feedId: feed.id, name: tag.name });
      }
    }
    
    const feedTagRows = await this.feedTagRepository.findBy({ feedId: feed.id });

    return feedTagRows;
  }

  async modifyFeedOnPictures(feed: Feed): Promise<FeedPicture[]> {
    const feedPictureRows = await this.feedPictureRepository.findBy({
      feedId: feed.id,
    });

    if (feed.pictures.length < feedPictureRows.length) {
      for (const [index, feedPicture] of feedPictureRows.entries()) {
        let sameCount = 0;
        for (const getFeedPicture of feed.pictures) {
          if (feedPicture.url === getFeedPicture.url) {
            sameCount += 1;
          }
        }
        if (sameCount === 0) {
          await this.fileService.deleteFile({
            tag: 'feed',
            tagInId: feedPicture.feedId,
            url: feedPicture.url,
          });
          feedPictureRows.slice(index, 1);
        }
      }
    }

    return feedPictureRows;
  }

  /*
   * 피드 삭제 - 작업 완료
   * */
  async deleteFeed(id: string): Promise<void> {
    const feedRows: Feed | null = await this.feedRepository.findOneBy({ id });
    
    if (feedRows){
      feedRows.deletedAt = new Date();

      await this.feedRepository.save(feedRows);
    }
  }

  async findByLikePage(
    options: IPaginationOptions,
    feedId: string,
    pageDate: Date,
  ): Promise<Pagination<FeedLike>> {
    const searchOptions: any = {
      relations: ['user', 'user.picture'],
      where: (qb) => {
        qb.where({
          feedId: feedId,
          createdAt: LessThanOrEqual(pageDate),
        });
      },
    };

    const feedLikePages = await paginate<FeedLike>(
      this.feedLikeRepository,
      options,
      searchOptions,
    );

    return feedLikePages;
  }

  /**
   * 피드 좋아요한 인원 리스트 조회 - 작업 완료
   * @param options
   * @param feedId
   * @param userId
   * @param pageDate
   */
  async findByLikePageWithUserBehavior(
    options: IPaginationOptions,
    feedId: string,
    userId: string,
    pageDate: Date,
  ): Promise<Pagination<FeedLike>> {
    const searchOptions: any = {
      relations: ['user', 'user.picture'],
      where: {
        feedId: feedId,
        createdAt: LessThanOrEqual(pageDate),
      },
    };

    const feedLikePages = await paginate<FeedLike>(
      this.feedLikeRepository,
      options,
      searchOptions,
    );

    // user별로 isFllow 추가 해야함
    if (feedLikePages.items.length > 0) {
      const followUsers: Follow[] = await this.followService.getFollowUsers(
        userId,
      );

      feedLikePages.items.forEach((feedLike) => {
        if (followUsers.length > 0) {
          const isFollow = followUsers.filter(
            (follow) => follow.toUser === feedLike.userId,
          ).length;

          feedLike.user.isFollow = isFollow > 0;
        }
      });
    }
    return feedLikePages;
  }

  /**
   * 마이페이지 피드 메인 조회
   * @param options
   * @param userId
   * @param pageDate
   */
  async findMyPageFeedList(
    options: IPaginationOptions,
    userId: string,
    pageDate: Date,
  ): Promise<Pagination<Feed>> {
    const searchOptions: any = {
      where: {
        userId: userId,
        state: 'feed_state_posting',
        sortedAt: LessThanOrEqual(pageDate),
        deletedAt: IsNull(),
      },
      order: {
        sortedAt: 'DESC',
      },
    };

    const feedPage = await paginate<Feed>(
      this.feedRepository,
      options,
      searchOptions,
    );

    const totalCount: number = await this.feedRepository.count({
      where: { userId, state: 'feed_state_posting', deletedAt: IsNull() },
    });

    // 피드 메인에 출력되는 개수 외 카운트
    
    if (feedPage.items.length >= Number(options.limit)) {
      feedPage.meta.otherCount = totalCount - feedPage.items.length;
    }

    feedPage.meta.totalCount = totalCount;

    return feedPage;
  }

  /**
   * 피드 정보들 find
   * @param feedList
   * @param userId
   */
  async findFeedTagAndCommentAndLikeAndBookmark(
    feedList: Feed[],
    userId: string,
  ): Promise<Feed[]> {
    const feedListResult: Feed[] = [...feedList];

    if (feedListResult.length > 0) {
      const feedIds: string[] = feedListResult.map((r) => r.id);

      // 태그
      const feedTags: FeedTag[] =
        await this.feedTagRepository.getFeedTagInFeedIds(feedIds);

      // 좋아요
      const feedLikes: FeedLike[] =
        await this.feedLikeRepository.findFeedLikeIds(feedIds);

      // 북마크
      const feedBookmarks: FeedBookmark[] =
        await this.feedBookmarkRepository.findFeedBookmarkInFeedIds(feedIds);

      const feedPictures: FeedPicture[] =
        await this.feedPictureRepository.findFeedPictureInFeedIds(feedIds);

      for (const feed of feedListResult) {
        // 댓글 갯수
        feed.commentCount = await this.feedCommentService.getCount(feed.id);

        // 업로드 한 사진
        feed.pictures = feedPictures.filter(
          (feedPicture) => feedPicture.feedId === feed.id,
        );

        // 사진 개수
        feed.pictureCount = feed.pictures.length;

        const filteredFeedLike: FeedLike[] = feedLikes.filter(
          (feedLike) => feedLike.feedId === feed.id && feed.userId === userId,
        );

        // 좋아요 여부
        feed.isLike = filteredFeedLike.length > 0;

        const exposureUserIds: string[] = [];

        filteredFeedLike.some((feedLike, index) => {
          exposureUserIds.push(feedLike.userId);
          return index === 2;
        });

        if (exposureUserIds.length > 0) {
          feed.exposureUser = await this.userService.findUserIds(
            exposureUserIds,
          );
        }

        feed.writingUser = await this.userService.findById(feed.userId);
        delete feed.writingUser.password;

        // 북마크 여부
        feed.isBookmark =
          feedBookmarks.filter(
            (feedBookmark) =>
              feedBookmark.feedId === feed.id && feed.userId === userId,
          ).length > 0;

        // 좋아요 개수
        feed.likeCount = feedLikes.filter(
          (feedLike) => feedLike.feedId === feed.id,
        ).length;

        // 연관 태그
        feed.tags = feedTags.filter((feedTag) => feedTag.feedId === feed.id);
      }
    }

    return feedListResult;
  }

  /**
   * 피드 삭제 (물리적 삭제)
   * @param feedId
   */
  async deleteRealFeed(feedId: string): Promise<void> {
    const feed: FindFeedEntity | null =
      await this.findFeedRepository.findFeedWithRelations(feedId);

    if (!feed) {
      throw new HttpException(
        { code: 'failure', message: '삭제할 피드가 존재하지 않습니다.' },
        500,
      );
    }

    // 피드 댓글
    await this.feedCommentService.deleteAllFeedComment(feedId);

    // 피드 북마크
    await this.feedBookmarkService.deleteAllBookmarkOfFeed(feedId);

    // 삭제
    await this.findFeedRepository.remove(feed);
  }

  /**
   * 피드 및 연관 테이블 조회
   * @param feedId
   */
  async findFeedWithRelations(feedId: string): Promise<FindFeedEntity | null> {
    const searchOptions: any = {
      relations: [
        'pictures',
        'likes',
        'tags',
        'comments',
        'bookmarks',
        'writer',
      ],
      where: { feedId, state: 'feed_state_posting' },
    };
    return await this.findFeedRepository.findOneBy(searchOptions);
  }

  /**
   * 유저 피드 목록 및 연관 테이블 조회
   * @param userId
   */
  async findAllFeedWithRelationsForUser(
    userId: string,
  ): Promise<FindFeedEntity[]> {
    return await this.findFeedRepository.findAllFeedWithRelations(userId);
  }

  /**
   * 피드상세 페이지
   * @param pageOptions
   * @param userId
   * @param pageDate
   */
  async findFeedDetailPage(
    pageOptions: IPaginationOptions,
    userId: string,
    pageDate: Date,
  ): Promise<Pagination<FindFeedEntity>> {
    const searchOptions: any = {
      relations: [
        'pictures',
        'likes',
        'tags',
        'comments',
        'bookmarks',
        'writer',
      ],
      where: {
        userId: userId,
        state: 'feed_state_posting',
        createdAt: LessThanOrEqual(pageDate),
      },
      order: {
        createdAt: 'DESC',
      },
    };

    const feedPage = await paginate<FindFeedEntity>(
      this.findFeedRepository,
      pageOptions,
      searchOptions,
    );

    if (feedPage.items.length > 0) {
      for (const feedDetail of feedPage.items) {
        feedDetail.isLike =
          feedDetail.likes.filter((like) => like.userId === userId).length > 0;
        feedDetail.isBookmark =
          feedDetail.bookmarks.filter((bookmark) => bookmark.userId === userId)
            .length > 0;
        feedDetail.pictureCount = feedDetail.pictures.length;
        feedDetail.likeCount = feedDetail.likes.length;
        feedDetail.commentCount = feedDetail.comments.length;

        const exposureUserIds: string[] = [];

        if (feedDetail.likes?.length > 0) {
          feedDetail.likes.some((feedLike, index) => {
            exposureUserIds.push(feedLike.userId);
            return index === 2;
          });

          if (exposureUserIds.length > 0) {
            feedDetail.exposureUser = await this.userService.findUserIds(
              exposureUserIds,
            );
          }
        }

        feedDetail.writer.picture = await this.userService.getUserPictures(
          feedDetail.writer.id,
        );
      }
    }

    return feedPage;
  }

  async findFeedOtherUserPage(
    pageOptions: IPaginationOptions,
    userId: string,
    otherUserId: string,
  ): Promise<Pagination<FindFeedEntity>> {
    const searchOptions: any = {
      relations: [
        'pictures',
        'likes',
        'tags',
        'comments',
        'bookmarks',
        'writer',
      ],
      where: { userId, state: 'feed_state_posting' },
    };

    const feedPage = await paginate<FindFeedEntity>(
      this.findFeedRepository,
      pageOptions,
      searchOptions,
    );

    if (feedPage.items.length > 0) {
      for (const feedDetail of feedPage.items) {
        feedDetail.isLike =
          feedDetail.likes.filter((like) => like.userId === otherUserId)
            .length > 0;
        feedDetail.isBookmark =
          feedDetail.bookmarks.filter(
            (bookmark) => bookmark.userId === otherUserId,
          ).length > 0;
        feedDetail.pictureCount = feedDetail.pictures.length;
        feedDetail.likeCount = feedDetail.likes.length;
        feedDetail.commentCount = feedDetail.comments.length;

        const exposureUserIds: string[] = [];

        if (feedDetail.likes?.length > 0) {
          feedDetail.likes.some((feedLike, index) => {
            exposureUserIds.push(feedLike.userId);
            return index === 2;
          });

          if (exposureUserIds.length > 0) {
            feedDetail.exposureUser = await this.userService.findUserIds(
              exposureUserIds,
            );
          }
        }

        feedDetail.writer.picture = await this.userService.getUserPictures(
          feedDetail.writer.id,
        );
      }
    }

    return feedPage;
  }

  /**
   * 피드 필터링 검색
   * @param feedFilteringDto
   * @param pageOptions
   */
  async findFilteredFeedPages(
    feedFilteringDto: FeedFilteringDto,
    pageOptions: IPaginationOptions,
  ): Promise<Pagination<FindFeedEntity>> {
    const searchOptions: any = {
      relations: ['pictures', 'likes', 'comments', 'bookmarks', 'writer'],
      where: {
        state: 'feed_state_posting',
      },
      order: {
        createdAt: 'DESC',
      },
    };

    if (feedFilteringDto.content) {
      searchOptions.where.content = ILike(`%${feedFilteringDto.content}%`);
    }

    if (feedFilteringDto.email) {
      searchOptions.where.writer = {
        ...searchOptions.where.writer,
        email: ILike(`%${feedFilteringDto.email}%`),
      };
    }

    if (feedFilteringDto.nickname) {
      searchOptions.where.writer = {
        ...searchOptions.where.writer,
        nickname: ILike(`%${feedFilteringDto.nickname}%`),
      };
    }

    if (feedFilteringDto.isIncludeDate) {
      searchOptions.where = {
        ...searchOptions.where,
        createdAt: Between(feedFilteringDto.from, feedFilteringDto.to),
      };
    }

    return await paginate<FindFeedEntity>(
      this.findFeedRepository,
      pageOptions,
      searchOptions,
    );
  }
}
