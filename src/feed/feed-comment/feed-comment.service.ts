import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedCommentRepository } from './feed-comment.repository';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FeedComment } from './feed-comment.entity';
import { FeedCommentLikeRepository } from './commnet-like/comment-like.repository';
import { FeedCommentLike } from './commnet-like/commnet-like.entity';
import { FeedCommentLikeService } from './commnet-like/comment-like.service';
import { FeedCommentMentionRepository } from './comment-mention/comment-mention.repository';
import { UserService } from '../../user/user.service';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class FeedCommentService {
  constructor(
    @InjectRepository(FeedCommentRepository)
    private feedCommentRepository: FeedCommentRepository,
    private feedCommentLikeRepository: FeedCommentLikeRepository,
    private feedCommentLikeService: FeedCommentLikeService,
    private feedCommentMentionRepository: FeedCommentMentionRepository,
    private userService: UserService,
  ) {}

  /*
   * 댓글 생성, 조회, 수정, 삭제 추가 해야함.
   * 가능하다면 댓글에서 언급을 통해 대댓글을 표시하고자 함.
   * 초기 구상 => 테이블 신규 생성해서 댓글id, 언급 유저id로 언급 상태를 저장. (대댓글, 팔로우와 유사 기능)
   * 대댓글 조회
   * */
  async getCount(feedId: string) {
    return await this.feedCommentRepository.countBy({ feedId });
  }

  async findByPage(
    options: IPaginationOptions,
    feedId: string,
    pageDate: Date,
  ): Promise<Pagination<any>> {
    const searchOptions: any = {
      join: {
        alias: 'feed_comment',
      },
      relations: [
        'writer',
        'writer.picture',
        'mentions',
        'mentions.mentionUser',
        'mentions.mentionUser.picture',
      ],
      where: (qb) => {
        qb.where({
          feedId: feedId,
          createdAt: LessThanOrEqual(pageDate),
        }).andWhere('feed_comment.parentId IS null');
      },
    };

    const commentPage = await paginate<FeedComment>(
      this.feedCommentRepository,
      options,
      searchOptions,
    );

    if (commentPage.items.length > 0) {
      for (const comment of commentPage.items) {
        comment.likeCount = await this.feedCommentLikeService.getCount(
          comment.id,
        );
      }
    }

    return commentPage;
  }

  async findSubByPage(
    options: IPaginationOptions,
    feedCommentId: string,
    pageDate: Date,
  ): Promise<Pagination<any>> {
    const searchOptions: any = {
      relations: [
        'writer',
        'writer.picture',
        'mentions',
        'mentions.mentionUser',
        'mentions.mentionUser.picture',
      ],
      where: {
        parentId: feedCommentId,
        createdAt: LessThanOrEqual(pageDate),
      },
    };

    const subCommentPage = await paginate<FeedComment>(
      this.feedCommentRepository,
      options,
      searchOptions,
    );

    if (subCommentPage.items.length > 0) {
      for (const comment of subCommentPage.items) {
        comment.likeCount = await this.feedCommentLikeService.getCount(
          comment.id,
        );
      }
    }

    return subCommentPage;
  }

  async findByPageWithUserBehavior(
    options: IPaginationOptions,
    feedId: string,
    userId: string,
    pageDate: Date,
  ): Promise<Pagination<any>> {
    const searchOptions: any = {
      join: {
        alias: 'feed_comment',
      },
      relations: [
        'writer',
        'writer.picture',
        'mentions',
        'mentions.mentionUser',
        'mentions.mentionUser.picture',
      ],
      where: (qb) => {
        qb.where({
          feedId: feedId,
          createdAt: LessThanOrEqual(pageDate),
        }).andWhere('feed_comment.parentId IS null');
      },
    };

    const commentPage = await paginate<FeedComment>(
      this.feedCommentRepository,
      options,
      searchOptions,
    );

    // 댓글 좋아요 불러와야 함.
    if (commentPage.items.length > 0) {
      const commentIds: string[] = commentPage.items.map((r) => r.id);
      const commentLikes: FeedCommentLike[] =
        await this.feedCommentLikeRepository.findCommentLikeInCommentIdsOfUser(
          commentIds,
          userId,
        );

      for (const comment of commentPage.items) {
        //like Count
        comment.likeCount = await this.feedCommentLikeService.getCount(
          comment.id,
        );

        //isLike
        if (commentLikes.length > 0) {
          const isLike = commentLikes.filter(
            (commentLike) => commentLike.feedCommentId === comment.id,
          ).length;
          comment.isLike = isLike > 0;
        }
      }
    }

    return commentPage;
  }

  async findSubByPageWithUserBehavior(
    options: IPaginationOptions,
    feedCommentId: string,
    userId: string,
    pageDate: Date,
  ): Promise<Pagination<any>> {
    const searchOptions: any = {
      relations: [
        'writer',
        'writer.picture',
        'mentions',
        'mentions.mentionUser',
        'mentions.mentionUser.picture',
      ],
      where: {
        parentId: feedCommentId,
        createdAt: LessThanOrEqual(pageDate),
      },
    };

    const subCommentPage = await paginate<FeedComment>(
      this.feedCommentRepository,
      options,
      searchOptions,
    );

    // 댓글 좋아요 불러와야 함.
    if (subCommentPage.items.length > 0) {
      const commentIds: string[] = subCommentPage.items.map((r) => r.id);
      const commentLikes: FeedCommentLike[] =
        await this.feedCommentLikeRepository.findCommentLikeInCommentIdsOfUser(
          commentIds,
          userId,
        );
      if (commentLikes.length > 0) {
        for (const comment of subCommentPage.items) {
          //like Count
          comment.likeCount = await this.feedCommentLikeService.getCount(
            comment.id,
          );

          //isLike
          if (commentLikes.length > 0) {
            const isLike = commentLikes.filter(
              (commentLike) => commentLike.feedCommentId === comment.id,
            ).length;
            comment.isLike = isLike > 0;
          }
        }
      }
    }

    return subCommentPage;
  }

  async createFeedComment(feedComment: FeedComment): Promise<FeedComment> {
    return await this.feedCommentRepository.save(feedComment);
  }

  async modifyFeedComment(
    feedCommentId: string,
    text: string,
  ): Promise<FeedComment> {
    return await this.feedCommentRepository.save({
      id: feedCommentId,
      text: text,
    });
  }

  async deleteFeedComment(feedCommentId: string): Promise<FeedComment> {
    const feedCommentRows: FeedComment | null =
      await this.feedCommentRepository.findOneBy({ id: feedCommentId });

    if (feedCommentRows) feedCommentRows.deletedAt = new Date();

    return await this.feedCommentRepository.save(feedCommentRows!);
  }

  async removeFeedComment(feedCommentId: string): Promise<void> {
    const feedComment: FeedComment | null = await this.feedCommentRepository.findOneBy({
      id: feedCommentId,
    });

    if (feedComment) {
      const feedCommentChildren: FeedComment[] =
        await this.feedCommentRepository.findBy({ parentId: feedComment.id });

      if (feedCommentChildren.length > 0) {
        await this.feedCommentRepository.remove(feedCommentChildren);
      }

      await this.feedCommentRepository.remove(feedComment);
    }
  }

  /**
   * 피드내 모든 댓글 삭제
   * @param feedId
   */
  async deleteAllFeedComment(feedId: string): Promise<void> {
    const feedComments: FeedComment[] =
      await this.feedCommentRepository.findAllFeedCommentWithMentionAndLikes(
        feedId,
      );

    await this.feedCommentRepository.remove(feedComments);
  }

  /**
   * 피드 및 관계 테이블 조회
   * @param feedId
   */
  async findFeedCommentWithRelations(feedId: string): Promise<FeedComment[]> {
    const searchOptions: any = {
      relations: ['writer', 'mentions', 'likes'],
      where: { feedId },
      order: {
        createdAt: 'ASC',
      },
    };

    const feedComments: FeedComment[] = await this.feedCommentRepository.find(
      searchOptions,
    );

    for (const feedComment of feedComments) {
      feedComment.writer.picture = await this.userService.getUserPictures(
        feedComment.writer.id,
      );
    }

    return feedComments;
  }
}
