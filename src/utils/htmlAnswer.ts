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

/** 加载已保存内容时清理 UI 元素及残留文字 */
export function stripQuillUi(html: string): string {
  if (!html) return html;

  let result = html
    .replace(/<select\b[^>]*>[\s\S]*?<\/select>/gi, "")
    .replace(/<p>\s*JSTSHTMLCSSJSONPythonJavaShell\s*<\/p>/gi, "")
    .replace(/JSTSHTMLCSSJSONPythonJavaShell/g, "")
    .replace(/\s+data-language="[^"]*"/gi, "");

  // 将代码块转为 <pre>，让 Quill 保留缩进空白
  const temp = document.createElement("div");
  temp.innerHTML = result;
  temp.querySelectorAll(".ql-code-block-container").forEach((container) => {
    const lines = Array.from(
      container.querySelectorAll(".ql-code-block"),
      (el) => el.textContent ?? "",
    );
    const pre = document.createElement("pre");
    pre.textContent = lines.join("\n");
    container.replaceWith(pre);
  });
  result = temp.innerHTML;

  return result;
}
