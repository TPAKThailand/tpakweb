'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Users,
} from 'lucide-react';
import { displayTime } from './dashboard-data';

export const chartBlue = '#1677d2';
export const chartOrange = '#f59b48';
export function metricText(value: number | null, isSb = false) {
  if (value === null) return 'ไม่มีข้อมูล';
  return isSb ? displayTime(value) : `${value.toFixed(1)}%`;
}
const numeric = (n: number) =>
  n.toLocaleString('th-TH', { maximumFractionDigits: 1 });

export function SummaryCard({
  value,
  isSb,
  isDetail,
}: {
  value: number | null;
  isSb: boolean;
  isDetail: boolean;
}) {
  const percent =
    value === null
      ? 0
      : Math.max(0, Math.min(100, isSb ? (value / 1440) * 100 : value));
  return (
    <section className="stats-card ring-card">
      <div className="stats-card-heading">
        <h3>{isSb ? 'เวลาเนือยนิ่งเฉลี่ย' : 'กิจกรรมทางกายเพียงพอ'}</h3>
        <Activity size={17} />
      </div>
      <div className="metric-ring">
        <svg viewBox="0 0 180 180" aria-hidden="true">
          <circle
            cx="90"
            cy="90"
            r="72"
            fill="none"
            stroke={value === null ? '#edf2f8' : '#ffd9b6'}
            strokeWidth="12"
          />
          <circle
            cx="90"
            cy="90"
            r="72"
            fill="none"
            stroke={chartBlue}
            strokeWidth="12"
            pathLength="100"
            strokeDasharray={`${percent} 100`}
            strokeLinecap={percent > 0 ? 'round' : 'butt'}
            transform="rotate(-90 90 90)"
          />
        </svg>
        <div className={isSb ? 'ring-value time-value' : 'ring-value'}>
          <strong>
            {value === null
              ? '—'
              : isSb
                ? `${Math.floor(value / 60)}`
                : value.toFixed(1)}
            <small>{isSb ? 'ชม.' : '%'}</small>
          </strong>
          <span>
            {value === null
              ? 'ไม่มีข้อมูลในปีนี้'
              : isSb
                ? `${Math.round(value % 60)} นาที / วัน`
                : isDetail
                  ? 'ของผู้ตอบในกลุ่มที่เลือก'
                  : 'ของประชากรที่เลือก'}
          </span>
        </div>
      </div>
      <div className="ring-legend">
        <span>
          <i />
          {isSb ? 'เวลาเนือยนิ่ง' : 'เพียงพอ'}
        </span>
        <span>
          <i className="orange" />
          {isSb
            ? 'เวลาอื่นใน 24 ชม.'
            : `ไม่เพียงพอ${value === null ? '' : ` ${(100 - value).toFixed(1)}%`}`}
        </span>
      </div>
    </section>
  );
}

export function ChangeCard({
  current,
  previous,
  delta,
  year,
  compare,
  isSb,
  series,
}: {
  current: number | null;
  previous: number | null;
  delta: number | null;
  year: string;
  compare: string;
  isSb: boolean;
  series: { year: number; value: number | null }[];
}) {
  const recent = series.filter((r) => r.year <= Number(year)).slice(-5);
  return (
    <section className="stats-card change-card">
      <div className="stats-card-heading">
        <h3>ความเปลี่ยนแปลง</h3>
        {delta !== null && delta < 0 ? (
          <ArrowDownRight size={19} />
        ) : (
          <ArrowUpRight size={19} />
        )}
      </div>
      <div className="change-value">
        <strong>
          {delta === null
            ? '—'
            : `${delta > 0 ? '+' : delta < 0 ? '−' : ''}${numeric(Math.abs(delta))}`}
        </strong>
        <span>{isSb ? 'นาทีต่อวัน' : 'จุดเปอร์เซ็นต์'}</span>
      </div>
      <p className="stats-caption">
        ปี {year} เทียบกับปี {compare}
      </p>
      <div
        className="sparkline"
        role="img"
        aria-label={`แนวโน้ม ${recent[0]?.year}–${year}`}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          initialDimension={{ width: 260, height: 76 }}
        >
          <AreaChart
            data={recent}
            margin={{ top: 10, right: 7, left: 7, bottom: 4 }}
          >
            <Area
              dataKey="value"
              type="linear"
              stroke={chartBlue}
              strokeWidth={2}
              fill="#edf5ff"
              dot={{ r: 3, fill: chartOrange, stroke: 'white', strokeWidth: 2 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="comparison-pair">
        <span>
          {compare}
          <b>{metricText(previous, isSb)}</b>
        </span>
        <span>
          {year}
          <b>{metricText(current, isSb)}</b>
        </span>
      </div>
      {delta === null && <p className="stats-caption">ไม่มีข้อมูลครบทั้งสองปี</p>}
    </section>
  );
}

export function GenderCard({
  data,
  isSb,
  year,
}: {
  data: { label: string; value: number | null }[];
  isSb: boolean;
  year: string;
}) {
  return (
    <section className="stats-card gender-card">
      <div className="stats-card-heading">
        <h3>เปรียบเทียบชาย–หญิง</h3>
        <Users size={18} />
      </div>
      <p className="stats-caption">ปี {year} · ตามช่วงวัยที่เลือก</p>
      <div className="gender-bars">
        {data.map((row, i) => (
          <div key={row.label}>
            <div className="bar-label">
              <span>{row.label}</span>
              <strong>{metricText(row.value, isSb)}</strong>
            </div>
            <div className="bar-track">
              <span
                style={{
                  width: `${row.value === null ? 0 : (row.value / (isSb ? 1440 : 100)) * 100}%`,
                  background: i === 0 ? chartBlue : chartOrange,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="stats-caption gender-note">
        {isSb ? 'เวลาเฉลี่ยต่อวัน · สเกล 0–24 ชั่วโมง' : 'สัดส่วนที่มีกิจกรรมทางกายเพียงพอ'}
      </p>
    </section>
  );
}

export function SnapshotCard({
  year,
  age,
  gender,
  area,
  province,
  isDetail,
  count,
}: {
  year: string;
  age: string;
  gender: string;
  area: string;
  province: string;
  isDetail: boolean;
  count: number;
}) {
  return (
    <aside className="stats-card snapshot-card">
      <div className="stats-card-heading">
        <h3>ข้อมูลที่กำลังดู</h3>
        <CalendarDays size={19} />
      </div>
      <div className="snapshot-year">
        <span>พ.ศ.</span>
        <strong>{year}</strong>
        <span className="snapshot-badge">
          {year === '2567' ? 'ปีข้อมูลล่าสุด' : 'ข้อมูลย้อนหลัง'}
        </span>
      </div>
      <dl>
        <div>
          <dt>ช่วงวัย</dt>
          <dd>{age === 'ทั้งหมด' ? 'ทุกช่วงวัย' : age}</dd>
        </div>
        <div>
          <dt>เพศ</dt>
          <dd>{gender === 'ทั้งหมด' ? 'ทุกเพศ' : gender}</dd>
        </div>
        {isDetail && (
          <>
            <div>
              <dt>พื้นที่</dt>
              <dd>{area === 'ทั้งหมด' ? 'ทุกพื้นที่' : area}</dd>
            </div>
            <div>
              <dt>จังหวัด</dt>
              <dd>{province === 'ทั้งหมด' ? 'ทุกจังหวัด' : province}</dd>
            </div>
          </>
        )}
      </dl>
      {isDetail ? (
        <div className="snapshot-note">
          <strong>{count.toLocaleString('th-TH')}</strong>
          <span>คำตอบในกลุ่มที่เลือก</span>
          <p>จำนวนคำตอบจากการสำรวจ ไม่ใช่จำนวนประชากร</p>
        </div>
      ) : (
        <div className="snapshot-note">
          <span className="eyebrow">TPAK DATA</span>
          <p>
            สำรวจแนวโน้มย้อนหลัง
            <br />
            พ.ศ. 2555–2567
          </p>
          <span>เลือกปีจากกราฟเพื่อดูรายละเอียด</span>
        </div>
      )}
      <a href="#data-method" className="snapshot-link">
        วิธีอ่านข้อมูล <ArrowDownRight size={16} />
      </a>
    </aside>
  );
}

export function AgeComparisonCard({
  data,
  isSb,
  isDetail,
  year,
  compare,
}: {
  data: { label: string; current: number | null; previous: number | null }[];
  isSb: boolean;
  isDetail: boolean;
  year: string;
  compare: string;
}) {
  return (
    <section className="stats-card age-chart-card">
      <div className="stats-card-heading">
        <h3>เปรียบเทียบช่วงวัย</h3>
        <Users size={18} />
      </div>
      <p className="stats-caption">
        ทุกช่วงวัย · ตามเพศ{isDetail ? 'และพื้นที่' : ''}ที่เลือก
      </p>
      <div className="chart-key">
        <span>
          <i />
          {year}
        </span>
        <span>
          <i className="orange" />
          {compare}
        </span>
      </div>
      <figure
        className="age-native-chart"
        aria-label={`เปรียบเทียบทุกช่วงวัย ปี ${year} และ ${compare}`}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          initialDimension={{ width: 330, height: 225 }}
        >
          <BarChart
            data={data}
            margin={{ top: 12, right: 0, left: -24, bottom: 0 }}
            barGap={5}
          >
            <CartesianGrid vertical={false} stroke="#eaf0f6" />
            <XAxis
              dataKey="label"
              interval={0}
              tickFormatter={(label) =>
                ({
                  เด็กและเยาวชน: '5–17 ปี',
                  วัยทำงาน: '18–59 ปี',
                  ผู้สูงอายุ: '60+ ปี',
                })[label as string] ?? label
              }
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#5d7188' }}
            />
            <YAxis
              domain={isSb ? [0, 1440] : [0, 100]}
              ticks={isSb ? [0, 480, 960, 1440] : [0, 25, 50, 75, 100]}
              tickFormatter={(v) => (isSb ? `${v / 60}` : `${v}`)}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#8291a4' }}
            />
            <Tooltip
              formatter={(v, name) => [
                metricText(v === undefined ? null : Number(v), isSb),
                `ปี ${name === 'current' ? year : compare}`,
              ]}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e4ebf2',
                fontFamily: 'inherit',
              }}
            />
            <Bar
              dataKey="current"
              fill={chartBlue}
              radius={[5, 5, 0, 0]}
              maxBarSize={22}
              isAnimationActive={false}
            />
            <Bar
              dataKey="previous"
              fill={chartOrange}
              radius={[5, 5, 0, 0]}
              maxBarSize={22}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </figure>
      <p className="stats-caption">หน่วย: {isSb ? 'ชั่วโมงต่อวัน' : 'ร้อยละ'}</p>
      <div className="age-values">
        {data.map((r) => (
          <div key={r.label}>
            <span>{r.label}</span>
            <strong>{metricText(r.current, isSb)}</strong>
            <span className="age-previous">
              {compare}: {metricText(r.previous, isSb)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
