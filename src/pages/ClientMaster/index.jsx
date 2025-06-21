import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Save } from "lucide-react";
import API_ENDPOINTS from "../../utils/apiConfig";
const sampleData = [
  {
    id: 5,
    clientName: "fortune casting",
    isActive: true,
  },
  {
    id: 6,
    clientName: "fortune casting",
    isActive: true,
  },
];
export default function index() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(sampleData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    clientName: "",
    isActive: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch dropdown data from PHP backend
  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.CLIENTS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const clientsData = await response.json();
      setData(clientsData.data);
      // For demo purposes, using sample data
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = () => {
    setShowAddForm(true);
  };

  const handleGoBack = () => {
    setShowAddForm(false);
    setFormData({
      id: "",
      clientName: "",
      isActive: "",
    });
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async () => {
    setLoading(true);

    try {
      // Prepare data for PHP API
      const userData = {
        id: formData.id,
        clientName: formData.clientName,
        isActive: formData.isActive,
      };

      if (editingId) {
        // For demo purposes, update order locally
        const updatedUser = {
          id: formData.id,
          clientName: formData.clientName,
          isActive: formData.isActive,
        };
        // Update existing order
        const response = await fetch(API_ENDPOINTS.CLIENTS, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        });

        setData((prev) =>
          prev.map((item) => (item.id === editingId ? updatedUser : item))
        );

        setEditingId(null);
      } else {
        // For demo purposes, create new order locally
        const newUser = {
          clientName: formData.clientName,
          isActive: formData.isActive,
        };

        // Create new order
        const response = await fetch(API_ENDPOINTS.CLIENTS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        setData((prev) => [...prev, newUser]);
      }

      handleGoBack();
    } catch (error) {
      console.error("Error saving User:", error);
      alert("Failed to save User. Please try again.");
    } finally {
      fetchClientData();
      setLoading(false);
    }
  };

  // Handle Edit Order
  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      clientName: user.clientName,
      isActive: user.isActive,
    });

    setEditingId(user.id);
    setShowAddForm(true);
  };

  // Handle Delete Order
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      // Call PHP API to delete
      const response = await fetch(`${API_ENDPOINTS.CLIENTS}/?id=${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      // For demo purposes, delete locally
      setData((prev) => prev.filter((item) => item.id !== deleteId));
    } catch (error) {
      console.error("Error deleting User:", error);
      alert("Failed to delete User. Please try again.");
    } finally {
      fetchClientData();
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
    item.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = (id, status) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  // Add Order Form Component
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
            <span className="hidden sm:inline">Back to User</span>
            <span className="sm:hidden">Back</span>
          </button>
          <h2 className="text-lg font-semibold">Add New User</h2>
        </div>

        {/* Add Order Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter size (e.g., 10x20cm)"
                required
              />
            </div>

            {/* Mobile No. */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Is Active
              </label>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter size (e.g., 10x20cm)"
                required
              />
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
              {loading ? "Saving..." : "Save User"}
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
        <h2 className="text-lg font-semibold">Client Master</h2>

        {/* Search and Add Button Container */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search"
            className="border px-4 py-2 rounded w-full sm:w-64 order-2 sm:order-1"
            value={search}
            onChange={handleSearch}
          />
          <button
            onClick={handleAddOrder}
            className="bg-blue-900 text-white px-4 py-2 rounded flex items-center justify-center gap-2 whitespace-nowrap order-1 sm:order-2"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Client</span>
            <span className="sm:hidden">Add Client</span>
          </button>
        </div>
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left ">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Client Name</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} className="border-t-[0.5px]">
                  <td className="p-3">{row.id}</td>
                  <td className="p-3">{row.clientName}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
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
            <div key={row.id} className="border rounded-lg p-4 bg-gray-50">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-600">ID</div>
                  <div className="font-medium">{row.id}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(row)}
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded cursor-pointer"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card Content - 2 Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">
                    Client Name :
                  </span>
                  <div>{row.clientName}</div>
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
                  Delete Order
                </h3>
                <p className="text-sm text-gray-600">
                  Order ID: {data.find((item) => item.id === deleteId)?.id}
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this casting order? This action
              cannot be undone.
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
