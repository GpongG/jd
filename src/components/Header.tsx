import type { AppView, JdId, JobProfile } from "../types";
import { JdSwitcher } from "./JdSwitcher";
import { ViewTabs } from "./ViewTabs";
import { DataManager } from "./DataManager";
import "./Header.css";

interface HeaderProps {
  job: JobProfile;
  total: number;
  activeJd: JdId;
  jdCounts: Record<JdId, number>;
  onJdChange: (id: JdId) => void;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  commonCount?: number;
}

export function Header({
  job,
  total,
  activeJd,
  jdCounts,
  onJdChange,
  activeView,
  onViewChange,
  commonCount = 0,
}: HeaderProps) {
  return (
    <header className={`header header--${job.theme}`}>
      <div className="header-inner">
        <div className="header-badge">BOSS 直聘 JD · 面试备战</div>
        <h1>{activeView === "common" ? "常见面试题" : job.title}</h1>
        <p className="header-sub">
          {activeView === "common"
            ? "自定义分类与题库，支持富文本编辑，数据保存在本地"
            : job.subtitle}
        </p>
        <div className="header-stats">
          {activeView === "jd" ? (
            <>
              <span>
                <strong>{total}</strong> 道精选题
              </span>
              <span>含详细解析与要点</span>
              <span>{job.moduleLabel}</span>
            </>
          ) : (
            <>
              <span>
                <strong>{commonCount}</strong> 道自定义题
              </span>
              <span>支持新增分类与富文本答案</span>
            </>
          )}
          <DataManager />
        </div>
        <ViewTabs active={activeView} onChange={onViewChange} />
        {activeView === "jd" && (
          <JdSwitcher active={activeJd} counts={jdCounts} onChange={onJdChange} />
        )}
      </div>
    </header>
  );
}
