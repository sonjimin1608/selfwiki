import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import {
  CategoriesAsTags,
  PretendardFont,
  SanitizeHtml,
  TranscludeCycleGuard,
} from "./quartz/plugins/transformers/selfwiki"

/**
 * selfwiki 사이트 설정 (Quartz v4.5.2)
 * 이 파일은 selfwiki publish가 자동으로 만들고 덮어씁니다. 직접 고치지 마세요.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Son Jimin 위키",
    pageTitleSuffix: " - Son Jimin 위키",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "ko-KR",
    baseUrl: "sonjimin1608.github.io/selfwiki",
    ignorePatterns: ["private", "templates", ".obsidian", "raw"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "local",
      cdnCaching: false,
      typography: {
        header: "Pretendard Variable",
        body: "Pretendard Variable",
        code: "D2Coding",
      },
      colors: {
        lightMode: {
          light: "#fbfaf7",
          lightgray: "#e4e1d8",
          gray: "#77736a",
          darkgray: "#33302b",
          dark: "#1c1a17",
          secondary: "#2f4fb3",
          tertiary: "#b0502a",
          highlight: "rgba(47, 79, 179, 0.08)",
          textHighlight: "#ffd86b88",
        },
        darkMode: {
          light: "#15161a",
          lightgray: "#2c2e35",
          gray: "#8a8d96",
          darkgray: "#d6d4cf",
          dark: "#f1efea",
          secondary: "#8fa8ff",
          tertiary: "#e3906a",
          highlight: "rgba(143, 168, 255, 0.10)",
          textHighlight: "#b3870088",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      CategoriesAsTags(),
      PretendardFont(),
      // 공개 레포는 매번 커밋 하나로 덮어쓰므로 git 날짜는 쓰지 않습니다.
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "filesystem"] }),
      Plugin.SyntaxHighlighting({
        theme: { light: "github-light", dark: "github-dark" },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({
        enableInHtmlEmbed: false,
        parseTags: false,
        disableBrokenWikilinks: true,
      }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      // 두 번째 방어(D-60): 반드시 맨 끝. 본문 HTML 트리에서 허용 목록 밖 요소·이벤트 처리기·위험한 주소를 지웁니다.
      SanitizeHtml(),
    ],
    // ExplicitPublish: publish 값이 true(또는 문자열 "true")인 문서만 사이트에 나갑니다.
    filters: [Plugin.RemoveDrafts(), Plugin.ExplicitPublish()],
    emitters: [
      // 반드시 맨 앞: 문서끼리 서로 임베드하는 고리를 ContentPage 가 그리기 전에 끊습니다(빌드가 멈추지 않게).
      TranscludeCycleGuard(),
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({ enableSiteMap: true, enableRSS: false }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
