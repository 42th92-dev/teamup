import { MatchResult } from "../lib/matching";

interface Props {
  result: MatchResult;
  rank: number;
}

export default function MatchCard({ result, rank }: Props) {
  const { post, score, matchedTags, detail } = result;

  const scoreColor =
    score >= 70 ? "text-green-500" : score >= 40 ? "text-orange-500" : "text-gray-500";

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
                isMatched
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-500"
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

      <button
        type="button"
        onClick={() => alert("지원 기능은 서버 단계에서 연결할 예정이에요.")}
        className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        지원하기
      </button>
    </div>
  );
}