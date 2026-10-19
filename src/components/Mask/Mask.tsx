import { Fragment, type ElementType, type ReactNode } from 'react';

interface LinesProps {
  as?: ElementType;
  lines: ReactNode[];
  label: string;
  className?: string;
  lineClassName?: string;
}

/** Text split into explicit lines, each wrapped in an overflow mask. Animate `[data-line]`. */
export function Lines({ as: Tag = 'span', lines, label, className, lineClassName }: LinesProps) {
  return (
    <Tag className={className} aria-label={label}>
      {lines.map((line, i) => (
        <span key={i} className="mask" aria-hidden="true">
          <span data-line className={lineClassName}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

interface CharsProps { as?: ElementType; text: string; className?: string }

/** Text split into characters, each in its own mask; lines only break between words. Animate `[data-char]`. */
export function Chars({ as: Tag = 'span', text, className }: CharsProps) {
  return (
    <Tag className={className} aria-label={text}>
      {text.split(' ').map((word, w) => (
        <Fragment key={w}>
          {w > 0 && ' '}
          <span className="word" aria-hidden="true">
            {[...word].map((ch, i) => (
              <span key={i} className="mask-inline"><span data-char>{ch}</span></span>
            ))}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
