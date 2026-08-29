# GitHub Pages 배포

공개 주소는 `https://tjwnsdhfz.github.io/`이고 배포 대상은 이 저장소의 `main`입니다. 예약 실행은 없으며 push가 있을 때만 `.github/workflows/deploy-pages.yml`이 정적 사이트를 배포합니다.

## 승인 전

```bash
npm ci
npm run content:export:draft
npm run lint
npm test
```

이 단계의 결과는 로컬 검토용입니다. 공개 문장, 경력 범위와 프로젝트별 `myRole`을 사용자가 확인하기 전에는 push하지 않습니다.

## 승인 후

1. `content/publication-manifest.json`의 승인된 항목만 `approved: true`로 바꿉니다.
2. `npm run content:export`로 공개 JSON을 생성합니다.
3. lint, test, 링크·개인정보 검사를 다시 실행합니다.
4. `main` 반영 후 Actions 성공, Pages `built`, 공개 URL HTTP 200과 모바일 화면을 확인합니다.

`/edit`는 공개 편집 기능이 비활성화되었다는 안내만 표시합니다. GitHub 토큰은 웹 페이지에서 받지 않습니다.
