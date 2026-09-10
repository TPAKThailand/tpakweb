import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterResources, resources, paSeries } from '../app/content.ts';

test('Thai search combines keywords with topic and content type', () => {
  assert.deepEqual(
    filterResources('เดิน', 'วัยทำงาน', 'เครื่องมือ').map((r) => r.id),
    [783],
  );
  assert.deepEqual(
    filterResources('  gPaQ  ', 'ทั้งหมด', 'เครื่องมือ').map((r) => r.id),
    [805],
  );
  assert.deepEqual(
    filterResources('วิจัย กิจกรรม', 'ทั้งหมด', 'รายงานวิจัย').map((r) => r.id),
    [876, 837, 819],
  );
});
test('Empty, incompatible, and unknown searches behave predictably', () => {
  assert.equal(filterResources('', 'ทั้งหมด', 'ทั้งหมด').length, resources.length);
  assert.equal(filterResources('GPAQ', 'วัยทำงาน', 'ทั้งหมด').length, 0);
  assert.equal(
    filterResources('<script>alert(1)</script>', 'ทั้งหมด', 'ทั้งหมด').length,
    0,
  );
  assert.equal(filterResources('คำที่ไม่มีในเนื้อหา', 'ทั้งหมด', 'ทั้งหมด').length, 0);
});
test('Every displayed audience has relevant content', () => {
  for (const topic of [
    'กิจกรรมทางกาย',
    'เด็กและเยาวชน',
    'วัยทำงาน',
    'ผู้สูงอายุ',
    'เมืองสุขภาวะ',
  ])
    assert.ok(filterResources('', topic, 'ทั้งหมด').length > 0, topic);
});
test('Published dataset contains finite percentages and unique years', () => {
  assert.equal(new Set(paSeries.map((d) => d.year)).size, paSeries.length);
  assert.ok(
    paSeries.every(
      (d) => Number.isFinite(d.value) && d.value >= 0 && d.value <= 100,
    ),
  );
  assert.equal(
    +(paSeries.at(-1).value - paSeries.at(-2).value).toFixed(1),
    0.8,
  );
  assert.ok(
    resources.every((r) => new URL(r.url).hostname.endsWith('tpak.or.th')),
  );
});
