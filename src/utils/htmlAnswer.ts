import DOMPurify, { type Config } from "dompurify";

const SANITIZE_CONFIG: Config = {
  ADD_ATTR: ["target", "rel", "class"],
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
  ALLOWED_ATTR: ["href", "target", "rel", "class"],
};

/** 展示用：保留段落与换行标签 */
export function sanitizeAnswerHtml(html: string): string {
  return String(DOMPurify.sanitize(html, SANITIZE_CONFIG));
}

/** 保存前规范化，避免 Quill 输出被清洗后丢结构 */
export function normalizeAnswerHtml(html: string): string {
  const trimmed = html?.trim() ?? "";
  if (!trimmed || trimmed === "<p><br></p>" || trimmed === "<p></p>") {
    return "<p><br></p>";
  }

  // 纯文本（无块级标签）时按行拆成段落
  if (!/<(?:p|div|h[1-6]|ul|ol|li|blockquote|pre)\b/i.test(trimmed)) {
    const lines = trimmed.split(/\n/);
    const body = lines
      .map((line) => {
        const text = line.trim();
        return text ? `<p>${escapeText(text)}</p>` : "<p><br></p>";
      })
      .join("");
    return sanitizeAnswerHtml(body || "<p><br></p>");
  }

  return sanitizeAnswerHtml(trimmed);
}

function escapeText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
