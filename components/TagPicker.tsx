interface Props {
  options: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagPicker({ options, selected, onChange }: Props) {
  const toggle = (tag: string) => {
    onChange(
      selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((tag) => {
        const isSelected = selected.includes(tag);
        return (
          <button
            type="button"
            key={tag}
            onClick={() => toggle(tag)}
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