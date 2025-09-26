"use client";

export default function SalesBarChart({
  data,
}: {
  data: { hour: string; total: number }[];
}) {
  const max = Math.max(...data.map((d) => d.total)) || 1;

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg mt-6">
      <h2 className="font-semibold mb-2">Omzet per Jam (Hari Ini)</h2>
      <div className="flex items-end gap-1 h-48">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="bg-green-500 w-3 rounded-t"
              style={{ height: `${(d.total / max) * 100}%` }}
            />
            <span className="text-xs mt-1">{d.hour}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
