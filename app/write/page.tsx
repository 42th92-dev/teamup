"use client";

import { useState } from "react";
import TagPicker from "../../components/TagPicker";
import { domainTags, roleTags } from "../../data/tags";

export default function WritePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [neededCount, setNeededCount] = useState(1);
  const [deadline, setDeadline] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<null | {
    title: string;
    description: string;
    neededCount: number;
    deadline: string;
    tags: string[];
  }>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted({ title, description, neededCount, deadline, tags });
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">모집글 작성</h1>

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
          <label className="text-sm font-medium">분야 태그</label>
          <TagPicker options={domainTags} selected={tags} onChange={setTags} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">역량/역할 태그</label>
          <TagPicker options={roleTags} selected={tags} onChange={setTags} />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          모집글 등록
        </button>
      </form>

      {submitted && (
        <div className="border border-green-200 bg-green-50 rounded-lg p-4 text-sm">
          <p className="font-medium mb-2">입력값 확인 (아직 저장 기능은 없어요)</p>
          <pre className="whitespace-pre-wrap text-xs text-gray-700">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}