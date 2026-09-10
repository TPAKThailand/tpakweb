import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://tpak-knowledge-hub.kim-kreenna.chatgpt.site'),
  icons: { icon: '/favicon.png' },
  title: { default: 'TPAK | ค้นพบความรู้ ขยับสู่สุขภาวะที่ดี', template: '%s | TPAK' },
  description:
    'สำรวจข้อมูลกิจกรรมทางกายของคนไทย ค้นหางานวิจัย บทความ และเครื่องมือจากศูนย์พัฒนาองค์ความรู้ด้านกิจกรรมทางกายประเทศไทย',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
