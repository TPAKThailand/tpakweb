import type { ComponentProps, MouseEvent } from 'react';
import { withBase } from '../src/base';
import { navigate } from '../src/router';

/**
 * Anchor that understands the deployed sub-folder. In-app paths ("/knowledge")
 * are re-based and handled by the client router; hashes, external URLs, new-tab
 * clicks and keyboard modifiers keep native browser behavior.
 */
export default function SiteLink({
  children,
  href,
  onClick,
  ...props
}: ComponentProps<'a'>) {
  const internal =
    typeof href === 'string' &&
    href.startsWith('/') &&
    !href.startsWith('//') &&
    props.target !== '_blank';

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (!internal || event.defaultPrevented) return;
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(href as string);
  }

  return (
    <a
      href={typeof href === 'string' ? withBase(href) : href}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}
