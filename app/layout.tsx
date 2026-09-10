/**
 * Kept for reference only. The site is now a Vite single-page app: the document
 * shell lives in index.html and the routing lives in src/App.tsx.
 */
export const metadata = {
  title: 'TPAK | ค้นพบความรู้ ขยับสู่สุขภาวะที่ดี',
  description:
    'สำรวจข้อมูลกิจกรรมทางกายของคนไทย ค้นหางานวิจัย บทความ และเครื่องมือจากศูนย์พัฒนาองค์ความรู้ด้านกิจกรรมทางกายประเทศไทย',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
