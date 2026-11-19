// 정보상자: frontmatter infobox(키 → 문자열 | 문자열 배열)를 표로 그립니다.
// 배포 워크플로가 이 파일을 quartz/components/selfwiki/Infobox.tsx 에 덮어씁니다.
import { JSX } from "preact"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"

type Scalar = string | number | boolean

function isScalar(value: unknown): value is Scalar {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean"
}

/** 값 하나를 정리합니다. 빈 값은 null. */
function cleanItem(value: unknown): string | null {
  if (!isScalar(value)) return null
  const text = String(value).trim()
  return text === "" ? null : text
}

/** 값(문자열 또는 배열)을 항목 목록으로. 중첩 맵이나 빈 값은 빈 목록. */
function valueItems(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(cleanItem).filter((item): item is string => item !== null)
  }
  const item = cleanItem(value)
  return item === null ? [] : [item]
}

const URL_PATTERN = /^https?:\/\/\S+$/i

function renderItem(item: string): JSX.Element | string {
  if (!URL_PATTERN.test(item)) return item
  const label = item.replace(/^https?:\/\//i, "").replace(/\/+$/, "")
  return (
    <a class="external" href={item} rel="noopener noreferrer">
      {label}
    </a>
  )
}

const Infobox: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const infobox = fileData.frontmatter?.infobox
  if (infobox === null || typeof infobox !== "object" || Array.isArray(infobox)) return null

  const rows: [string, string[]][] = []
  for (const [key, value] of Object.entries(infobox as Record<string, unknown>)) {
    const label = key.trim()
    if (label === "") continue
    const items = valueItems(value)
    if (items.length === 0) continue
    rows.push([label, items])
  }
  if (rows.length === 0) return null

  const title = fileData.frontmatter?.title
  return (
    <aside class={classNames(displayClass, "sw-infobox")}>
      <table>
        {title ? <caption>{title}</caption> : null}
        <tbody>
          {rows.map(([label, items]) => (
            <tr>
              <th scope="row">{label}</th>
              <td>
                {items.map((item, i) => (
                  <>
                    {i > 0 ? ", " : null}
                    {renderItem(item)}
                  </>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  )
}

export default (() => Infobox) satisfies QuartzComponentConstructor
