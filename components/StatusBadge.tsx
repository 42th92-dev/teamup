interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  if (status === "accepted") {
    return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">수락</span>;
  }
  if (status === "rejected") {
    return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">거절</span>;
  }
  return <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">대기</span>;
}
