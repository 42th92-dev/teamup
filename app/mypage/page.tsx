"use client";

import { useState } from "react";
import TagPicker from "../../components/TagPicker";
import { domainTags, roleTags } from "../../data/tags";

export default function MyPage() {
  const [intro, setIntro] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [activities, setActivities] = useState<string[]>([]);
  const [activityInput, setActivityInput] = useState("");
  const [saved, setSaved] = useState(false);

  const addActivity = () => {
    if (!activityInput.trim()) return;
    setActivities((prev) => [...prev, activityInput.trim()]);
    setActivityInput("");
  };

  const removeActivity = (index: number) => {
    setActivities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">마이페이지</h1>

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
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          현재 다른 대회/프로젝트에 참여 중이에요
        </label>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">참여 활동 목록</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              placeholder="예) 2025 한사챌 본선 진출"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1"
            />
            <button
              type="button"
              onClick={addActivity}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
            >
              추가
            </button>
          </div>
          {activities.length > 0 && (
            <ul className="flex flex-col gap-1">
              {activities.map((activity, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-3 py-2"
                >
                  <span>{activity}</span>
                  <button
                    type="button"
                    onClick={() => removeActivity(index)}
                    className="text-gray-400 hover:text-red-500 text-xs"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          프로필 저장
        </button>
      </form>

      {saved && (
        <div className="border border-green-200 bg-green-50 rounded-lg p-4 text-sm text-gray-700">
          입력값이 화면에 정상적으로 반영되는 것까지만 확인했어요. 실제 저장은 다음 서버/DB 단계에서 연결할 예정이에요.
        </div>
      )}
    </main>
  );
}