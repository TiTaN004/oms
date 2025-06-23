import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Save } from "lucide-react";

// API Configuration
const API_BASE_URL = 'http://localhost/api'; // Change this to your actual API URL
const API_ENDPOINTS = {
  ORDERS: `${API_BASE_URL}/order/order.php`,
  CLIENTS: `${API_BASE_URL}/client/client.php`,
  PRODUCTS: `${API_BASE_URL}/product/product.php`,
  WEIGHT: `${API_BASE_URL}/weight/weight.php`,
  OPERATION_TYPES: `${API_BASE_URL}/operation/operation.php`,
  USERS: `${API_BASE_URL}/user/user.php`,
};

// Fixed weight types as requested
const fixedWeightTypes = [
  { id: 1, name: "kg" },
  { id: 2, name: "gram" },
];

export default function OrdersIndex() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    fClientID: "",
    fProductID: "",
    orderOn: new Date().toISOString().split("T")[0],
    weight: "",
    WeightTypeID: "",
    productWeight: "",
    productWeightTypeID: "",
    productQty: "",
    pricePerQty: "",
    totalPrice: "",
    remark: "",
    fOperationID: "",
    fAssignUserID: "",
  });

  // Dropdown data states
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [operationTypes, setOperationTypes] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter users based on selected operation type
  useEffect(() => {
    if (formData.fOperationID) {
      const selectedOperation = operationTypes.find(
        (op) => op.id.toString() === formData.fOperationID
      );
      if (selectedOperation) {
        // Filter users who are associated with the selected operation type
        const filtered = allUsers.filter((user) => 
          user.operationTypes && user.operationTypes.includes(parseInt(formData.fOperationID))
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers([]);
      }
    } else {
      setFilteredUsers([]);
    }
  }, [formData.fOperationID, operationTypes, allUsers]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchOrders(),
        fetchClients(),
        fetchProducts(),
        fetchOperationTypes(),
        fetchUsers(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ORDERS);
      const result = await response.json();
      if (result.outVal === 1 && result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CLIENTS);
      const result = await response.json();
      if (result.outVal === 1 && result.data) {
        setClients(result.data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS);
      const result = await response.json();
      if (result.outVal === 1 && result.data) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOperationTypes = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.OPERATION_TYPES);
      const result = await response.json();
      if (result.outVal === 1 && result.data) {
        setOperationTypes(result.data);
      }
    } catch (error) {
      console.error("Error fetching operation types:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USERS);
      const result = await response.json();
      if (result.outVal === 1 && result.data) {
        setAllUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchOrderHistory = async (orderId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/history/${orderId}`);
      const result = await response.json();
      if (result.outVal === 1 && result.data) {
        setOrderHistory(result.data);
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
      setOrderHistory([]);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.clientName.toLowerCase().includes(search.toLowerCase()) ||
    item.productName.toLowerCase().includes(search.toLowerCase()) ||
    item.orderNo.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (orderId, status) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status === 'completed' ? 1 : 0 }),
      });

      const result = await response.json();
      if (result.outVal === 1) {
        await fetchOrders(); // Refresh orders list
      } else {
        alert('Failed to update status: ' + result.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = () => {
    setShowAddForm(true);
    setFormData({
      fClientID: "",
      fProductID: "",
      orderOn: new Date().toISOString().split("T")[0],
      weight: "",
      WeightTypeID: "",
      productWeight: "",
      productWeightTypeID: "",
      productQty: "",
      pricePerQty: "",
      totalPrice: "",
      remark: "",
      fOperationID: "",
      fAssignUserID: "",
    });
  };

  const handleGoBack = () => {
    setShowAddForm(false);
    setEditingId(null);
    setOrderHistory([]);
    setFormData({
      fClientID: "",
      fProductID: "",
      orderOn: new Date().toISOString().split("T")[0],
      weight: "",
      WeightTypeID: "",
      productWeight: "",
      productWeightTypeID: "",
      productQty: "",
      pricePerQty: "",
      totalPrice: "",
      remark: "",
      fOperationID: "",
      fAssignUserID: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [name]: value,
      };

      // Auto-calculate total price when quantity or price per qty changes
      if (name === 'productQty' || name === 'pricePerQty') {
        const qty = parseFloat(name === 'productQty' ? value : prev.productQty) || 0;
        const price = parseFloat(name === 'pricePerQty' ? value : prev.pricePerQty) || 0;
        newFormData.totalPrice = (qty * price).toString();
      }

      return newFormData;
    });
  };

  const handleFormSubmit = async () => {
    setLoading(true);

    try {
      const orderData = {
        fClientID: parseInt(formData.fClientID),
        fProductID: parseInt(formData.fProductID),
        orderOn: formData.orderOn,
        weight: parseFloat(formData.weight),
        WeightTypeID: parseInt(formData.WeightTypeID),
        productWeight: parseFloat(formData.productWeight),
        productWeightTypeID: parseInt(formData.productWeightTypeID),
        productQty: parseInt(formData.productQty),
        pricePerQty: parseFloat(formData.pricePerQty),
        remark: formData.remark,
        fOperationID: parseInt(formData.fOperationID),
        fAssignUserID: parseInt(formData.fAssignUserID),
      };

      let response;
      if (editingId) {
        // Update existing order
        response = await fetch(`${API_ENDPOINTS.ORDERS}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
      } else {
        // Create new order
        response = await fetch(API_ENDPOINTS.ORDERS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
      }

      const result = await response.json();
      if (result.outVal === 1) {
        await fetchOrders(); // Refresh orders list
        handleGoBack();
        alert(editingId ? 'Order updated successfully!' : 'Order created successfully!');
      } else {
        alert('Failed to save order: ' + result.message);
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (order) => {
    setFormData({
      fClientID: order.fClientID.toString(),
      fProductID: order.fProductID.toString(),
      orderOn: order.orderOn.split('-').reverse().join('-'), // Convert DD-MMM-YYYY to YYYY-MM-DD
      weight: order.weight.toString(),
      WeightTypeID: order.weightTypeID.toString(),
      productWeight: order.productWeight.toString(),
      productWeightTypeID: order.productWeightTypeID.toString(),
      productQty: order.productQty.toString(),
      pricePerQty: order.pricePerQty.toString(),
      totalPrice: order.totalPrice.toString(),
      remark: order.orderDetails || "",
      fOperationID: order.fOperationID.toString(),
      fAssignUserID: order.fUserAssignID.toString(),
    });

    setEditingId(order.orderID);
    await fetchOrderHistory(order.orderID);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${deleteId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.outVal === 1) {
        await fetchOrders(); // Refresh orders list
        alert('Order deleted successfully!');
      } else {
        alert('Failed to delete order: ' + result.message);
      }
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

  // Custom Dropdown Component
  const CustomDropdown = ({
    name,
    value,
    onChange,
    options,
    placeholder,
    required = true,
  }) => (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
      required={required}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name || option.clientName || option.product_name || option.operationName || option.fullName}
        </option>
      ))}
    </select>
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
          <h2 className="text-lg font-semibold">
            {editingId ? 'Edit Order' : 'Add New Order'}
          </h2>
        </div>

        {/* Order History Section for Edit */}
        {editingId && orderHistory.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-semibold mb-3">Order Assignment History</h3>
            <div className="space-y-2">
              {orderHistory.map((history, index) => (
                <div key={index} className="flex justify-between items-center text-sm bg-white p-2 rounded">
                  <span>
                    <strong>{history.assignedUser}</strong> - {history.operationName}
                  </span>
                  <span className="text-gray-500">
                    {history.assignedOn} | Status: {history.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Order Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Client Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
              </label>
              <CustomDropdown
                name="fClientID"
                value={formData.fClientID}
                onChange={handleFormChange}
                options={clients}
                placeholder="Select Client"
              />
            </div>

            {/* Product Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product *
              </label>
              <CustomDropdown
                name="fProductID"
                value={formData.fProductID}
                onChange={handleFormChange}
                options={products}
                placeholder="Select Product"
              />
            </div>

            {/* Order Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Date *
              </label>
              <input
                type="date"
                name="orderOn"
                value={formData.orderOn}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight *
              </label>
              <input
                type="number"
                step="0.01"
                name="weight"
                value={formData.weight}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter weight"
                required
              />
            </div>

            {/* Weight Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight Type *
              </label>
              <CustomDropdown
                name="WeightTypeID"
                value={formData.WeightTypeID}
                onChange={handleFormChange}
                options={fixedWeightTypes}
                placeholder="Select Weight Type"
              />
            </div>

            {/* Product Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Weight *
              </label>
              <input
                type="number"
                step="0.01"
                name="productWeight"
                value={formData.productWeight}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product weight"
                required
              />
            </div>

            {/* Product Weight Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Weight Type *
              </label>
              <CustomDropdown
                name="productWeightTypeID"
                value={formData.productWeightTypeID}
                onChange={handleFormChange}
                options={fixedWeightTypes}
                placeholder="Select Weight Type"
              />
            </div>

            {/* Total Qty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Qty *
              </label>
              <input
                type="number"
                name="productQty"
                value={formData.productQty}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Price Per Qty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Per Qty *
              </label>
              <input
                type="number"
                step="0.01"
                name="pricePerQty"
                value={formData.pricePerQty}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price per quantity"
                required
              />
            </div>

            {/* Total Price (Auto-calculated) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Price *
              </label>
              <input
                type="number"
                step="0.01"
                name="totalPrice"
                value={formData.totalPrice}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Auto-calculated"
                readOnly
              />
            </div>

            {/* Operation Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operation Type *
              </label>
              <CustomDropdown
                name="fOperationID"
                value={formData.fOperationID}
                onChange={handleFormChange}
                options={operationTypes}
                placeholder="Select Operation Type"
              />
            </div>

            {/* Assigned User Dropdown - Filtered based on operation type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned User *
              </label>
              <CustomDropdown
                name="fAssignUserID"
                value={formData.fAssignUserID}
                onChange={handleFormChange}
                options={filteredUsers}
                placeholder={formData.fOperationID ? "Select User" : "Select Operation Type First"}
                required={!!formData.fOperationID}
              />
              {!formData.fOperationID && (
                <p className="text-xs text-gray-500 mt-1">
                  Please select an operation type first to see available users
                </p>
              )}
            </div>

            {/* Description */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleFormChange}
                rows="3"
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description or remarks"
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
              {loading ? "Saving..." : editingId ? "Update Order" : "Save Order"}
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
        <h2 className="text-lg font-semibold">Orders</h2>

        {/* Search and Add Button Container */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by client, product, or order number..."
            className="border px-4 py-2 rounded w-full sm:w-80 order-2 sm:order-1"
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 font-medium">Order ID</th>
              <th className="p-3 font-medium">Client Name</th>
              <th className="p-3 font-medium">Operation Name</th>
              <th className="p-3 font-medium">Assigned To</th>
              <th className="p-3 font-medium">Product</th>
              <th className="p-3 font-medium">Product Qty</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Total Price</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.orderID} className="border-t-[0.5px]">
                  <td className="p-3">{row.orderNo}</td>
                  <td className="p-3">{row.clientName}</td>
                  <td className="p-3">{row.operationName}</td>
                  <td className="p-3">{row.assignUser}</td>
                  <td className="p-3">{row.productName}</td>
                  <td className="p-3">{row.productQty}</td>
                  <td className="p-3">₹{row.pricePerQty}</td>
                  <td className="p-3">₹{row.totalPrice}</td>
                  <td className="p-3">
                    <select
                      value={row.status === 1 ? "completed" : "processing"}
                      onChange={(e) =>
                        handleStatusChange(row.orderID, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                      disabled={loading}
                    >
                      <option value="processing">🔴 Processing</option>
                      <option value="completed">🟢 Completed</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:underline cursor-pointer"
                        disabled={loading}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(row.orderID)}
                        className="text-red-600 hover:underline cursor-pointer"
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-500">
                  {loading ? "Loading orders..." : "No matching records found."}
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
            <div key={row.orderID} className="border rounded-lg p-4 bg-gray-50">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-600">
                    Order ID
                  </div>
                  <div className="font-medium">{row.orderNo}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(row)}
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded cursor-pointer"
                    disabled={loading}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(row.orderID)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded cursor-pointer"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card Content - 2 Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">
                    Client Name:
                  </span>
                  <div>{row.clientName}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Operation Name:
                  </span>
                  <div>{row.operationName}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Assigned To:</span>
                  <div>{row.assignUser}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Product:</span>
                  <div>{row.productName}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Product Qty:
                  </span>
                  <div>{row.productQty}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Price:</span>
                  <div>₹{row.pricePerQty}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Total Price:
                  </span>
                  <div>₹{row.totalPrice}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <select
                    value={row.status === 