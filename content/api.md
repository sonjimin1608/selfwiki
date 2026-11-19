---
title: api
publish: true
categories:
  - 프로젝트
updated: 2026-11-19
---

**api**는 [[Son Jimin]]이 커밋한 매장·주문·재고 관리용 Spring Boot 백엔드와 React 프런트엔드 저장소다.[^1]

## 개요

저장소에는 README와 설명이 없다.[^1] 커밋 메시지로 보면 사용자·매장, 주문, 재료(재고)·레시피, 카테고리·상품, 테이블을 다루는 백엔드 API와 `storeos-front`라는 프런트엔드를 함께 담고 있다.[^1]

## 주요 기능

- 사용자 가입·로그인과 매장 관리 API.[^1]
- 주문·재고(재료) 관리, 카테고리·재료·레시피 관리 API.[^1]
- 관리자·매니저 승인 기능과 관리자 대시보드, 파일 업로드를 포함한 매니저 가입 절차.[^1]
- 프런트엔드의 랜딩·가입·매장 페이지.[^1]

## 개발 기록

2026-02-01 첫 커밋 뒤, 2월 2일에 Category·Ingredient·Orders·Product·Recipe·StoreTable·Users 등 엔티티 클래스와 결제·상품·테이블 상태 enum, 리포지토리 인터페이스를 추가했다.[^1] 2월 4~5일에는 재고·주문 관리 서비스와 컨트롤러, DTO를 만들었다.[^1] 2월 6일에는 DTO를 요청별 클래스(`CreateUserRequest` 등)로 정리하고 사용자·매장 컨트롤러를 추가했으며, 로그인 응답에 매장 ID를 넣었다.[^1]

2월 7일 React·Vite·Axios로 `storeos-front` 프로젝트를 시작했고, 2월 9일 CORS 지원과 랜딩·가입·매장 페이지, 스타일을 더했다.[^1] 2월 10일에는 관리자·매니저 승인, 사용자 인증과 관리자 대시보드, 파일 업로드가 들어간 매니저 가입을 구현했다.[^1] 2월 11일 코드 구조를 정리하고 테이블 관리 DTO를 추가했다.[^1]

2월 21일에는 카테고리·재료·레시피 관리 백엔드 API를 구현하고, 재료·레시피 수량 타입을 Double로 바꾸었으며, `InventoryController`를 `IngredientController`로 대체했다.[^1] 본인 커밋은 모두 22개다.[^1]

## 기술

저장소 언어는 JavaScript 56.4%, Java 42.6%, CSS 0.8%, HTML 0.2%이다.[^1] `build.gradle` 의존성에는 Spring Boot(Web, Data JPA, WebSocket), MySQL Connector/J, Lombok이 있다.[^1] 프런트엔드는 커밋 메시지에 따르면 React, Vite, Axios로 시작했다.[^1]

[^1]: 원본 비공개
