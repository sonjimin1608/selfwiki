// 분류 줄: frontmatter categories 를 문서 맨 아래 한 줄로 그립니다.
// 배포 워크플로가 이 파일을 quartz/components/selfwiki/Categories.tsx 에 덮어씁니다.
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { FullSlug, resolveRelative, slugTag } from "../../util/path"
import { classNames } from "../../util/lang"
import { categoryNames } from "../../plugins/transformers/selfwiki"

const Categories: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const slug = fileData.slug
  if (!slug) return null
  // 분류 페이지(tags/...)와 폴더 페이지(.../index)에는 그리지 않습니다.
  if (slug === "tags" || slug.startsWith("tags/") || slug.endsWith("/index")) return null

  const names = categoryNames(fileData.frontmatter?.categories)
  if (names.length === 0) return null

  return (
    <nav class={classNames(displayClass, "sw-categories")} aria-label="분류">
      <span class="sw-categories-label">분류: </span>
      {names.map((name, i) => (
        <>
          {i > 0 ? (
            <span class="sw-categories-sep" aria-hidden="true">
              {" · "}
            </span>
          ) : null}
          <a
            class="internal sw-category"
            href={resolveRelative(slug, `tags/${slugTag(name)}` as FullSlug)}
          >
            {name}
          </a>
        </>
      ))}
    </nav>
  )
}

export default (() => Categories) satisfies QuartzComponentConstructor
