export type EvidenceState = "public-verified" | "prototype" | "self-reported" | "in-progress";
export type Visibility = "public" | "private";

export type LinkItem = { label: string; href: string };
export type FactItem = { label: string; value: string };
export type EvidenceMeta = {
  evidenceState: EvidenceState;
  observedAt: string;
  sourceRefs: string[];
  visibility: Visibility;
};

export type EducationItem = EvidenceMeta & {
  period: string;
  institution: string;
  course: string;
  description: string;
};

export type ExperienceItem = EvidenceMeta & {
  period: string;
  role: string;
  organization: string;
  description: string;
  proof: string;
};

export type PortfolioProject = EvidenceMeta & {
  id: string;
  canonicalId: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  myRole: string;
  artifact: string;
  proof: string;
  boundary: string;
  image: string;
  imageAlt: string;
  tags: string[];
  links: LinkItem[];
  featured: boolean;
};

export type RepositoryItem = {
  name: string;
  description: string;
  repositoryUrl: string;
  demoUrl?: string;
  tags: string[];
};

export type PortfolioContent = {
  version: 2;
  identity: {
    name: string;
    englishName: string;
    monogram: string;
    role: string;
    status: string;
    email: string;
    github: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  about: { eyebrow: string; title: string; description: string; facts: FactItem[] };
  education: EducationItem[];
  experiences: ExperienceItem[];
  activities: ExperienceItem[];
  projects: PortfolioProject[];
  awards: { title: string; description: string }[];
  credentials: string[];
  repositories: RepositoryItem[];
  capabilities: { title: string; description: string }[];
  contact: { title: string; description: string; footerNote: string };
};

export const EVIDENCE_LABELS: Record<EvidenceState, string> = {
  "public-verified": "공개 근거 확인",
  prototype: "프로토타입",
  "self-reported": "본인 기록",
  "in-progress": "진행 중",
};

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  version: 2,
  identity: {
    name: "김서준",
    englishName: "Seojun Kim",
    monogram: "KS",
    role: "건축 × AI 자동화",
    status: "건축학과 5년제 · 취업 포트폴리오",
    email: "thatsceo@naver.com",
    github: "https://github.com/tjwnsdhfz",
  },
  hero: {
    eyebrow: "ARCHITECTURE × AI AUTOMATION",
    title: "건축의 복잡한 문제를,",
    highlight: "검증 가능한 디지털 흐름으로 바꿉니다.",
    description: "건축 설계에서 익힌 공간·도면 이해와 AI·데이터 도구를 연결합니다. 문제를 구조화하고, 직접 만든 산출물과 확인 가능한 근거를 함께 남기는 김서준의 작업 기록입니다.",
    image: "/profile/kim-seojun.jpg",
    imageAlt: "김서준 프로필 사진",
  },
  about: {
    eyebrow: "ABOUT ME",
    title: "설계의 맥락을 이해하고, 반복 가능한 도구로 전환합니다.",
    description: "저는 건축을 형태만 만드는 일이 아니라 요구조건·공간·도면·협업 기록을 하나의 의사결정 과정으로 다루는 일로 봅니다. AI와 코드는 그 판단을 대신하는 답이 아니라, 누락을 줄이고 결과를 다시 확인하게 만드는 도구로 사용합니다.",
    facts: [
      { label: "Focus", value: "건축설계 · CAD/BIM · AI/데이터 · 자동화" },
      { label: "Working style", value: "문제 정의 → 구현 → 독립 검증 → 기록" },
      { label: "Evidence policy", value: "직접 기여와 한계를 함께 공개" },
    ],
  },
  education: [
    {
      period: "2021. 03. — 2028. 02. 예정",
      institution: "경북대학교",
      course: "건축학과 5년제 · 경제통상학부 복수전공",
      description: "건축 설계와 공간 분석을 중심으로 공부하며 경제·사업 관점과 디지털 제작 방식을 함께 탐구하고 있습니다. 졸업예정일은 지원서 자기기재입니다.",
      evidenceState: "self-reported",
      observedAt: "2026-05-26",
      sourceRefs: ["canonical:career:kim-seojun"],
      visibility: "public",
    },
  ],
  experiences: [
    {
      period: "2025. 09. 01. — 2026. 05. 26. 관측",
      role: "연구보조원",
      organization: "대구경제교육연구소 · 대구지역경제교육센터",
      description: "경제교육 운영을 지원하고 만족도 설문 데이터를 정리·분석했습니다.",
      proof: "2026-05-26 지원서 관측 시점까지의 자기기재",
      evidenceState: "self-reported",
      observedAt: "2026-05-26",
      sourceRefs: ["canonical:career:kim-seojun"],
      visibility: "public",
    },
    {
      period: "2025. 07. 31. — 2025. 08. 30.",
      role: "대체투자팀 프로젝트 인턴",
      organization: "그린하버투자",
      description: "부유형 해상풍력 산업 자료를 조사하고 산업분석 보고서 작성에 참여했습니다.",
      proof: "지원서·경력 자료의 반복 자기기재",
      evidenceState: "self-reported",
      observedAt: "2026-08-29",
      sourceRefs: ["canonical:career:kim-seojun"],
      visibility: "public",
    },
    {
      period: "2024. 12. 02. — 2024. 12. 31.",
      role: "임차관리팀 사무보조",
      organization: "현대 C&R",
      description: "사택과 임대차계약 관련 서류를 정리하며 임차관리 업무를 지원했습니다.",
      proof: "지원서·경력 자료의 반복 자기기재",
      evidenceState: "self-reported",
      observedAt: "2026-08-29",
      sourceRefs: ["canonical:career:kim-seojun"],
      visibility: "public",
    },
    {
      period: "2024. 09. 09. — 2024. 12. 01.",
      role: "부동산운영팀 매니저",
      organization: "IAM BOX",
      description: "현장 실측 조건과 고객 요구를 셀프스토리지 평면 및 운영 검토로 전환했습니다.",
      proof: "경력 자료와 도면 산출물 기반, 정량 수치 제외",
      evidenceState: "self-reported",
      observedAt: "2026-08-29",
      sourceRefs: ["canonical:career:kim-seojun"],
      visibility: "public",
    },
  ],
  activities: [
    { period: "2026. 01. 04. — 01. 14.", role: "CES 2026 대구시 청년체험단", organization: "미국 해외연수", description: "CES 2026을 참관하고 실리콘밸리 기업과 기관을 방문했습니다.", proof: "신세계 지원서 자기기재", evidenceState: "self-reported", observedAt: "2026-05-26", sourceRefs: ["canonical:career:kim-seojun"], visibility: "public" },
    { period: "2026. 01.", role: "Google AI Studio Nocode Hackathon", organization: "AI 프로토타입 활동", description: "노코드 AI 재고·플래시세일 앱 프로젝트에 참여했습니다. 수상 표현은 공식 자료 확인 전까지 공개하지 않습니다.", proof: "지원서 반복 자기기재, 상장 미대조", evidenceState: "self-reported", observedAt: "2026-05-26", sourceRefs: ["canonical:career:kim-seojun"], visibility: "public" },
    { period: "2025. 04. — 2026. 05. 관측", role: "KREIA 대체투자학회", organization: "학내 활동", description: "IM 작성, 오피스 분석과 섹터 스터디 운영 활동을 지원서에 기록했습니다. 대표 직함은 승인 전 공개하지 않습니다.", proof: "지원서 자기기재", evidenceState: "self-reported", observedAt: "2026-05-26", sourceRefs: ["canonical:career:kim-seojun"], visibility: "public" },
    { period: "2025. 03. — 2026. 01.", role: "DART 퀀트 투자 동아리", organization: "학내 활동", description: "Python·R 기반 금융 데이터 분석 교육과 프로젝트·리포트 활동을 기록했습니다.", proof: "지원서 자기기재", evidenceState: "self-reported", observedAt: "2026-05-26", sourceRefs: ["canonical:career:kim-seojun"], visibility: "public" },
    { period: "2025. 01. 06. — 02. 28.", role: "P&P 멘토링클래스 23기", organization: "부동산금융 전문가네트워크", description: "부동산금융·개발 컨설팅 교육과 구성역 플랫폼시티 개발계획 실습을 수료했습니다.", proof: "수료증 기록", evidenceState: "public-verified", observedAt: "2025-02-26", sourceRefs: ["canonical:career:kim-seojun"], visibility: "public" },
    { period: "2024. 08. 21. — 08. 26.", role: "해피무브 더 그린", organization: "독일 환경 봉사", description: "환경 봉사와 친환경 랜드마크 탐방, CSR 제안 활동에 참여했습니다.", proof: "지원서·활동 자료 반복 자기기재", evidenceState: "self-reported", observedAt: "2026-05-26", sourceRefs: ["canonical:career:kim-seojun"], visibility: "public" },
    { period: "2023. 01. — 2024. 07.", role: "공병 · 공사감독 · 분대장", organization: "대한민국 육군", description: "안전 절차, 작업 확인, 인원과 임무 조율 경험을 기록했습니다.", proof: "복무·역할 자기기재", evidenceState: "self-reported", observedAt: "2026-05-26", sourceRefs: ["canonical:career:kim-seojun"], visibility: "public" },
    { period: "2022.", role: "비산동 주거환경 개선 봉사", organization: "주거환경 활동", description: "노후 주거의 누수·문·도배 보수 활동에 참여했다고 기록했습니다.", proof: "지원서 자기기재", evidenceState: "self-reported", observedAt: "2026-08-27", sourceRefs: ["canonical:career:kim-seojun"], visibility: "public" }
  ],
  projects: [
    {
      id: "datumguard", canonicalId: "project:datumguard", title: "DatumGuard", category: "DESIGN ASSURANCE",
      summary: "CAD/BIM 산출물을 별도 reader로 다시 열어 요구조건과 변경 이력을 확인하는 설계 QA 프로젝트입니다.",
      problem: "파일 생성 성공만으로는 저장된 결과가 치수·datum·clearance 조건을 지켰는지 알 수 없습니다.",
      myRole: "문제 범위 설정, contract·writer·독립 reader·승인 gate와 공개 데모를 직접 설계하고 구현했습니다.",
      artifact: "DXF·STEP·IFC 검증 파이프라인, 테스트, 웹 사례 페이지, 공개 릴리스",
      proof: "공개 v0.4.0 릴리스와 저장소에서 테스트·빌드·보안 gate를 확인할 수 있습니다.",
      boundary: "공개·합성 fixture 기반 개인 프로젝트이며 실제 안전 인증이나 상용 납품을 대체하지 않습니다.",
      image: "/projects/datumguard-piping.png", imageAlt: "DatumGuard 배관 clearance 검증 화면",
      tags: ["DXF", "STEP", "IFC", "QA", "Change Control"],
      links: [{ label: "Live demo", href: "https://datumguard-tjwnsdhfz.vercel.app" }, { label: "GitHub", href: "https://github.com/tjwnsdhfz/datumguard" }],
      evidenceState: "public-verified", observedAt: "2026-08-29", sourceRefs: ["canonical:project:datumguard", "https://github.com/tjwnsdhfz/datumguard/releases/tag/v0.4.0"], visibility: "public", featured: false,
    },
    {
      id: "modu-brain", canonicalId: "project:modu-brain", title: "Modu Brain", category: "AI AGENT · TEAM PROJECT",
      summary: "흩어진 협업 기록에서 결정, 관점 차이와 미해결 질문을 근거와 함께 복원하는 맥락 분석 도구입니다.",
      problem: "단순 요약에서는 누가 왜 다르게 판단했는지와 다음 질문이 사라집니다.",
      myRole: "맥락 분석 API, provider 분리, 근거 검증, 참여자 비교 UI와 실패 상태 구현에 참여했습니다.",
      artifact: "공개 저장소, 테스트 가능한 분석 흐름, 데모 화면",
      proof: "원문 snapshot에서 분석·근거 검증·저장으로 이어지는 코드를 공개 저장소에서 확인할 수 있습니다.",
      boundary: "팀 프로젝트이며 공개 전 제 직접 기여 문장은 사용자 최종 확인이 필요합니다.",
      image: "/projects/modu-brain-desktop.png", imageAlt: "Modu Brain 맥락 분석 화면",
      tags: ["TypeScript", "OpenAI API", "Supabase", "Testing"],
      links: [{ label: "Live demo", href: "https://modu-brain-demo.onrender.com/demo" }, { label: "GitHub", href: "https://github.com/tjwnsdhfz/modu-brain" }],
      evidenceState: "public-verified", observedAt: "2026-08-29", sourceRefs: ["canonical:project:modu-brain", "https://github.com/tjwnsdhfz/modu-brain"], visibility: "public", featured: false,
    },
    {
      id: "greenmiles", canonicalId: "project:greenmiles", title: "GreenMiles", category: "PRODUCT PROTOTYPE",
      summary: "저탄소·로컬 농식품 구매 증빙과 포인트, 추정 탄소기여도와 ESG 지표를 연결한 대시보드형 MVP입니다.",
      problem: "친환경 구매 행동과 조직의 ESG 기록이 서로 분리되어 추적하기 어렵습니다.",
      myRole: "제품 흐름, 데이터 구조, 접근 제어와 대시보드 MVP를 구현했습니다.",
      artifact: "Next.js·Supabase 기반 MVP와 테스트",
      proof: "공개 저장소에서 구현과 테스트 범위를 확인할 수 있습니다.",
      boundary: "운영 서비스나 검증된 탄소 회계가 아닌 제품 가설을 확인하는 프로토타입입니다.",
      image: "/projects/greenmiles-flow.svg", imageAlt: "GreenMiles 구매 증빙과 ESG 기록의 프로토타입 흐름",
      tags: ["Next.js", "Supabase", "RLS", "Product"],
      links: [{ label: "GitHub", href: "https://github.com/tjwnsdhfz/greenmiles-mvp" }],
      evidenceState: "prototype", observedAt: "2026-08-29", sourceRefs: ["canonical:project:greenmiles", "https://github.com/tjwnsdhfz/greenmiles-mvp"], visibility: "public", featured: false,
    },
    {
      id: "baram-2026", canonicalId: "project:baram-2026", title: "BARAM 2026", category: "ENGINEERING DATA QA",
      summary: "데이터 계약, 시간 누수 방지, provenance와 독립 gate review를 코드로 관리하는 예측 파이프라인입니다.",
      problem: "모델 성능만으로는 데이터 누수와 재현성, 제출 결과의 계보를 설명하기 어렵습니다.",
      myRole: "데이터 계약과 단계별 fail-closed 검증, 해시 기반 근거 기록을 구현하고 있습니다.",
      artifact: "검증 gate, 실행 상태 보고서, 재현 가능한 로컬 파이프라인",
      proof: "현재 통과 단계와 실패·대기 단계를 분리해 기록합니다.",
      boundary: "진행 중이며 잠금 검증과 최종 제출을 완료 성과로 주장하지 않습니다.",
      image: "/projects/baram-validation.svg", imageAlt: "BARAM 2026 단계별 검증 gate 다이어그램",
      tags: ["Python", "Data Contract", "Provenance", "Quality Gate"], links: [],
      evidenceState: "in-progress", observedAt: "2026-08-29", sourceRefs: ["canonical:project:baram-2026"], visibility: "public", featured: false,
    },
  ],
  awards: [],
  credentials: ["투자자산운용사 · 2024", "굴착기운전기능사 · 2023", "전산응용건축제도기능사 · 2022", "워드프로세서", "OPIc IH · 2026"],
  repositories: [
    { name: "DatumGuard", description: "설계 파일 독립 검증과 변경관리", repositoryUrl: "https://github.com/tjwnsdhfz/datumguard", demoUrl: "https://datumguard-tjwnsdhfz.vercel.app", tags: ["Python", "TypeScript", "CAD/BIM"] },
    { name: "Modu Brain", description: "근거 중심 협업 맥락 분석", repositoryUrl: "https://github.com/tjwnsdhfz/modu-brain", demoUrl: "https://modu-brain-demo.onrender.com/demo", tags: ["TypeScript", "AI", "Supabase"] },
    { name: "GreenMiles", description: "친환경 구매와 ESG 기록 MVP", repositoryUrl: "https://github.com/tjwnsdhfz/greenmiles-mvp", tags: ["Next.js", "Supabase"] },
  ],
  capabilities: [
    { title: "건축·공간", description: "도면, 모델, 동선과 요구조건을 함께 읽습니다." },
    { title: "CAD/BIM 자동화", description: "생성 결과를 다시 읽고 검증하는 흐름을 설계합니다." },
    { title: "AI·데이터", description: "출처, 실패 상태와 재현 가능성을 포함해 구현합니다." },
    { title: "기록·협업", description: "판단 근거와 한계를 다음 사람이 확인할 수 있게 남깁니다." },
  ],
  contact: {
    title: "함께 풀어볼 건축·AI 문제가 있다면 이야기해주세요.",
    description: "취업, 프로젝트 협업과 포트폴리오 피드백은 이메일로 받을 수 있습니다.",
    footerNote: "직접 기여와 확인 가능한 근거를 중심으로 작성했습니다.",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function sanitizePortfolioContent(value: unknown): PortfolioContent {
  if (!isRecord(value) || value.version !== 2) return DEFAULT_PORTFOLIO_CONTENT;
  return value as unknown as PortfolioContent;
}
