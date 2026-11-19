"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";

interface Application {
  id: string;
  status: string;
  user_id: string;
}

interface MyPost {
  id: string;
  title: string;
  needed_count: number;
  is_closed: boolean;
  applications: Application[];
}

interface Profile {
  id: string;
  name: string;
  student_id: string;
  intro: string;
  tags: string[];
}

export default function MyPostsPage() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [msg, setMsg] = useState("");
  // 이 숫자가 바뀌면 목록을 다시 불러온다
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      // 1. 내가 쓴 모집글과 각 글의 지원 기록
      const { data: postRows, error } = await supabase
        .from("posts")
        .select("id, title, needed_count, is_closed, applications(id, status, user_id)")
        .eq("author_id", user.id)
        .order("deadline", { ascending: true });

      if (error) {
        setMsg("불러오기에 실패했어요: " + error.message);
        return;
      }

      const myPosts = (postRows as MyPost[]) ?? [];
      setPosts(myPosts);

      // 2. 지원자들의 프로필
      const userIds = myPosts.flatMap((p) => p.applications.map((a) => a.user_id));
      if (userIds.length === 0) return;

      const { data: userRows } = await supabase
        .from("users")
        .select("id, name, student_id, intro, tags")
        .in("id", userIds);

      setProfiles((userRows as Profile[]) ?? []);
    };

    load();
  }, [user, reloadKey]);

  const changeStatus = async (post: MyPost, appId: string, newStatus: string) => {
    setMsg("");

    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", appId);

    if (error) {
      setMsg("상태 변경에 실패했어요: " + error.message);
      return;
    }

    // 수락했다면, 수락 인원이 필요 인원에 도달했는지 확인하고 마감한다
    if (newStatus === "accepted") {
      const before = post.applications.filter((a) => a.status === "accepted").length;
      const acceptedCount = before + 1;

      if (acceptedCount >= post.needed_count) {
        const { error: closeError } = await supabase
          .from("posts")
          .update({ is_closed: true })
          .eq("id", post.id);

        if (closeError) {
          setMsg("모집 마감 처리에 실패했어요: " + closeError.message);
        }
      }
    }

    setReloadKey((k) => k + 1);
  };

  const deletePost = async (post: MyPost) => {
    setMsg("");

    // 지원자가 있으면 삭제를 막는다 (지원자의 지원 기록을 보호)
    if (post.applications.length > 0) {
      setMsg("지원자가 있는 글은 삭제할 수 없어요.");
      return;
    }

    if (!window.confirm(`"${post.title}" 글을 삭제할까요?`)) return;

    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id)
      .select("id");

    if (error) {
      setMsg("삭제에 실패했어요: " + error.message);
      return;
    }
    // RLS 때문에 막히면 에러 없이 0건이 삭제된다
    if (!data || data.length === 0) {
      setMsg("삭제 권한이 없어요.");
      return;
    }

    setReloadKey((k) => k + 1);
  };

  if (loading) {
    return <main className="max-w-2xl mx-auto px-4 py-10 text-sm text-gray-400">불러오는 중...</main>;
  }

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">내 모집글 관리</h1>
        <p className="text-sm text-gray-500">로그인하면 내 모집글의 지원자를 볼 수 있어요.</p>
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
        <h1 className="text-2xl font-bold">내 모집글 관리</h1>
        <Link
          href="/mypage"
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
        >
          마이페이지로
        </Link>
      </div>

      {msg && <p className="text-sm text-red-500">{msg}</p>}

      {posts.length === 0 ? (
        <p className="text-sm text-gray-400">아직 작성한 모집글이 없어요.</p>
      ) : (
        posts.map((post) => {
          const acceptedCount = post.applications.filter((a) => a.status === "accepted").length;

          return (
            <section key={post.id} className="border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start gap-4">
                <h2 className="text-lg font-semibold">{post.title}</h2>
                {post.is_closed && (
                  <span className="text-sm font-medium text-red-500 whitespace-nowrap">모집 마감</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                수락 {acceptedCount}명 / 필요 {post.needed_count}명
              </p>

              <div className="flex gap-2">
                <Link
                  href={`/my-posts/${post.id}/edit`}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm hover:bg-gray-50"
                >
                  수정
                </Link>
                <button
                  type="button"
                  onClick={() => deletePost(post)}
                  className="border border-red-300 text-red-600 rounded-lg px-3 py-1 text-sm hover:bg-red-50"
                >
                  삭제
                </button>
              </div>

              {post.applications.length === 0 ? (
                <p className="text-sm text-gray-400">아직 지원자가 없어요.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {post.applications.map((app) => {
                    const profile = profiles.find((p) => p.id === app.user_id);

                    return (
                      <li key={app.id} className="border border-gray-100 rounded-lg p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">
                            {profile?.name ?? "이름 없음"}{" "}
                            <span className="text-gray-500 font-normal">{profile?.student_id}</span>
                          </span>
                          <StatusBadge status={app.status} />
                        </div>

                        <p className="text-sm text-gray-600">
                          {profile?.intro || "자기소개가 없어요."}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {(profile?.tags ?? []).map((tag) => (
                            <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* 대기 중인 지원자만, 마감 전에만 버튼을 보여준다 */}
                        {app.status === "pending" && !post.is_closed && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => changeStatus(post, app.id, "accepted")}
                              className="flex-1 bg-blue-600 text-white rounded-lg px-3 py-2 text-sm hover:bg-blue-700"
                            >
                              수락
                            </button>
                            <button
                              type="button"
                              onClick={() => changeStatus(post, app.id, "rejected")}
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              거절
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })
      )}
    </main>
  );
}
