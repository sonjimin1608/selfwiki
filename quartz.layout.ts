import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import Infobox from "./quartz/components/selfwiki/Infobox"
import Categories from "./quartz/components/selfwiki/Categories"

// 이 파일은 selfwiki publish가 자동으로 만들고 덮어씁니다. 직접 고치지 마세요.

// 모든 페이지 공통. afterBody는 공유 레이아웃에만 있으므로
// 분류 줄은 분류가 없는 페이지(분류 페이지 포함)에서 아무것도 그리지 않습니다.
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [Categories()],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/sonjimin1608",
    },
  }),
}

const left = [
  Component.PageTitle(),
  Component.MobileOnly(Component.Spacer()),
  Component.Flex({
    components: [
      { Component: Component.Search(), grow: true },
      { Component: Component.Darkmode() },
    ],
  }),
  Component.Explorer({ title: "문서 목록" }),
]

// 문서 한 개를 보여 주는 페이지
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ContentMeta({ showReadingTime: false }),
    Infobox(),
  ],
  left,
  right: [
    Component.Graph({ localGraph: { showTags: false }, globalGraph: { showTags: false } }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// 목록 페이지(분류, 폴더)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle(), Component.ContentMeta({ showReadingTime: false })],
  left,
  right: [],
}
