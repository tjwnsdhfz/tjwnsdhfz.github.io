# Kim Seojun · Engineering, Design & Digital Portfolio

건축 설계와 현장 운영, CAD·데이터 검증, 디지털 프로젝트에서 문제를 정의하고 결과를 검증해 온 김서준의 포트폴리오입니다. 수행 범위와 한계를 구분하고 공개 코드와 검토 기록으로 근거를 보여줍니다.

## Content

- 설계·데이터·협업 역량과 실제 근거를 연결한 30초 요약
- 공개 `DatumGuard v0.3.0`의 독립 CAD 재검증·revision·승인 gate
- 현장 실측 기반 100개 이상 평면 설계와 공병 안전·협업 경험
- G4 감사 실패를 숨기지 않고 보강 중인 `BARAM 2026` 검증 절차
- 건축 설계의 구획·동선·반복 유닛 검토와 명확한 경험 경계

지원처별 편집 순서와 저장 방식은 [`docs/CONTENT_EDITING.md`](docs/CONTENT_EDITING.md)에 정리되어 있습니다.

## 사이트에서 직접 편집

공개 주소 `https://tjwnsdhfz.github.io/edit/`에서 포트폴리오 내용을 수정할 수 있습니다. `범용 자기소개 적용`으로 소개·핵심 역량 문구만 초기화하면서 프로젝트와 경력 근거는 유지할 수 있습니다. 브라우저 초안 저장과 지원처별 JSON 백업을 지원하며, `tjwnsdhfz/tjwnsdhfz.github.io` 저장소에만 쓰기 권한이 있는 fine-grained token을 현재 세션에서 입력해 콘텐츠를 게시할 수 있습니다. 토큰은 저장되지 않습니다.

자세한 설정은 [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)를 참고하세요.

## Local development

Node.js 22.13 이상이 필요합니다.

```bash
npm install
npm run dev:portable
```

호스팅 중립형 미리보기와 정적 빌드:

```bash
npm run dev:portable
npm run build:portable
```

## Validation

```bash
npm run lint
npm test
```

`npm test`는 정적 빌드, 실제 렌더링 확인, 공개 JSON 무결성, 프리셋 재정렬 회귀를 함께 검사합니다. GitHub Pages도 같은 검증을 통과한 뒤에만 배포합니다.

## Main files

- `app/page.tsx`: 공개 포트폴리오 진입점
- `app/edit/page.tsx`: 사이트 내 편집 화면
- `app/content-editor.tsx`: 초안, JSON, GitHub 게시 편집기
- `public/portfolio-content.json`: 화면·검색·공유 메타데이터가 함께 읽는 공개 콘텐츠 단일 소스
- `scripts/export-default-content.ts`: 기본 콘텐츠를 공개 JSON에 초기 반영하는 수동 동기화 도구
- `app/globals.css`: 반응형 디자인 시스템
- `app/layout.tsx`: 메타데이터, 공유 카드, 폰트
- `public/projects/`: 실제 프로젝트 이미지
- `design-system/kim-seojun-portfolio/MASTER.md`: UI 원칙

## External hosting

`npm run build:portable`은 `out/` 정적 배포물을 만듭니다. Vercel, Netlify, Cloudflare Pages, GitHub Pages용 설정이 저장소에 포함되어 있습니다.

## Privacy

공개 페이지에는 전체 주소, 생년월일, 전화번호, 지원자 번호, 자격증·어학 식별번호를 넣지 않습니다. 연락처는 포트폴리오용 이메일 하나만 사용합니다.
