"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { posts as allPosts } from "../data/posts";
import PostCard from "../components/PostCard";
import TagFilter from "../components/TagFilter";

export default function Home() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allPosts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredPosts = useMemo(() => {
    const filtered =
      selectedTags.length === 0
        ? allPosts
        : allPosts.filter((post) =>
            selectedTags.every((tag) => post.tags.includes(tag))
          );

    return [...filtered].sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
  }, [selectedTags]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">모집 중인 팀</h1>
          <p className="text-sm text-gray-500 mt-1">
            관심 있는 태그를 선택하면 조건에 맞는 모집글만 볼 수 있어요.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/write"
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
          >
            모집글 작성
          </Link>
          <Link
            href="/mypage"
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
          >
            마이페이지
          </Link>
        </div>
      </div>

      <TagFilter allTags={allTags} selectedTags={selectedTags} onToggle={toggleTag} />

      <div className="flex flex-col gap-4">
        {filteredPosts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">
            조건에 맞는 모집글이 없어요.
          </p>
        ) : (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </main>
  );
}