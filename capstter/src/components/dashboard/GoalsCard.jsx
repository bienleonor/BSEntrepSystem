import Card from "../common/Card";

export default function GoalsCard() {
  return (
    <Card className="w-full">
      <h2 className="font-semibold text-gray-700 text-2xl">Goals</h2>
      <p className="text-lg font-bold">Php 5,000</p>
      <p className="text-sm text-gray-500">May, 2023</p>
      <div className="mt-3 text-sm">
        <p>Target Achieved: <span className="font-semibold">₱12,500</span></p>
        <p>This month Target: <span className="font-semibold">₱20,000</span></p>
      </div>
    </Card>
  );
}
