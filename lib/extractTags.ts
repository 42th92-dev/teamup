import { domainTags, roleTags } from "../data/tags";

// 태그별로 글에서 찾을 키워드 목록 (소문자 비교)
const keywordMap: Record<string, string[]> = {
  "알고리즘/PS": ["알고리즘", "ps", "문제풀이", "백준", "코딩테스트", "dp", "그리디", "nypc", "ioi", "ucpc"],
  "웹/앱 개발": ["웹", "앱", "프론트", "백엔드", "서비스", "사이트", "react", "next", "한사챌", "개발"],
  "인공지능/데이터": ["인공지능", "ai", "머신러닝", "딥러닝", "데이터", "분석", "시각화", "모델"],
  "수학": ["수학", "대수", "기하", "정수론", "조합", "확률", "해석"],
  "물리/화학/생명과학/지구과학": ["물리", "화학", "생명", "지구과학", "실험", "과학탐구", "과학전람회"],
  "발명/공학": ["발명", "특허", "공학", "설계", "제작", "하드웨어", "회로", "로봇"],
  "연구(R&E)": ["r&e", "연구", "논문", "탐구", "학회", "프로젝트 연구"],
  "코딩/구현": ["코딩", "구현", "프로그래밍", "개발", "코드", "c++", "python", "파이썬", "java"],
  "자료조사/논문분석": ["자료조사", "논문", "문헌", "분석", "리서치", "조사"],
  "발표/문서작성": ["발표", "문서", "보고서", "ppt", "슬라이드", "작성", "포스터"],
  "기획/아이디어": ["기획", "아이디어", "브레인스토밍", "설계", "구상"],
  "디자인": ["디자인", "ui", "ux", "그림", "포스터", "피그마", "figma"],
};

const allowed = new Set<string>([...domainTags, ...roleTags]);

export function extractTags(text: string): string[] {
  const lower = text.toLowerCase();
  const result: string[] = [];

  for (const [tag, keywords] of Object.entries(keywordMap)) {
    if (!allowed.has(tag)) continue;
    if (keywords.some((kw) => lower.includes(kw))) {
      result.push(tag);
    }
  }

  return result;
}