import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Save } from "lucide-react";
const sampleData = [
  {
    id: 5,
    client: "fortune casting",
    user: "test",
    product: "LOCK DABI",
    qty: 10,
    size: 10,
    status: "pending",
    orderDate: "2024-01-15"
  },
  {
    id: 4,
    client: "fortune casting",
    user: "test",
    product: 'S HENDAL 4"',
    qty: 11,
    size: 12,
    status: "pending",
    orderDate: "2024-01-15"
  },
];

// Sample data for demonstration
// const sampleData = [
//   {
//     id: "CO0001",
//     client: "ABC Corp",
//     user: "John Doe",
//     product: "Cast Iron Pipe",
//     qty: "100",
//     size: "10x20cm",
//     status: "processing",
//     orderDate: "2024-01-15"
//   },
//   {
//     id: "CO0002",
//     client: "XYZ Ltd",
//     user: "Jane Smith",
//     product: "Steel Casting",
//     qty: "50",
//     size: "15x25cm",
//     status: "completed",
//     orderDate: "2024-01-14"
//   }
// ];

// Sample dropdown data (this would come from PHP backend)
const sampleClients = [
  { id: 1, name: "ABC Corp" },
  { id: 2, name: "XYZ Ltd" },
  { id: 3, name: "DEF Industries" },
  { id: 4, name: "GHI Manufacturing" },
];

const sampleUsers = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Mike Johnson" },
  { id: 4, name: "Sarah Wilson" },
];

const sampleProducts = [
  { id: 1, name: "Cast Iron Pipe" },
  { id: 2, name: "Steel Casting" },
  { id: 3, name: "Aluminum Casting" },
  { id: 4, name: "Bronze Casting" },
];

export default function index() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(sampleData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    client: "",
    user: "",
    product: "",
    qty: "",
    size: "",
    status: "processing",
    orderDate: new Date().toISOString().split("T")[0],
  });

  // Dropdown data states
  const [clients, setClients] = useState(sampleClients);
  const [users, setUsers] = useState(sampleUsers);
  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(false);

  // Fetch dropdown data from PHP backend
  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    setLoading(true);
    try {
      // Replace these with actual PHP API endpoints
      // const clientsResponse = await fetch('/api/clients');
      // const usersResponse = await fetch('/api/users');
      // const productsResponse = await fetch('/api/products');

      // const clientsData = await clientsResponse.json();
      // const usersData = await usersResponse.json();
      // const productsData = await productsResponse.json();

      // setClients(clientsData);
      // setUsers(usersData);
      // setProducts(productsData);

      // For demo purposes, using sample data
      console.log("Fetching dropdown data from PHP backend...");
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.client.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = (id, status) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleAddOrder = () => {
    setShowAddForm(true);
  };

  const handleGoBack = () => {
    setShowAddForm(false);
    setFormData({
      client: "",
      user: "",
      product: "",
      qty: "",
      size: "",
      status: "processing",
      orderDate: new Date().toISOString().split("T")[0],
    });
    setEditingId(null)
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    setLoading(true);

    try {
      // Get selected names for display
      const selectedClient = clients.find(
        (c) => c.id.toString() === formData.client
      );
      const selectedUser = users.find((u) => u.id.toString() === formData.user);
      const selectedProduct = products.find(
        (p) => p.id.toString() === formData.product
      );

      // Prepare data for PHP API
      const orderData = {
        client_id: formData.client,
        user_id: formData.user,
        product_id: formData.product,
        qty: formData.qty,
        size: formData.size,
        status: formData.status,
        order_date: formData.orderDate,
      };

      if (editingId) {
        // Update existing order
        // const response = await fetch(`/api/casting-orders/${editingId}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(orderData)
        // });

        // For demo purposes, update order locally
        const updatedOrder = {
          id: editingId,
          client: selectedClient?.name || "",
          user: selectedUser?.name || "",
          product: selectedProduct?.name || "",
          qty: formData.qty,
          size: formData.size,
          status: formData.status,
          orderDate: formData.orderDate,
        };

        setData((prev) =>
          prev.map((item) => (item.id === editingId ? updatedOrder : item))
        );

        console.log("Order updated successfully:", orderData);
        setEditingId(null)
      } else {
        // Create new order
        // const response = await fetch('/api/casting-orders', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(orderData)
        // });

        // For demo purposes, create new order locally
        const newOrder = {
          id: `CO${String(data.length + 1).padStart(4, "0")}`,
          client: selectedClient?.name || "",
          user: selectedUser?.name || "",
          product: selectedProduct?.name || "",
          qty: formData.qty,
          size: formData.size,
          status: formData.status,
          orderDate: formData.orderDate,
        };

        setData((prev) => [...prev, newOrder]);

        console.log("Order created successfully:", orderData);
      }

      handleGoBack();
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewItem = (type) => {
    // This would open a modal or navigate to add new client/user/product
    alert(`Add new ${type} functionality would be implemented here`);
    // Example: window.open(`/add-${type}`, '_blank');
  };

  // Handle Edit Order
  const handleEdit = (order) => {
    // Find the corresponding IDs for the dropdowns
    const clientId = clients.find((c) => c.name === order.client)?.id || "";
    const userId = users.find((u) => u.name === order.user)?.id || "";
    const productId = products.find((p) => p.name === order.product)?.id || "";

    setFormData({
      client: clientId.toString(),
      user: userId.toString(),
      product: productId.toString(),
      qty: order.qty,
      size: order.size,
      status: order.status,
      orderDate: order.orderDate,
    });

    setEditingId(order.id);
    setShowAddForm(true);
  };

  // Handle Delete Order
  const handleDelete = (id) => {
    console.log("clicked")
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      // Call PHP API to delete
      // const response = await fetch(`/api/casting-orders/${deleteId}`, {
      //   method: 'DELETE'
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Failed to delete order');
      // }

      // For demo purposes, delete locally
      setData((prev) => prev.filter((item) => item.id !== deleteId));

      console.log("Order deleted successfully:", deleteId);
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order. Please try again.");
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

  // Custom Dropdown Component with Add Link
  const CustomDropdown = ({
    name,
    value,
    onChange,
    options,
    placeholder,
    type,
  }) => (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
        required
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <div className="mt-1">
        <button
          type="button"
          onClick={() => handleAddNewItem(type)}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Plus size={12} />
          Add New {type}
        </button>
      </div>
    </div>
  );

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
            <span className="hidden sm:inline">Back to Orders</span>
            <span className="sm:hidden">Back</span>
          </button>
          <h2 className="text-lg font-semibold">Add New Casting Order</h2>
        </div>

        {/* Add Order Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Client Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
              </label>
              <CustomDropdown
                name="client"
                value={formData.client}
                onChange={handleFormChange}
                options={clients}
                placeholder="Select Client"
                type="Client"
              />
            </div>

            {/* Product Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product *
              </label>
              <CustomDropdown
                name="product"
                value={formData.product}
                onChange={handleFormChange}
                options={products}
                placeholder="Select Product"
                type="Product"
              />
            </div>

            {/* Order Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="orderDate"
                  value={formData.orderDate}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* User Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned User *
              </label>
              <CustomDropdown
                name="user"
                value={formData.user}
                onChange={handleFormChange}
                options={users}
                placeholder="Select User"
                type="User"
              />
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size *
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter size (e.g., 10x20cm)"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="text"
                name="qty"
                value={formData.qty}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Status */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="processing">In Processing</option>
                <option value="completed">Completed</option>
              </select>
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
              {loading ? "Saving..." : "Save Order"}
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

  // Main Casting Order List View
  return (
    <div className="bg-white p-4 sm:p-6 rounded shadow">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-lg font-semibold">Casting Order</h2>

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
            <span className="hidden sm:inline">Add Order</span>
            <span className="sm:hidden">Add Order</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 font-medium">Casting Order ID</th>
              <th className="p-3 font-medium">Client Name</th>
              <th className="p-3 font-medium">User Name</th>
              <th className="p-3 font-medium">Product</th>
              <th className="p-3 font-medium">Product Qty</th>
              <th className="p-3 font-medium">Size</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} className="border-t-[0.5px]">
                  <td className="p-3">{row.id}</td>
                  <td className="p-3">{row.client}</td>
                  <td className="p-3">{row.user}</td>
                  <td className="p-3">{row.product}</td>
                  <td className="p-3">{row.qty}</td>
                  <td className="p-3">{row.size}</td>
                  <td className="p-3">
                    <select
                      value={row.status}
                      onChange={(e) =>
                        handleStatusChange(row.id, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="pending">🔴</option>
                      <option value="completed">🟢</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(row)} className="text-blue-600 hover:underline cursor-pointer">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:underline cursor-pointer">
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
                  <div className="font-semibold text-sm text-gray-600">
                    Casting Order ID
                  </div>
                  <div className="font-medium">{row.id}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(row)} className="text-blue-600 hover:bg-blue-50 p-2 rounded cursor-pointer">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:bg-red-50 p-2 rounded cursor-pointer">
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
                  <div>{row.client}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">User Name :</span>
                  <div>{row.user}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Product :</span>
                  <div>{row.product}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Quantity :</span>
                  <div>{row.qty}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Size :</span>
                  <div>{row.size}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status :</span>
                  <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    className="border px-3 py-1 rounded mt-1 w-full"
                  >
                    <option value="pending">🔴 Pending</option>
                    <option value="completed">🟢 Completed</option>
                  </select>
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

      {/* Footer */}
      <div className="mt-6 text-xs sm:text-sm text-gray-500 text-center">
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
                <h3 className="text-lg font-semibold text-gray-900">Delete Order</h3>
                <p className="text-sm text-gray-600">
                  Order ID: {data.find(item => item.id === deleteId)?.id}
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this casting order? This action cannot be undone.
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