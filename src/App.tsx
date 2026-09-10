import {
  Component,
  Fragment,
  Suspense,
  lazy,
  useEffect,
  type ReactNode,
} from 'react';
import { useLocation } from './router';
import { NotFoundError } from './shims/next-navigation';

import HomePage from '../app/page';
import KnowledgePage from '../app/knowledge/page';
import AboutPage from '../app/about/page';
import PeoplePage from '../app/people/page';
import NotFound from '../app/not-found';
import articles from '../app/generated/articles.json';

// The survey tables behind the dashboard are megabytes of JSON, and only the
// data explorer needs them, so that route loads on demand.
const ArticlePage = lazy(() => import('../app/article/[id]/page'));
const DataPage = lazy(() => import('../app/data/page'));

const SITE_NAME = 'TPAK';
const DEFAULT_TITLE = 'TPAK | ค้นพบความรู้ ขยับสู่สุขภาวะที่ดี';
const DEFAULT_DESCRIPTION =
  'สำรวจข้อมูลกิจกรรมทางกายของคนไทย ค้นหางานวิจัย บทความ และเครื่องมือจากศูนย์พัฒนาองค์ความรู้ด้านกิจกรรมทางกายประเทศไทย';

type Match = {
  element: ReactNode;
  title: string;
  description: string;
};

function articleId(path: string): string | null {
  const m = /^\/article\/([^/]+)$/.exec(path);
  return m ? decodeURIComponent(m[1]) : null;
}

function resolve(path: string): Match {
  if (path === '/' || path === '/th') {
    return {
      element: <HomePage />,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    };
  }
  if (path === '/knowledge') {
    return {
      element: <KnowledgePage />,
      title: `คลังองค์ความรู้ | ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
    };
  }
  if (path === '/data') {
    return {
      element: <DataPage />,
      title: `ข้อมูลและสถิติ | สำรวจกิจกรรมทางกายคนไทย | ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
    };
  }
  if (path === '/about') {
    return {
      element: <AboutPage />,
      title: `เกี่ยวกับ TPAK | วิสัยทัศน์ พันธกิจ และบุคลากร | ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
    };
  }
  if (path === '/people') {
    return {
      element: <PeoplePage />,
      title: `บุคลากร | ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
    };
  }

  const id = articleId(path);
  if (id) {
    const article = articles.find((a) => String(a.id) === id);
    return {
      element: <ArticlePage id={id} />,
      title: article ? `${article.title} | ${SITE_NAME}` : `ไม่พบบทความ | ${SITE_NAME}`,
      description: article?.summary ?? DEFAULT_DESCRIPTION,
    };
  }

  return {
    element: <NotFound />,
    title: `ไม่พบหน้าที่คุณกำลังมองหา | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
  };
}

/** notFound() inside a page throws; this turns that into the 404 view. */
class NotFoundBoundary extends Component<
  { children: ReactNode; routeKey: string },
  { missing: boolean }
> {
  state = { missing: false };

  static getDerivedStateFromError(error: unknown) {
    if (error instanceof NotFoundError) return { missing: true };
    throw error;
  }

  componentDidUpdate(prev: { routeKey: string }) {
    if (prev.routeKey !== this.props.routeKey && this.state.missing) {
      this.setState({ missing: false });
    }
  }

  render() {
    return this.state.missing ? <NotFound /> : this.props.children;
  }
}

function setMeta(name: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`,
  );
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        color: '#657387',
        fontFamily: "'Manrope', 'Noto Sans Thai', sans-serif",
      }}
    >
      กำลังโหลด…
    </div>
  );
}

export default function App() {
  const { path, search } = useLocation();
  const match = resolve(path);

  useEffect(() => {
    document.title = match.title;
    setMeta('description', match.description);
  }, [match.title, match.description]);

  // Search and topic arrive as initial state, so a new query string has to
  // remount the page rather than reuse the previous filters.
  const routeKey = path + search;

  return (
    <NotFoundBoundary routeKey={routeKey}>
      <Suspense fallback={<RouteFallback />}>
        <Fragment key={routeKey}>{match.element}</Fragment>
      </Suspense>
    </NotFoundBoundary>
  );
}
