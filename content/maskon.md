---
title: maskon
publish: true
aliases:
  - MaskOn
categories:
  - 프로젝트
updated: 2026-11-19
infobox:
  인원: 3명
---

**maskon**은 [[Son Jimin]]이 참여한, 캐릭터 머리를 합성한 본인 영상을 만들고 공유하는 SNS Flutter 앱이다.[^1]

## 개요

README는 MaskOn을 ARKit 52 blendshape 표준 표정 추적과 Head-Swap 합성으로 캐릭터 머리를 입은 본인 영상을 생성·공유하는 SNS Flutter 앱으로 소개한다.[^1] 합성 방식은 사용자 영상의 머리 영역 전체를 캐릭터 머리 GLB로 바꾸고, 표정은 ARKit 52 blendshape 표준으로 맞추며, 몸은 사용자 영상 그대로 두는 것이다.[^1]

README의 분담표에는 작업자 세 명이 있다.[^1] sonjimin1608이 완료한 작업으로는 Backend 인프라 항목에 Firebase에서 Supabase로의 전면 마이그레이션(auth·database·storage), Supabase Auth와 딥링크 로그인 흐름, profiles·posts·comments·follows·notifications 테이블과 RLS·storage bucket 정책을 담은 `supabase/schema.sql`이 적혀 있다.[^1] 잠정 분담에서 sonjimin1608의 영역은 Supabase 인프라(DB·Auth·Storage·Schema), `lib/screens/**` UI 화면, 결제·본인인증 UI이며, 대기 작업 중 PG 결제·본인인증 UI와 SNS Feed UI의 잠정 담당으로도 적혀 있다.[^1] README는 이 분담이 표정 구현 채택 뒤 다시 정해진다고 적고 있다.[^1]

README 작성 시점에는 세 작업자가 각자 브랜치에서 표정 구현을 동시에 다시 진행해, 평가 후 가장 좋은 결과를 main에 병합하는 방식이 진행 중이었다.[^1] sonjimin1608의 작업 브랜치는 `son` / `son-hoom-myung`으로 적혀 있다.[^1]

## 주요 기능

- Head Swap 합성: 사용자 영상의 머리를 캐릭터 머리 GLB로 바꾸고, 사용자가 웃으면 캐릭터도 웃도록 표정을 맞춘다.[^1]
- 마스크 생성 4단계 파이프라인: 카테고리를 골라 5방향 마스크 이미지를 만들고(Nano Banana), 이를 3D mesh GLB로 바꾸고(Tripo3D), ARKit 52 blendshape로 rigging한 뒤(Python auto-rigging), 고유성 검증·R2 업로드·Identity 등록을 하는 구성이다.[^1]
- SNS 기능: 피드, 로그인, 프로필 화면과 profiles·posts·comments·follows·notifications 스키마가 README에 적혀 있다.[^1]

## 개발 기록

저장소는 2026-04-03에 만들어졌고, 같은 날 `son` 브랜치의 PR #1이 병합되었다.[^1] 2026-04-28에는 checkout 기능(feat) 커밋을 포함해 두 건을 커밋했다.[^1] 저장소의 마지막 푸시는 2026-05-15로 기록되어 있다.[^1]

## 기술

저장소 언어 비율은 Dart 39.2%, Python 33.8%, Kotlin 18.3% 순이다.[^1] README에 적힌 핵심 기술은 클라이언트 Flutter, Android 네이티브 Kotlin·Filament·MediaPipe Face Landmarker·ONNX Runtime·QNN(Snapdragon NPU)·OpenCV, 백엔드 Supabase(Auth·Postgres·RLS)와 Cloudflare R2, 마스크 이미지 생성 Nano Banana(Gemini 2.5 Flash Image), 3D mesh 생성 Tripo3D, auto-rigging Python(numpy·PIL)이다.[^1]

[^1]: 원본 비공개
