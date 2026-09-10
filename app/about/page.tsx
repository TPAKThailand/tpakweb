import { Header, Footer } from '../site-shell';
import AboutContent from '../about-content';
export const metadata = { title: 'เกี่ยวกับ TPAK | วิสัยทัศน์ พันธกิจ และบุคลากร' };
export default function AboutPage() {
  return (
    <>
      <Header page="about" />
      <main id="main">
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
