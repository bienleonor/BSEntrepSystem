import Card from "../common/Card";
import { CirclePlus, CircleMinus } from "lucide-react";

export default function OrderCard({ ProductImage, ProductName, Price, Quantity }) {
    return (
        <Card className="w-full">
            <img src={ProductImage} alt={ProductName} className="w-full h-48 object-cover rounded-md mb-4" />
            <h2 className="font-semibold text-gray-700">{ProductName}</h2>
            <p className="text-lg font-bold">{Price}</p>
            <div className="flex gap-2 items-center">
                <CirclePlus />
                <p className="text-sm text-gray-500 font-semibold">{Quantity}</p>
                <CircleMinus />
            </div>
        </Card>
    );
}
