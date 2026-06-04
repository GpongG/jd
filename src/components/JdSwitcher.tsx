import type { JdId } from "../types";
import { jobProfiles } from "../data/jds";
import "./JdSwitcher.css";

interface JdSwitcherProps {
  active: JdId;
  counts: Record<JdId, number>;
  onChange: (id: JdId) => void;
}

export function JdSwitcher({ active, counts, onChange }: JdSwitcherProps) {
  return (
    <div className="jd-switcher" role="tablist" aria-label="选择岗位 JD">
      {jobProfiles.map((job) => (
        <button
          key={job.id}
          type="button"
          role="tab"
          aria-selected={active === job.id}
          className={`jd-tab jd-tab--${job.theme} ${active === job.id ? "active" : ""}`}
          onClick={() => onChange(job.id)}
        >
          <span className="jd-tab-title">{job.title}</span>
          <span className="jd-tab-meta">
            <span className="jd-tab-badge">{job.badge}</span>
            <span className="jd-tab-count">{counts[job.id]} 题</span>
          </span>
        </button>
      ))}
    </div>
  );
}
