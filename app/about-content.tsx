'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
  Users,
  Target,
  BookOpen,
  Download,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import about from './generated/about.json';
import Link from './site-link';

const staffGroups = about.groups.filter(
  (g) =>
    !['งานพัฒนาฐานข้อมูลและการพยากรณ์', 'งานพัฒนาเครือข่ายวิชาการ'].includes(g.title),
);

export default function AboutContent({
  initialTab = 'overview',
}: {
  initialTab?: string;
}) {
  const [group, setGroup] = useState('ทั้งหมด');
  const shown = staffGroups.filter(
    (g) => group === 'ทั้งหมด' || g.title === group,
  );
  return (
    <div className="page-width inner-page about-page">
      <div className="breadcrumb">
        <Link href="/">ค้นพบ</Link>
        <span> / </span>เกี่ยวกับ TPAK
      </div>
      <div className="about-intro">
        <span className="eyebrow">KNOWLEDGE FOR CHANGE</span>
        <h1>
          ความรู้ที่ขับเคลื่อน
          <br />
          <span>สังคมให้มีสุขภาวะ</span>
        </h1>
        <p>
          ศูนย์พัฒนาองค์ความรู้ด้านกิจกรรมทางกายประเทศไทย
          <br />
          สถาบันวิจัยประชากรและสังคม มหาวิทยาลัยมหิดล
        </p>
      </div>
      <Tabs defaultValue={initialTab} className="about-tabs">
        <TabsList className="section-tabs">
          <TabsTrigger value="overview">
            <Target size={17} /> รู้จัก TPAK
          </TabsTrigger>
          <TabsTrigger value="people">
            <Users size={17} /> บุคลากร
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <section className="vision-panel">
            <span className="eyebrow">OUR VISION</span>
            <h2>วิสัยทัศน์</h2>
            <p>{about.vision}</p>
            <div className="vision-signature">
              <Image
                src="/tpak-logo.png"
                alt="TPAK"
                width={150}
                height={43}
                unoptimized
              />
              <span>สร้างความรู้ สร้างการเปลี่ยนแปลง</span>
            </div>
          </section>
          <section className="about-section">
            <div className="section-heading">
              <span className="eyebrow">OUR MISSION</span>
              <h2>พันธกิจของเรา</h2>
            </div>
            <div className="mission-cards">
              {about.missions.map((m, i) => (
                <article key={m}>
                  <span className="mission-number">0{i + 1}</span>
                  <p>{m}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="about-section background-section">
            <div>
              <span className="eyebrow">OUR STORY</span>
              <h2>
                ความเป็นมา
                <br />
                ของศูนย์ฯ
              </h2>
            </div>
            <p>{about.background}</p>
          </section>
          <section className="about-section">
            <span className="eyebrow">OUR PURPOSE</span>
            <h2>เป้าหมายและผลผลิตทางวิชาการ</h2>
            <p className="muted">{about.goalIntro}</p>
            <div className="goals-grid">
              {about.goals.map((g, i) => (
                <div key={g}>
                  <span>0{i + 1}</span>
                  <BookOpen size={24} />
                  <h3>{g}</h3>
                </div>
              ))}
            </div>
          </section>
          <section className="about-section identity-panel">
            <div>
              <span className="eyebrow">OUR IDENTITY</span>
              <h2>อัตลักษณ์ของศูนย์</h2>
              <p>Thailand Physical Activity Knowledge Development Centre</p>
              <div className="about-links">
                {['jpg', 'png', 'ai'].map((ext) => (
                  <Link
                    key={ext}
                    className="outline-button"
                    href={`https://tpak.or.th/asset/front_images/about-tpak/logo/tpak-${ext}.${ext}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download size={15} /> โลโก้ {ext.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
            <Image
              src={about.identityImage}
              alt="อัตลักษณ์และองค์ประกอบตราสัญลักษณ์ของศูนย์ TPAK จากเว็บไซต์ต้นฉบับ"
              width={1200}
              height={900}
              unoptimized
            />
          </section>
        </TabsContent>
        <TabsContent value="people">
          <div className="staff-intro">
            <div>
              <span className="eyebrow">PEOPLE BEHIND THE KNOWLEDGE</span>
              <h2>ทีมที่ร่วมสร้างองค์ความรู้</h2>
              <p>รู้จักบุคลากรและกลุ่มงานของ TPAK</p>
            </div>
            <Select value={group} onValueChange={(v) => v && setGroup(v)}>
              <SelectTrigger
                className="staff-select"
                aria-label="เลือกกลุ่มงานบุคลากร"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['ทั้งหมด', ...staffGroups.map((g) => g.title)].map((g) => (
                  <SelectItem value={g} key={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {shown.map((g) => (
            <section className="staff-section" key={g.title}>
              <h3>{g.title}</h3>
              {g.people.length ? (
                <div className="staff-grid">
                  {g.people.map((p) => (
                    <article className="person-card" key={p.name}>
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={500}
                        height={550}
                        unoptimized
                        loading="lazy"
                      />
                      <div>
                        <h4>{p.name}</h4>
                        {p.email && (
                          <Link
                            className="person-email"
                            href={`mailto:${p.email}`}
                          >
                            <Mail size={15} />
                            <span>{p.email}</span>
                          </Link>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="muted">
                  ยังไม่มีรายชื่อบุคลากรเผยแพร่ในหมวดนี้บนเว็บไซต์ต้นฉบับ
                </p>
              )}
            </section>
          ))}
          <p className="source-line">
            รายชื่อและภาพจาก{' '}
            <Link
              href="https://tpak.or.th/th/personal"
              target="_blank"
              rel="noreferrer"
            >
              หน้าบุคลากร TPAK <ArrowUpRight size={13} />
            </Link>{' '}
            · นำเข้าวันที่ 9 กันยายน 2569
          </p>
        </TabsContent>
      </Tabs>
      <section className="contact-panel" id="contact">
        <div>
          <span className="eyebrow">LET’S CONNECT</span>
          <h2>ติดต่อ TPAK</h2>
          <p>
            สถาบันวิจัยประชากรและสังคม มหาวิทยาลัยมหิดล
            <br />
            999 ถ.พุทธมณฑลสาย 4 ต.ศาลายา อ.พุทธมณฑล จ.นครปฐม 73170
          </p>
        </div>
        <div className="contact-methods">
          <Link href="tel:024410201">
            02-441-0201-4 <span>ต่อ 307, 317, 524, 525</span>
          </Link>
          <Link href="mailto:admin@tpak.or.th">
            admin@tpak.or.th <ArrowRight size={17} />
          </Link>
          <p>โทรสาร 02-441-9333</p>
        </div>
      </section>
      <p className="source-line">
        เนื้อหาหน่วยงานอ้างอิงจาก{' '}
        <Link href={about.source} target="_blank" rel="noreferrer">
          เกี่ยวกับ TPAK <ArrowUpRight size={13} />
        </Link>
      </p>
    </div>
  );
}
