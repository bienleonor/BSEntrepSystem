import OverviewCard from "./OverviewCard";

const data = [

];

export default function OverviewSection() {
  return (
    <section className="mt-6">
      <h2 className="text-xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item) => (
          <OverviewCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
