import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Plus, Trash } from "lucide-react";
import toast from "react-hot-toast";

export default function RecipeBuilder({ productType, onRecipeChange }) {
  const [ingredients, setIngredients] = useState([]);
  const [products, setProducts] = useState([]);
  const businessId = localStorage.getItem('selectedBusinessId');

  // Fetch products that can be used as ingredients
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await axiosInstance.get(`/inventory/businesses/${businessId}/products/`);
        setProducts(res.data);
      } catch (err) {
        toast.error("Failed to load ingredients list");
      }
    }
    loadProducts();
  }, []);

  const addIngredient = () => {
    setIngredients([...ingredients, { product_id: "", qty: "" }]);
  };

  const removeIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
    onRecipeChange(updated);
  };

  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
    onRecipeChange(updated);
  };

  // Render nothing if product type does not support recipes
  if (productType === "Simple") return null;

  return (
    <div className="mt-6 p-4 bg-white  shadow rounded-xl w-full text-center items-center">
      <h3 className="text-xl font-semibold mb-5">
        {productType === "Recipe" ? "Recipe Ingredients" : "Composite Contents"}
      </h3>

      <div >
        {ingredients.map((ing, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-2 rounded-lg"
          >
            <select
              value={ing.product_id}
              onChange={(e) => updateIngredient(index, "product_id", e.target.value)}
              className="col-span-6 p-2 rounded border"
            >
              <option value="">Select Item</option>
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={ing.qty}
              onChange={(e) => updateIngredient(index, "qty", e.target.value)}
              placeholder="Qty"
              className="col-span-4 p-2 border rounded"
            />

            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="col-span-2 p-2 bg-red-500 text-white rounded"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addIngredient}
        className="mt-5 m-auto flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        <Plus size={18} />
        Add Ingredient
      </button>
    </div>
  );
}
