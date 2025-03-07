import { JSX } from "react";

import { DocumentText } from "@/utils/interface";

export function parseHighlightText(documentText: DocumentText) {
  const text = documentText.Text;
  const parsedText: (string | JSX.Element)[] = [];

  let cur = 0;
  documentText.Highlights.forEach((highlight) => {
    parsedText.push(text.substring(cur, highlight.BeginOffset));
    parsedText.push(
      <b>{text.substring(highlight.BeginOffset, highlight.EndOffset)}</b>
    );
    cur = highlight.EndOffset;
  });

  if (cur < text.length) parsedText.push(text.substring(cur));

  return <p>{...parsedText}</p>;
}

