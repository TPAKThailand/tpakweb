import Link from './site-link';
import Image from 'next/image';
export default function NotFound() {
  return (
    <main className="page-width inner-page">
      <Link className="brand" href="/">
        <Image
          unoptimized
          src="/tpak-logo.png"
          alt="TPAK"
          width="208"
          height="59"
        />
      </Link>
      <div className="empty-state" style={{ marginTop: 60 }}>
        <span className="eyebrow">404 · PAGE NOT FOUND</span>
        <h1>ไม่พบหน้าที่คุณกำลังมองหา</h1>
        <p>เริ่มค้นหาความรู้ใหม่ หรือกลับไปสำรวจข้อมูลของ TPAK</p>
        <Link className="solid-button" href="/">
          กลับหน้าค้นพบ
        </Link>
      </div>
    </main>
  );
}
