<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

ℹ️ℹ️ 본 파일에서는 firebase 및 인증키 연결 코드가 누락되었습니다. 구글 로그인, 이메일 발송 등의 코드는 작동하지 않습니다.


🚩 취미활동 커뮤니티(백엔드)

당시 영화, 애니, 피규어 시장의 커뮤니티 서비스 입니다. 인스타그램과 유사한 피드 게시물을 위주로 관리자 페이지에서 정보 전달을 위해 뉴스 페이지 같은 매거진 등의 기능을 개발하였으며, 1.5만명의 활성 유저를 관리하였습니다. 초기 aws 서비스의 lambda로 기획되어 개발되었으나 유지보수 기간 중 무료 클라우드 서버 인프라인 fly.io로 변경되었습니다.


📌 프로젝트 개요

목적: 예술계 기업을 효과적으로 소개하고 작가들을 모집하기 위한 반응형 웹사이트 개발

개발 기간: 프론트 포함 전체 9개월 ~ 12개월 소요

참여 인원: 4인 팀 프로젝트 (퍼블리싱/개발2/디자인)

담당: 프론트 40%, 백엔드 70% 이상 담당.

특징:

NestJS 및 TypeORM 사용

구동시 (http://localhost:3001/api-docs) 에서 Swagger를 통해 REST API 문서화

일부 Join쿼리 등 복잡한 쿼리는 (/src/feed/feed.repository.ts) 파일처럼 직접 처리


🚀 기술 스택

영역	기술

Frontend	Angular(HTML, SCSS, Typescript)

Backend	Nest.js(Node.js)

DB MySQL

Hosting / Infra	AWS (Lambda, CloudFront, S3, Route53, RDS, SES 등) -> Fly.io(Lambda, cloudfont 부분 계승)

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
