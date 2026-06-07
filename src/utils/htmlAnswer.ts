import DOMPurify, { type Config } from "dompurify";

const SANITIZE_CONFIG: Config = {
  ADD_ATTR: ["target", "rel", "class", "data-language"],
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "strike",
    "h1",
    "h2",
    "h3",
    "h4",
    "ol",
    "ul",
    "li",
    "blockquote",
    "pre",
    "code",
    "a",
    "span",
    "div",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "class", "data-language"],
};

/** 展示用：保留段落与换行标签 */
export function sanitizeAnswerHtml(html: string): string {
  const cleaned = html
    .replace(/<select\b[^>]*>[\s\S]*?<\/select>/gi, "")
    .replace(/<p>\s*JSTSHTMLCSSJSONPythonJavaShell\s*<\/p>/gi, "")
    .replace(/JSTSHTMLCSSJSONPythonJavaShell/g, "");
  return String(DOMPurify.sanitize(cleaned, SANITIZE_CONFIG));
}

/** 保存前规范化：剥离 UI 元素，保护缩进 */
export function normalizeAnswerHtml(html: string): string {
  const trimmed = html?.trim() ?? "";
  if (!trimmed || trimmed === "<p><br></p>" || trimmed === "<p></p>") {
    return "<p><br></p>";
  }

  // 剥离 <select> 和残留文字即可，保持 Quill 原生格式
  let cleaned = trimmed
    .replace(/<select\b[^>]*>[\s\S]*?<\/select>/gi, "")
    .replace(/<p>\s*JSTSHTMLCSSJSONPythonJavaShell\s*<\/p>/gi, "")
    .replace(/JSTSHTMLCSSJSONPythonJavaShell/g, "");

  // 纯文本兜底
  if (!/<(?:p|div|h[1-6]|ul|ol|li|blockquote|pre)\b/i.test(cleaned)) {
    const lines = cleaned.split(/\n/);
    const body = lines
      .map((line) => {
        const text = line.trim();
        return text ? `<p>${escapeText(text)}</p>` : "<p><br></p>";
      })
      .join("");
    return sanitizeAnswerHtml(body || "<p><br></p>");
  }

  return sanitizeAnswerHtml(cleaned);
}

function escapeText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** 加载已保存内容时清理 UI 元素，保留 .ql-code-block-container 原生结构供 Quill DOM 解析 */
export function stripQuillUi(html: string): string {
console.log(html);

  if (!html) return html;

  // 只剥离 <select> 和残留文字，保留代码块原生结构和 data-language
  return html
    .replace(/<select\b[^>]*>[\s\S]*?<\/select>/gi, "")
    .replace(/<p>\s*JSTSHTMLCSSJSONPythonJavaShell\s*<\/p>/gi, "")
    .replace(/JSTSHTMLCSSJSONPythonJavaShell/g, "");
}
