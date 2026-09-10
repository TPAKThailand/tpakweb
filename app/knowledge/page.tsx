import TpakApp from '../tpak-app';
import { useSearchParams } from '../../src/router';

export default function Page() {
  const params = useSearchParams();
  const query = params.get('q') ?? '';
  const topic = params.get('topic') ?? 'ทั้งหมด';
  return <TpakApp page="knowledge" initialQuery={query} initialTopic={topic} />;
}
