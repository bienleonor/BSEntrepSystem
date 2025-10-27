import Card from "../common/Card";

export default function OverviewCard({ title, amount, percent, color }) {
  return (
    <Card className={`w-full  ${color}`}>
      <div className="flex justify-between items-center">
        <p className="text-sm">{title}</p>
        <span className="text-xs">{percent}%</span>
      </div>
      <p className="text-lg font-bold">{amount}</p>
    </Card>
  );
}
