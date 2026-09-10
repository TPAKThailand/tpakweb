/**
 * Everything in this project was authored with root-absolute paths ("/media/x.jpg",
 * "/knowledge"). GitHub Pages serves the site from a sub-folder, so those paths have
 * to be re-based at runtime. import.meta.env.BASE_URL always ends with a slash.
 */
export const BASE = import.meta.env.BASE_URL;

/** Turn an app-absolute path into one that works under the deployed base. */
export function withBase(path: string): string {
  if (!path) return path;
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return BASE.replace(/\/$/, '') + path;
}

/** Strip the base off a browser pathname, giving the app-level route. */
export function toRoute(pathname: string): string {
  const prefix = BASE.replace(/\/$/, '');
  let route = pathname;
  if (prefix && route.startsWith(prefix)) route = route.slice(prefix.length);
  if (!route.startsWith('/')) route = '/' + route;
  if (route.length > 1 && route.endsWith('/')) route = route.slice(0, -1);
  return route;
}

/** Re-base the root-absolute src/href attributes inside stored article HTML. */
export function rebaseHtml(html: string): string {
  const prefix = BASE.replace(/\/$/, '');
  if (!prefix) return html;
  return html.replace(
    /(src|href)=("|')\/(?!\/)/g,
    (_m, attr, quote) => `${attr}=${quote}${prefix}/`,
  );
}
