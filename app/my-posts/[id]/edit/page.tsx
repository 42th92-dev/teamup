"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostForm, { PostFormValues } from "../../../../components/PostForm";
import { supabase } from "../../../../lib/supabase";
import { useAuth } from "../../../../lib/AuthContext";

interface EditTarget {
  values: PostFormValues;
  acceptedCount: number;
}

export default function EditPostPage() {
  const { user, loading } = useAuth();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [target, setTarget] = useState<EditTarget | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      // 내 글만 가져온다 (author_id 조건)
      const { data, error } = await supabase
        .from("posts")
        .select("title, description, needed_count, deadline, tags, applications(status)")
        .eq("id", id)
        .eq("author_id", user.id)
        .maybeSingle();

      if (error || !data) {
        setMsg("수정할 수 있는 글을 찾지 못했어요.");
        return;
      }

      setTarget({
        values: {
          title: data.title,
          description: data.description,
          neededCount: data.needed_count,
          deadline: String(data.deadline).slice(0, 10),
          tags: data.tags ?? [],
        },
        acceptedCount: data.applications.filter((a: { status: string }) => a.status === "accepted").length,
      });
    };

    load();
  }, [user, id]);

  const handleSubmit = async (values: PostFormValues) => {
    if (!target || !user) return "글 정보를 불러오지 못했어요.";

    // 이미 수락된 인원보다 적게는 줄일 수 없다
    if (values.neededCount < target.acceptedCount) {
      return `이미 ${target.acceptedCount}명이 수락되어 있어서 필요 인원을 그보다 적게 줄일 수 없어요.`;
    }

    // 수락 인원과 같으면 마감, 더 많으면 마감을 푼다
    const isClosed = values.neededCount <= target.acceptedCount;

    const { data, error } = await supabase
      .from("posts")
      .update({
        title: values.title,
        description: values.description,
        tags: values.tags,
        needed_count: values.neededCount,
        deadline: values.deadline,
        is_closed: isClosed,
      })
      .eq("id", id)
      .eq("author_id", user.id)
      .select("id");

    if (error) return "수정에 실패했어요: " + error.message;
    // RLS 때문에 막히면 에러 없이 0건이 수정된다
    if (!data || data.length === 0) return "수정 권한이 없거나 글을 찾을 수 없어요.";

    router.push("/my-posts");
    return null;
  };

  if (loading) {
    return <main className="max-w-2xl mx-auto px-4 py-10 text-sm text-gray-400">불러오는 중...</main>;
  }

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">모집글 수정</h1>
        <p className="text-sm text-gray-500">로그인이 필요해요.</p>
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
        <h1 className="text-2xl font-bold">모집글 수정</h1>
        <Link
          href="/my-posts"
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
        >
          취소
        </Link>
      </div>

      {msg && <p className="text-sm text-red-500">{msg}</p>}

      {target && (
        <>
          <p className="text-sm text-gray-500">현재 수락된 인원: {target.acceptedCount}명</p>
          <PostForm initial={target.values} submitLabel="수정 저장" onSubmit={handleSubmit} />
        </>
      )}
    </main>
  );
}
