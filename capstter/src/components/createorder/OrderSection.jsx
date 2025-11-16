import OrderCard from "./OrderCard";
import sisigbowl from "../../assets/sisigbowl.png";

const data = [
  { ProductImage: sisigbowl, ProductName: "Product 1", Price: "$10.00", Quantity: 1 },
  { ProductImage: "https://via.placeholder.com/150", ProductName: "Product 2", Price: "$20.00", Quantity: 2 },
  { ProductImage: "https://via.placeholder.com/150", ProductName: "Product 3", Price: "$30.00", Quantity: 3 },
  { ProductImage: "https://via.placeholder.com/150", ProductName: "Product 4", Price: "$40.00", Quantity: 4 },
  { ProductImage: "https://via.placeholder.com/150", ProductName: "Product 5", Price: "$50.00", Quantity: 5 },
  { ProductImage: "https://via.placeholder.com/150", ProductName: "Product 6", Price: "$60.00", Quantity: 6 },

];

export default function OrderSection() {
  return (
    <section className="mt-6">
      <h2 className="text-xl font-bold mb-4">Create Order</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item) => (
          <OrderCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
