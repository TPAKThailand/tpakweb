import TpakApp from './tpak-app';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : '';
  const topic = typeof params.topic === 'string' ? params.topic : 'ทั้งหมด';
  return <TpakApp page="home" initialQuery={query} initialTopic={topic} />;
}
