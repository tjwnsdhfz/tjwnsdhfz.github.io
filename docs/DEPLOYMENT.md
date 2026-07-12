# GitHub 포트폴리오 편집과 독립 홈페이지 배포

이 포트폴리오는 특정 호스팅에 종속되지 않는 정적 Next.js 사이트입니다. 같은 `out/` 결과물을 GitHub Pages, Cloudflare Pages, Vercel, Netlify에 배포할 수 있습니다.

현재 지원서 공유용 기본 주소는 `https://tjwnsdhfz.github.io/`, 웹 편집 주소는 `https://tjwnsdhfz.github.io/edit/`입니다.

## 권장 경로

### 1. GitHub 프로필 대표 홈페이지: GitHub Pages

가장 전형적인 GitHub 포트폴리오는 `tjwnsdhfz/tjwnsdhfz.github.io` 저장소입니다. 이 이름을 사용하면 주소가 `https://tjwnsdhfz.github.io`가 되고 별도의 하위 경로 설정이 필요 없습니다.

1. GitHub에서 public 저장소 `tjwnsdhfz.github.io`를 만듭니다.
2. 이 프로젝트의 소스를 해당 저장소 `main` 브랜치에 올립니다.
3. 저장소 **Settings → Pages → Build and deployment → Source**에서 `GitHub Actions`를 선택합니다.
4. 포함된 `.github/workflows/deploy-pages.yml`이 `out/`을 빌드해 게시합니다.

일반 저장소 이름을 사용하면 주소는 `https://tjwnsdhfz.github.io/<repository>/`가 됩니다. 포함된 workflow는 저장소 이름을 읽어 `NEXT_PUBLIC_BASE_PATH`를 자동 설정합니다.

### 2. 운영 편의와 PR Preview: Cloudflare Pages

GitHub 저장소를 연결한 뒤 다음 값만 지정합니다.

- Production branch: `main`
- Build command: `npm run build:portable`
- Build output directory: `out`
- Node.js: `22.13.0` 이상

`main`에 새 commit이 생기면 자동 재배포되고 Pull Request마다 Preview 주소를 받을 수 있습니다. 사용자 도메인도 Pages의 Custom domains에서 연결할 수 있습니다.

### 선택 기준

| 방식 | 추천 상황 | 결과 주소 |
| --- | --- | --- |
| GitHub Pages | GitHub 프로필의 대표 홈페이지가 목적 | `tjwnsdhfz.github.io` |
| Cloudflare Pages | PR Preview와 정적 배포 운영을 함께 사용 | `<project>.pages.dev` |
| Vercel | 향후 Next.js 서버 기능으로 확장할 가능성이 큼 | `<project>.vercel.app` |
| Netlify | 기존 Netlify 계정과 배포 흐름이 있음 | `<project>.netlify.app` |

## 사이트에서 직접 편집

1. 배포 주소 뒤에 `/edit/`를 붙여 편집기를 엽니다.
2. 문구, 프로젝트, 경력, 역량, 연락처를 수정합니다.
3. 변경 내용은 약 0.9초 뒤 현재 브라우저에 자동 저장되며 `지금 저장`으로 즉시 저장할 수도 있습니다.
4. `JSON 내보내기`로 복구 가능한 백업을 받습니다.
5. `게시·배포` 탭에서 기본 저장소 `tjwnsdhfz/tjwnsdhfz.github.io`와 `main` 브랜치를 확인합니다.
6. 해당 저장소에만 `Contents: Read and write` 권한을 준 fine-grained token을 입력하고 `GitHub에 게시`를 누릅니다.

토큰은 React 메모리에만 보관되며 localStorage, JSON, Git 저장소에 기록되지 않습니다. 새로고침하면 사라집니다. 저장소·브랜치·콘텐츠 경로만 브라우저에 저장됩니다. 공개 `/edit/` 화면에서 토큰을 사용할 때는 본인 기기에서만 접속하고, 반드시 해당 저장소 하나의 `Contents: Read and write` 권한만 부여한 fine-grained token을 사용합니다.

게시 대상 파일은 기본적으로 `public/portfolio-content.json`입니다. GitHub에 새 커밋이 생기면 연결된 호스팅 서비스가 자동으로 다시 배포하고, 방문자는 새 JSON을 읽습니다.

`npm run content:sync`는 코드에 들어 있는 기본 템플릿을 JSON에 다시 복사하는 초기화 명령입니다. 웹이나 GitHub에서 JSON을 수정한 뒤에는 실행하지 마세요. 일반 빌드는 JSON을 덮어쓰지 않습니다.

## 로컬 실행과 정적 빌드

```bash
npm install
npm run dev:portable
npm run build:portable
```

정적 결과물은 `out/`에 생성됩니다. 단순 웹 서버로 `out/` 폴더를 배포해도 됩니다.

## Vercel

GitHub 저장소를 Vercel에 연결합니다. 포함된 `vercel.json`이 `npm run build:portable`과 `out/`을 사용합니다. 루트 도메인은 `NEXT_PUBLIC_BASE_PATH`를 비워 둡니다.

## Netlify

GitHub 저장소를 Netlify에 연결합니다. 포함된 `netlify.toml`이 빌드 명령과 배포 폴더를 설정합니다.

## Cloudflare Pages

- Build command: `npm run build:portable`
- Build output directory: `out`
- Node.js: `22.13.0` 이상

## GitHub Pages

저장소의 **Settings → Pages → Source**를 `GitHub Actions`로 설정합니다. `.github/workflows/deploy-pages.yml`이 저장소 이름에 맞는 base path를 자동으로 적용합니다.

## 환경값

`.env.example`을 참고해 호스팅 서비스에 다음 값을 설정할 수 있습니다.

- `NEXT_PUBLIC_SITE_URL`: 실제 공개 도메인
- `NEXT_PUBLIC_BASE_PATH`: 루트 배포는 빈 값, 하위 경로 배포는 `/repository-name`
- `NEXT_PUBLIC_GITHUB_REPO`: 편집기에 미리 표시할 `owner/repository`

`NEXT_PUBLIC_` 값에는 비밀정보를 넣으면 안 됩니다. GitHub token은 배포 환경값이 아니라 `/edit/` 화면에서 매번 입력합니다.

## 사용자 도메인

- GitHub Pages는 저장소 Settings → Pages의 Custom domain에서 연결합니다. 먼저 GitHub 계정에서 도메인을 검증하는 편이 안전합니다.
- Vercel, Netlify, Cloudflare Pages는 각 프로젝트의 Domains 또는 Custom domains 메뉴에서 연결합니다.
- DNS와 사이트 설정이 모두 완료된 뒤 HTTPS 강제를 켭니다.
