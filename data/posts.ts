export interface Post {
  id: string;
  title: string;
  description: string;
  tags: string[];
  neededCount: number;
  deadline: string; // YYYY-MM-DD
}

export const posts: Post[] = [
  {
    id: "1",
    title: "NYPC 알고리즘 대회 팀원 모집",
    description: "온라인 예선까지 함께 준비할 팀원을 찾습니다. 그리디, DP 문제풀이 스터디도 병행할 예정입니다.",
    tags: ["알고리즘/PS", "코딩/구현"],
    neededCount: 3,
    deadline: "2026-10-15",
  },
  {
    id: "2",
    title: "청소년 과학탐구대회 R&E 팀 구성",
    description: "생명과학 분야 탐구 주제로 함께 실험 설계와 논문 작성을 진행할 팀원을 모집합니다.",
    tags: ["물리/화학/생명과학/지구과학", "연구(R&E)", "자료조사/논문분석"],
    neededCount: 2,
    deadline: "2026-10-05",
  },
  {
    id: "3",
    title: "한사챌 웹 서비스 개발팀",
    description: "교내 문제를 해결하는 웹 서비스를 함께 기획하고 개발할 팀원을 찾습니다.",
    tags: ["웹/앱 개발", "기획/아이디어"],
    neededCount: 4,
    deadline: "2026-11-01",
  },
  {
    id: "4",
    title: "발명특허대회 아이디어 팀",
    description: "생활 속 불편을 해결하는 발명 아이디어를 구체화하고 특허 출원까지 진행할 팀원을 모집합니다.",
    tags: ["발명/공학", "기획/아이디어", "디자인"],
    neededCount: 3,
    deadline: "2026-10-20",
  },
  {
    id: "5",
    title: "전국 과학전람회 발표 자료 제작",
    description: "실험은 마무리 단계이며, 발표 자료와 보고서 작성을 함께할 팀원이 필요합니다.",
    tags: ["연구(R&E)", "발표/문서작성"],
    neededCount: 1,
    deadline: "2026-09-30",
  },
  {
    id: "6",
    title: "AI 데이터 분석 프로젝트",
    description: "학교 급식 만족도 데이터를 분석해 시각화하는 프로젝트를 함께할 팀원을 찾습니다.",
    tags: ["인공지능/데이터", "수학", "코딩/구현"],
    neededCount: 2,
    deadline: "2026-11-10",
  },
];