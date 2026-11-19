---
title: shopify-bundle-builder
publish: true
aliases:
  - Bundle Builder
categories:
  - 프로젝트
updated: 2026-11-19
---

**shopify-bundle-builder**는 [[Son Jimin]]이 만든, 변형이 많은 상품 묶음을 광고 채널에서도 팔 수 있게 하는 Shopify 앱이다.[^1]

## 개요

README는 Bundle Builder를 Meta·Google·Pinterest·TikTok에서도 계속 팔 수 있는, 변형(variant)이 많은 묶음 상품용 Shopify 앱으로 소개한다.[^1] 저장소에는 제품 계획 문서와 GitHub Pages용 소개·문서 사이트(`site/`)가 함께 있다.[^1] 요금제는 Shopify managed pricing으로 Free, Growth($9.99), Pro($29)를 두는 것으로 적혀 있다.[^1]

## 주요 기능

- Cart Transform 함수: 묶음 구성 줄을 하나의 묶음 줄로 합치고, 가격은 구성 상품의 현재 가격에서 할인 단계를 뺀 값이며, 장바구니 그룹마다 다시 검증한다.[^1]
- 테마 앱 확장: 묶음 상품 페이지에 선택기를 그리고, 앱 프록시에서 받은 데이터로 구성 상품을 장바구니에 넣는다.[^1]
- 관리자 화면: 묶음 빌더, 대시보드·리포트, 요금제, 변경 기록이 있다.[^1]
- 웹훅: products, inventory_levels, locations, orders, GDPR(3종)을 받는다.[^1]
- 묶음을 지워도 구성 상품은 건드리지 않고 랜딩 상품만 보관 처리한다.[^1]

## 개발 기록

2026-10-06에 저장소를 만들고 cart transform, 관리자 화면, 테마 확장, 웹훅을 담은 Shopify 묶음 앱을 한 번에 커밋했다.[^1] README에는 병합 가격 방식, 광고 피드 노출, 할인 코드와의 상호작용, 다중 지점 재고, 함수 입력 크기·시간 제한처럼 실제 개발 스토어에서 아직 확인해야 할 항목이 남아 있다고 적혀 있다.[^1]

## 기술

저장소 언어는 TypeScript 74.1%, JavaScript 17.2% 순이다.[^1] README에 따르면 관리자 화면은 React Router, Polaris 웹 컴포넌트, Prisma와 Postgres로 만들었다.[^1] 배포용으로 Dockerfile, `fly.toml`, `render.yaml`이 있다.[^1]

[^1]: 원본 비공개
