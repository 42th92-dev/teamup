"use client";

import Link from "next/link";
import { useState } from "react";
import { posts } from "../../data/posts";
import { recommendPosts, UserProfile } from "../../lib/matching";
import MatchCard from "../../components/MatchCard";
import TagPicker from "../../components/TagPicker";
import { domainTags, roleTags } from "../../data/tags";

export default function MatchPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [requested, setRequested] = useState(false);

  const user: UserProfile = { name: "나", tags, isBusy };
  const results = recommendPosts(user, posts);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">나와 맞는 팀 추천</h1>
        <Link
          href="/"
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
        >
          메인으로
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-500">
          내 관심 분야와 역량 태그를 고르면 점수가 높은 순서로 모집글을 추천해요.
        </p>
        <TagPicker options={domainTags} selected={tags} onChange={setTags} />
        <TagPicker options={roleTags} selected={tags} onChange={setTags} />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isBusy}
            onChange={(e) => setIsBusy(e.target.checked)}
          />
          현재 다른 대회/프로젝트에 참여 중이에요
        </label>
        <button
          type="button"
          onClick={() => setRequested(true)}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          나와 맞는 팀 추천받기
        </button>
      </div>

      {requested && (
        <div className="flex flex-col gap-4">
          {results.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">
              추천할 모집글이 없어요. 태그를 더 선택해보세요.
            </p>
          ) : (
            results.map((result, index) => (
              <MatchCard key={result.post.id} result={result} rank={index + 1} />
            ))
          )}
        </div>
      )}
    </main>
  );
}