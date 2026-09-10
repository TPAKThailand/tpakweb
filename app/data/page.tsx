import { Header, Footer } from '../site-shell';
import NativeDashboard from '../native-dashboard';
import Link from '../site-link';
export const metadata = { title: 'ข้อมูลและสถิติ | สำรวจกิจกรรมทางกายคนไทย' };
export default function DataPage() {
  return (
    <>
      <Header page="data" />
      <main id="main" className="data-workspace">
        <div className="page-width data-workspace-inner">
          <div className="breadcrumb">
            <Link href="/">ค้นพบ</Link>
            <span> / </span>ข้อมูลและสถิติ
          </div>
          <div className="data-page-heading">
            <div>
              <span className="eyebrow">TPAK DATA EXPLORER</span>
              <h1>ข้อมูลและสถิติ</h1>
              <p>เข้าใจการขยับของคนไทย ผ่านข้อมูลกิจกรรมทางกาย</p>
            </div>
            <span className="data-update">
              <i />
              ข้อมูล พ.ศ. 2555–2567
            </span>
          </div>
          <NativeDashboard />
        </div>
      </main>
      <Footer />
    </>
  );
}
