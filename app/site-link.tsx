import type { ComponentProps } from 'react';

/**
 * Keep document navigation native. The deployed vinext client router throws
 * during prefetch and click handling, after cancelling the anchor's navigation.
 * A normal link also preserves keyboard, new-tab and no-JavaScript behavior.
 */
export default function SiteLink({ children, ...props }: ComponentProps<'a'>) {
  return <a {...props}>{children}</a>;
}
