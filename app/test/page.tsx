"use client";

import { useState } from "react";
import { posts } from "../../data/posts";
import { recommendPosts, UserProfile } from "../../lib/matching";
import TagPicker from "../../components/TagPicker";
import { domainTags, roleTags } from "../../data/tags";

export default function TestPage() {
  const [tags, setTags] = useState<string[]>(["알고리즘/PS", "코딩/구현"]);
  const [isBusy, setIsBusy] = useState(false);

  const user: UserProfile = { name: "테스트", tags, isBusy };
  const results = recommendPosts(user, posts);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">매칭 점수 검증</h1>

      <TagPicker options={domainTags} selected={tags} onChange={setTags} />
      <TagPicker options={roleTags} selected={tags} onChange={setTags} />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isBusy}
          onChange={(e) => setIsBusy(e.target.checked)}
        />
        다른 활동에 참여 중
      </label>

      <div className="flex flex-col gap-3">
        {results.length === 0 && (
          <p className="text-sm text-gray-400">추천 결과가 없어요.</p>
        )}
        {results.map((r) => (
          <div key={r.post.id} className="border border-gray-300 rounded-lg p-4 text-sm">
            <p className="font-semibold">
              {r.post.title} / {r.score}점
            </p>
            <p className="text-gray-500">
              기본 {r.detail.base.toFixed(1)} - 감점 {r.detail.busyPenalty} + 가점{" "}
              {r.detail.deadlineBonus}
            </p>
            <p className="text-gray-500">일치 태그: {r.matchedTags.join(", ") || "없음"}</p>
          </div>
        ))}
      </div>
    </main>
  );
}