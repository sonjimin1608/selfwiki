---
title: kospi-k-rating-data
publish: true
aliases:
  - K-Rating 데이터
categories:
  - 프로젝트
updated: 2026-11-19
---

**kospi-k-rating-data**는 [[Son Jimin]]의 저장소로, K-Rating 앱이 읽는 코스피200 종목 평가 공개 데이터 저장소다.[^1]

## 개요

README는 이 저장소를 [K-Rating](https://kospi-k-rating.web.app)(코스피200 FIFA 스타일 종목 평가)의 공개 데이터 저장소로 소개한다.[^1] 앱은 `raw.githubusercontent.com`에서 이 저장소의 `data/` 파일을 직접 읽는다.[^1] 네이버 금융 API는 브라우저에서 직접 부를 수 없어서, CORS를 허용하는 이 저장소가 중간 캐시 역할을 한다고 README에 적혀 있다.[^1] 저장소 설명은 "K-Rating 코스피200 데이터 (장중 매시 자동 갱신)"이다.[^1]

README는 데이터 출처를 네이버 금융 비공식 API로 적고, 데이터가 투자 참고용이며 투자 권유가 아니라고 밝힌다.[^1]

## 주요 기능

- 자동 갱신: GitHub Actions 워크플로가 평일 09:13~15:13 KST 매시와 15:43 장 마감 직후에 `scripts/build-data.js`를 다시 실행해 시세·점수·등급·알림을 만들고, 바뀐 것이 있을 때만 커밋한다.[^1]
- 골든크로스 알림: MACD 0선 아래 골든크로스가 새로 생기면 ntfy.sh로 푸시 알림을 보낸다.[^1]
- 데이터 구성: `data/summary.json`(200종목 요약, BUY/SELL·등급·시세), `data/stocks/{code}.json`(종목별 파트별 점수 산정 이유·목표주가·총평·차트), `data/alerts.json`(골든크로스 신호 30일 이력)이 있다.[^1]

## 개발 기록

저장소는 2026-07-07에 만들어졌다.[^1] 수집 원본에는 본인 이름으로 된 커밋이 없고, 마지막 푸시는 2026-11-19로 기록되어 있다.[^1]

## 기술

저장소 언어는 JavaScript 100%이다.[^1] README에 따르면 수집·스코어링 파이프라인 `scripts/build-data.js`는 Node 22에서 의존성 없이 돈다.[^1]

[^1]: 원본 비공개
