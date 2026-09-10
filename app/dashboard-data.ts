import overview from './generated/overview.json' with { type: 'json' };
import details from './generated/details.json' with { type: 'json' };
export { overview, details };
export const ageOptions = ['ทั้งหมด', ...details.ages.slice(0, 3)];
export const years = Array.from({ length: 13 }, (_, i) => 2555 + i);
export type DetailFilters = {
  gender: string;
  age: string;
  area: string;
  province: string;
};
export function filteredDetails(filters: DetailFilters) {
  return details.rows.filter(
    (r) =>
      (filters.gender === 'ทั้งหมด' ||
        details.genders[r[1]] === filters.gender) &&
      (filters.age === 'ทั้งหมด' || details.ages[r[2]] === filters.age) &&
      (filters.area === 'ทั้งหมด' || details.areas[r[3]] === filters.area) &&
      (filters.province === 'ทั้งหมด' ||
        details.provinces[r[4]] === filters.province),
  );
}
export function summarize(rows: number[][]) {
  let count = 0,
    enough = 0;
  const sums = [0, 0, 0, 0],
    counts = [0, 0, 0, 0];
  for (const r of rows) {
    count += r[6];
    if (r[5] === 1) enough += r[6];
    for (let i = 0; i < 4; i++) {
      sums[i] += r[7 + i * 2];
      counts[i] += r[8 + i * 2];
    }
  }
  return {
    count,
    enough,
    percent: count ? (enough / count) * 100 : null,
    durations: sums.map((v, i) => (counts[i] ? v / counts[i] : null)),
  };
}
export function displayTime(minutes: number) {
  return `${Math.floor(minutes / 60)} ชม. ${Math.round(minutes % 60)} นาที`;
}
export function csvText(rows: (string | number | null)[][]) {
  return (
    '\uFEFF' +
    rows
      .map((r) =>
        r
          .map((v) => '"' + String(v ?? '').replaceAll('"', '""') + '"')
          .join(','),
      )
      .join('\r\n')
  );
}
