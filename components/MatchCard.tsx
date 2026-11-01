"use client";

import Link from "next/link";
import { useState } from "react";
import { MatchResult } from "../lib/matching";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";

interface Props {
  result: MatchResult;
  rank: number;
}

export default function MatchCard({ result, rank }: Props) {
  const { post, score, matchedTags, detail } = result;
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  const scoreColor =
    score >= 70 ? "text-green-500" : score >= 40 ? "text-orange-500" : "text-gray-500";

  const handleApply = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("applications").insert({
      post_id: post.id,
      user_id: user.id,
      status: "pending",
    });

    setSaving(false);

    if (error) {
      if (error.code === "23505") {
        setMessage("이미 지원한 모집글이에요.");
        setDone(true);
      } else {
        setMessage("지원 저장에 실패했어요: " + error.message);
      }
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

      {message && (
        <p className={`text-xs ${done ? "text-gray-500" : "text-red-500"}`}>{message}</p>
      )}

      {!user ? (
        <Link
          href="/login"
          className="text-center bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-200"
        >
          로그인하고 지원하기
        </Link>
      ) : done ? (
        <p className="text-sm text-green-600 font-medium">
          {message ? "" : "지원이 저장됐어요."}
        </p>
      ) : (
        <button
          type="button"
          onClick={handleApply}
          disabled={saving}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? "저장 중..." : "지원하기"}
        </button>
      )}
    </div>
  );
}