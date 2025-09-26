"use client";

export default function SalesBarChart({
  data,
}: {
  data: { hour: string; total: number }[];
}) {
  const max = Math.max(...data.map((d) => d.total)) || 1;

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg mt-6">
      <h2 className="font-semibold mb-4 text-base sm:text-lg">
        Omzet per Jam (Hari Ini)
      </h2>

      <div className="overflow-x-auto">
        <div className="flex items-end gap-2 h-48 min-w-[600px] sm:min-w-0">
          {data.map((d, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-end flex-1"
              style={{ minWidth: "2rem" }}
            >
              <div
                className="bg-green-500 w-full rounded-t transition-all duration-300"
                style={{
                  height: `${(d.total / max) * 100}%`,
                  maxHeight: "100%",
                }}
              />
              <span className="text-xs mt-1 text-center">{d.hour}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
