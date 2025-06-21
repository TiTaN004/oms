import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Save } from "lucide-react";
import API_ENDPOINTS from "../../utils/apiConfig";

// API base URL - adjust according to your setup
const API_BASE_URL = 'http://localhost/api';

export default function ProductManagement() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    product_image: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
        const response = await fetch(API_ENDPOINTS.PRODUCTS, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        console.error("Error fetching products:", result.error);
        alert("Failed to fetch products: " + result.error);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setShowAddForm(true);
  };

  const handleGoBack = () => {
    setShowAddForm(false);
    setFormData({
      productName: "",
      product_image: "",
      isActive: true,
    });
    setImageFile(null);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          product_image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async () => {
    if (!formData.productName.trim()) {
      alert("Product name is required");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('product_name', formData.productName);
      formDataToSend.append('is_active', formData.isActive ? '1' : '0');
      
      // If there's an image file, append it
      if (imageFile) {
        formDataToSend.append('product_image', imageFile);
      } else if (formData.product_image && formData.product_image.startsWith('data:')) {
        // If it's a base64 image (for editing existing products)
        formDataToSend.append('image_base64', formData.product_image);
      }

      let url = `${API_ENDPOINTS.PRODUCTS}`;
      let method = 'POST';

      if (editingId) {
        url += `?id=${editingId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        // alert(editingId ? 'Product updated successfully' : 'Product created successfully');
        await fetchProducts(); // Refresh the list
        handleGoBack();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Product
  const handleEdit = (product) => {
    setFormData({
      productName: product.productName,
      product_image: product.product_image,
      isActive: product.isActive,
    });
    setImageFile(null);
    setEditingId(product.srno);
    setShowAddForm(true);
  };

  // Handle Delete Product
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/?id=${deleteId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        // alert('Product deleted successfully');
        await fetchProducts(); // Refresh the list
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  // Add Product Form Component
  if (showAddForm) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded shadow">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Products</span>
            <span className="sm:hidden">Back</span>
          </button>
          <h2 className="text-lg font-semibold">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
        </div>

        {/* Add Product Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFormChange}
                  className="rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Is Active</span>
              </label>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                name="product_image"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.product_image && (
                <div className="mt-2">
                  <img
                    src={formData.product_image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={loading}
              className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {loading ? "Saving..." : editingId ? "Update Product" : "Save Product"}
            </button>
            <button
              type="button"
              onClick={handleGoBack}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-lg font-semibold">Products</h2>

        {/* Search and Add Button Container */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="border px-4 py-2 rounded w-full sm:w-64 order-2 sm:order-1"
            value={search}
            onChange={handleSearch}
          />
          <button
            onClick={handleAddProduct}
            className="bg-blue-900 text-white px-4 py-2 rounded flex items-center justify-center gap-2 whitespace-nowrap order-1 sm:order-2"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {loading && !showAddForm && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 font-medium">Sr No.</th>
              <th className="p-3 font-medium">Product Name</th>
              <th className="p-3 font-medium">Image</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.srno} className="border-t-[0.5px]">
                  <td className="p-3">{row.srno}</td>
                  <td className="p-3">{row.productName}</td>
                  <td className="p-3">
                    {row.image ? (
                      <img
                        src={row.image}
                        alt={row.productName}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      row.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {row.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded cursor-pointer"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(row.srno)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((row) => (
            <div key={row.srno} className="border rounded-lg p-4 bg-gray-50">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-600">
                    Sr No.
                  </div>
                  <div className="font-medium">{row.srno}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(row)}
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded cursor-pointer"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(row.srno)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Product Name:</span>
                  <div>{row.productName}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      row.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {row.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-medium text-gray-600">Image:</span>
                  <div className="mt-1">
                    {row.image ? (
                      <img
                        src={row.image}
                        alt={row.productName}
                        className="w-24 h-24 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded border flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-gray-500 border rounded-lg">
            No matching records found.
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()}, All Rights Reserved
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/35 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Product
                </h3>
                <p className="text-sm text-gray-600">
                  Product ID: {data.find((item) => item.srno === deleteId)?.srno}
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this product? This action
              cannot be undone and will also delete the associated image.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}