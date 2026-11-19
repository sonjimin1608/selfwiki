# selfwiki 공개 위키

이 레포는 [selfwiki](https://github.com/sonjimin1608/selfwiki-cli)가 자동으로 만들고 관리합니다.
`selfwiki publish`를 실행할 때마다 레포 전체가 새 커밋 하나로 덮어써집니다.

- 여기 있는 파일을 직접 고치지 마세요. 다음 `selfwiki publish`에서 사라집니다.
- 문서를 고치려면 비공개 위키에서 고친 뒤 `selfwiki publish`를 다시 실행하세요.
- `content/`에는 `publish: true`로 공개를 켠 문서와, 그 문서가 참조하는 첨부 파일만 들어 있습니다.
- 사이트는 GitHub Actions(`.github/workflows/deploy.yml`)가 Quartz v4.5.2로 빌드해 GitHub Pages에 올립니다.

사이트: https://sonjimin1608.github.io/selfwiki/
