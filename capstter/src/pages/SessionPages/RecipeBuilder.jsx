import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Plus, Trash } from "lucide-react";
import toast from "react-hot-toast";

export default function RecipeBuilder({ productType, onRecipeChange, initialRecipe }) {
  const [ingredients, setIngredients] = useState([]);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const businessId = localStorage.getItem("selectedBusinessId");

  // Fetch products for ingredients
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await axiosInstance.get(`/inventory/businesses/${businessId}/products`);
        setProducts(res.data);
      } catch (err) {
        toast.error("Failed to load ingredients list");
      }
    }
    loadProducts();
  }, [businessId]);

  // Fetch units
  useEffect(() => {
    async function loadUnits() {
      try {
        const res = await axiosInstance.get("/inventory/units");
        setUnits(res.data);
      } catch {
        toast.error("Failed to load units");
      }
    }
    loadUnits();
  }, []);

  const addIngredientRow = () => {
    const newIng = { product_id: "", qty: "", unit_id: null };
    setIngredients([...ingredients, newIng]);
    onRecipeChange([...ingredients, newIng]);
  };

  const removeIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
    onRecipeChange(updated);
  };

  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value ?? null; // always default null
    setIngredients(updated);
    onRecipeChange(updated);
  };

  // Normalize initialRecipe into internal state ONLY when it actually changes.
  // Avoid calling onRecipeChange here to prevent parent-child update loops.
  useEffect(() => {
    if (!Array.isArray(initialRecipe)) return;
    const normalized = initialRecipe.map((ing) => ({
      product_id: String(ing.ingredient_product_id ?? ing.product_id ?? ""),
      qty: String(ing.consumption_amount ?? ing.qty ?? ""),
      unit_id: ing.unit_id ?? null,
    }));
    // Shallow equality check to avoid unnecessary state updates
    const same =
      normalized.length === ingredients.length &&
      normalized.every((n, i) =>
        n.product_id === ingredients[i].product_id &&
        n.qty === ingredients[i].qty &&
        n.unit_id === ingredients[i].unit_id
      );
    if (!same) {
      setIngredients(normalized);
    }
  }, [initialRecipe]);

  if (!productType || productType.toLowerCase() === "simple") return null;

  return (
    <div className="mt-6 p-4 bg-white shadow rounded-xl w-full text-center">
      <h3 className="text-xl font-semibold mb-5">
        {productType.toLowerCase() === "recipe" ? "Recipe Ingredients" : "Composite Contents"}
      </h3>

      <div>
        {ingredients.map((ing, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-2 rounded-lg"
          >
            {/* Product select */}
            <select
              value={ing.product_id}
              onChange={(e) => updateIngredient(index, "product_id", e.target.value)}
              className="col-span-4 p-2 rounded border"
            >
              <option value="">Select Item</option>
              {products.map((p) => (
                <option key={p.product_id} value={String(p.product_id)}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Quantity input */}
            <input
              type="number"
              min="1"
              value={ing.qty}
              onChange={(e) => updateIngredient(index, "qty", e.target.value)}
              placeholder="Qty"
              className="col-span-3 p-2 border rounded"
            />

            {/* Unit select */}
            <select
              value={ing.unit_id ?? ""}
              onChange={(e) => updateIngredient(index, "unit_id", e.target.value || null)}
              className="col-span-3 p-2 rounded border"
            >
              <option value="">Select Unit</option>
              {units.map((u) => (
                <option key={u.unit_id} value={String(u.unit_id)}>
                  {u.name}
                </option>
              ))}
            </select>

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
        onClick={addIngredientRow}
        className="mt-5 flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        <Plus size={18} />
        Add Ingredient
      </button>
    </div>
  );
}
