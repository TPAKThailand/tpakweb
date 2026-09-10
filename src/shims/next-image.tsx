import type { ComponentProps } from 'react';
import { withBase } from '../base';

type Props = Omit<ComponentProps<'img'>, 'src'> & {
  src: string;
  /** Accepted and ignored: next/image knobs that a plain <img> does not need. */
  unoptimized?: boolean;
  priority?: boolean;
  fill?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  sizes?: string;
};

/**
 * Stand-in for next/image. The project ships pre-sized static files, so the
 * optimizer was never doing anything here — only the path needs re-basing.
 */
export default function Image({
  src,
  unoptimized: _unoptimized,
  priority,
  fill: _fill,
  quality: _quality,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  ...rest
}: Props) {
  return (
    <img
      src={withBase(src)}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : null)}
      {...rest}
    />
  );
}
