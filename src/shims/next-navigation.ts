import { navigate, useLocation, useSearchParams } from '../router';

/** Signals "no such route" to the app shell, which renders the 404 page. */
export class NotFoundError extends Error {
  constructor() {
    super('NEXT_NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export function notFound(): never {
  throw new NotFoundError();
}

export function usePathname() {
  return useLocation().path;
}

export function useRouter() {
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, true),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => {},
    prefetch: () => {},
  };
}

export { useSearchParams };
