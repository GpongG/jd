import "./AnswerContent.css";

interface AnswerContentProps {
  text: string;
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((seg, j) => {
      if (seg.startsWith("**") && seg.endsWith("**")) {
        return <strong key={`${i}-${j}`}>{seg.slice(2, -2)}</strong>;
      }
      return <span key={`${i}-${j}`}>{seg}</span>;
    });
  });
}

export function AnswerContent({ text }: AnswerContentProps) {
  const blocks = text.split(/\n\n+/);

  return (
    <div className="answer-content">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("```")) {
          const lines = trimmed.split("\n");
          const code = lines.slice(1, lines[lines.length - 1] === "```" ? -1 : undefined).join("\n");
          return (
            <pre key={idx}>
              <code>{code}</code>
            </pre>
          );
        }

        if (trimmed.startsWith("|")) {
          const rows = trimmed.split("\n").filter((r) => r.trim());
          return (
            <div key={idx} className="table-wrap">
              <table>
                <tbody>
                  {rows.map((row, ri) => {
                    if (row.replace(/[|\-\s]/g, "") === "") return null;
                    const cells = row
                      .split("|")
                      .filter((c) => c.trim())
                      .map((c) => c.trim());
                    const Tag = ri === 0 ? "th" : "td";
                    return (
                      <tr key={ri}>
                        {cells.map((cell, ci) => (
                          <Tag key={ci}>{renderInline(cell)}</Tag>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        if (/^[-*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split("\n").filter(Boolean);
          const isOrdered = /^\d+\.\s/.test(items[0]);
          const ListTag = isOrdered ? "ol" : "ul";
          return (
            <ListTag key={idx} className="answer-list">
              {items.map((item, ii) => {
                const content = item.replace(/^[-*]\s|^\d+\.\s/, "");
                return <li key={ii}>{renderInline(content)}</li>;
              })}
            </ListTag>
          );
        }

        if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.includes("\n")) {
          return (
            <p key={idx} className="answer-heading">
              {trimmed.slice(2, -2)}
            </p>
          );
        }

        return (
          <p key={idx} className="answer-para">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
