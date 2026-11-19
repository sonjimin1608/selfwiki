---
title: nook
publish: true
aliases:
  - Nook
  - 누크
categories:
  - 프로젝트
updated: 2026-11-19
---

**nook**은 [[Son Jimin]]의 저장소로, 주변 카페와 식당의 실시간 혼잡도를 확인하는 Flutter 앱이다.[^1]

## 개요

README는 Nook(누크)을 주변 카페와 식당의 실시간 혼잡도를 확인하는 Flutter 앱으로 소개한다.[^1] README에는 [App Store](https://apps.apple.com/kr/app/nook-누크/id6756519079)와 [Google Play](https://play.google.com/store/apps/details?id=com.jiminson.nook) 다운로드 링크가 있다.[^1] 라이선스는 MIT License로 적혀 있다.[^1]

## 주요 기능

- 일반 사용자: 근처 카페 지도 보기, 카페 목록과 상세 정보, 실시간 좌석 현황(여유/보통/혼잡/만석), 카페 위치와 운영 정보.[^1]
- 카페·식당 업주: 아이디와 비밀번호로 하는 업주 인증, 영업신고증을 올려 받는 관리자 승인, 네이버 지도 연동 카페 등록, 실시간 좌석 상태 관리, 업주 대시보드.[^1]
- README는 성능 최적화로 재방문 시 이미지 로딩 2.5초 → 0.1초, 3-Layer 캐싱으로 네트워크 요청 95% 감소, 이미지 크기 800x800 최적화를 적고 있다.[^1]

## 개발 기록

저장소는 2025-12-12에 만들어졌고, 본인 커밋은 34건이다.[^1] 첫날에는 Flutter 기본 파일에 이어 사진 업로드와 검증이 있는 업주 회원가입 화면, Firebase Cloud Functions·스토리지 규칙, Google Mobile Ads App ID 설정을 커밋했다.[^1] 2025-12-13에는 카페 관리 기능을 늘리고 이용약관·개인정보처리방침 화면을 넣었으며, 패키지 이름을 바꾸고 iOS 앱 아이콘과 실행 화면을 손봤다.[^1] 이어 Android 릴리스 서명 설정(12-14), 계정 설정·비밀번호 관리 화면과 캐시·새로고침 제한을 쓴 DB 읽기 최적화(12-18), 사업자 전화번호 선택 입력(12-19), 인증·업주 관리 개선(12-20), Firebase Hosting 설정과 여러 화면의 이미지 캐싱(12-24)을 커밋했다.[^1]

2026년 1월에는 Firebase Storage URL 캐싱 관리자(01-15), AdMob 설정과 Firebase Analytics 추가로 버전 1.0.2(01-16), 이미지 선택 최적화와 버전 1.0.3(01-23)을 커밋했다.[^1] 2026-01-27에는 민감한 파일을 `.gitignore`로 빼고, Functions를 제거해 Firebase Hosting 빌드 오류를 고친 뒤, 오래된 문서 파일들을 지웠다.[^1] 이것이 마지막 본인 커밋이다.[^1]

## 기술

저장소 언어 비율은 Dart 83.8%, C++ 6.4%, CMake 4.8% 순이다.[^1] README에 적힌 기술 스택은 Flutter 3.9+, Riverpod 2.x 상태 관리, Clean Architecture·Feature-first 구조, Firebase(Auth·Firestore·Storage) 백엔드, 네이버 지도 SDK와 Google Maps이다.[^1]

[^1]: 원본 비공개
