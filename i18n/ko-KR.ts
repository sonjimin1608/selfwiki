// selfwiki: Quartz v4.5.2 의 ko-KR.ts 를 복사해 분류·오류·푸터 문구만 바꾼 파일입니다.
// 배포 워크플로가 이 파일을 quartz/i18n/locales/ko-KR.ts 에 덮어씁니다.
import { Translation } from "./definition"

export default {
  propertyDefaults: {
    title: "제목 없음",
    description: "설명 없음",
  },
  components: {
    callout: {
      note: "노트",
      abstract: "개요",
      info: "정보",
      todo: "할일",
      tip: "팁",
      success: "성공",
      question: "질문",
      warning: "주의",
      failure: "실패",
      danger: "위험",
      bug: "버그",
      example: "예시",
      quote: "인용",
    },
    backlinks: {
      title: "백링크",
      noBacklinksFound: "백링크가 없습니다.",
    },
    themeToggle: {
      lightMode: "라이트 모드",
      darkMode: "다크 모드",
    },
    readerMode: {
      title: "리더 모드",
    },
    explorer: {
      title: "탐색기",
    },
    footer: {
      createdWith: "만든 도구:",
    },
    graph: {
      title: "그래프 뷰",
    },
    recentNotes: {
      title: "최근 게시글",
      seeRemainingMore: ({ remaining }) => `${remaining}건 더보기 →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `${targetSlug}의 포함`,
      linkToOriginal: "원본 링크",
    },
    search: {
      title: "검색",
      searchBarPlaceholder: "검색어를 입력하세요",
    },
    tableOfContents: {
      title: "목차",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `${minutes}분 분량`,
    },
  },
  pages: {
    rss: {
      recentNotes: "최근 게시글",
      lastFewNotes: ({ count }) => `최근 ${count} 건`,
    },
    error: {
      title: "문서를 찾을 수 없습니다",
      notFound: "없는 문서이거나 공개되지 않은 문서입니다.",
      home: "홈페이지로 돌아가기",
    },
    folderContent: {
      folder: "폴더",
      itemsUnderFolder: ({ count }) => `${count}건의 항목`,
    },
    tagContent: {
      tag: "분류",
      tagIndex: "분류 목록",
      itemsUnderTag: ({ count }) => `${count}건의 항목`,
      showingFirst: ({ count }) => `처음 ${count}개의 분류`,
      totalTags: ({ count }) => `분류 ${count}개`,
    },
  },
} as const satisfies Translation
