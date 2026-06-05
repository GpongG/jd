import { useEffect, useMemo, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import Quill from "quill";
import "./RichTextEditor.css";

// 确保 Quill 的 Syntax 模块能拿到 hljs
(window as any).hljs = hljs;

const CODE_LANGUAGES = [
  { label: "JS", value: "js" },
  { label: "TS", value: "ts" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "JSON", value: "json" },
  { label: "Python", value: "py" },
  { label: "Java", value: "java" },
  { label: "Shell", value: "sh" },
];

// 接管 Syntax 模块的默认语言列表，避免与用户配置按索引合并导致多余选项
const SyntaxModule = Quill.import("modules/syntax");
SyntaxModule.DEFAULTS.languages = CODE_LANGUAGES.map((l) => ({ key: l.value, label: l.label }));

interface RichTextEditorProps {
  defaultValue?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichTextEditor({
  defaultValue,
  onChange,
  placeholder = "输入内容…",
  minHeight = 200,
}: RichTextEditorProps) {
  // 用 ref 固定初始值，避免 onChange → state → 再次设置内容的循环
  const defaultValueRef = useRef(defaultValue ?? "");

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link"],
        ["clean"],
      ],
      syntax: { hljs, languages: CODE_LANGUAGES.map((l) => ({ key: l.value, label: l.label })) },
    }),
    []
  );

  // 编辑器挂载后清除因 Quill 解析产生的多余段落
  useEffect(() => {
    const timer = setInterval(() => {
      const editor = document.querySelector(".ql-editor");
      if (!editor) return;
      const stray = editor.querySelector("p");
      if (stray && /JSTSHTMLCSSJSONPythonJavaShell/.test(stray.textContent ?? "")) {
        stray.remove();
        clearInterval(timer);
      } else if (editor.querySelector(".ql-code-block")) {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // 包装 onChange，阻止 <select> 和乱码进入 state
  const handleChange = useRef((html: string) => {
    onChange(
      html
        .replace(/<select\b[^>]*>[\s\S]*?<\/select>/gi, "")
        .replace(/<p>\s*JSTSHTMLCSSJSONPythonJavaShell\s*<\/p>/gi, "")
        .replace(/JSTSHTMLCSSJSONPythonJavaShell/g, "")
    );
  }).current;

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "blockquote",
    "code-block",
    "link",
  ];

  return (
    <div className="rich-text-editor" style={{ "--editor-min-h": `${minHeight}px` } as React.CSSProperties}>
      <ReactQuill
        theme="snow"
        defaultValue={defaultValueRef.current}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        useSemanticHTML={false}
      />
    </div>
  );
}
