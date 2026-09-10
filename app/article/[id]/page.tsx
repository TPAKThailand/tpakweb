import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowUpRight, ArrowLeft, Clock, UserRound } from 'lucide-react';
import { Header, Footer } from '../../site-shell';
import Link from '../../site-link';
import articles from '../../generated/articles.json';
import bodies from '../../generated/article-bodies.json';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = articles.find((a) => String(a.id) === id);
  return {
    title: a ? a.title : 'ไม่พบบทความ',
    description: a?.summary,
  };
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = articles.find((a) => String(a.id) === id);
  if (!article) notFound();
  const related = articles
    .filter((a) => a.id !== article.id && a.topic === article.topic)
    .slice(0, 3);
  return (
    <>
      <Header page="knowledge" />
      <main id="main" className="article-page">
        <div className="page-width">
          <div className="breadcrumb">
            <Link href="/knowledge">
              <ArrowLeft size={15} /> คลังองค์ความรู้
            </Link>
            <span>/</span>
            {article.type}
          </div>
          <header className="article-header">
            <Link
              className="card-topic"
              href={`/knowledge?topic=${encodeURIComponent(article.topic)}`}
            >
              {article.topic}
            </Link>
            <h1>{article.title}</h1>
            <div className="article-meta">
              <span>{article.date}</span>
              <span>
                <UserRound size={15} />
                {article.author}
              </span>
              <span>
                <Clock size={15} /> อ่านประมาณ {article.readingMinutes} นาที
              </span>
            </div>
          </header>
          {article.image && (
            <Image
              className="article-cover"
              src={article.image}
              alt={article.title}
              width={1400}
              height={800}
              unoptimized
              priority
            />
          )}
        </div>
        <div
          className="article-body"
          dangerouslySetInnerHTML={{
            __html: (bodies as Record<string, string>)[id],
          }}
        />
        <div className="article-after">
          <div className="article-tags">
            {article.tags.map((t) => (
              <Link key={t} href={`/knowledge?q=${encodeURIComponent(t)}`}>
                #{t}
              </Link>
            ))}
          </div>
          <p>ผู้เผยแพร่: ศูนย์พัฒนาองค์ความรู้ด้านกิจกรรมทางกายประเทศไทย (TPAK)</p>
          <Link
            className="text-link"
            href={article.url}
            target="_blank"
            rel="noreferrer"
          >
            อ่านและตรวจสอบจากต้นฉบับ <ArrowUpRight size={16} />
          </Link>
          <Link className="outline-button" href="/knowledge">
            <ArrowLeft size={16} /> กลับคลังองค์ความรู้
          </Link>
        </div>
        {related.length > 0 && (
          <section className="page-width related-section">
            <span className="eyebrow">KEEP EXPLORING</span>
            <h2>อ่านต่อในเรื่องที่คุณสนใจ</h2>
            <div className="related-grid">
              {related.map((a) => (
                <Link href={`/article/${a.id}`} key={a.id}>
                  {a.image && (
                    <Image
                      src={a.image}
                      alt=""
                      width={500}
                      height={300}
                      unoptimized
                      loading="lazy"
                    />
                  )}
                  <div>
                    <span className="card-topic">{a.topic}</span>
                    <h3>{a.title}</h3>
                    <span className="text-link">
                      อ่านต่อ <ArrowUpRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
