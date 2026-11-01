"use client";

import { useState } from "react";
import { MatchResult } from "../lib/matching";
import { supabase } from "../lib/supabase";

interface Props {
  result: MatchResult;
  rank: number;
}

export default function MatchCard({ result, rank }: Props) {
  const { post, score, matchedTags, detail } = result;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  const scoreColor =
    score >= 70 ? "text-green-500" : score >= 40 ? "text-orange-500" : "text-gray-500";

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const userId = crypto.randomUUID();
    const { error: userError } = await supabase.from("users").insert({
      id: userId,
      name,
      student_id: studentId,
      tags: matchedTags,
    });

    if (userError) {
      setSaving(false);
      if (userError.code === "23505") {
        setMessage("이미 등록된 학번이에요. 지금 버전에서는 한 번만 지원할 수 있어요.");
      } else {
        setMessage("저장에 실패했어요: " + userError.message);
      }
      return;
    }

    const { error: appError } = await supabase.from("applications").insert({
      post_id: post.id,
      user_id: userId,
      status: "pending",
    });

    setSaving(false);

    if (appError) {
      setMessage("지원 저장에 실패했어요: " + appError.message);
      return;
    }

    setDone(true);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-3">
          <span className="text-lg font-bold text-gray-400">{rank}</span>
          <h3 className="text-lg font-semibold">{post.title}</h3>
        </div>
        <span className={`text-xl font-bold whitespace-nowrap ${scoreColor}`}>
          {score}점
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>

      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => {
          const isMatched = matchedTags.includes(tag);
          return (
            <span
              key={tag}
              className={`text-xs px-2 py-1 rounded-full ${
                isMatched ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {tag}
            </span>
          );
        })}
      </div>

      <p className="text-xs text-gray-500">
        기본 {detail.base.toFixed(1)}점
        {detail.busyPenalty > 0 && ` - 다른 활동 참여 ${detail.busyPenalty}점`}
        {detail.deadlineBonus > 0 && ` + 마감 임박 ${detail.deadlineBonus}점`}
      </p>

      {done ? (
        <p className="text-sm text-green-600 font-medium">지원이 저장됐어요.</p>
      ) : open ? (
        <form onSubmit={handleApply} className="flex flex-col gap-2">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            required
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="학번 (예: 2415)"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          {message && <p className="text-xs text-red-500">{message}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "저장 중..." : "지원 제출"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          지원하기
        </button>
      )}
    </div>
  );
}