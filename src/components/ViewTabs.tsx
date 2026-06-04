import type { AppView } from "../types";
import "./ViewTabs.css";

interface ViewTabsProps {
  active: AppView;
  onChange: (view: AppView) => void;
}

export function ViewTabs({ active, onChange }: ViewTabsProps) {
  return (
    <div className="view-tabs" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={active === "jd"}
        className={`view-tab ${active === "jd" ? "active" : ""}`}
        onClick={() => onChange("jd")}
      >
        JD 面试题库
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={active === "common"}
        className={`view-tab ${active === "common" ? "active" : ""}`}
        onClick={() => onChange("common")}
      >
        常见面试题
      </button>
    </div>
  );
}
