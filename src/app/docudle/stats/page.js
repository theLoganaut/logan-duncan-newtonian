import StatsView from './statsview';
import docudleData from '../../data/pythonDocs.json';

export default function StatsPage() {
  return <StatsView data={docudleData} />;
}