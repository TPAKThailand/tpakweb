'use client';
import { useMemo, useState } from 'react';
import {
  Activity,
  Armchair,
  SlidersHorizontal,
  Download,
  RotateCcw,
  Info,
  ArrowUpRight,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import Link from './site-link';
import {
  SummaryCard,
  ChangeCard,
  GenderCard,
  SnapshotCard,
  AgeComparisonCard,
  chartBlue,
} from './dashboard-cards';
import {
  overview,
  details,
  ageOptions,
  years,
  filteredDetails,
  summarize,
  displayTime,
  csvText,
} from './dashboard-data';

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="dashboard-filter">
      <span>{label}</span>
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((v) => (
            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
function saveCsv(name: string, rows: (string | number | null)[][]) {
  const blob = new Blob([csvText(rows)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const number = (v: number | null, digits = 1) =>
  v === null
    ? '—'
    : v.toLocaleString('th-TH', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });

export default function NativeDashboard() {
  const [mode, setMode] = useState('pa');
  const [year, setYear] = useState('2567');
  const [compare, setCompare] = useState('2566');
  const [age, setAge] = useState('ทั้งหมด');
  const [gender, setGender] = useState('ทั้งหมด');
  const [area, setArea] = useState('ทั้งหมด');
  const [province, setProvince] = useState('ทั้งหมด');
  const isDetail = mode === 'explore',
    isSb = mode === 'sb';
  const color = chartBlue;
  const rows = useMemo(
    () => filteredDetails({ age, gender, area, province }),
    [age, gender, area, province],
  );
  const selectedRows = rows.filter((r) => r[0] === Number(year));
  const selected = summarize(selectedRows);
  const series = years.map((y) => ({
    year: y,
    value: isDetail
      ? summarize(rows.filter((r) => r[0] === y)).percent
      : (overview.find(
          (r) =>
            r.metric === mode &&
            r.age === age &&
            r.gender === gender &&
            r.year === y,
        )?.value ?? null),
  }));
  const current = series.find((r) => r.year === Number(year))?.value ?? null;
  const previous =
    series.find((r) => r.year === Number(compare))?.value ?? null;
  const format = (v: number | null) =>
    v === null ? 'ไม่มีข้อมูล' : isSb ? displayTime(v) : number(v) + '%';
  const delta =
    current !== null && previous !== null
      ? isSb
        ? current - previous
        : Number(current.toFixed(1)) - Number(previous.toFixed(1))
      : null;
  const tableRows = years.map((y) => ({
    year: y,
    all:
      overview.find(
        (r) =>
          r.metric === mode &&
          r.age === age &&
          r.gender === 'ทั้งหมด' &&
          r.year === y,
      )?.value ?? null,
    male:
      overview.find(
        (r) =>
          r.metric === mode &&
          r.age === age &&
          r.gender === 'ชาย' &&
          r.year === y,
      )?.value ?? null,
    female:
      overview.find(
        (r) =>
          r.metric === mode &&
          r.age === age &&
          r.gender === 'หญิง' &&
          r.year === y,
      )?.value ?? null,
  }));
  const exportData = () => {
    if (isDetail) {
      saveCsv(`tpak-survey-${year}.csv`, [
        [
          'ปี',
          'เพศ',
          'ช่วงวัย',
          'พื้นที่',
          'จังหวัด',
          'กิจกรรมทางกาย',
          'จำนวนผู้ตอบ',
          'ผลรวมกิจกรรมทางกาย (นาที/สัปดาห์)',
          'จำนวนคำตอบกิจกรรมทางกาย',
          'ผลรวมการทำงาน (นาที/สัปดาห์)',
          'จำนวนคำตอบการทำงาน',
          'ผลรวมการเดินทาง (นาที/สัปดาห์)',
          'จำนวนคำตอบการเดินทาง',
          'ผลรวมนันทนาการ (นาที/สัปดาห์)',
          'จำนวนคำตอบนันทนาการ',
        ],
        ...selectedRows.map((r) => [
          r[0],
          details.genders[r[1]],
          details.ages[r[2]],
          details.areas[r[3]],
          details.provinces[r[4]],
          r[5] ? 'เพียงพอ' : 'ไม่เพียงพอ',
          ...r.slice(6),
        ]),
      ]);
    } else {
      saveCsv(`tpak-${mode}-${age}.csv`, [
        [
          'ปี',
          'ช่วงวัย',
          'เพศ',
          'ค่า',
          isSb ? 'หน่วย: นาทีต่อวัน' : 'หน่วย: ร้อยละ',
          'แหล่งข้อมูล',
        ],
        ...series.map((r) => [
          r.year,
          age,
          gender,
          r.value,
          isSb ? 'นาทีต่อวัน' : 'ร้อยละ',
          `https://tpak.or.th/th/iframe/${isSb ? 14 : 15}`,
        ]),
      ]);
    }
  };
  const reset = () => {
    setAge('ทั้งหมด');
    setGender('ทั้งหมด');
    setArea('ทั้งหมด');
    setProvince('ทั้งหมด');
    setYear('2567');
    setCompare('2566');
  };
  const valueFor = (y: number, a: string, g: string) =>
    isDetail
      ? summarize(
          filteredDetails({ age: a, gender: g, area, province }).filter(
            (r) => r[0] === y,
          ),
        ).percent
      : (overview.find(
          (r) =>
            r.metric === mode && r.year === y && r.age === a && r.gender === g,
        )?.value ?? null);
  const genderComparison = ['ชาย', 'หญิง'].map((g) => ({
    label: g,
    value: valueFor(Number(year), age, g),
  }));
  const ageComparison = details.ages.slice(0, 3).map((a, i) => ({
    label: ['เด็กและเยาวชน', 'วัยทำงาน', 'ผู้สูงอายุ'][i],
    current: valueFor(Number(year), a, gender),
    previous: valueFor(Number(compare), a, gender),
  }));
  return (
    <div className="native-dashboard">
      <Tabs value={mode} onValueChange={setMode}>
        <TabsList className="dataset-tabs">
          <TabsTrigger value="pa">
            <Activity size={20} />
            <span>
              กิจกรรมทางกาย<small>คนไทยขยับเพียงพอแค่ไหน</small>
            </span>
          </TabsTrigger>
          <TabsTrigger value="sb">
            <Armchair size={20} />
            <span>
              พฤติกรรมเนือยนิ่ง<small>เวลานั่งและเอนกายในแต่ละวัน</small>
            </span>
          </TabsTrigger>
          <TabsTrigger value="explore">
            <SlidersHorizontal size={20} />
            <span>
              สำรวจข้อมูลรายกลุ่ม<small>เลือกพื้นที่ จังหวัด และรูปแบบกิจกรรม</small>
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value={mode}>
          <div className="dashboard-toolbar">
            <div>
              <h2>
                {isDetail
                  ? 'มองลึกถึงความต่างของแต่ละกลุ่ม'
                  : isSb
                    ? 'คนไทยใช้เวลาเนือยนิ่งเท่าไร?'
                    : 'คนไทยมีกิจกรรมทางกายเพียงพอเท่าไร?'}
              </h2>
            </div>
            <button className="outline-button" onClick={exportData}>
              <Download size={16} /> ดาวน์โหลด CSV
            </button>
          </div>
          <div className="dashboard-filters">
            <Filter
              label="ปีที่ต้องการดู"
              value={year}
              onChange={setYear}
              options={[...years].reverse().map(String)}
            />
            <Filter
              label="เปรียบเทียบกับปี"
              value={compare}
              onChange={setCompare}
              options={[...years].reverse().map(String)}
            />
            <Filter
              label="ช่วงวัย"
              value={age}
              onChange={setAge}
              options={ageOptions}
            />
            <Filter
              label="เพศ"
              value={gender}
              onChange={setGender}
              options={['ทั้งหมด', 'ชาย', 'หญิง']}
            />
            {isDetail && (
              <>
                <Filter
                  label="ลักษณะพื้นที่"
                  value={area}
                  onChange={setArea}
                  options={['ทั้งหมด', ...details.areas]}
                />
                <Filter
                  label="จังหวัด"
                  value={province}
                  onChange={setProvince}
                  options={['ทั้งหมด', ...details.provinces]}
                />
              </>
            )}
            <button className="filter-reset" onClick={reset}>
              <RotateCcw size={15} /> คืนค่าเริ่มต้น
            </button>
          </div>
          <p className="sr-only" role="status">
            ปี {year} · {age} · {gender} · {format(current)}
            {isDetail
              ? ` · ${province} · ${area} · ${selected.count} คำตอบ`
              : ''}
          </p>
          <div className="stats-grid">
            <SummaryCard value={current} isSb={isSb} isDetail={isDetail} />
            <ChangeCard
              current={current}
              previous={previous}
              delta={delta}
              year={year}
              compare={compare}
              isSb={isSb}
              series={series}
            />
            <GenderCard data={genderComparison} isSb={isSb} year={year} />
            <SnapshotCard
              year={year}
              age={age}
              gender={gender}
              area={area}
              province={province}
              isDetail={isDetail}
              count={selected.count}
            />
            <section className="dashboard-chart-panel stats-card trend-card">
              <Tabs defaultValue="chart">
                <div className="chart-section-head">
                  <div>
                    <h3>แนวโน้มระหว่างปี 2555–2567</h3>
                    <p>
                      {isSb
                        ? 'เวลาเฉลี่ยต่อวัน · แกนตั้งแสดงชั่วโมง'
                        : isDetail
                          ? 'สัดส่วนผู้ตอบที่มีกิจกรรมทางกายเพียงพอ (%)'
                          : 'ประชากรที่มีกิจกรรมทางกายเพียงพอ (%)'}
                    </p>
                  </div>
                  <TabsList>
                    <TabsTrigger value="chart">กราฟ</TabsTrigger>
                    <TabsTrigger value="table">ตาราง</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="chart">
                  <figure
                    className="native-chart"
                    aria-label={`กราฟแนวโน้ม ${isSb ? 'พฤติกรรมเนือยนิ่ง' : 'กิจกรรมทางกาย'} เลือกดูค่ารายปีได้จากปุ่มใต้กราฟ`}
                  >
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                      minWidth={0}
                      initialDimension={{ width: 800, height: 300 }}
                    >
                      <AreaChart
                        data={series}
                        margin={{ top: 25, right: 25, left: 0, bottom: 10 }}
                        onClick={(state) => {
                          if (state.activeLabel)
                            setYear(String(state.activeLabel));
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="tpak-trend-fill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={color}
                              stopOpacity={0.18}
                            />
                            <stop
                              offset="100%"
                              stopColor={color}
                              stopOpacity={0.01}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          vertical={false}
                          stroke="#e5edf3"
                          strokeDasharray="3 5"
                        />
                        <XAxis
                          dataKey="year"
                          tick={{ fontSize: 12, fill: '#748498' }}
                          axisLine={false}
                          tickLine={false}
                          minTickGap={18}
                        />
                        <YAxis
                          domain={isSb ? [0, 1080] : [0, 100]}
                          tickFormatter={(v) => (isSb ? `${v / 60}` : `${v}%`)}
                          ticks={
                            isSb ? [0, 360, 720, 1080] : [0, 25, 50, 75, 100]
                          }
                          tick={{ fontSize: 12, fill: '#748498' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          formatter={(v) => [
                            format(v === undefined ? null : Number(v)),
                            isSb ? 'เวลาเฉลี่ยต่อวัน' : 'กิจกรรมทางกายเพียงพอ',
                          ]}
                          labelFormatter={(v) => `ปี ${v}`}
                          contentStyle={{
                            borderRadius: 14,
                            border: '1px solid #dde6ed',
                            fontFamily: 'inherit',
                          }}
                        />
                        <ReferenceLine
                          x={Number(year)}
                          stroke={color}
                          strokeDasharray="4 4"
                        />
                        <Area
                          type="linear"
                          dataKey="value"
                          fill="url(#tpak-trend-fill)"
                          stroke={color}
                          strokeWidth={3}
                          dot={{ r: 4, fill: 'white', strokeWidth: 2 }}
                          activeDot={{
                            r: 7,
                            fill: '#f59b48',
                            stroke: 'white',
                            strokeWidth: 3,
                          }}
                          connectNulls={false}
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </figure>
                  <div className="year-buttons" aria-label="เลือกปีจากกราฟ">
                    {series.map((r) => (
                      <button
                        key={r.year}
                        aria-pressed={Number(year) === r.year}
                        onClick={() => setYear(String(r.year))}
                        title={format(r.value)}
                      >
                        {r.year}
                      </button>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ปี พ.ศ.</TableHead>
                        {isDetail ? (
                          <>
                            <TableHead>กิจกรรมทางกายเพียงพอ</TableHead>
                            <TableHead>จำนวนคำตอบ</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead>รวม</TableHead>
                            <TableHead>ชาย</TableHead>
                            <TableHead>หญิง</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isDetail
                        ? series.map((r) => (
                            <TableRow
                              key={r.year}
                              className={
                                r.year === Number(year)
                                  ? 'selected-data-row'
                                  : ''
                              }
                            >
                              <TableCell>
                                <button onClick={() => setYear(String(r.year))}>
                                  {r.year}
                                </button>
                              </TableCell>
                              <TableCell>{format(r.value)}</TableCell>
                              <TableCell>
                                {summarize(
                                  rows.filter((x) => x[0] === r.year),
                                ).count.toLocaleString('th-TH')}
                              </TableCell>
                            </TableRow>
                          ))
                        : tableRows.map((r) => (
                            <TableRow
                              key={r.year}
                              className={
                                r.year === Number(year)
                                  ? 'selected-data-row'
                                  : ''
                              }
                            >
                              <TableCell>
                                <button onClick={() => setYear(String(r.year))}>
                                  {r.year}
                                </button>
                              </TableCell>
                              <TableCell>{format(r.all)}</TableCell>
                              <TableCell>{format(r.male)}</TableCell>
                              <TableCell>{format(r.female)}</TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                  {!isDetail && (
                    <p className="source-line">
                      ตารางแสดงทุกเพศของช่วงวัยที่เลือก เพื่อเปรียบเทียบกันได้ทันที
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </section>
            <AgeComparisonCard
              data={ageComparison}
              isSb={isSb}
              isDetail={isDetail}
              year={year}
              compare={compare}
            />
          </div>
          {isDetail && (
            <>
              <section className="duration-section">
                <div className="section-heading">
                  <span className="eyebrow">HOW WE MOVE</span>
                  <h3>กิจกรรมทางกายในชีวิตประจำวัน</h3>
                  <p>ระยะเวลาเฉลี่ย นาทีต่อสัปดาห์ · ตามกลุ่มที่เลือกในปี {year}</p>
                </div>
                <div className="duration-cards">
                  {['กิจกรรมทางกายรวม', 'การทำงาน', 'การเดินทาง', 'นันทนาการ'].map(
                    (label, i) => (
                      <div key={label}>
                        <span>{label}</span>
                        <strong>{number(selected.durations[i], 0)}</strong>
                        <small>นาที / สัปดาห์</small>
                      </div>
                    ),
                  )}
                </div>
              </section>
              {selected.count === 0 && (
                <div className="dashboard-empty">
                  <MapPin size={25} />
                  <h3>ไม่พบข้อมูลสำหรับตัวกรองชุดนี้</h3>
                  <p>ลองเปลี่ยนปี จังหวัด หรือคืนค่าตัวกรองเพื่อดูข้อมูลที่มี</p>
                  <button className="solid-button" onClick={reset}>
                    ดูข้อมูลทั้งหมด <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
          <div className="dashboard-explanation" id="data-method">
            <Info size={20} />
            <div>
              {isSb ? (
                <>
                  <p>
                    <strong>อ่านหน่วยเวลาได้ตรงกัน</strong> ต้นฉบับใช้รูปแบบชั่วโมง.นาที
                    เช่น 14.03 คือ 14 ชั่วโมง 3 นาที
                    กราฟนี้แปลงเป็นนาทีเพื่อให้แกนและการเปรียบเทียบถูกต้อง
                  </p>
                  <p>ไม่มีข้อมูลปี 2564 ในชุดสรุปต้นฉบับ จึงเว้นช่วงกราฟไว้</p>
                  <Link
                    href="/data-downloads/sedentary-overview-tpak.jpg"
                    target="_blank"
                  >
                    ดูภาพสรุปต้นฉบับ <ArrowUpRight size={14} />
                  </Link>
                </>
              ) : isDetail ? (
                <>
                  <p>
                    <strong>ข้อมูลของกลุ่มที่เลือก</strong> คำนวณร้อยละจากจำนวนคำตอบ
                    และคำนวณเวลาเฉลี่ยจากผลรวมกับจำนวนคำตอบที่มีข้อมูล
                    ตามวิธีของกราฟรายกลุ่มในต้นฉบับ
                  </p>
                  <p>
                    ข้อมูลภาพรวมและข้อมูลจากผู้ตอบอาจต่างกันจากการประมวลผลของรายงาน
                    ไม่ควรนำจำนวนผู้ตอบไปแทนจำนวนประชากรของจังหวัด
                  </p>
                </>
              ) : (
                <p>
                  <strong>กิจกรรมทางกายเพียงพอ</strong> ใช้ค่าร้อยละและการจำแนกช่วงวัยที่
                  TPAK เผยแพร่ในชุดสรุปสถานการณ์
                  เลือกเพศหรือช่วงวัยด้านบนเพื่อเปรียบเทียบแนวโน้มของแต่ละกลุ่ม
                </p>
              )}
            </div>
          </div>
          <div className="dashboard-sources">
            <span>
              ข้อมูลสาธารณะจาก TPAK · นำเข้า 9 กันยายน 2569 · ปีข้อมูลล่าสุด 2567
            </span>
            <Link
              href={`https://tpak.or.th/th/iframe/${isDetail ? 2 : isSb ? 14 : 15}`}
              target="_blank"
              rel="noreferrer"
            >
              ตรวจสอบแหล่งข้อมูล <ArrowUpRight size={14} />
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
