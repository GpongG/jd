/** 将现有 Markdown 风格答案转为 HTML，供富文本编辑器初始加载 */
export function markdownToHtml(text: string): string {
  const blocks = text.split(/\n\n+/);
  const htmlParts: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("```")) {
      const lines = trimmed.split("\n");
      const code = lines
        .slice(1, lines[lines.length - 1] === "```" ? -1 : undefined)
        .join("\n");
      htmlParts.push(
        `<pre><code>${escapeHtml(code)}</code></pre>`
      );
      continue;
    }

    if (/^[-*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter(Boolean);
      const isOrdered = /^\d+\.\s/.test(items[0]);
      const tag = isOrdered ? "ol" : "ul";
      const lis = items
        .map((item) => {
          const content = item.replace(/^[-*]\s|^\d+\.\s/, "");
          return `<li>${inlineToHtml(content)}</li>`;
        })
        .join("");
      htmlParts.push(`<${tag}>${lis}</${tag}>`);
      continue;
    }

    if (
      trimmed.startsWith("**") &&
      trimmed.endsWith("**") &&
      !trimmed.includes("\n")
    ) {
      htmlParts.push(`<p><strong>${trimmed.slice(2, -2)}</strong></p>`);
      continue;
    }

    const lines = trimmed.split("\n");
    if (lines.length === 1) {
      htmlParts.push(`<p>${inlineToHtml(lines[0])}</p>`);
    } else {
      const body = lines
        .map((line) => inlineToHtml(line) || "<br>")
        .join("<br>");
      htmlParts.push(`<p>${body}</p>`);
    }
  }

  return htmlParts.join("") || "<p></p>";
}

function inlineToHtml(text: string): string {
  let result = escapeHtml(text);
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return result;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isHtmlContent(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text);
}
