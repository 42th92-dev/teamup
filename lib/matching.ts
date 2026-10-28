import { differenceInCalendarDays } from "date-fns";
import { Post } from "../data/posts";

export interface UserProfile {
  name: string;
  tags: string[];
  isBusy: boolean; // 현재 다른 대회/프로젝트에 참여 중인지
}

export interface MatchResult {
  post: Post;
  score: number;
  matchedTags: string[];
  detail: {
    base: number;
    busyPenalty: number;
    deadlineBonus: number;
  };
}

const BUSY_PENALTY = 15;

export function calculateMatch(
  user: UserProfile,
  post: Post,
  today: Date = new Date()
): MatchResult {
  const daysLeft = differenceInCalendarDays(new Date(post.deadline), today);

  // 마감이 지난 글은 0점
  if (daysLeft < 0) {
    return {
      post,
      score: 0,
      matchedTags: [],
      detail: { base: 0, busyPenalty: 0, deadlineBonus: 0 },
    };
  }

  const matchedTags = post.tags.filter((tag) => user.tags.includes(tag));
  const base =
    post.tags.length === 0 ? 0 : (matchedTags.length / post.tags.length) * 100;
  // 일치하는 태그가 하나도 없으면 추천하지 않음
  if (matchedTags.length === 0) {
    return {
      post,
      score: 0,
      matchedTags: [],
      detail: { base: 0, busyPenalty: 0, deadlineBonus: 0 },
    };
  }

  const busyPenalty = user.isBusy ? BUSY_PENALTY : 0;
  const deadlineBonus = daysLeft <= 3 ? 10 : daysLeft <= 7 ? 5 : 0;

  const raw = base - busyPenalty + deadlineBonus;
  const score = Math.max(0, Math.min(100, Math.round(raw * 10) / 10));

  return { post, score, matchedTags, detail: { base, busyPenalty, deadlineBonus } };
}

export function recommendPosts(
  user: UserProfile,
  posts: Post[],
  today: Date = new Date()
): MatchResult[] {
  return posts
    .map((post) => calculateMatch(user, post, today))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}