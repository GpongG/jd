import { ViewTabs } from "./ViewTabs";
import { DataManager } from "./DataManager";
import "./Header.css";

interface HeaderProps {
  commonCount?: number;
}

export function Header({ commonCount = 0 }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-badge">面试备战</div>
        <h1>常见面试题</h1>
        <p className="header-sub">
          自定义分类与题库，支持富文本编辑，数据保存在本地
        </p>
        <div className="header-stats">
          <span>
            <strong>{commonCount}</strong> 道自定义题
          </span>
          <span>支持新增分类与富文本答案</span>
          <DataManager />
        </div>
        <ViewTabs />
      </div>
    </header>
  );
}
