"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

// 학교 이메일만 허용하려면 예: "@djshs.djsch.kr" 로 바꾸세요. 빈 문자열이면 제한 없음
const ALLOWED_DOMAIN = "";

// 학번: 숫자 정확히 4자리 (예: 2415)
const STUDENT_ID_PATTERN = /^\d{4}$/;
// 이메일: "글자@글자.글자" 형식 (공백과 @는 각 부분에 들어갈 수 없음)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // 회원가입 입력 검증: 하나라도 틀리면 메시지를 보여주고 가입 요청을 보내지 않음
    if (mode === "signup") {
      if (name.trim() === "") {
        setMessage("이름을 입력해주세요.");
        return;
      }
      if (!STUDENT_ID_PATTERN.test(studentId)) {
        setMessage("학번은 숫자 4자리로 입력해주세요. (예: 2415)");
        return;
      }
      if (!EMAIL_PATTERN.test(email)) {
        setMessage("이메일 형식이 올바르지 않아요. (예: name@example.com)");
        return;
      }
      if (password.length < 6) {
        setMessage("비밀번호는 6자 이상이어야 해요.");
        return;
      }
    }

    if (mode === "signup" && ALLOWED_DOMAIN && !email.endsWith(ALLOWED_DOMAIN)) {
      setMessage(`${ALLOWED_DOMAIN} 이메일만 가입할 수 있어요.`);
      return;
    }

    setBusy(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        setMessage("로그인에 실패했어요: " + error.message);
        return;
      }
      router.push("/");
      return;
    }

    // 회원가입: 이름과 학번은 가입 정보(metadata)로 함께 보냄
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, student_id: studentId } },
    });

    if (error) {
      setBusy(false);
      setMessage("가입에 실패했어요: " + error.message);
      return;
    }

    // 이메일 인증을 끈 경우 바로 세션이 생겨서 프로필까지 저장 가능
    if (data.session && data.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        name,
        student_id: studentId,
        email,
      });
      setBusy(false);
      if (profileError) {
        setMessage("프로필 저장에 실패했어요: " + profileError.message);
        return;
      }
      router.push("/");
      return;
    }

    // 이메일 인증을 켠 경우: 메일 확인 후 첫 로그인 때 프로필 저장
    setBusy(false);
    setMessage("인증 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해주세요.");
    setMode("login");
  };

  return (
    <main className="max-w-md mx-auto px-4 py-10 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{mode === "login" ? "로그인" : "회원가입"}</h1>
        <Link
          href="/"
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
        >
          메인으로
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        {mode === "signup" && (
          <>
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
              inputMode="numeric"
              maxLength={4}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="학번 (예: 2415)"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </>
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 (6자 이상)"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        {message && <p className="text-sm text-red-500">{message}</p>}

        <button
          type="submit"
          disabled={busy}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {busy ? "처리 중..." : mode === "login" ? "로그인" : "가입하기"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setMessage("");
        }}
        className="text-sm text-gray-500 underline"
      >
        {mode === "login" ? "계정이 없어요 (회원가입)" : "이미 계정이 있어요 (로그인)"}
      </button>
    </main>
  );
}