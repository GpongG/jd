import { sanitizeAnswerHtml } from "../utils/htmlAnswer";
import "./HtmlAnswer.css";

interface HtmlAnswerProps {
  html: string;
}

export function HtmlAnswer({ html }: HtmlAnswerProps) {
  const safe = sanitizeAnswerHtml(html);

  return (
    <div
      className="html-answer answer-content"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
