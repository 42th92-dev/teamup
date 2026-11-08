import { differenceInCalendarDays } from "date-fns";

interface CardPost {
  id: string;
  title: string;
  description: string;
  tags: string[];
  needed_count: number;
  deadline: string;
  is_closed?: boolean;
}

interface Props {
  post: CardPost;
}

export default function PostCard({ post }: Props) {
  const today = new Date();
  const deadlineDate = new Date(post.deadline);
  const dDay = differenceInCalendarDays(deadlineDate, today);

  let dDayLabel = dDay > 0 ? `D-${dDay}` : dDay === 0 ? "D-Day" : "마감";
  let dDayColor =
    dDay <= 3 ? "text-red-500" : dDay <= 7 ? "text-orange-500" : "text-gray-500";

  // 수락 인원이 다 차서 마감된 글
  if (post.is_closed) {
    dDayLabel = "모집 마감";
    dDayColor = "text-gray-400";
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <span className={`text-sm font-medium ${dDayColor}`}>{dDayLabel}</span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="text-sm text-gray-500">필요 인원 {post.needed_count}명</div>
    </div>
  );
}