import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  overview,
  details,
  filteredDetails,
  summarize,
  displayTime,
  csvText,
} from '../app/dashboard-data.ts';
import originalYearTotals from './fixtures/year-totals.json' with { type: 'json' };
import articles from '../app/generated/articles.json' with { type: 'json' };
import bodies from '../app/generated/article-bodies.json' with { type: 'json' };
const all = { gender: 'ทั้งหมด', age: 'ทั้งหมด', area: 'ทั้งหมด', province: 'ทั้งหมด' };

test('Imported groups reproduce independently queried original totals and means', () => {
  for (const y of new Set(originalYearTotals.map((r) => r.Year))) {
    const source = originalYearTotals.filter((r) => r.Year === y);
    const result = summarize(filteredDetails(all).filter((r) => r[0] === y));
    const count = source.reduce((s, r) => s + r['5_MVPA_Enough_ok'], 0);
    assert.equal(result.count, count, `sample count ${y}`);
    assert.equal(
      result.enough,
      source
        .filter((r) => r.MVPA_Enough_ok === 'เพียงพอ')
        .reduce((s, r) => s + r['5_MVPA_Enough_ok'], 0),
    );
    for (const [i, k] of [
      'MVPA_Dura',
      'WR_Dura',
      'TRAN_Dura',
      'RE_Dura',
    ].entries()) {
      const sum = source.reduce((s, r) => s + Number(r['0_' + k] || 0), 0);
      const n = source.reduce((s, r) => s + Number(r['5_' + k] || 0), 0);
      if (n === 0) assert.equal(result.durations[i], null, `${k} ${y}`);
      else
        assert.ok(Math.abs(result.durations[i] - sum / n) < 1e-6, `${k} ${y}`);
    }
  }
});
test('Combined filters, empty groups and denominator handling stay correct', () => {
  const f = {
    gender: 'หญิง',
    age: 'วัยทำงาน (18–59 ปี)',
    area: 'เมือง',
    province: 'กรุงเทพมหานคร',
  };
  const rows = filteredDetails(f);
  assert.ok(rows.length > 0);
  assert.ok(
    rows.every(
      (r) =>
        details.genders[r[1]] === f.gender &&
        details.ages[r[2]] === f.age &&
        details.areas[r[3]] === f.area &&
        details.provinces[r[4]] === f.province,
    ),
  );
  assert.deepEqual(summarize([]), {
    count: 0,
    enough: 0,
    percent: null,
    durations: [null, null, null, null],
  });
  assert.equal(filteredDetails({ ...all, province: 'ไม่มีจังหวัดนี้' }).length, 0);
});
test('Sedentary units match the source poster and the missing year is kept missing', () => {
  const r = overview.find(
    (r) =>
      r.metric === 'sb' &&
      r.year === 2567 &&
      r.gender === 'ทั้งหมด' &&
      r.age === 'ทั้งหมด',
  );
  assert.equal(r.value, 843);
  assert.equal(displayTime(r.value), '14 ชม. 3 นาที');
  assert.equal(
    overview.filter((r) => r.metric === 'sb' && r.year === 2564).length,
    0,
  );
  assert.equal(
    overview.find(
      (r) =>
        r.metric === 'pa' &&
        r.year === 2567 &&
        r.gender === 'ทั้งหมด' &&
        r.age === 'ทั้งหมด',
    ).value,
    68.9,
  );
});
test('CSV preserves Thai text, embedded delimiters, quotes and missing values', () => {
  assert.equal(
    csvText([
      ['จังหวัด', 'ค่า'],
      ['กรุงเทพฯ, เมือง', null],
      ['คำว่า "เดิน"', 0],
    ]),
    '\uFEFF"จังหวัด","ค่า"\r\n"กรุงเทพฯ, เมือง",""\r\n"คำว่า ""เดิน""","0"',
  );
});
test('Every imported article has a complete sanitized body and local image assets', () => {
  assert.equal(articles.length, 86);
  assert.equal(Object.keys(bodies).length, 86);
  for (const a of articles) {
    const body = bodies[a.id];
    assert.ok(body.length > 100 && a.title && a.author && a.dateISO);
    assert.doesNotMatch(body, /<(?:script|iframe|style)\b|\bon\w+\s*=/i);
    for (const [, src] of body.matchAll(/src="([^"]+)"/g))
      assert.ok(
        existsSync(new URL('../public' + src, import.meta.url)),
        `${a.id}: ${src}`,
      );
  }
  assert.match(bodies['805'], /Download GPAQ Thaiversion IPSR/);
  assert.match(bodies['805'], /ไฟล์ประกอบบทความ/);
  assert.ok(
    !readFileSync(
      new URL('../app/native-dashboard.tsx', import.meta.url),
      'utf8',
    ).includes('<iframe'),
  );
});
