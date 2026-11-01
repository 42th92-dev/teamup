"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TagPicker from "../../components/TagPicker";
import { domainTags, roleTags } from "../../data/tags";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";

interface AppRow {
  id: string;
  status: string;
  created_at: string;
  posts: { title: string; deadline: string } | null;
}

export default function MyPage() {
  const { user, loading } = useAuth();
  const [intro, setIntro] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [apps, setApps] = useState<AppRow[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data: profile } = await supabase
        .from("users")
        .select("name, student_id, intro, tags, is_busy")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setName(profile.name ?? "");
        setStudentId(profile.student_id ?? "");
        setIntro(profile.intro ?? "");
        setTags(profile.tags ?? []);
        setIsBusy(profile.is_busy ?? false);
      }

      const { data: rows } = await supabase
        .from("applications")
        .select("id, status, created_at, posts(title, deadline)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setApps((rows as unknown as AppRow[]) ?? []);
    };

    load();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setMsg("");

    const { error } = await supabase.from("users").upsert({
      id: user.id,
      name: name || (user.user_metadata?.name as string) || "이름 없음",
      student_id: studentId || (user.user_metadata?.student_id as string) || "",
      email: user.email,
      intro,
      tags,
      is_busy: isBusy,
    });

    setMsg(error ? "저장에 실패했어요: " + error.message : "프로필이 저장됐어요.");
  };

  if (loading) {
    return <main className="max-w-2xl mx-auto px-4 py-10 text-sm text-gray-400">불러오는 중...</main>;
  }

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">마이페이지</h1>
        <p className="text-sm text-gray-500">로그인하면 내 프로필과 지원 기록을 볼 수 있어요.</p>
        <Link
          href="/login"
          className="text-center bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700"
        >
          로그인하러 가기
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">마이페이지</h1>
        <Link
          href="/"
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
        >
          메인으로
        </Link>
      </div>

      <p className="text-sm text-gray-500">{user.email}</p>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">자기소개</label>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={4}
            placeholder="관심 분야와 역량을 자유롭게 소개해주세요"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">분야 태그</label>
          <TagPicker options={domainTags} selected={tags} onChange={setTags} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">역량/역할 태그</label>
          <TagPicker options={roleTags} selected={tags} onChange={setTags} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isBusy}
            onChange={(e) => setIsBusy(e.target.checked)}
          />
          현재 다른 대회/프로젝트에 참여 중이에요
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          프로필 저장
        </button>
        {msg && <p className="text-sm text-gray-600">{msg}</p>}
      </form>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">내 지원 기록</h2>
        {apps.length === 0 ? (
          <p className="text-sm text-gray-400">아직 지원한 모집글이 없어요.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {apps.map((a) => (
              <li
                key={a.id}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm flex justify-between"
              >
                <span>{a.posts?.title ?? "삭제된 모집글"}</span>
                <span className="text-gray-500">
                  {new Date(a.created_at).toLocaleDateString("ko-KR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}