import { highlightSplitText } from '../lib/highlightSplitText';

interface Props {
  text: string;
  highlight: string;
}

export const HighlightedText = ({ text, highlight }: Props) => {
  if (!text) return null;
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const { regex, parts } = highlightSplitText(text, highlight);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};
