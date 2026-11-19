"use client";

import { useState } from "react";
import TagPicker from "./TagPicker";
import { domainTags, roleTags } from "../data/tags";
import { extractTags } from "../lib/extractTags";

export interface PostFormValues {
  title: string;
  description: string;
  neededCount: number;
  deadline: string;
  tags: string[];
}

interface Props {
  initial: PostFormValues;
  submitLabel: string;
  // 에러 메시지를 돌려주면 폼에 표시하고, 성공이면 null을 돌려준다
  onSubmit: (values: PostFormValues) => Promise<string | null>;
}

// 모집글 작성/수정에서 함께 쓰는 폼
export default function PostForm({ initial, submitLabel, onSubmit }: Props) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [neededCount, setNeededCount] = useState(initial.neededCount);
  const [deadline, setDeadline] = useState(initial.deadline);
  const [tags, setTags] = useState<string[]>(initial.tags);
  const [saving, setSaving] = useState(false);
  const [extractMsg, setExtractMsg] = useState("");
  const [error, setError] = useState("");

  const handleExtract = () => {
    const found = extractTags(title + " " + description);
    if (found.length === 0) {
      setExtractMsg("글에서 찾은 태그가 없어요. 직접 선택해주세요.");
      return;
    }
    setTags(found);
    setExtractMsg(`${found.length}개 태그를 자동으로 선택했어요. 필요하면 직접 고쳐주세요.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const message = await onSubmit({ title, description, neededCount, deadline, tags });

    setSaving(false);
    if (message) setError(message);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">대회 및 프로젝트명</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예) NYPC 알고리즘 대회 팀원 모집"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">상세 설명</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="어떤 대회/프로젝트인지, 함께할 팀원에게 바라는 점을 적어주세요"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium">필요 인원</label>
          <input
            type="number"
            min={1}
            required
            value={neededCount}
            onChange={(e) => setNeededCount(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium">모집 마감일</label>
          <input
            type="date"
            required
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExtract}
            className="border border-blue-500 text-blue-600 rounded-lg px-3 py-1 text-sm hover:bg-blue-50"
          >
            글에서 태그 자동 추출
          </button>
          {extractMsg && <span className="text-xs text-gray-500">{extractMsg}</span>}
        </div>
        <label className="text-sm font-medium">분야 태그</label>
        <TagPicker options={domainTags} selected={tags} onChange={setTags} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">역량/역할 태그</label>
        <TagPicker options={roleTags} selected={tags} onChange={setTags} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {saving ? "저장 중..." : submitLabel}
      </button>
    </form>
  );
}
