// selfwiki 변환 플러그인 (Quartz v4.5.2)
// 배포 워크플로가 이 파일을 quartz/plugins/transformers/selfwiki.ts 에 덮어씁니다.
import { QuartzEmitterPlugin, QuartzTransformerPlugin } from "../types"
import { slugTag } from "../../util/path"

/** frontmatter categories 를 분류 이름 목록으로 정리합니다(문자열·숫자만, 앞뒤 공백 제거, 빈 값 제외). */
export function categoryNames(categories: unknown): string[] {
  if (!Array.isArray(categories)) return []
  const seen = new Set<string>()
  const names: string[] = []
  for (const item of categories) {
    if (typeof item !== "string" && typeof item !== "number") continue
    const name = String(item).trim()
    if (name === "") continue
    const slug = slugTag(name)
    if (slug === "" || seen.has(slug)) continue
    seen.add(slug)
    names.push(name)
  }
  return names
}

/**
 * categories → tags.
 * FrontMatter 바로 뒤에 두어 frontmatter.tags 를 categories 로 덮어씁니다.
 * (문서에 tags 를 직접 써도 무시됩니다. 분류 페이지 주소는 Quartz 고정값 tags/<분류>.)
 */
export const CategoriesAsTags: QuartzTransformerPlugin = () => ({
  name: "SelfwikiCategoriesAsTags",
  markdownPlugins() {
    return [
      () => {
        return (_tree, file) => {
          const frontmatter = file.data.frontmatter
          if (!frontmatter) return
          frontmatter.tags = categoryNames(frontmatter.categories).map((name) => slugTag(name))
        }
      },
    ]
  },
})

// ------------------------------------------------------------
// 두 번째 방어(D-60): 본문 HTML 트리 정리
// ------------------------------------------------------------
// selfwiki publish 가 공개 문서의 HTML 을 이미 허용 목록으로 정리하지만(D-54, D-59), 마크다운 해석 차이가 남더라도
// 사이트에 스크립트·이벤트 처리기·위험한 주소가 나가지 않게 마지막 변환 단계에서 hast 트리를 한 번 더 정리합니다.
// quartz.config.ts 에서 변환 플러그인 맨 끝에 두어 다른 플러그인(rehype-raw, 코드 강조, 링크 정리 등)이 모두 돈 뒤에 실행됩니다.

type HastNode = {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
  value?: string
  content?: HastNode
}

/** Quartz 가 본문에 만드는 요소 + D-54 허용 태그 */
export const SANITIZE_ALLOWED_ELEMENTS: ReadonlySet<string> = new Set([
  // 마크다운 기본
  "p", "a", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "pre", "code",
  "img", "hr", "br", "span", "div",
  // GFM: 표, 할 일 목록, 각주, 취소선
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "input", "section", "del",
  // 코드 강조(rehype-pretty-code), 제목 고리·외부 링크·mermaid 아이콘, mermaid 확대 버튼
  "figure", "figcaption", "svg", "path", "button",
  // Obsidian 임베드(동영상·소리·PDF·YouTube)
  "video", "audio", "iframe",
  // D-54 허용 태그
  "b", "i", "em", "strong", "sup", "sub", "kbd", "ins", "mark",
])

/** 허용 목록 밖에서 내용째 지우는 요소(그 밖은 요소만 지우고 안의 글자는 남김) */
const SANITIZE_DROP_WITH_CONTENT: ReadonlySet<string> = new Set([
  "script", "style", "template", "noscript", "textarea", "title", "xmp", "noembed", "noframes",
  "object", "embed", "applet", "frame", "frameset", "math", "select", "option", "canvas", "map",
  "head", "meta", "link", "base", "plaintext", "foreignobject", "picture", "source", "track",
])

/** 주소를 담는 속성(소문자) */
const URL_ATTRIBUTES: ReadonlySet<string> = new Set([
  "href", "src", "srcset", "poster", "cite", "action", "formaction", "data", "xlinkhref", "xlink:href",
  "background", "ping", "longdesc", "usemap", "manifest", "codebase", "icon", "dynsrc", "lowsrc",
  "itemtype", "itemid", "archive", "classid", "profile",
])

/** 늘 지우는 속성(소문자) */
const DROP_ATTRIBUTES: ReadonlySet<string> = new Set(["srcdoc", "formaction", "action", "is", "http-equiv", "httpequiv"])

/** style 은 코드 강조 색 변수와 외부 링크 아이콘 크기만 */
const SAFE_STYLE_DECL = /^\s*(--shiki-[a-z0-9-]+|max-width|max-height)\s*:\s*[#A-Za-z0-9 ._%-]+\s*$/

export function isSafeStyle(value: string): boolean {
  return value
    .split(";")
    .filter((d) => d.trim() !== "")
    .every((d) => SAFE_STYLE_DECL.test(d))
}

/**
 * 남겨도 되는 주소: `#…`, `mailto:`, 호스트가 있는 `https://`·`http://`, 스킴 없는 사이트 안 상대 주소.
 * 브라우저처럼 제어 문자·공백을 뺀 뒤 스킴을 본다(`java\tscript:` 등). `//호스트` 는 http(s) 외부 주소와 같으므로 허용.
 */
export function isSafeUrl(value: string): boolean {
  const v = value.replace(/[\u0000- \u007f-\u009f\u200b-\u200d\ufeff]/g, "")
  if (v === "" || v.startsWith("#")) return true
  if (/^mailto:/i.test(v)) return true
  if (/^https?:\/\/[^/\\?#]/i.test(v)) return true
  if (/^[\\/]{2}/.test(v)) return /^\/\/[^/\\?#]/.test(v)
  // `:` 가 첫 `/`·`?`·`#` 앞에 있으면 스킴(javascript:, data:, file:, vbscript:, obsidian: …)
  return !/^[^/?#]*:/.test(v)
}

/** iframe 은 사이트 안 상대 주소(PDF 임베드)와 YouTube 임베드만 */
function isSafeFrameSrc(value: string): boolean {
  const v = value.replace(/[\u0000- \u007f-\u009f]/g, "")
  if (/^https:\/\/www\.youtube\.com\/embed\//i.test(v)) return true
  return v !== "" && !/^[^/?#]*:/.test(v) && !/^[\\/]{2}/.test(v)
}

function urlsOf(name: string, value: unknown): string[] {
  const list = Array.isArray(value) ? value.map(String) : [String(value)]
  if (name === "srcset") {
    return list.flatMap((s) => s.split(",").map((c) => c.trim().split(/\s+/)[0] ?? ""))
  }
  return list
}

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? ""
  return (node.children ?? []).map(textOf).join("")
}

/**
 * 본문에 남겨도 되는 class 값(D-66). Quartz v4.5.2 가 우리 설정(quartz.config.ts)으로 본문에 만드는 값만:
 * 링크(CrawlLinks), 임베드·끊긴 링크·형광펜·콜아웃·mermaid·PDF·YouTube·체크박스(ObsidianFlavoredMarkdown),
 * 할 일 목록·각주(GitHubFlavoredMarkdown = remark-gfm), 임베드 원문 링크(renderPage).
 * 사용자 정의 콜아웃 종류는 class 에서 빠지지만 Quartz 의 콜아웃 색은 data-callout 으로 정해지므로 모양은 같습니다.
 * 코드 강조(rehype-pretty-code)는 class 대신 data-* 를 씁니다(강조하지 못한 언어만 language-*).
 */
export const SANITIZE_ALLOWED_CLASSES: ReadonlySet<string> = new Set([
  // CrawlLinks
  "internal", "external", "alias", "external-icon", "tag-link",
  // OFM: 위키 링크·임베드
  "broken", "transclude", "transclude-inner", "transclude-src", "pdf", "external-embed", "youtube",
  // OFM: 형광펜, 체크박스, mermaid
  "text-highlight", "checkbox-toggle", "mermaid", "expand-button", "mermaid-content",
  // OFM: 콜아웃(틀 + Quartz 가 아는 종류)
  "callout", "is-collapsible", "is-collapsed", "callout-title", "callout-icon", "callout-title-inner",
  "fold-callout-icon", "callout-content",
  "note", "abstract", "info", "todo", "tip", "success", "question", "warning", "failure", "danger", "bug", "example", "quote",
  // GFM: 할 일 목록, 각주
  "contains-task-list", "task-list-item", "footnotes", "sr-only", "data-footnote-backref",
])

const ALLOWED_CLASS_RE = /^language-[A-Za-z0-9_+#.-]{1,40}$/

/**
 * 본문에 남겨도 되는 data-* 속성(D-66). Quartz·rehype-pretty-code·remark-gfm 이 쓰는 이름만.
 * data-embed-alias(임베드 별칭, Quartz 가 이스케이프 없이 만듦)와 data-clipboard(복사 버튼이 화면과 다른 글을 복사할 수 있음)는
 * 지우고, data-clipboard 는 mermaid 그림으로 남는 코드에만 코드 글자로 다시 만듭니다.
 */
const ALLOWED_DATA_ATTRIBUTES: ReadonlySet<string> = new Set([
  // OFM·CrawlLinks·renderPage
  "data-slug", "data-no-popover", "data-url", "data-block", "data-callout", "data-callout-fold", "data-callout-metadata",
  "data-view-component",
  // remark-gfm 각주
  "data-footnotes", "data-footnote-ref", "data-footnote-backref",
  // rehype-pretty-code
  "data-rehype-pretty-code-figure", "data-rehype-pretty-code-title", "data-rehype-pretty-code-caption",
  "data-language", "data-theme", "data-line", "data-line-numbers", "data-line-numbers-max-digits",
  "data-highlighted-line", "data-highlighted-line-id", "data-highlighted-chars", "data-highlighted-chars-mark", "data-chars-id",
])

/** hast 속성 이름 → data-* 속성 이름(아니면 null). `dataFooBar` 와 `data-foo-bar` 두 꼴 모두. */
function dataAttributeName(key: string): string | null {
  if (/^data-/i.test(key)) return key.toLowerCase()
  if (/^data[A-Z0-9]/.test(key)) return "data" + key.slice(4).replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())
  return null
}

function removeData(props: Record<string, unknown>, name: string): void {
  for (const key of Object.keys(props)) if (dataAttributeName(key) === name) delete props[key]
}

/** className·class 두 꼴(배열·공백 구분 문자열)을 모아 지우고 낱말 목록으로 돌려줌 */
function takeClasses(props: Record<string, unknown>): string[] {
  const out: string[] = []
  for (const key of Object.keys(props)) {
    const name = key.toLowerCase()
    if (name !== "classname" && name !== "class") continue
    const value = props[key]
    const list = Array.isArray(value) ? value.map(String) : typeof value === "string" ? value.split(/\s+/) : []
    for (const c of list) if (c !== "" && !out.includes(c)) out.push(c)
    delete props[key]
  }
  return out
}

function classesOf(el: HastNode): string[] {
  const props = el.properties ?? {}
  const v = props.className
  return Array.isArray(v) ? v.map(String) : []
}

function setClasses(el: HastNode, classes: string[]): void {
  const props = (el.properties ??= {})
  takeClasses(props)
  if (classes.length > 0) props.className = classes
}

/** 제어 문자·공백을 뺀 뒤 스킴(`x:`) 또는 `//`·`\\` 로 시작하면 절대 주소(D-66) */
export function isAbsoluteHref(value: string): boolean {
  const v = value.replace(/[\u0000- \u007f-\u009f\u200b-\u200d\ufeff]/g, "")
  return /^[A-Za-z][A-Za-z0-9+.-]*:/.test(v) || /^[\\/]{2}/.test(v)
}

/** mermaid 의 클릭·콜백·링크 지시문은 securityLevel "loose" 에서 스크립트를 부를 수 있어 그림 대신 코드로 보여 줍니다 */
const MERMAID_ACTION_RE = /\b(?:click|call|callback|href|links?)\b/i
/** `<` 뒤 영문자·`/`·`!`·`?`(태그·주석 시작) — Quartz mermaid 스크립트가 innerText 를 innerHTML 로 다시 넣으므로(D-65) */
const MERMAID_MARKUP_RE = /<[A-Za-z/!?]/
const MERMAID_BR_RE = /<br\s*\/?>/gi
/** 설정 지시문(`%%{init: …}%%`)·머리 설정(`---`)은 dompurifyConfig 같은 보안 설정을 바꿀 수 있음 */
const MERMAID_CONFIG_RE = /%%\s*\{|^\s*---/

/** 그림으로 그려도 되는 mermaid 코드인지(D-65). 자식이 글 노드뿐이어야 함(숨긴 요소로 글자를 나누는 것 방지). */
export function isSafeMermaid(el: HastNode): boolean {
  const kids = el.children ?? []
  if (kids.some((k) => k.type !== "text")) return false
  const text = textOf(el)
  if (MERMAID_MARKUP_RE.test(text.replace(MERMAID_BR_RE, ""))) return false
  if (MERMAID_ACTION_RE.test(text) || MERMAID_CONFIG_RE.test(text)) return false
  return true
}

export interface SanitizeContext {
  /** 지금 문서의 slug(자기 자신 임베드 판정) */
  slug?: string
}

function cleanProperties(el: HastNode): void {
  const props = (el.properties ??= {})
  const tag = (el.tagName ?? "").toLowerCase()
  for (const key of Object.keys(props)) {
    const name = key.toLowerCase()
    const value = props[key]
    if (name.startsWith("on") || DROP_ATTRIBUTES.has(name)) {
      delete props[key]
      continue
    }
    const data = dataAttributeName(key)
    if (data !== null) {
      if (!ALLOWED_DATA_ATTRIBUTES.has(data)) delete props[key]
      continue
    }
    if (name === "style") {
      if (typeof value !== "string" || !isSafeStyle(value)) delete props[key]
      continue
    }
    if (URL_ATTRIBUTES.has(name) || name.endsWith("href")) {
      const urls = urlsOf(name, value)
      const ok = tag === "iframe" && name === "src" ? urls.every(isSafeFrameSrc) : urls.every(isSafeUrl)
      if (!ok) delete props[key]
    }
  }
  if (tag === "iframe" && typeof props.src !== "string") el.tagName = "div"
  let classes = takeClasses(props).filter((c) => SANITIZE_ALLOWED_CLASSES.has(c) || ALLOWED_CLASS_RE.test(c))
  if (tag === "a") {
    // 절대 주소 링크는 사이트 안 문서가 아님: internal 을 빼고(팝오버가 a.internal 의 주소를 가져와 페이지에 넣음) external, 팝오버 끔
    const hrefs = Object.keys(props)
      .filter((k) => k.toLowerCase().endsWith("href"))
      .flatMap((k) => urlsOf(k, props[k]))
    if (hrefs.some(isAbsoluteHref)) {
      classes = classes.filter((c) => c !== "internal")
      if (!classes.includes("external")) classes.push("external")
      removeData(props, "data-no-popover")
      props.dataNoPopover = "true"
    }
  }
  if (classes.length > 0) props.className = classes
}

function isElement(node: HastNode | undefined, tag: string): boolean {
  return node !== undefined && node.type === "element" && (node.tagName ?? "").toLowerCase() === tag
}

/** 자식까지 정리한 뒤 구조를 보는 규칙: mermaid, 임베드 */
function checkStructure(el: HastNode, ctx: SanitizeContext): void {
  const tag = (el.tagName ?? "").toLowerCase()
  const props = (el.properties ??= {})
  if (tag === "code" && classesOf(el).includes("mermaid")) {
    if (isSafeMermaid(el)) {
      props.dataClipboard = JSON.stringify(textOf(el).replace(/\n$/, ""))
    } else {
      setClasses(el, classesOf(el).filter((c) => c !== "mermaid"))
    }
  }
  if (tag === "pre") {
    // mermaid 그림이 아니게 된 코드 블록에서 Quartz 가 붙인 확대 버튼·그림 창을 뺌
    const kids = el.children ?? []
    if (!kids.some((k) => isElement(k, "code") && classesOf(k).includes("mermaid"))) {
      el.children = kids.filter(
        (k) =>
          !(isElement(k, "button") && classesOf(k).includes("expand-button")) &&
          !(isElement(k, "div") && k.properties?.id === "mermaid-container"),
      )
    }
  }
  if (tag === "blockquote" && classesOf(el).includes("transclude")) {
    // Quartz renderPage 는 첫 자식 a 의 data-slug(없으면 지금 문서)를 임베드합니다. 첫 자식이 사이트 안 문서 링크가 아니거나
    // 지금 문서 자신이면 자기 임베드가 끝없이 되풀이되어 빌드가 멈추므로(Maximum call stack size exceeded) 임베드를 풀어 인용으로 둠.
    const first = el.children?.[0]
    const fp = first?.properties ?? {}
    const href = typeof fp.href === "string" ? fp.href : ""
    const target = fp["data-slug"]
    const ok =
      first !== undefined &&
      isElement(first, "a") &&
      classesOf(first).includes("transclude-inner") &&
      href !== "" &&
      !href.startsWith("#") &&
      !isAbsoluteHref(href) &&
      typeof target === "string" &&
      target !== "" &&
      target !== ctx.slug
    if (!ok) setClasses(el, classesOf(el).filter((c) => c !== "transclude"))
  }
}

/** 트리를 제자리에서 정리합니다(다른 플러그인이 같은 트리를 file.data.htmlAst 로 들고 있음). */
export function sanitizeHast(node: HastNode, ctx: SanitizeContext = {}): void {
  const kids = node.children
  if (kids === undefined) return
  const out: HastNode[] = []
  for (const child of kids) {
    if (child.type === "text") {
      out.push(child)
      continue
    }
    if (child.type !== "element") continue // 주석, raw, doctype 등은 지움
    const tag = (child.tagName ?? "").toLowerCase()
    if (SANITIZE_ALLOWED_ELEMENTS.has(tag)) {
      cleanProperties(child)
      sanitizeHast(child, ctx)
      checkStructure(child, ctx)
      out.push(child)
      continue
    }
    if (SANITIZE_DROP_WITH_CONTENT.has(tag)) continue
    // 그 밖의 요소: 요소만 지우고 안쪽은 같은 규칙으로 정리해 남김
    sanitizeHast(child, ctx)
    out.push(...(child.children ?? []))
  }
  node.children = out
}

export const SanitizeHtml: QuartzTransformerPlugin = () => ({
  name: "SelfwikiSanitizeHtml",
  htmlPlugins() {
    return [
      () => {
        return (tree: HastNode, file: { data: { slug?: string } }) => {
          sanitizeHast(tree, { slug: file.data.slug })
        }
      },
    ]
  },
})

// ------------------------------------------------------------
// 임베드 고리 끊기: 문서 A 가 B 를, B 가 A 를 임베드(![[…]])하면 Quartz v4.5.2 renderPage 가 끝없이 펼쳐
// 사이트 빌드 전체가 "Maximum call stack size exceeded"로 실패합니다. 자기 자신 임베드는 SanitizeHtml 이 풀고,
// 여러 문서에 걸친 고리는 문서 사이를 봐야 하므로 이 emitter 가 ContentPage 보다 먼저(emitters 맨 앞) 고리를 이루는 임베드만 인용으로 풉니다.
// ------------------------------------------------------------

function transcludeTarget(node: HastNode): string | null {
  if (node.type !== "element" || (node.tagName ?? "").toLowerCase() !== "blockquote") return null
  if (!classesOf(node).includes("transclude")) return null
  const target = node.children?.[0]?.properties?.["data-slug"]
  return typeof target === "string" ? target : null
}

function collectTranscludes(node: HastNode, out: HastNode[]): void {
  for (const child of node.children ?? []) {
    if (transcludeTarget(child) !== null) out.push(child)
    collectTranscludes(child, out)
  }
}

/** 임베드 그래프에서 고리를 만드는 임베드(DFS 의 되돌아가는 간선)의 transclude 를 뗍니다. 뗀 개수를 돌려줌. */
export function breakTranscludeCycles(pages: Array<{ slug: string; trees: HastNode[] }>): number {
  const edges = new Map<string, HastNode[]>()
  for (const p of pages) {
    const list = edges.get(p.slug) ?? []
    for (const tree of p.trees) collectTranscludes(tree, list)
    edges.set(p.slug, list)
  }
  const state = new Map<string, 1 | 2>() // 1: 방문 중, 2: 끝남
  let broken = 0
  const visit = (slug: string): void => {
    state.set(slug, 1)
    for (const bq of edges.get(slug) ?? []) {
      const target = transcludeTarget(bq)
      if (target === null) continue
      const s = state.get(target)
      if (s === 1) {
        setClasses(bq, classesOf(bq).filter((c) => c !== "transclude"))
        broken++
      } else if (s === undefined && edges.has(target)) {
        visit(target)
      }
    }
    state.set(slug, 2)
  }
  for (const slug of [...edges.keys()].sort()) if (!state.has(slug)) visit(slug)
  return broken
}

type ContentItem = [HastNode, { data: { slug?: string; htmlAst?: HastNode } }]

export const TranscludeCycleGuard: QuartzEmitterPlugin = () => ({
  name: "SelfwikiTranscludeCycleGuard",
  // async 함수 본문은 첫 await 전까지 바로 실행되므로, emitters 맨 앞에 두면 다른 emitter 가 시작하기 전에 끝납니다.
  async emit(_ctx, content) {
    const pages = (content as unknown as ContentItem[]).map(([tree, file]) => ({
      slug: file.data.slug ?? "",
      trees: file.data.htmlAst !== undefined && file.data.htmlAst !== tree ? [tree, file.data.htmlAst] : [tree],
    }))
    breakTranscludeCycles(pages)
    return []
  },
})

/** Pretendard 웹폰트. 받지 못해도 custom.scss 의 대체 글꼴 목록으로 표시됩니다. */
export const PRETENDARD_CSS =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"

export const PretendardFont: QuartzTransformerPlugin = () => ({
  name: "SelfwikiPretendardFont",
  externalResources() {
    return {
      css: [{ content: PRETENDARD_CSS }],
    }
  },
})
