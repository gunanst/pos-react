export default function DashboardCard({
    title,
    value,
    color,
}: {
    title: string;
    value: string | number;
    color: string;
}) {
    return (
        <div
            className={`p-4 rounded-lg shadow-lg hover:shadow-xl transition ${color}`}
        >
            <p className="text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}
