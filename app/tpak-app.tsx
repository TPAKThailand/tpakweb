'use client';
import { useState, useRef } from 'react';
import Link from './site-link';
import Image from 'next/image';
import {
  Search,
  ArrowUpRight,
  ArrowRight,
  Activity,
  ChartNoAxesCombined,
  BookOpen,
  SlidersHorizontal,
  FileText,
  X,
  Download,
  Sparkles,
  Info,
  MoveUpRight,
  LayoutGrid,
  LibraryBig,
  Footprints,
  Users,
  BriefcaseBusiness,
  Leaf,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Header, Footer, type Page } from './site-shell';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { filterResources, paSeries, reportUrl, type Resource } from './content';

function Picker({
  value,
  onChange,
  label,
  items,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  items: { value: string; label: string }[];
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => v !== null && onChange(v)}
      items={items}
    >
      <SelectTrigger className="picker" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((i) => (
          <SelectItem key={i.value} value={i.value}>
            {i.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
function SearchBox({
  query,
  setQuery,
  onSearch,
}: {
  query: string;
  setQuery: (s: string) => void;
  onSearch: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <search>
      <form
        className="big-search"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
          input.current?.blur();
        }}
      >
        <Search className="search-leading" size={26} />
        <input
          ref={input}
          aria-label="ค้นหาความรู้และข้อมูล TPAK"
          placeholder="อยากรู้เรื่องอะไร? ค้นหาข้อมูล งานวิจัย หรือแรงบันดาลใจ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            type="button"
            className="clear-search"
            aria-label="ล้างคำค้น"
            onClick={() => {
              setQuery('');
              input.current?.focus();
            }}
          >
            <X size={19} />
          </button>
        )}
        <button type="submit" className="search-submit">
          ค้นหา <ArrowRight size={20} />
        </button>
      </form>
    </search>
  );
}
function DataExplorer({ full = false }: { full?: boolean }) {
  const [year, setYear] = useState('2567');
  const [compare, setCompare] = useState('2566');
  const [range, setRange] = useState('all');
  const current = paSeries.find((d) => d.year === +year)!;
  const baseline = paSeries.find((d) => d.year === +compare)!;
  const diff = +(current.value - baseline.value).toFixed(1);
  const series = range === 'recent' ? paSeries.slice(-3) : paSeries;
  function download() {
    const csv =
      '\uFEFFปี พ.ศ.,มีกิจกรรมทางกายเพียงพอ (ร้อยละ),แหล่งข้อมูล\r\n' +
      series.map((d) => `${d.year},${d.value},${reportUrl}`).join('\r\n');
    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TPAK-physical-activity.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section
      className={'data-section ' + (full ? 'full-data' : '')}
      aria-labelledby="data-heading"
    >
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <span className="orange-dot" /> TPAK DATA EXPLORER
          </div>
          <h2 id="data-heading">
            เข้าใจสังคมไทย ผ่านข้อมูลที่ขยับได้<span className="accent-dot">.</span>
          </h2>
        </div>
        {!full && (
          <Link className="text-link" href="/data">
            สำรวจข้อมูลทั้งหมด <ArrowUpRight size={19} />
          </Link>
        )}
      </div>
      <div className="dashboard">
        <div className="dashboard-intro">
          <div className="dashboard-label">
            <Activity size={19} /> กิจกรรมทางกายของคนไทย
          </div>
          <p className="small-muted">สัดส่วนประชากรที่มีกิจกรรมทางกายเพียงพอ</p>
          <div className="year-control">
            <span>ปีข้อมูล</span>
            <Picker
              value={year}
              onChange={setYear}
              label="เลือกปีข้อมูล"
              items={paSeries.map((d) => ({
                value: String(d.year),
                label: `พ.ศ. ${d.year}`,
              }))}
            />
          </div>
          <div className="big-stat" aria-live="polite">
            {current.value.toFixed(1)}
            <span>%</span>
          </div>
          <div className={'stat-change ' + (diff < 0 ? 'negative' : '')}>
            <MoveUpRight size={16} />
            {diff > 0 ? '+' : ''}
            {diff.toFixed(1)} จุดเปอร์เซ็นต์ <span>จากปี {compare}</span>
          </div>
          <p className="stat-explain">
            ประมาณ <strong>{Math.round(current.value / 10)} ใน 10 คน</strong>
            <br /> มีกิจกรรมทางกายเพียงพอในปี {year}
          </p>
          <div className="data-note">
            <Info size={15} />
            <span>ข้อมูลย้อนหลัง พ.ศ. 2563–2567</span>
          </div>
        </div>
        <div className="chart-panel">
          <div className="chart-top">
            <div>
              <h3>ทุกปีที่เปลี่ยนไป คนไทยขยับแค่ไหน?</h3>
              <span className="chart-legend">
                <i /> มีกิจกรรมทางกายเพียงพอ (%)
              </span>
            </div>
            <Tabs defaultValue="chart" className="chart-tabs">
              <TabsList>
                <TabsTrigger value="chart">กราฟ</TabsTrigger>
                <TabsTrigger value="table">ตาราง</TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <div
                  className="chart"
                  aria-label="กราฟสัดส่วนประชากรที่มีกิจกรรมทางกายเพียงพอ"
                >
                  <div className="chart-y" aria-hidden="true">
                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>
                    <span>0</span>
                  </div>
                  <div className="chart-grid">
                    <div className="grid-lines" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="chart-bars">
                      {series.map((d) => (
                        <button
                          className={
                            'bar-column ' + (+year === d.year ? 'selected' : '')
                          }
                          key={d.year}
                          onClick={() => setYear(String(d.year))}
                          aria-pressed={+year === d.year}
                          aria-label={`เลือกปี ${d.year} ร้อยละ ${d.value}`}
                        >
                          <span className="bar-area">
                            <span
                              className="bar"
                              style={{ height: d.value + '%' }}
                            >
                              <b>{d.value.toFixed(1)}</b>
                            </span>
                          </span>
                          <span className="bar-year">{d.year}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="table">
                <div className="data-table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ปี พ.ศ.</TableHead>
                        <TableHead>กิจกรรมทางกายเพียงพอ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {series.map((d) => (
                        <TableRow key={d.year}>
                          <TableCell>{d.year}</TableCell>
                          <TableCell>{d.value.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="chart-bottom">
            <span>
              <span className="orange-dot" /> คลิกแท่งกราฟเพื่อดูแต่ละปี
            </span>
            <Link
              href="https://tpak.or.th/th/iframe/15"
              target="_blank"
              rel="noreferrer"
            >
              แหล่งข้อมูล <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      {full && (
        <>
          <div className="data-toolbar">
            <div className="toolbar-field">
              <span>ช่วงข้อมูล</span>
              <Picker
                value={range}
                onChange={(v) => {
                  setRange(v);
                  if (v === 'recent' && +year < 2564) setYear('2564');
                }}
                label="ช่วงข้อมูลบนกราฟ"
                items={[
                  { value: 'all', label: '2563–2567' },
                  { value: 'recent', label: '2565–2567' },
                ]}
              />
            </div>
            <div className="toolbar-field">
              <span>เปรียบเทียบกับปี</span>
              <Picker
                value={compare}
                onChange={setCompare}
                label="เลือกปีฐานสำหรับเปรียบเทียบ"
                items={paSeries.map((d) => ({
                  value: String(d.year),
                  label: `พ.ศ. ${d.year}`,
                }))}
              />
            </div>
            <button className="outline-button" onClick={download}>
              <Download size={17} /> ดาวน์โหลดข้อมูล CSV
            </button>
          </div>
          <div className="data-explanation">
            <div>
              <span className="eyebrow">READ THE DATA</span>
              <h3>อ่านตัวเลขให้เข้าใจ</h3>
              <p>
                ปี {year} มีประชากรไทยที่มีกิจกรรมทางกายเพียงพอ{' '}
                {current.value.toFixed(1)}%{' '}
                {diff === 0 ? 'เท่ากับ' : diff > 0 ? 'สูงกว่า' : 'ต่ำกว่า'}ปี {compare}{' '}
                {Math.abs(diff).toFixed(1)} จุดเปอร์เซ็นต์
                การเปรียบเทียบนี้แสดงความต่างของสัดส่วนระหว่างสองปี
              </p>
            </div>
            <div>
              <span className="eyebrow">ABOUT THIS DATASET</span>
              <h3>ที่มาและขอบเขตข้อมูล</h3>
              <p>
                ข้อมูลระดับประเทศจากรายงาน
                “สถานการณ์กิจกรรมทางกายคนไทยกับความเป็นไปในรอบ 12 ปี” ของ TPAK
                แสดงเฉพาะช่วง พ.ศ. 2563–2567 ที่คัดมาสำหรับหน้านี้
                ข้อมูลไม่ใช่สถานการณ์ปัจจุบันหรือข้อมูลสด
              </p>
              <Link
                className="text-link"
                href="https://tpak.or.th/th/iframe/15"
                target="_blank"
                rel="noreferrer"
              >
                อ่านรายงานและวิธีการศึกษา <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
function ResourceCard({ item }: { item: Resource }) {
  return (
    <article className="resource-card">
      <Link
        className="card-button"
        href={item.dateISO ? `/article/${item.id}` : item.url}
        aria-label={`อ่าน ${item.title}`}
      >
        <div className={'card-visual ' + (item.color || 'photo')}>
          {item.image ? (
            <Image
              unoptimized
              src={item.image}
              alt=""
              loading="lazy"
              width="600"
              height="400"
            />
          ) : (
            <div className="editorial-cover">
              <span className="cover-brand">
                TPAK<span>KNOWLEDGE FOR CHANGE</span>
              </span>
              <span className="cover-eyebrow">{item.eyebrow}</span>
              {item.id === 876 ? (
                <>
                  <div className="cover-number">
                    12<span>ปี</span>
                  </div>
                  <p>
                    เข้าใจการเปลี่ยนแปลง
                    <br />
                    กิจกรรมทางกายคนไทย
                  </p>
                  <div className="mini-bars" aria-hidden="true">
                    {paSeries.map((d) => (
                      <i key={d.year} style={{ height: d.value + '%' }} />
                    ))}
                  </div>
                </>
              ) : item.id === 805 ? (
                <>
                  <FileText size={56} strokeWidth={1.15} />
                  <div className="cover-title">GPAQ</div>
                  <p>
                    เครื่องมือวัดกิจกรรมทางกาย
                    <br />
                    เพื่อเข้าใจทุกการเคลื่อนไหว
                  </p>
                </>
              ) : (
                <>
                  <span className="cover-title thai">
                    ทุกวัย
                    <br />
                    ขยับได้
                  </span>
                  <p>
                    เข้าใจความต่าง
                    <br />
                    สร้างโอกาสให้ทุกคน
                  </p>
                  <Users size={46} strokeWidth={1.2} />
                </>
              )}
            </div>
          )}
          <span className="card-format">
            {item.type === 'รายงานวิจัย' ? (
              <ChartNoAxesCombined size={13} />
            ) : item.type === 'เครื่องมือ' ? (
              <FileText size={13} />
            ) : (
              <BookOpen size={13} />
            )}{' '}
            {item.type}
          </span>
          <span className="card-open">
            <ArrowUpRight size={22} />
          </span>
        </div>
        <div className="card-copy">
          <span className="card-topic">{item.topic}</span>
          <h3>{item.title}</h3>
          <div className="card-meta">
            TPAK <span>•</span> {item.year}
          </div>
        </div>
      </Link>
    </article>
  );
}
export default function TpakApp({
  page,
  initialQuery = '',
  initialTopic = 'ทั้งหมด',
}: {
  page: Page;
  initialQuery?: string;
  initialTopic?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [topic, setTopic] = useState(initialTopic);
  const [type, setType] = useState('ทั้งหมด');
  const [sort, setSort] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [lastFilter, setLastFilter] = useState(
    `${query}|${topic}|${type}|${sort}`,
  );
  const filterKey = `${query}|${topic}|${type}|${sort}`;
  if (filterKey !== lastFilter) {
    setLastFilter(filterKey);
    setPageNumber(1);
  }
  const filtered = filterResources(query, topic, type);
  const items =
    sort === 'latest'
      ? [...filtered].sort((a, b) =>
          (b.dateISO || `${b.year - 543}`).localeCompare(
            a.dateISO || `${a.year - 543}`,
          ),
        )
      : filtered;
  function search() {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (topic !== 'ทั้งหมด') params.set('topic', topic);
    window.history.replaceState(
      null,
      '',
      window.location.pathname + (params.size ? '?' + params : ''),
    );
    document
      .getElementById('knowledge')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const topics = [
    { label: 'ทั้งหมด', icon: LayoutGrid },
    { label: 'กิจกรรมทางกาย', icon: Footprints },
    { label: 'เด็กและเยาวชน', icon: Sparkles },
    { label: 'วัยทำงาน', icon: BriefcaseBusiness },
    { label: 'ผู้สูงอายุ', icon: Users },
    { label: 'เมืองสุขภาวะ', icon: Leaf },
  ];
  return (
    <>
      <Link className="skip-link" href="#main">
        ข้ามไปเนื้อหา
      </Link>
      <Header page={page} />
      <main id="main">
        {(page === 'home' || page === 'knowledge') && (
          <>
            <section
              className={
                'search-hero ' + (page === 'knowledge' ? 'compact' : '')
              }
            >
              <div className="hero-kicker">
                <span className="orange-dot" /> KNOWLEDGE FOR CHANGE
              </div>
              <h1>
                {page === 'home' ? (
                  <>
                    ค้นพบความรู้ <span>ขยับสู่สุขภาวะที่ดี</span>
                  </>
                ) : (
                  'ความรู้ดี ๆ อยู่ใกล้กว่าที่คิด'
                )}
              </h1>
              <p>เชื่อมต่อข้อมูล งานวิจัย และไอเดีย เพื่อให้ทุกการขยับของคุณมีความหมาย</p>
              <SearchBox query={query} setQuery={setQuery} onSearch={search} />
              <div className="trending">
                <span>หัวข้อน่าค้นหา</span>
                {['กิจกรรมทางกาย', 'ผู้สูงอายุ', 'วัยทำงาน', 'PM2.5'].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setQuery(t);
                      setTopic('ทั้งหมด');
                      document
                        .getElementById('knowledge')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {t}
                    <ArrowUpRight size={13} />
                  </button>
                ))}
              </div>
            </section>
            {page === 'home' && (
              <div className="page-width">
                <DataExplorer />
              </div>
            )}
            <section id="knowledge" className="knowledge-section page-width">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">
                    <span className="orange-dot" /> THE KNOWLEDGE HUB
                  </div>
                  <h2>
                    พื้นที่ของความรู้ และแรงบันดาลใจ
                    <span className="accent-dot">.</span>
                  </h2>
                </div>
                <button
                  className={
                    'filter-button ' + (showFilters ? 'is-active' : '')
                  }
                  aria-expanded={showFilters}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal size={17} /> ตัวกรอง
                </button>
              </div>
              <div className="knowledge-controls">
                <div className="topic-list" aria-label="กรองตามหัวข้อ">
                  {topics.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      className={topic === label ? 'selected' : ''}
                      aria-pressed={topic === label}
                      onClick={() => setTopic(label)}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>
                <Picker
                  value={sort}
                  onChange={setSort}
                  label="เรียงลำดับองค์ความรู้"
                  items={[
                    { value: 'recommended', label: 'เรียงตามแนะนำ' },
                    { value: 'latest', label: 'ปีล่าสุดก่อน' },
                  ]}
                />
              </div>
              {showFilters && (
                <div className="expanded-filters">
                  <span>ประเภทเนื้อหา</span>
                  {['ทั้งหมด', 'บทความ', 'รายงานวิจัย', 'เครื่องมือ'].map((t) => (
                    <button
                      key={t}
                      aria-pressed={type === t}
                      className={type === t ? 'selected' : ''}
                      onClick={() => setType(t)}
                    >
                      {t}
                    </button>
                  ))}
                  <button
                    className="reset"
                    onClick={() => {
                      setType('ทั้งหมด');
                      setTopic('ทั้งหมด');
                      setQuery('');
                    }}
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
              )}
              <div className="results-label" aria-live="polite">
                {query
                  ? `ผลการค้นหา “${query}”`
                  : topic !== 'ทั้งหมด'
                    ? topic
                    : 'คัดสรรจากองค์ความรู้ของ TPAK'}{' '}
                <span>{items.length} รายการ</span>
              </div>
              {items.length ? (
                <div className="masonry">
                  {items
                    .slice((pageNumber - 1) * 12, pageNumber * 12)
                    .map((item) => (
                      <ResourceCard key={item.id} item={item} />
                    ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Search size={36} />
                  <h3>ยังไม่พบเรื่องที่คุณค้นหา</h3>
                  <p>ลองใช้คำสั้น ๆ เช่น “เดิน” “ผู้สูงอายุ” หรือเลือกดูทุกหัวข้อ</p>
                  <button
                    className="solid-button"
                    onClick={() => {
                      setQuery('');
                      setTopic('ทั้งหมด');
                      setType('ทั้งหมด');
                    }}
                  >
                    ดูองค์ความรู้ทั้งหมด <ArrowRight size={17} />
                  </button>
                </div>
              )}
              {items.length > 12 && (
                <Pagination
                  className="library-pagination"
                  aria-label="หน้าคลังองค์ความรู้"
                >
                  <PaginationContent>
                    {Array.from(
                      { length: Math.ceil(items.length / 12) },
                      (_, i) => i + 1,
                    ).map((n) => (
                      <PaginationItem key={n}>
                        <PaginationLink
                          href="#knowledge"
                          isActive={pageNumber === n}
                          aria-label={`หน้าที่ ${n}`}
                          onClick={() => setPageNumber(n)}
                        >
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  </PaginationContent>
                </Pagination>
              )}
              <div className="media-links" aria-label="คลังสื่อเพิ่มเติมจาก TPAK">
                <span>เลือกเรียนรู้ในแบบของคุณ</span>
                <Link
                  href="https://tpak.or.th/th/concept/infographic/all/all/all"
                  target="_blank"
                  rel="noreferrer"
                >
                  อินโฟกราฟิก <ArrowUpRight size={16} />
                </Link>
                <Link
                  href="https://tpak.or.th/th/concept/video/all/all/all"
                  target="_blank"
                  rel="noreferrer"
                >
                  วิดีโอ <ArrowUpRight size={16} />
                </Link>
                <Link
                  href="https://tpak.or.th/th/concept/print_media/all/all/all"
                  target="_blank"
                  rel="noreferrer"
                >
                  หนังสือและสื่อสิ่งพิมพ์ <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="library-footer">
                <LibraryBig size={21} />
                <p>ยังมีเรื่องน่ารู้อีกมากมายให้ค้นพบ</p>
                <Link
                  href="https://tpak.or.th/th"
                  target="_blank"
                  rel="noreferrer"
                >
                  สำรวจคลังต้นฉบับ TPAK <ArrowUpRight size={17} />
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
