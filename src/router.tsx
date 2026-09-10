import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { toRoute, withBase } from './base';

export type Location = { path: string; search: string; hash: string };

function read(): Location {
  return {
    path: toRoute(window.location.pathname),
    search: window.location.search,
    hash: window.location.hash,
  };
}

const LocationContext = createContext<Location>({
  path: '/',
  search: '',
  hash: '',
});

export function useLocation() {
  return useContext(LocationContext);
}

export function useSearchParams() {
  return new URLSearchParams(useLocation().search);
}

/** Client-side navigation to an app-absolute path such as "/knowledge?q=x". */
export function navigate(href: string, replace = false) {
  const url = withBase(href);
  if (replace) window.history.replaceState(null, '', url);
  else window.history.pushState(null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function applyHash(hash: string) {
  if (!hash || hash === '#') {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function Router({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location>(read);

  useEffect(() => {
    function onPopState() {
      const next = read();
      setLocation((prev) => {
        if (
          prev.path === next.path &&
          prev.search === next.search &&
          prev.hash === next.hash
        ) {
          return prev;
        }
        return next;
      });
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    applyHash(location.hash);
  }, [location.path, location.search, location.hash]);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
}
