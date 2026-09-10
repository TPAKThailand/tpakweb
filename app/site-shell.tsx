'use client';
import { useState } from 'react';
import Link from './site-link';
import Image from 'next/image';
import {
  ChartNoAxesCombined,
  ArrowUpRight,
  Heart,
  Menu,
  X,
} from 'lucide-react';
export type Page = 'home' | 'knowledge' | 'data' | 'about';
const nav = [
  { page: 'home', label: 'ค้นพบ', href: '/' },
  { page: 'knowledge', label: 'คลังองค์ความรู้', href: '/knowledge' },
  { page: 'data', label: 'ข้อมูลและสถิติ', href: '/data' },
  { page: 'about', label: 'เกี่ยวกับ TPAK', href: '/about' },
];
export function Header({ page }: { page: Page }) {
  const [menu, setMenu] = useState(false);
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="TPAK หน้าแรก">
        <Image
          unoptimized
          src="/tpak-logo.png"
          alt="TPAK ศูนย์พัฒนาองค์ความรู้ด้านกิจกรรมทางกายประเทศไทย"
          width="208"
          height="59"
        />
      </Link>
      <nav className={menu ? 'main-nav open' : 'main-nav'} aria-label="เมนูหลัก">
        {nav.map((n) => (
          <Link
            key={n.page}
            href={n.href}
            className={page === n.page ? 'active' : ''}
            aria-current={page === n.page ? 'page' : undefined}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <Link className="header-data" href="/data">
          <ChartNoAxesCombined size={18} /> สำรวจข้อมูล <ArrowUpRight size={15} />
        </Link>
        <button
          className="menu-button"
          aria-label={menu ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main page-width">
        <div>
          <Link href="/" className="brand">
            <Image
              unoptimized
              src="/tpak-logo.png"
              alt="TPAK"
              width="208"
              height="59"
            />
          </Link>
          <p>
            องค์ความรู้ที่เข้าถึงได้
            <br />
            เพื่อสังคมไทยที่ขยับไปด้วยกัน
          </p>
        </div>
        <div>
          <h3>ค้นพบ TPAK</h3>
          <Link href="/knowledge">คลังองค์ความรู้</Link>
          <Link href="/data">ข้อมูลและสถิติ</Link>
          <Link href="/about">เกี่ยวกับเราและติดต่อ</Link>
          <Link href="/people">บุคลากร</Link>
        </div>
        <div>
          <h3>บริการจากเว็บต้นฉบับ</h3>
          <Link href="https://tpak.or.th/th" target="_blank" rel="noreferrer">
            แบบประเมินกิจกรรมทางกาย <ArrowUpRight size={14} />
          </Link>
          <Link
            href="https://tpak.or.th/th/event"
            target="_blank"
            rel="noreferrer"
          >
            ปฏิทินกิจกรรม <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="footer-institute">
          <Heart size={22} />
          <p>
            ศูนย์พัฒนาองค์ความรู้
            <br />
            ด้านกิจกรรมทางกายประเทศไทย
          </p>
          <span>
            สถาบันวิจัยประชากรและสังคม
            <br />
            มหาวิทยาลัยมหิดล
          </span>
        </div>
      </div>
      <div className="footer-bottom page-width">
        <span>
          TPAK · Thailand Physical Activity Knowledge Development Centre
        </span>
        <span>เว็บไซต์แนวทางใหม่ · เนื้อหาอ้างอิงจาก TPAK</span>
      </div>
    </footer>
  );
}
