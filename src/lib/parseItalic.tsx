import { Fragment, type ReactNode } from "react";

const ITALIC_RE = /<i>(.*?)<\/i>/g;

export function parseItalic(input: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  ITALIC_RE.lastIndex = 0;
  while ((match = ITALIC_RE.exec(input)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <Fragment key={key++}>{input.slice(lastIndex, match.index)}</Fragment>
      );
    }
    parts.push(<i key={key++}>{match[1]}</i>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    parts.push(<Fragment key={key++}>{input.slice(lastIndex)}</Fragment>);
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}
