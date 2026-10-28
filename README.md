# Kim Seojun · Architecture × AI Automation Portfolio

기존 `https://tjwnsdhfz.github.io/`를 위한 공개 전용 저장소입니다. `NEW` 작업 루트나 비공개 지원서·경력 자료를 연결하지 않습니다.

## 정보 구조

`Profile → Education → Career → Activities → Credentials → Projects → View`

프로젝트는 모두 `문제 / 내가 한 일 / 산출물 / 확인 가능한 증거 / 한계 / 링크`로 표시하며, 사용자 승인 전에는 모두 `featured: false`입니다.

## 콘텐츠 흐름

1. 일상 아이디어는 비공개 Notion `아이디어 인박스`에 기록합니다.
2. 요청이 있을 때만 Obsidian `raw/captures`에 불변 스냅샷을 만들고 정본 변경안을 검토합니다.
3. 승인된 `canonical_id`만 `content/publication-manifest.json`에 표시합니다.
4. 편집한 공개 JSON의 구조·개인정보·미승인 주장 검사를 통과시킵니다. 검증 과정은 편집 파일을 덮어쓰지 않습니다.
5. 공개 문장과 프로젝트별 직접 기여를 사용자가 확인한 뒤에만 `main`에 반영합니다.

```bash
npm ci
npm run content:export:draft
npm run lint
npm test
```

승인이 끝난 후에만 manifest의 해당 값을 `true`로 바꾸고 `npm run content:export`를 실행합니다. `/edit`에서는 문장과 사진을 직접 수정하고 브라우저 임시저장·미리보기·JSON 내보내기를 할 수 있습니다. 토큰 입력이나 GitHub 자동 게시 기능은 없습니다.

## Privacy

공개 JSON에는 로컬 경로, 지원서 파일명, 전화번호, 주소, 학번, 식별번호와 미승인 수치를 넣지 않습니다. 연락처는 `thatsceo@naver.com`과 GitHub만 사용합니다.
