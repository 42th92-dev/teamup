"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PostCard from "../components/PostCard";
import TagFilter from "../components/TagFilter";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";

interface DbPost {
  id: string;
  title: string;
  description: string;
  tags: string[];
  needed_count: number;
  deadline: string;
}

export default function Home() {
  const { user, signOut } = useAuth();
  const [allPosts, setAllPosts] = useState<DbPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("posts").select("*");
      if (error) {
        setErrorMsg(error.message);
      } else {
        setAllPosts((data as DbPost[]) ?? []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allPosts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [allPosts]);

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
  }, [allPosts, selectedTags]);

  const linkClass =
    "text-sm border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50";

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">모집 중인 팀</h1>
          <p className="text-sm text-gray-500 mt-1">
            관심 있는 태그를 선택하면 조건에 맞는 모집글만 볼 수 있어요.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <Link href="/match" className={linkClass}>팀 추천받기</Link>
          <Link href="/write" className={linkClass}>모집글 작성</Link>
          <Link href="/mypage" className={linkClass}>마이페이지</Link>
          {user ? (
            <button type="button" onClick={signOut} className={linkClass}>
              로그아웃
            </button>
          ) : (
            <Link href="/login" className={linkClass}>로그인</Link>
          )}
        </div>
      </div>

      <TagFilter allTags={allTags} selectedTags={selectedTags} onToggle={toggleTag} />

      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-10">불러오는 중...</p>
        ) : errorMsg ? (
          <p className="text-sm text-red-500 text-center py-10">
            불러오기에 실패했어요: {errorMsg}
          </p>
        ) : filteredPosts.length === 0 ? (
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