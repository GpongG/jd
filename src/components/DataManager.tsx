import { useRef, useState } from "react";
import "./Modal.css";
import "./DataManager.css";

const STORAGE_KEYS = [
  "interview-common-bank",
] as const;

interface ExportData {
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
}

export function DataManager() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const payload: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {},
    };

    for (const key of STORAGE_KEYS) {
      try {
        const raw = localStorage.getItem(key);
        if (raw !== null) {
          payload.data[key] = JSON.parse(raw);
        }
      } catch {
        // skip corrupted entries
      }
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // a.download = `interview-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.download = `interview-data.json`;
    a.click();
    URL.revokeObjectURL(url);

    setMessage({ type: "success", text: "导出成功 ✅" });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleImport = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as ExportData;

        // 基本格式校验
        if (parsed.version !== 1 || !parsed.data) {
          setMessage({ type: "error", text: "文件格式不正确，请检查导入文件" });
          return;
        }

        let importedCount = 0;
        for (const key of STORAGE_KEYS) {
          if (key in parsed.data) {
            localStorage.setItem(key, JSON.stringify(parsed.data[key]));
            importedCount++;
          }
        }

        setMessage({
          type: "success",
          text: `导入成功 ✅ 共导入 ${importedCount} 项数据，页面即将刷新`,
        });

        // 延迟刷新，让用户看到成功提示
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch {
        setMessage({ type: "error", text: "文件解析失败，请选择有效的 JSON 文件" });
      }
    };
    reader.readAsText(file);

    // 重置 input 以便再次选择同一文件
    e.target.value = "";
  };

  return (
    <>
      <button
        type="button"
        className="data-mgr-btn"
        onClick={() => setOpen(true)}
        title="数据导入导出"
      >
        💾
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="modal data-mgr-modal"
            role="dialog"
            aria-labelledby="data-mgr-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="data-mgr-title">数据管理</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setOpen(false)}
                aria-label="关闭"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="data-mgr-desc">
                导出所有面试题库和自定义数据为 JSON 文件，或从之前导出的文件恢复数据。
              </p>

              {message && (
                <div className={`data-mgr-msg data-mgr-msg--${message.type}`}>
                  {message.text}
                </div>
              )}

              <div className="data-mgr-actions">
                <button
                  type="button"
                  className="data-mgr-action-btn data-mgr-action-btn--export"
                  onClick={handleExport}
                >
                  📤 导出数据
                </button>
                <button
                  type="button"
                  className="data-mgr-action-btn data-mgr-action-btn--import"
                  onClick={handleImport}
                >
                  📥 导入数据
                </button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
