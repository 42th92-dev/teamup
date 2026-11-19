"use client";

import Link from "next/link";
import { useState } from "react";
import PostForm, { PostFormValues } from "../../components/PostForm";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";

const emptyValues: PostFormValues = {
  title: "",
  description: "",
  neededCount: 1,
  deadline: "",
  tags: [],
};

export default function WritePost() {
  const { user, loading } = useAuth();
  const [saved, setSaved] = useState(false);
  // 저장 후 이 숫자를 올려서 폼을 빈 상태로 다시 만든다
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (values: PostFormValues) => {
    if (!user) return "로그인이 필요해요.";

    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      title: values.title,
      description: values.description,
      tags: values.tags,
      needed_count: values.neededCount,
      deadline: values.deadline,
    });

    if (error) return "저장에 실패했어요: " + error.message;

    setSaved(true);
    setFormKey((k) => k + 1);
    return null;
  };

  if (loading) {
    return <main className="max-w-2xl mx-auto px-4 py-10 text-sm text-gray-400">불러오는 중...</main>;
  }

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">모집글 작성</h1>
        <p className="text-sm text-gray-500">모집글을 쓰려면 로그인이 필요해요.</p>
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
        <h1 className="text-2xl font-bold">모집글 작성</h1>
        <Link
          href="/"
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
        >
          메인으로
        </Link>
      </div>

      <PostForm key={formKey} initial={emptyValues} submitLabel="모집글 등록" onSubmit={handleSubmit} />

      {saved && (
        <div className="border border-green-200 bg-green-50 rounded-lg p-4 text-sm text-gray-700">
          모집글이 저장됐어요. 메인 화면에서 확인할 수 있어요.
        </div>
      )}
    </main>
  );
}
