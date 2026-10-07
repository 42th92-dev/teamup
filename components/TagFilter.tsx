import { Tag } from "lucide-react";

interface Props {
  allTags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
}

export default function TagFilter({ allTags, selectedTags, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Tag size={16} className="text-gray-400" />
      {allTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${
              isSelected
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}