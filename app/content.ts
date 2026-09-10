import importedArticles from './generated/articles.json' with { type: 'json' };
export type Resource = {
  id: number;
  title: string;
  type: string;
  topic: string;
  year: number;
  image?: string;
  color?: string;
  eyebrow?: string;
  summary: string;
  url: string;
  keywords: string;
  date?: string;
  dateISO?: string;
  author?: string;
  tags?: string[];
  readingMinutes?: number;
};
export const reportUrl =
  'https://tpak.or.th/backend/print_media_file/876/12_years_PA-2..pdf';
const curatedResources: Resource[] = [
  {
    id: 860,
    title: 'บทบาทของกิจกรรมทางกายในการสร้างสังคมคาร์บอนต่ำ',
    type: 'บทความ',
    topic: 'เมืองสุขภาวะ',
    year: 2567,
    image: '/article-860.jpg',
    summary:
      'สำรวจความเชื่อมโยงระหว่างกิจกรรมทางกาย การเดินทาง และแนวคิดสังคมคาร์บอนต่ำ ผ่านบทความจาก TPAK',
    url: 'https://tpak.or.th/th/article/860',
    keywords: 'สิ่งแวดล้อม เดิน ปั่นจักรยาน carbon เมืองสุขภาวะ',
  },
  {
    id: 876,
    title: '12 ปี กิจกรรมทางกายคนไทย บอกอะไรกับเรา',
    type: 'รายงานวิจัย',
    topic: 'สถานการณ์คนไทย',
    year: 2566,
    color: 'blue',
    eyebrow: '12 YEARS OF MOVEMENT',
    summary:
      'รายงานสถานการณ์กิจกรรมทางกายคนไทยกับความเป็นไปในรอบ 12 ปี รวบรวมข้อมูลระหว่าง พ.ศ. 2555–2566 เพื่อทำความเข้าใจการเปลี่ยนแปลงระยะยาว ปีที่แสดงเป็นปีสิ้นสุดของชุดข้อมูล',
    url: reportUrl,
    keywords: 'สถิติ ข้อมูล วิจัย รายงาน กิจกรรมทางกาย 2566 68.1 dashboard',
  },
  {
    id: 783,
    title: 'WalkShop: เครื่องมือส่งเสริมการจัด Healthy Active Meeting',
    type: 'เครื่องมือ',
    topic: 'วัยทำงาน',
    year: 2566,
    image: '/article-783.jpg',
    summary:
      'รู้จัก WalkShop ผ่านบทความแนะนำเครื่องมือสำหรับการจัดประชุมที่เปิดโอกาสให้ผู้เข้าร่วมได้ขยับร่างกาย',
    url: 'https://tpak.or.th/th/article/783',
    keywords: 'ประชุม เดิน ออฟฟิศ office เนือยนิ่ง',
  },
  {
    id: 821,
    title: 'เมื่อ PM2.5 ปกคลุมทั่วพื้นที่ เรายังขยับได้อย่างไร',
    type: 'บทความ',
    topic: 'กิจกรรมทางกาย',
    year: 2567,
    image: '/article-821.jpg',
    summary:
      'ชวนทำความเข้าใจว่าฝุ่น PM2.5 เกี่ยวข้องกับกิจกรรมทางกายอย่างไร พร้อมเชื่อมต่อบทความและแหล่งอ้างอิงต้นฉบับสำหรับอ่านรายละเอียด',
    url: 'https://tpak.or.th/th/article/821',
    keywords: 'ฝุ่น pm2.5 สิ่งแวดล้อม ออกกำลังกาย สุขภาพ',
  },
  {
    id: 805,
    title: 'GPAQ แบบสอบถามกิจกรรมทางกายระดับสากล',
    type: 'เครื่องมือ',
    topic: 'กิจกรรมทางกาย',
    year: 2567,
    color: 'orange',
    eyebrow: 'TOOLKIT FOR RESEARCH',
    summary:
      'เข้าถึง Global Physical Activity Questionnaire (GPAQ) จากหน้าเครื่องมือของ TPAK สำหรับศึกษาแนวทางการเก็บและวิเคราะห์ข้อมูลกิจกรรมทางกาย',
    url: 'https://tpak.or.th/th/article/805',
    keywords: 'แบบประเมิน แบบสอบถาม gpaq เครื่องมือ นักวิจัย',
  },
  {
    id: 837,
    title:
      'Life course determinants and age-sex-specific physical inactivity rate',
    type: 'รายงานวิจัย',
    topic: 'ทุกช่วงวัย',
    year: 2567,
    image: '/article-837.jpg',
    summary:
      'บทความวิจัยว่าด้วยปัจจัยตลอดช่วงชีวิต และการขาดกิจกรรมทางกายเมื่อพิจารณาตามอายุและเพศ อ่านบทความต้นฉบับและรายละเอียดการศึกษาจาก TPAK',
    url: 'https://tpak.or.th/th/article/837',
    keywords: 'เด็กและเยาวชน ผู้สูงอายุ วัยทำงาน อายุ เพศ research',
  },
  {
    id: 819,
    title: 'เข้าใจปัจจัยที่สัมพันธ์กับกิจกรรมทางกาย ผ่านงานวิจัย',
    type: 'รายงานวิจัย',
    topic: 'กิจกรรมทางกาย',
    year: 2567,
    image: '/article-819.jpg',
    summary:
      'Logistic regression odds ratios of independent variables on Physical Activity: เข้าถึงผลงานการวิเคราะห์ปัจจัยที่เกี่ยวข้องจากบทความต้นฉบับ',
    url: 'https://tpak.or.th/th/article/819',
    keywords: 'สถิติ วิเคราะห์ ข้อมูล regression',
  },
  {
    id: 499,
    title: 'ต่างช่วงวัย ต่างอุปสรรคในการขยับร่างกาย',
    type: 'บทความ',
    topic: 'ทุกช่วงวัย',
    year: 2565,
    color: 'sky',
    eyebrow: 'MOVEMENT FOR EVERYONE',
    summary:
      'อุปสรรคในการมีกิจกรรมทางกายแตกต่างกันตามช่วงวัย บทความนี้ชวนทำความเข้าใจทั้งแรงจูงใจ เวลา และข้อจำกัดด้านสุขภาพ',
    url: 'https://www.tpak.or.th/th/article/499',
    keywords: 'เด็กและเยาวชน ผู้สูงอายุ วัยทำงาน สุขภาพ แรงจูงใจ',
  },
];
export const resources: Resource[] = [
  ...importedArticles,
  ...curatedResources.filter(
    (r) => !importedArticles.some((a) => a.id === r.id),
  ),
];
// National figures published by TPAK. Never extrapolate missing years or breakdowns.
export const paSeries = [
  { year: 2563, value: 54.3 },
  { year: 2564, value: 63.0 },
  { year: 2565, value: 62.0 },
  { year: 2566, value: 68.1 },
  { year: 2567, value: 68.9 },
];
export function filterResources(query: string, topic: string, type: string) {
  const words = query
    .toLocaleLowerCase('th')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return resources.filter((item) => {
    const text =
      `${item.title} ${item.summary} ${item.keywords} ${item.type} ${item.topic}`.toLocaleLowerCase(
        'th',
      );
    return (
      words.every((word) => text.includes(word)) &&
      (topic === 'ทั้งหมด' ||
        item.topic === topic ||
        item.keywords.includes(topic)) &&
      (type === 'ทั้งหมด' || item.type === type)
    );
  });
}
