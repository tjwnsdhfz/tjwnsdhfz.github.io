export type Tone = "light" | "dark";

export type LinkItem = {
  label: string;
  href: string;
};

export type Metric = {
  value: string;
  label: string;
};

export type ProjectDetail = {
  label: string;
  value: string;
};

export type PortfolioProject = {
  id: string;
  category: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  tone: Tone;
  featured: boolean;
  visible: boolean;
  details: ProjectDetail[];
  tags: string[];
  links: LinkItem[];
};

export type RepositoryItem = {
  id: string;
  name: string;
  fullName: string;
  description: string;
  repositoryUrl: string;
  demoUrl: string;
  demoLabel: string;
  language: string;
  status: string;
  tags: string[];
  visible: boolean;
};

export type ExperienceItem = {
  period: string;
  role: string;
  description: string;
};

export type AwardItem = {
  year: string;
  title: string;
};

export type CapabilityItem = {
  title: string;
  summary: string;
  items: string[];
};

export type RoleFitItem = {
  label: string;
  title: string;
  evidence: string;
  application: string;
};

export type PortfolioContent = {
  version: 1;
  identity: {
    name: string;
    englishName: string;
    monogram: string;
    role: string;
    status: string;
    email: string;
    github: string;
    githubHandle: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    image: string;
    imageAlt: string;
    imageCaption: string;
  };
  intro: {
    eyebrow: string;
    title: string;
    description: string;
  };
  careerFacts: ProjectDetail[];
  metrics: Metric[];
  roleFitIntro: {
    eyebrow: string;
    title: string;
    description: string;
  };
  roleFit: RoleFitItem[];
  roleBoundary: string;
  projectIntro: {
    eyebrow: string;
    title: string;
    description: string;
    supportingEyebrow: string;
    supportingTitle: string;
  };
  repositoryIntro: {
    eyebrow: string;
    title: string;
    description: string;
    profileLabel: string;
  };
  repositories: RepositoryItem[];
  projects: PortfolioProject[];
  experienceIntro: {
    eyebrow: string;
    title: string;
    description: string;
  };
  experiences: ExperienceItem[];
  awards: AwardItem[];
  capabilityIntro: {
    eyebrow: string;
    title: string;
    description: string;
  };
  capabilities: CapabilityItem[];
  credentials: string[];
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    emailLabel: string;
    footerNote: string;
  };
};

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  version: 1,
  identity: {
    name: "김서준",
    englishName: "Seojun Kim",
    monogram: "KS",
    role: "HD현대중공업 조선 상세설계 지원 · CAD/Data Assurance",
    status: "건축학 5년제 · 조선 상세설계 신입 지원",
    email: "thatsceo@naver.com",
    github: "https://github.com/tjwnsdhfz",
    githubHandle: "@tjwnsdhfz",
  },
  hero: {
    eyebrow: "HD HYUNDAI HEAVY INDUSTRIES · SHIPBUILDING DETAILED DESIGN",
    title: "요구조건과 도면 변경을,",
    highlight: "생산 가능한 정보로 연결합니다.",
    description:
      "건축학에서 익힌 도면·공간 이해와 현장 실측 경험을 바탕으로, 저장된 CAD를 다시 열어 치수·datum·clearance·revision을 확인하는 검증 흐름을 구현했습니다. 실제 코드와 변경 기록으로 조선 상세설계에 전이 가능한 근거를 제시합니다.",
    primaryCta: { label: "설계 QA Case Study", href: "https://datumguard-tjwnsdhfz.vercel.app/case-study" },
    secondaryCta: { label: "직무 적합성 30초", href: "#role-fit" },
    image: "/projects/datumguard-piping.png",
    imageAlt: "배관 경로와 장비 clearance를 독립 검증하는 DatumGuard 화면",
    imageCaption: "DatumGuard · 공개 합성 배관 예제 · mm 단위 독립 재검증",
  },
  intro: {
    eyebrow: "CANDIDATE BRIEF",
    title: "정확한 도면, 설명 가능한 검토, 현장에 닿는 변경",
    description:
      "경북대학교 건축학과 5년제에서 도면·모델·동선을 다루고, 현장 실측을 100개 이상의 평면으로 전환했습니다. 현재는 CAD 산출물의 요구조건과 변경 이력을 코드로 검증합니다. 결과보다 검토 기준, 실패 차단, 협업 문서를 먼저 남기는 상세설계 엔지니어를 지향합니다.",
  },
  careerFacts: [
    { label: "Target", value: "HD현대중공업 · 조선 상세설계" },
    { label: "Education", value: "경북대학교 건축학과 5년제" },
    { label: "GPA", value: "3.86 / 4.5" },
    { label: "Language", value: "OPIc IH" },
  ],
  metrics: [
    { value: "100+", label: "현장 실측을 반영한 평면 설계" },
    { value: "376 + 35", label: "DatumGuard v0.3.0 자동 검증" },
    { value: "0.001 mm", label: "제한형 FrameGuard DXF 좌표 gate" },
  ],
  roleFitIntro: {
    eyebrow: "ROLE FIT · 30 SECOND REVIEW",
    title: "상세설계의 업무 신호를 실제 근거에 연결했습니다.",
    description:
      "HD현대 공식 직무의 구조해석·장비 검토·도면 설계 및 검토, 생산도면과 설계 시스템 개발을 기준으로 정리했습니다. 선박 실무를 했다고 포장하지 않고 지금 확인 가능한 도면·현장·검증 경험만 연결합니다.",
  },
  roleFit: [
    {
      label: "01 · DRAWING",
      title: "도면 설계와 검토",
      evidence: "AutoCAD·Rhino·SketchUp으로 건축 도면과 3D 모델을 작성하고, 현장 실측 조건을 100개 이상의 셀프스토리지 평면으로 전환했습니다.",
      application: "요구조건을 치수와 도면으로 구체화하고, 누락·충돌·변경을 체크리스트로 다시 검토하는 기본기로 연결합니다.",
    },
    {
      label: "02 · MODEL REVIEW",
      title: "구조·공간·장비 배치 사고",
      evidence: "구조 프레임, 주거 유닛, 공용 동선과 무장애 조건을 하나의 공간 체계로 검토하고 도면·다이어그램으로 설명했습니다.",
      application: "구획, 통행, 접근성, clearance를 함께 보는 모델 기반 검토 역량으로 확장하고 있습니다.",
    },
    {
      label: "03 · CHANGE CONTROL",
      title: "설계 품질과 변경 추적",
      evidence: "DatumGuard에서 요구조건을 versioned contract로 고정하고 DXF·STEP·IFC를 별도 reader로 재측정한 뒤 통과 파일만 승인합니다.",
      application: "설계 입력 → CAD 산출물 → 독립 검토 → revision 기록 → 승인 gate의 닫힌 흐름을 구현했습니다.",
    },
    {
      label: "04 · FIELD & TEAM",
      title: "현장·안전·협업 문서화",
      evidence: "실측·고객 협의와 공병 분대장 경험에서 조건과 위험을 기록하고, 인원과 임무를 조율하며 절차를 지켰습니다.",
      application: "타 부서·현장과 검토 근거를 짧고 정확하게 공유하고, 모호한 조건은 질문과 기록으로 닫는 태도를 갖췄습니다.",
    },
  ],
  roleBoundary:
    "현재 보유 근거는 건축·BIM/CAD와 공개 합성 설계 QA입니다. 선급 Rule, 선박 구조해석, AVEVA·NAPA 실무와 생산 승인 경험은 보유 역량으로 주장하지 않으며 입사 전후 학습·적응 영역으로 분리합니다.",
  projectIntro: {
    eyebrow: "SELECTED DESIGN EVIDENCE",
    title: "도면 품질과 모델 검토를 보여주는 대표 작업",
    description: "각 작업을 설계 입력, 판단, 검증 근거, 변경 기록과 한계 순서로 읽을 수 있도록 정리했습니다.",
    supportingEyebrow: "CURRENT & SUPPORTING WORK",
    supportingTitle: "검증 절차와 건축 설계 기반",
  },
  repositoryIntro: {
    eyebrow: "PUBLIC DESIGN ASSURANCE",
    title: "주장보다 코드·검토 기록·배포 근거",
    description:
      "설계 QA의 요구조건, 실패 사례, 테스트 수치와 변경 이력을 공개 저장소에서 다시 확인할 수 있습니다. 직무와 거리가 있는 저장소는 메인 목록에서 제외했습니다.",
    profileLabel: "@tjwnsdhfz 전체 저장소",
  },
  repositories: [
    {
      id: "repo-datumguard",
      name: "DatumGuard",
      fullName: "tjwnsdhfz/datumguard",
      description:
        "Versioned contract로 요구조건을 고정하고 저장된 DXF·STEP·IFC를 독립 reader로 다시 열어 치수·datum·clearance·revision 근거를 만드는 설계 품질 도구입니다.",
      repositoryUrl: "https://github.com/tjwnsdhfz/datumguard",
      demoUrl: "https://datumguard-tjwnsdhfz.vercel.app",
      demoLabel: "Live demo",
      language: "Python · TypeScript",
      status: "v0.3.0 · Public · Live",
      tags: ["DXF", "STEP", "IFC", "Change Control", "Independent Verification"],
      visible: true,
    },
    {
      id: "repo-modu-brain",
      name: "Modu Brain",
      fullName: "tjwnsdhfz/modu-brain",
      description:
        "회의록과 리서치에 흩어진 결정 배경, 참여자 관점, 미결 질문을 원문 근거와 함께 구조화하는 협업 맥락 웹 앱입니다.",
      repositoryUrl: "https://github.com/tjwnsdhfz/modu-brain",
      demoUrl: "https://modu-brain-demo.onrender.com/demo",
      demoLabel: "Demo",
      language: "TypeScript · SQL",
      status: "Public · Standalone",
      tags: ["React", "Supabase", "OpenAI", "RLS", "Playwright"],
      visible: false,
    },
    {
      id: "repo-greenmiles",
      name: "GreenMiles MVP",
      fullName: "tjwnsdhfz/greenmiles-mvp",
      description:
        "저탄소·로컬 농식품의 구매 증빙, 포인트, 추정 탄소기여도, 소매점 ESG 지표와 MRV 상태를 연결한 대시보드형 MVP입니다.",
      repositoryUrl: "https://github.com/tjwnsdhfz/greenmiles-mvp",
      demoUrl: "",
      demoLabel: "",
      language: "TypeScript · SQL",
      status: "Public · MVP",
      tags: ["Next.js", "Supabase", "RLS", "Vitest", "Product"],
      visible: false,
    },
  ],
  projects: [
    {
      id: "datumguard",
      category: "01 · DESIGN ASSURANCE · PERSONAL · v0.3.0",
      title: "DatumGuard — 설계 데이터 검증과 변경관리",
      summary:
        "요구조건을 versioned contract로 고정하고, 저장된 DXF·STEP·IFC를 별도 reader로 다시 열어 치수·datum·clearance·revision을 확인한 뒤 통과 파일만 승인합니다.",
      image: "/projects/datumguard-piping.png",
      imageAlt: "배관 경로, 장비, 지지대와 clearance를 재검증하는 DatumGuard 화면",
      tone: "dark",
      featured: true,
      visible: true,
      details: [
        {
          label: "Problem",
          value: "생성 성공만으로는 저장된 CAD가 요구 치수, datum과 변경 조건을 실제 파일에서도 지켰는지 확인할 수 없었습니다.",
        },
        {
          label: "My role",
          value: "문제 범위를 설계 품질 보증으로 좁히고 contract, writer, 독립 reader, approval gate와 배포 검증을 구현했습니다.",
        },
        {
          label: "Detailed-design transfer",
          value: "요구조건 → CAD 산출물 → 독립 재검토 → revision 기록 → 승인 gate 순서로 검토 흐름을 닫고, 하나라도 실패하면 공식 bundle을 차단합니다.",
        },
        {
          label: "Verified evidence",
          value: "공개 v0.3.0은 376 pytest, 35 Playwright, 15-page build, container·SBOM·security gate와 배포 commit의 exact release_sha smoke를 통과했습니다.",
        },
        {
          label: "Boundary",
          value: "Architecture·Piping·Pipe Rack·Plate는 공개 합성 예제입니다. 조선소 실무도면, 제작 승인, 선급·구조·안전 인증을 대체하지 않습니다.",
        },
      ],
      tags: ["DXF", "STEP", "IFC", "Rhino", "Change Control", "Independent Verification"],
      links: [
        { label: "60초 Case Study", href: "https://datumguard-tjwnsdhfz.vercel.app/case-study" },
        { label: "Live demo", href: "https://datumguard-tjwnsdhfz.vercel.app" },
        { label: "GitHub", href: "https://github.com/tjwnsdhfz/datumguard" },
      ],
    },
    {
      id: "modu-brain",
      category: "02 · AI AGENT · TEAM PROJECT",
      title: "Modu Brain",
      summary:
        "흩어진 협업 기록에서 결정, 관점 차이, 미해결 질문을 근거와 함께 복원하는 맥락 분석 도구입니다.",
      image: "/projects/modu-brain-desktop.png",
      imageAlt: "Modu Brain 맥락 분석 결과와 참여자 관점 비교 화면",
      tone: "light",
      featured: false,
      visible: false,
      details: [
        {
          label: "Problem",
          value: "회의와 메시지를 요약하는 것만으로는 누가 왜 다르게 판단했는지와 다음 질문이 사라졌습니다.",
        },
        {
          label: "My role",
          value: "맥락 분석 API, provider 분리, 근거 검증, 참여자 비교 UI와 실패 상태를 구현했습니다.",
        },
        {
          label: "Proof",
          value: "원문 snapshot부터 분석·근거 검증·저장까지 이어지는 흐름을 테스트와 공개 데모로 확인했습니다.",
        },
      ],
      tags: ["TypeScript", "OpenAI API", "Supabase", "Vitest", "Playwright"],
      links: [{ label: "Live demo", href: "https://modu-brain-demo.onrender.com/demo" }],
    },
    {
      id: "architecture-project-01",
      category: "03 · ARCHITECTURE · ACADEMIC",
      title: "구조 프레임과 전시 동선을 결합한 갤러리",
      summary:
        "구조 프레임과 전시 동선을 하나의 공간 경험으로 엮은 건축 설계 작업입니다.",
      image: "/projects/architecture-gallery.webp",
      imageAlt: "구조 프레임과 전시 공간을 보여주는 건축 설계 렌더링",
      tone: "dark",
      featured: false,
      visible: false,
      details: [
        { label: "Focus", value: "공간 구성 · 동선 · 3D visualization" },
      ],
      tags: ["Spatial Design", "Circulation", "3D Visualization"],
      links: [],
    },
    {
      id: "time-after-time",
      category: "02 · MODEL-BASED SPACE REVIEW · ACADEMIC",
      title: "Time After Time — 공간·동선·무장애 검토",
      summary:
        "매스, 공용 동선, 주거 유닛과 무장애 조건을 하나의 모델로 조정하고 평면·단면·다이어그램에서 반복 검토한 건축 설계입니다.",
      image: "/projects/time-after-time.webp",
      imageAlt: "시니어 주거 매스와 평면, 동선을 설명하는 설계 패널",
      tone: "light",
      featured: false,
      visible: true,
      details: [
        { label: "Design input", value: "고령자의 독립 생활, 지역 커뮤니티 연결, 주거 유닛과 무장애 이동 조건을 설계 요구로 정리했습니다." },
        { label: "Review focus", value: "주요 구획, 공용 동선, 유닛 반복, 수직 이동과 접근성이 서로 충돌하지 않는지 스케일별로 검토했습니다." },
        { label: "Deliverables", value: "배치·평면·단면, 매스·동선 다이어그램과 주거 유닛 검토를 하나의 설계 패널로 정리했습니다." },
        { label: "Detailed-design transfer", value: "큰 모델을 구획·동선·반복 유닛으로 분해하고 도면 간 정합성을 확인하는 사고를 보여줍니다." },
        { label: "Boundary", value: "건축 스튜디오 결과이며 선박 구획, 장비 배치, 구조해석이나 생산도면 경험으로 주장하지 않습니다." },
      ],
      tags: ["AutoCAD", "Rhino", "Spatial Coordination", "Circulation", "Universal Design"],
      links: [],
    },
    {
      id: "baram-2026",
      category: "03 · ENGINEERING DATA QA · ACTIVE",
      title: "BARAM 2026 — 검증 Gate 기반 예측 파이프라인",
      summary:
        "데이터 계약, 시간 누수 방지, SHA-256 provenance와 독립 Gate review를 코드로 관리합니다. G0–G3는 통과했지만 G4 감사의 FAIL 항목을 숨기지 않고 보강 중이며 2024 잠금 검증셋은 아직 열지 않았습니다.",
      image: "/projects/baram-validation.svg",
      imageAlt: "BARAM 2026의 데이터 계약, G0부터 G6까지의 검증 gate와 잠금 검증 상태를 나타낸 다이어그램",
      tone: "dark",
      featured: false,
      visible: true,
      details: [
        { label: "Focus", value: "데이터 계약 · 시간 누수 방지 · provenance · 독립 감사 · fail-closed gate" },
        { label: "Current state", value: "G0–G3 PASS, G4 보강 중, G5/G6 대기. 성능보다 검증 순서와 재현 가능성을 먼저 고정합니다." },
        { label: "Boundary", value: "현재 로컬 개발 작업이며 G4 완료, 2024 one-shot 평가와 DACON 최종 제출을 성과로 주장하지 않습니다." },
      ],
      tags: ["Python", "Data Contract", "Quality Gate", "Provenance", "Reproducibility"],
      links: [],
    },
    {
      id: "kreia-market-research",
      category: "05 · REAL ESTATE · RESEARCH",
      title: "KREIA Market Research",
      summary:
        "대체투자학회를 설립하고 초대 회장으로 시장 조사, 현장 실사, IM 작성과 섹터 스터디를 운영했습니다.",
      image: "/projects/kreia-market-analysis.webp",
      imageAlt: "셀프스토리지와 시니어하우징 시장 분석 인포그래픽",
      tone: "dark",
      featured: false,
      visible: false,
      details: [{ label: "Focus", value: "학회 설립 · 시장 분석 · Investment memo" }],
      tags: ["Leadership", "Market Research", "Investment Memo"],
      links: [],
    },
    {
      id: "platform-city",
      category: "06 · DEVELOPMENT · TEAM PROJECT",
      title: "구성역 플랫폼시티 개발안",
      summary:
        "P&P 멘토링클래스 개발5조 발표자로 신축 개발계획, 시장 분석과 사업성 검토를 의사결정 자료로 구성했습니다.",
      image: "/projects/landtech-calculator.webp",
      imageAlt: "구성역 플랫폼시티 개발계획의 시장 및 사업성 분석 화면",
      tone: "light",
      featured: false,
      visible: false,
      details: [{ label: "Focus", value: "개발기획 · 시장 분석 · 사업성 검토" }],
      tags: ["Development", "Feasibility", "Presentation"],
      links: [],
    },
    {
      id: "dart-analysis",
      category: "07 · DATA ANALYSIS · DART",
      title: "공학적 가설을 데이터로 시험하기",
      summary:
        "LNG 밸류체인과 데이터센터 수요, 공매도 재개 역모멘텀을 분석하고 10건 이상의 리포트를 주도했습니다.",
      image: "/projects/dart-llm-analysis.webp",
      imageAlt: "데이터센터 건설 추세와 LNG 수요를 분석한 리포트",
      tone: "dark",
      featured: false,
      visible: false,
      details: [{ label: "Focus", value: "Python · R · Valuation · Backtest" }],
      tags: ["Python", "R", "Valuation", "Backtest"],
      links: [],
    },
  ],
  experienceIntro: {
    eyebrow: "RELEVANT EXPERIENCE · ROLE-ORDERED",
    title: "도면, 현장, 안전과 협업을 맡아본 경험",
    description:
      "최신순이 아니라 조선 상세설계 직무와의 관련성 순으로 배치했습니다. 현장 조건을 도면으로 바꾸고, 절차와 위험을 기록하며, 다른 이해관계자와 검토 근거를 맞춘 경험입니다.",
  },
  experiences: [
    {
      period: "2024.09 — 2024.12",
      role: "IAM BOX · 부동산운영팀 매니저",
      description: "현장 실측 조건을 바탕으로 100개 이상의 셀프스토리지 평면을 설계했습니다. 치수와 운영 동선을 상담 내용에 맞춰 조정했고, 312건 이상의 상담을 16건·약 9.5억원 규모 계약으로 연결했습니다.",
    },
    {
      period: "2023.01 — 2024.07",
      role: "대한민국 육군 · 공병 / 분대장",
      description: "6개월간 분대장으로 임무와 인원을 조율하고 45일간 지뢰 제거 작전을 수행했습니다. 작업 순서, 위험요소와 팀 안전 기준을 생략하지 않는 현장 태도를 익혔습니다.",
    },
    {
      period: "2025.07 — 2025.08",
      role: "그린하버 · 대체투자팀 프로젝트 인턴",
      description: "옥상 태양광 산업 분석과 블라인드펀드 IM 초안을 지원했습니다. 시장 자료, 금융 조건과 계약 문구를 비교하고 검토 근거를 문서로 정리했습니다.",
    },
    {
      period: "2025.09 — NOW",
      role: "대구지역경제교육센터 · 연구보조",
      description: "금융 데이터와 만족도 설문을 정리해 교육 개선안을 도출하고, 청년창업 경진대회 운영에서 심사 기준과 진행 절차를 조율합니다.",
    },
  ],
  awards: [
    { year: "2026", title: "Google AI 노코드 해커톤 우수상" },
    { year: "2026", title: "경북대학교 우수 취업동아리 대표 장려상" },
    { year: "2025 — NOW", title: "KREIA 설립 · 초대 회장" },
  ],
  capabilityIntro: {
    eyebrow: "TRANSFERABLE CAPABILITIES",
    title: "상세설계로 가져갈 도면·데이터·검증 역량",
    description: "기술 이름보다 어떤 설계 입력을 다루고, 무엇을 다시 확인하며, 어떤 근거를 남기는지로 구분했습니다.",
  },
  capabilities: [
    {
      title: "Drawing & Spatial Design",
      summary: "현장 조건을 도면과 모델로 구체화",
      items: ["AutoCAD · SketchUp · Rhino", "실측 · 평면 · 단면 · 동선", "구조 프레임 · 반복 유닛 · 무장애 검토", "전산응용건축제도기능사"],
    },
    {
      title: "CAD Data & Verification",
      summary: "저장된 산출물을 다시 열어 독립 검토",
      items: ["DXF · STEP · IFC", "Datum · tolerance · clearance", "Serialized artifact 재측정", "Revision compare · 공개 합성 Piping/Plate fixture"],
    },
    {
      title: "Engineering QA & Delivery",
      summary: "요구조건과 변경 근거를 fail-closed로 관리",
      items: ["Versioned contract · immutable hash", "Python · TypeScript · Git", "pytest · Playwright · CI", "Issue log · test report · exact-revision smoke"],
    },
  ],
  credentials: ["전산응용건축제도기능사", "굴착기운전기능사", "OPIc IH", "투자자산운용사"],
  contact: {
    eyebrow: "CONTACT",
    title: "정확한 도면이 생산 현장까지 이어지도록 배우고 기여하겠습니다.",
    description:
      "HD현대중공업 조선 상세설계 신입으로 구조·장비 검토, 생산도면과 설계 시스템을 빠르게 익히고, 도면 품질과 변경 추적에 검증 자동화 경험을 보태고 싶습니다.",
    emailLabel: "김서준에게 이메일",
    footerNote: "Role-targeted portfolio · Source and evidence linked · Editable in browser",
  },
};

type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function textValue(value: unknown, fallback: string, max = 4000): string {
  return typeof value === "string" ? value.trim().slice(0, max) || fallback : fallback;
}

function optionalText(value: unknown, max = 4000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function safeHref(value: unknown, fallback: string): string {
  const candidate = textValue(value, fallback, 1000);
  if (
    candidate.startsWith("#") ||
    candidate.startsWith("/") ||
    candidate.startsWith("mailto:") ||
    candidate.startsWith("https://") ||
    candidate.startsWith("http://localhost")
  ) {
    return candidate;
  }
  return fallback;
}

function optionalHref(value: unknown): string {
  const candidate = optionalText(value, 1000);
  if (!candidate) return "";
  if (
    candidate.startsWith("#") ||
    candidate.startsWith("/") ||
    candidate.startsWith("mailto:") ||
    candidate.startsWith("https://") ||
    candidate.startsWith("http://localhost")
  ) {
    return candidate;
  }
  return "";
}

function safeImage(value: unknown, fallback: string): string {
  const candidate = textValue(value, fallback, 1000);
  return candidate.startsWith("/") || candidate.startsWith("https://") ? candidate : fallback;
}

function stringList(value: unknown, fallback: string[], maxItems = 24): string[] {
  if (!Array.isArray(value)) return fallback;
  const list = value
    .slice(0, maxItems)
    .map((item) => (typeof item === "string" ? item.trim().slice(0, 240) : ""))
    .filter(Boolean);
  return list.length ? list : fallback;
}

function link(value: unknown, fallback: LinkItem): LinkItem {
  const source = record(value);
  return {
    label: textValue(source.label, fallback.label, 120),
    href: safeHref(source.href, fallback.href),
  };
}

export function sanitizePortfolioContent(value: unknown): PortfolioContent {
  const source = record(value);
  const identity = record(source.identity);
  const hero = record(source.hero);
  const intro = record(source.intro);
  const roleFitIntro = record(source.roleFitIntro);
  const projectIntro = record(source.projectIntro);
  const repositoryIntro = record(source.repositoryIntro);
  const experienceIntro = record(source.experienceIntro);
  const capabilityIntro = record(source.capabilityIntro);
  const contact = record(source.contact);

  const metrics = Array.isArray(source.metrics)
    ? source.metrics.slice(0, 12).map((item, index) => {
        const entry = record(item);
        const fallback = DEFAULT_PORTFOLIO_CONTENT.metrics[index] ?? { value: "—", label: "새 지표" };
        return {
          value: textValue(entry.value, fallback.value, 80),
          label: textValue(entry.label, fallback.label, 240),
        };
      })
    : DEFAULT_PORTFOLIO_CONTENT.metrics;

  const careerFacts = Array.isArray(source.careerFacts)
    ? source.careerFacts.slice(0, 8).map((item, index) => {
        const entry = record(item);
        const fallback = DEFAULT_PORTFOLIO_CONTENT.careerFacts[index] ?? {
          label: "Fact",
          value: "내용",
        };
        return {
          label: textValue(entry.label, fallback.label, 120),
          value: textValue(entry.value, fallback.value, 300),
        };
      })
    : DEFAULT_PORTFOLIO_CONTENT.careerFacts;

  const roleFit = Array.isArray(source.roleFit)
    ? source.roleFit.slice(0, 8).map((item, index) => {
        const entry = record(item);
        const fallback = DEFAULT_PORTFOLIO_CONTENT.roleFit[index] ?? {
          label: `0${index + 1} · ROLE FIT`,
          title: "새 직무 근거",
          evidence: "확인 가능한 경험과 산출물",
          application: "지원 직무와 연결되는 이유",
        };
        return {
          label: textValue(entry.label, fallback.label, 120),
          title: textValue(entry.title, fallback.title, 240),
          evidence: textValue(entry.evidence, fallback.evidence, 1600),
          application: textValue(entry.application, fallback.application, 1600),
        } satisfies RoleFitItem;
      })
    : DEFAULT_PORTFOLIO_CONTENT.roleFit;

  const repositories = Array.isArray(source.repositories)
    ? source.repositories.slice(0, 18).map((item, index) => {
        const entry = record(item);
        const fallback = DEFAULT_PORTFOLIO_CONTENT.repositories[index] ?? {
          id: `repository-${index + 1}`,
          name: "New repository",
          fullName: "owner/repository",
          description: "저장소 설명",
          repositoryUrl: "https://github.com/",
          demoUrl: "",
          demoLabel: "",
          language: "TypeScript",
          status: "Public",
          tags: ["Project"],
          visible: true,
        };
        const id = textValue(entry.id, fallback.id, 80)
          .toLowerCase()
          .replace(/[^a-z0-9가-힣-]+/g, "-");
        return {
          id: id || `repository-${index + 1}`,
          name: textValue(entry.name, fallback.name, 180),
          fullName: textValue(entry.fullName, fallback.fullName, 220),
          description: textValue(entry.description, fallback.description, 1600),
          repositoryUrl: safeHref(entry.repositoryUrl, fallback.repositoryUrl),
          demoUrl: optionalHref(entry.demoUrl),
          demoLabel: optionalText(entry.demoLabel, 120),
          language: textValue(entry.language, fallback.language, 180),
          status: textValue(entry.status, fallback.status, 160),
          tags: stringList(entry.tags, fallback.tags, 16),
          visible: booleanValue(entry.visible, fallback.visible),
        } satisfies RepositoryItem;
      })
    : DEFAULT_PORTFOLIO_CONTENT.repositories;

  const projects = Array.isArray(source.projects)
    ? source.projects.slice(0, 30).map((item, index) => {
        const entry = record(item);
        const fallback = DEFAULT_PORTFOLIO_CONTENT.projects[index] ?? DEFAULT_PORTFOLIO_CONTENT.projects[0];
        const detailSource = Array.isArray(entry.details) ? entry.details : fallback.details;
        const linkSource = Array.isArray(entry.links) ? entry.links : fallback.links;
        const id = textValue(entry.id, `project-${index + 1}`, 80)
          .toLowerCase()
          .replace(/[^a-z0-9가-힣-]+/g, "-");
        return {
          id: id || `project-${index + 1}`,
          category: textValue(entry.category, fallback.category, 200),
          title: textValue(entry.title, fallback.title, 200),
          summary: textValue(entry.summary, fallback.summary, 2000),
          image: safeImage(entry.image, fallback.image),
          imageAlt: textValue(entry.imageAlt, fallback.imageAlt, 400),
          tone: entry.tone === "dark" ? "dark" : "light",
          featured: booleanValue(entry.featured, fallback.featured),
          visible: booleanValue(entry.visible, fallback.visible),
          details: detailSource.slice(0, 12).map((detail, detailIndex) => {
            const detailRecord = record(detail);
            const detailFallback = fallback.details[detailIndex] ?? { label: "Detail", value: "내용" };
            return {
              label: textValue(detailRecord.label, detailFallback.label, 100),
              value: textValue(detailRecord.value, detailFallback.value, 1400),
            };
          }),
          tags: stringList(entry.tags, fallback.tags, 20),
          links: linkSource.slice(0, 8).map((item, linkIndex) =>
            link(item, fallback.links[linkIndex] ?? { label: "Link", href: "#" }),
          ),
        } satisfies PortfolioProject;
      })
    : DEFAULT_PORTFOLIO_CONTENT.projects;

  const experiences = Array.isArray(source.experiences)
    ? source.experiences.slice(0, 24).map((item, index) => {
        const entry = record(item);
        const fallback = DEFAULT_PORTFOLIO_CONTENT.experiences[index] ?? {
          period: "기간",
          role: "새 경험",
          description: "설명",
        };
        return {
          period: textValue(entry.period, fallback.period, 120),
          role: textValue(entry.role, fallback.role, 240),
          description: textValue(entry.description, fallback.description, 2000),
        };
      })
    : DEFAULT_PORTFOLIO_CONTENT.experiences;

  const awards = Array.isArray(source.awards)
    ? source.awards.slice(0, 18).map((item, index) => {
        const entry = record(item);
        const fallback = DEFAULT_PORTFOLIO_CONTENT.awards[index] ?? { year: "연도", title: "새 항목" };
        return {
          year: textValue(entry.year, fallback.year, 80),
          title: textValue(entry.title, fallback.title, 300),
        };
      })
    : DEFAULT_PORTFOLIO_CONTENT.awards;

  const capabilities = Array.isArray(source.capabilities)
    ? source.capabilities.slice(0, 12).map((item, index) => {
        const entry = record(item);
        const fallback = DEFAULT_PORTFOLIO_CONTENT.capabilities[index] ?? {
          title: "새 역량",
          summary: "요약",
          items: ["항목"],
        };
        return {
          title: textValue(entry.title, fallback.title, 160),
          summary: textValue(entry.summary, fallback.summary, 400),
          items: stringList(entry.items, fallback.items, 20),
        };
      })
    : DEFAULT_PORTFOLIO_CONTENT.capabilities;

  return {
    version: 1,
    identity: {
      name: textValue(identity.name, DEFAULT_PORTFOLIO_CONTENT.identity.name, 120),
      englishName: textValue(identity.englishName, DEFAULT_PORTFOLIO_CONTENT.identity.englishName, 120),
      monogram: textValue(identity.monogram, DEFAULT_PORTFOLIO_CONTENT.identity.monogram, 8),
      role: textValue(identity.role, DEFAULT_PORTFOLIO_CONTENT.identity.role, 240),
      status: textValue(identity.status, DEFAULT_PORTFOLIO_CONTENT.identity.status, 240),
      email: textValue(identity.email, DEFAULT_PORTFOLIO_CONTENT.identity.email, 240),
      github: safeHref(identity.github, DEFAULT_PORTFOLIO_CONTENT.identity.github),
      githubHandle: textValue(
        identity.githubHandle,
        DEFAULT_PORTFOLIO_CONTENT.identity.githubHandle,
        120,
      ),
    },
    hero: {
      eyebrow: textValue(hero.eyebrow, DEFAULT_PORTFOLIO_CONTENT.hero.eyebrow, 160),
      title: textValue(hero.title, DEFAULT_PORTFOLIO_CONTENT.hero.title, 300),
      highlight: textValue(hero.highlight, DEFAULT_PORTFOLIO_CONTENT.hero.highlight, 300),
      description: textValue(hero.description, DEFAULT_PORTFOLIO_CONTENT.hero.description, 2000),
      primaryCta: link(hero.primaryCta, DEFAULT_PORTFOLIO_CONTENT.hero.primaryCta),
      secondaryCta: link(hero.secondaryCta, DEFAULT_PORTFOLIO_CONTENT.hero.secondaryCta),
      image: safeImage(hero.image, DEFAULT_PORTFOLIO_CONTENT.hero.image),
      imageAlt: textValue(hero.imageAlt, DEFAULT_PORTFOLIO_CONTENT.hero.imageAlt, 400),
      imageCaption: textValue(hero.imageCaption, DEFAULT_PORTFOLIO_CONTENT.hero.imageCaption, 240),
    },
    intro: {
      eyebrow: textValue(intro.eyebrow, DEFAULT_PORTFOLIO_CONTENT.intro.eyebrow, 120),
      title: textValue(intro.title, DEFAULT_PORTFOLIO_CONTENT.intro.title, 400),
      description: textValue(intro.description, DEFAULT_PORTFOLIO_CONTENT.intro.description, 2400),
    },
    careerFacts: careerFacts.length ? careerFacts : DEFAULT_PORTFOLIO_CONTENT.careerFacts,
    metrics: metrics.length ? metrics : DEFAULT_PORTFOLIO_CONTENT.metrics,
    roleFitIntro: {
      eyebrow: textValue(roleFitIntro.eyebrow, DEFAULT_PORTFOLIO_CONTENT.roleFitIntro.eyebrow, 160),
      title: textValue(roleFitIntro.title, DEFAULT_PORTFOLIO_CONTENT.roleFitIntro.title, 500),
      description: textValue(
        roleFitIntro.description,
        DEFAULT_PORTFOLIO_CONTENT.roleFitIntro.description,
        2400,
      ),
    },
    roleFit: roleFit.length ? roleFit : DEFAULT_PORTFOLIO_CONTENT.roleFit,
    roleBoundary: textValue(source.roleBoundary, DEFAULT_PORTFOLIO_CONTENT.roleBoundary, 2400),
    projectIntro: {
      eyebrow: textValue(projectIntro.eyebrow, DEFAULT_PORTFOLIO_CONTENT.projectIntro.eyebrow, 160),
      title: textValue(projectIntro.title, DEFAULT_PORTFOLIO_CONTENT.projectIntro.title, 500),
      description: textValue(projectIntro.description, DEFAULT_PORTFOLIO_CONTENT.projectIntro.description, 1800),
      supportingEyebrow: textValue(
        projectIntro.supportingEyebrow,
        DEFAULT_PORTFOLIO_CONTENT.projectIntro.supportingEyebrow,
        160,
      ),
      supportingTitle: textValue(
        projectIntro.supportingTitle,
        DEFAULT_PORTFOLIO_CONTENT.projectIntro.supportingTitle,
        400,
      ),
    },
    repositoryIntro: {
      eyebrow: textValue(repositoryIntro.eyebrow, DEFAULT_PORTFOLIO_CONTENT.repositoryIntro.eyebrow, 120),
      title: textValue(repositoryIntro.title, DEFAULT_PORTFOLIO_CONTENT.repositoryIntro.title, 300),
      description: textValue(
        repositoryIntro.description,
        DEFAULT_PORTFOLIO_CONTENT.repositoryIntro.description,
        1600,
      ),
      profileLabel: textValue(
        repositoryIntro.profileLabel,
        DEFAULT_PORTFOLIO_CONTENT.repositoryIntro.profileLabel,
        180,
      ),
    },
    repositories: repositories.length ? repositories : DEFAULT_PORTFOLIO_CONTENT.repositories,
    projects: projects.length ? projects : DEFAULT_PORTFOLIO_CONTENT.projects,
    experienceIntro: {
      eyebrow: textValue(experienceIntro.eyebrow, DEFAULT_PORTFOLIO_CONTENT.experienceIntro.eyebrow, 120),
      title: textValue(experienceIntro.title, DEFAULT_PORTFOLIO_CONTENT.experienceIntro.title, 400),
      description: textValue(
        experienceIntro.description,
        DEFAULT_PORTFOLIO_CONTENT.experienceIntro.description,
        1600,
      ),
    },
    experiences: experiences.length ? experiences : DEFAULT_PORTFOLIO_CONTENT.experiences,
    awards: awards.length ? awards : DEFAULT_PORTFOLIO_CONTENT.awards,
    capabilityIntro: {
      eyebrow: textValue(capabilityIntro.eyebrow, DEFAULT_PORTFOLIO_CONTENT.capabilityIntro.eyebrow, 120),
      title: textValue(capabilityIntro.title, DEFAULT_PORTFOLIO_CONTENT.capabilityIntro.title, 400),
      description: textValue(
        capabilityIntro.description,
        DEFAULT_PORTFOLIO_CONTENT.capabilityIntro.description,
        1600,
      ),
    },
    capabilities: capabilities.length ? capabilities : DEFAULT_PORTFOLIO_CONTENT.capabilities,
    credentials: stringList(source.credentials, DEFAULT_PORTFOLIO_CONTENT.credentials, 24),
    contact: {
      eyebrow: textValue(contact.eyebrow, DEFAULT_PORTFOLIO_CONTENT.contact.eyebrow, 120),
      title: textValue(contact.title, DEFAULT_PORTFOLIO_CONTENT.contact.title, 400),
      description: textValue(contact.description, DEFAULT_PORTFOLIO_CONTENT.contact.description, 1600),
      emailLabel: textValue(contact.emailLabel, DEFAULT_PORTFOLIO_CONTENT.contact.emailLabel, 120),
      footerNote: textValue(contact.footerNote, DEFAULT_PORTFOLIO_CONTENT.contact.footerNote, 300),
    },
  };
}
