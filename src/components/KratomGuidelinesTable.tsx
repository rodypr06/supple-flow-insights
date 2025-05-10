import { supplementGuidelines } from '@/lib/supplement-guidelines';

export function KratomGuidelinesTable() {
  const { guidelines, capsuleSize } = supplementGuidelines.kratom;
  return (
    <div className="mt-4">
      <div className="text-lg font-semibold mb-2 flex items-center gap-2">
        <span role="img" aria-label="brain">🧠</span>
        Rody's Personalized Capsule Guidance ({capsuleSize} mg each)
      </div>
      <table className="w-full text-sm border-separate border-spacing-y-1">
        <thead>
          <tr>
            <th className="text-left font-medium">Category</th>
            <th className="text-left font-medium">Value</th>
          </tr>
        </thead>
        <tbody>
          {guidelines.map((row, idx) => (
            <tr key={idx}>
              <td className="py-1 pr-4">{row.category}</td>
              <td className="py-1">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 