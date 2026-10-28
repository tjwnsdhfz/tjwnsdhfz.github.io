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
2. `/edit/`에서 내려받아 교체한 `public/portfolio-content.json`을 `npm run content:export`로 검증합니다. 이 명령은 파일을 덮어쓰지 않습니다.
3. lint, test, 링크·개인정보 검사를 다시 실행합니다.
4. `main` 반영 후 Actions 성공, Pages `built`, 공개 URL HTTP 200과 모바일 화면을 확인합니다.

`/edit/`에서 브라우저 초안을 편집·임시저장·미리보기하고 JSON을 내려받을 수 있습니다. JSON 불러오기와 전체 JSON 편집은 필수 항목·링크·이미지 형식을 검사하며, 잘못된 입력은 기존 초안을 교체하지 않습니다. 저장 공간이 부족하면 오류 안내 후 JSON 내려받기로 보관할 수 있습니다. GitHub 토큰은 웹 페이지에서 받지 않습니다.
