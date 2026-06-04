import "./SearchBar.css";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  difficulty: string;
  onDifficultyChange: (v: string) => void;
  resultCount: number;
}

const difficulties = ["all", "基础", "进阶", "高级"] as const;

export function SearchBar({
  value,
  onChange,
  difficulty,
  onDifficultyChange,
  resultCount,
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <div className="search-input-wrap">
        <span className="search-icon" aria-hidden>
          ⌕
        </span>
        <input
          type="search"
          className="search-input"
          placeholder="搜索题目、标签、解析内容…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="search-filters">
        <div className="difficulty-group" role="group" aria-label="难度筛选">
          {difficulties.map((d) => (
            <button
              key={d}
              type="button"
              className={`diff-btn ${difficulty === d ? "active" : ""}`}
              onClick={() => onDifficultyChange(d)}
            >
              {d === "all" ? "全部难度" : d}
            </button>
          ))}
        </div>
        <span className="result-count">共 {resultCount} 题</span>
      </div>
    </div>
  );
}
