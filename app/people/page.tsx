import { Header, Footer } from '../site-shell';
import AboutContent from '../about-content';
export const metadata = { title: 'บุคลากร' };
export default function PeoplePage() {
  return (
    <>
      <Header page="about" />
      <main id="main">
        <AboutContent initialTab="people" />
      </main>
      <Footer />
    </>
  );
}
