import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/token";
import { toast, ToastContainer } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import RecipeBuilder from "./RecipeBuilder";
import axiosInstance from "../../utils/axiosInstance";

function ProductRegistration() {
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [recipeIngredients, setRecipeIngredients] = useState([]);

  const [itemData, setItemData] = useState({
    itemName: "",
    unit_id: "",
    unitSearch: "",
    productType: "",
    price: "",
    image: null,
    category_id: "",
  });

  const navigate = useNavigate();

  // 🔎 FETCH UNITS AND CATEGORIES (AXIOS)
  useEffect(() => {
    const token = getToken();
    const businessId = localStorage.getItem("selectedBusinessId");

    if (!businessId) {
      toast.error("No business selected. Redirecting...");
      setTimeout(() => navigate("/busmanage"), 1500);
      return;
    }

    // Fetch units
    axiosInstance
      .get("/inventory/units", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) setUnits(res.data);
        else setUnits([]);
      })
      .catch((err) => {
        console.error("Error fetching units:", err);
        setUnits([]);
      });

    // Fetch product categories for this business
    axiosInstance
      .get(`/inventory/${businessId}/product-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) setCategories(res.data);
        else setCategories([]);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setCategories([]);
      });
  }, [navigate]);

  // 📥 INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({ ...prev, [name]: value }));
  };

  // 📸 IMAGE UPLOAD
  const handleImageUpload = (e) => {
    setItemData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // 🧽 CLEAR FORM
  const handleClear = () => {
    setItemData({
      itemName: "",
      unit_id: "",
      unitSearch: "",
      productType: "",
      price: "",
      image: null,
      category_id: "",
    });
    setShowUnitDropdown(false);
    setRecipeIngredients([]);
  };

  // 🔄 Convert File → Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // 🔄 Convert Base64 → File
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  // 📤 SEND TO BACKEND (AXIOS ONLY)
  const sendProductToServer = async (product, token) => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("unit_id", product.unit_id);
    formData.append("product_type", product.product_type);
    formData.append("price", product.price);
    formData.append("businessId", product.businessId);
    formData.append("recipe", JSON.stringify(product.recipe));
    if (product.category_id) {
      formData.append("category_id", product.category_id);
    }

    // convert base64 → real file for uploading
    formData.append(
      "picture",
      dataURLtoFile(product.image, "offline-image.jpg")
    );

    try {
      // Let the browser set the Content-Type with proper boundary for FormData
      const res = await axiosInstance.post(`inventory/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product synced successfully!");
      return res.data;
    } catch (error) {
      console.error("Error syncing product:", error);
      toast.error("Sync failed.");
    }
  };

  // 🚀 SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    const businessId = localStorage.getItem("selectedBusinessId");

    if (!businessId) {
      toast.error("No business selected.");
      return;
    }

    // VALIDATIONS
    if (itemData.productType.toLowerCase() === "recipe") {
      if (recipeIngredients.length === 0) {
        toast.error("Recipe items are required for recipe products.");
        return;
      }
    }

    if (itemData.productType.toLowerCase() === "composite") {
      if (recipeIngredients.length > 0) {
        const invalid = recipeIngredients.some(
          (ing) => !ing.product_id || !ing.qty
        );
        if (invalid) {
          toast.error("Composite recipe contains empty fields.");
          return;
        }
      }
    }

    const product = {
      name: itemData.itemName,
      unit_id: itemData.unit_id,
      product_type: itemData.productType.toLowerCase(),
      price: itemData.price,
      businessId,
      image: await toBase64(itemData.image),
      recipe: recipeIngredients,
      category_id: itemData.category_id || "",
    };
    console.log("Submitting product:", product);

    // OFFLINE MODE
    if (!navigator.onLine) {
      const queue = JSON.parse(
        localStorage.getItem("offlineProducts") || "[]"
      );
      queue.push(product);
      localStorage.setItem("offlineProducts", JSON.stringify(queue));
      toast.info("Saved locally. Will sync when online.");
      handleClear();
      return;
    }

    await sendProductToServer(product, token);
    handleClear();
  };

  // 🔁 SYNC OFFLINE ON RECONNECT
  useEffect(() => {
    const syncOfflineProducts = async () => {
      const token = getToken();
      const queue = JSON.parse(
        localStorage.getItem("offlineProducts") || "[]"
      );

      for (const product of queue) {
        await sendProductToServer(product, token);
      }

      localStorage.removeItem("offlineProducts");
    };

    window.addEventListener("online", syncOfflineProducts);
    return () => window.removeEventListener("online", syncOfflineProducts);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-center items-start min-h-screen px-4 pt-5 pb-12">
        <div className="bg-sky-100 p-6 sm:p-8 rounded-2xl w-full max-w-4xl shadow-lg border border-blue-200">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
            REGISTER NEW ITEM
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 items-center w-full"
          >
            {/* TOP SECTION */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full justify-center">
              {/* IMAGE */}
              <div className="flex flex-col items-center">
                <label className="w-40 xs:w-48 sm:w-56 md:w-64 h-40 xs:h-48 sm:h-56 md:h-64 
                                  border-2 border-dashed border-gray-400 flex items-center justify-center 
                                  text-gray-500 cursor-pointer relative rounded-lg overflow-hidden 
                                  bg-white/60 backdrop-blur">
                  {itemData.image ? (
                    <img
                      src={URL.createObjectURL(itemData.image)}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm sm:text-base">PICTURE</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* RIGHT INPUTS */}
              <div className="flex flex-col gap-4 w-full">

                {/* NAME */}
                <label className="block text-sm font-medium text-gray-700">
                  Item Name
                  <input
                    type="text"
                    name="itemName"
                    placeholder="ITEM NAME"
                    value={itemData.itemName}
                    onChange={handleChange}
                    required
                    className="mt-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm w-full"
                  />
                </label>

                {/* UNIT */}
                <label className="block text-sm font-medium text-gray-700 relative">
                  Unit
                  <input
                    type="text"
                    name="unitSearch"
                    placeholder="SEARCH UNIT"
                    value={
                      itemData.unit_id
                        ? units.find((u) => u.unit_id === itemData.unit_id)?.name || ""
                        : itemData.unitSearch
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setItemData((prev) => ({
                        ...prev,
                        unitSearch: value,
                        unit_id: "",
                      }));
                      setShowUnitDropdown(true);
                    }}
                    onBlur={() =>
                      setTimeout(() => setShowUnitDropdown(false), 100)
                    }
                    className="mt-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm w-full"
                    autoComplete="off"
                  />

                  {showUnitDropdown &&
                    itemData.unitSearch &&
                    units
                      .filter((unit) =>
                        unit.name
                          .toLowerCase()
                          .includes(itemData.unitSearch.toLowerCase())
                      )
                      .length > 0 && (
                      <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
                        {units
                          .filter((unit) =>
                            unit.name
                              .toLowerCase()
                              .includes(itemData.unitSearch.toLowerCase())
                          )
                          .map((unit) => (
                            <li
                              key={unit.unit_id}
                              onMouseDown={() => {
                                setItemData((prev) => ({
                                  ...prev,
                                  unit_id: unit.unit_id,
                                  unitSearch: unit.name,
                                }));
                                setShowUnitDropdown(false);
                              }}
                              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            >
                              {unit.name}
                            </li>
                          ))}
                      </ul>
                    )}
                </label>

                {/* CATEGORY */}
                <label className="block text-sm font-medium text-gray-700">
                  Category
                  <select
                    name="category_id"
                    value={itemData.category_id}
                    onChange={handleChange}
                    className="mt-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm w-full"
                    disabled={!categories.length}
                    required
                  >
                    <option value="">{categories.length ? 'Select Category' : 'No categories available'}</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* PRODUCT TYPE */}
                <label className="block text-sm font-medium text-gray-700">
                  Product Type
                  <select
                    name="productType"
                    value={itemData.productType}
                    onChange={handleChange}
                    required
                    className="mt-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm w-full"
                  >
                    <option value="">Select Product Type</option>
                    <option value="simple">Simple</option>
                    <option value="recipe">Recipe</option>
                    <option value="composite">Composite</option>
                  </select>
                </label>

                {/* PRICE */}
                <label className="block text-sm font-medium text-gray-700">
                  Price
                  <input
                    type="number"
                    name="price"
                    placeholder="PRICE"
                    value={itemData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="mt-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm w-full"
                  />
                </label>

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    SAVE
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    CLEAR
                  </button>
                </div>
              </div>
            </div>

            {/* RECIPE BUILDER */}
            {(itemData.productType === "recipe" ||
              itemData.productType === "composite") && (
              <div className="w-full flex justify-center animate-fadeIn">
                <RecipeBuilder
                  productType={itemData.productType}
                  onRecipeChange={setRecipeIngredients}
                />
              </div>
            )}
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </DashboardLayout>
  );
}

export default ProductRegistration;
