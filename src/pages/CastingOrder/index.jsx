import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Save } from "lucide-react";
import API_ENDPOINTS from "../../utils/apiConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../login/ProtectedRoute";
import InfiniteScroll from "react-infinite-scroll-component";

export default function index() {
 // state variables
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
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
    status: "pending",
    orderDate: new Date().toISOString().split("T")[0],
  });
  
  // filter
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    hasMore: true,
  });
  
  // Dropdown data states
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const {user} = useAuth()

  // Navigation hook
  const nav = useNavigate();

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Reset pagination when search or filter changes
  useEffect(() => {
    resetAndFetchData();
  }, [search, activeFilter]);

  const resetAndFetchData = async () => {
    setData([]);
    setPagination(prev => ({
      ...prev,
      pageIndex: 0,
      hasMore: true,
    }));
    await fetchCastingOrders(0, true);
  };

  const fetchAllData = async () => {
    setInitialLoading(true);
    setError(null);
    try {
      // Fetch all required data in parallel
      await Promise.all([
        fetchCastingOrders(0, true),
        fetchClients(),
        fetchUsers(),
        fetchProducts(),
      ]);
    } catch (error) {
      setError("Failed to load data. Please refresh the page.");
      console.error("Error fetching data:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchCastingOrders = async (pageIndex = 0, reset = false) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        pageIndex: pageIndex.toString(),
        pageSize: pagination.pageSize.toString(),
        getCount: pageIndex === 0 ? 'true' : 'false', // Only get count on first page
      });

      // Add user filter if needed
      if (user.isAdmin) {
        params.append('userID', user.userID.toString());
      }

      const response = await fetch(`${API_ENDPOINTS.CASTING_ORDERS}?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.success) {
        const newData = responseData.data || [];
        
        // Update data based on whether it's a reset or append
        if (reset) {
          setData(newData);
        } else {
          setData(prev => [...prev, ...newData]);
        }

        // Update pagination
        setPagination(prev => ({
          ...prev,
          pageIndex: pageIndex,
          totalCount: responseData.pagination?.totalCount || prev.totalCount,
          hasMore: responseData.pagination?.hasMore || false,
        }));
      } else {
        throw new Error(responseData.error || "Failed to fetch casting orders");
      }
    } catch (error) {
      console.error("Error fetching casting orders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = () => {
    if (!loading && pagination.hasMore) {
      const nextPage = pagination.pageIndex + 1;
      fetchCastingOrders(nextPage, false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CLIENTS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const clientData = await response.json();
      if (clientData.statusCode === 200) {
        // Map the client data to match expected format
        const mappedClients = clientData.data.map((client) => ({
          id: client.id,
          name: client.clientName || client.client_name || client.name,
        }));
        setClients(mappedClients);
      } else {
        throw new Error(clientData.error || "Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      // Set empty array to prevent crashes
      setClients([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USERS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      if (userData.statusCode === 200) {
        // Map the user data to match expected format
        const mappedUsers = userData.data.map((user) => ({
          id: user.userID || user.id,
          name: user.fullName || user.name,
          operationTypeID: user.operationTypeID
        }));
        const filtered = mappedUsers.filter(
          (user) => user.operationTypeID === "2"
        );
        setUsers(filtered);
      } else {
        throw new Error(userData.error || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const productData = await response.json();
      if (productData.success) {
        // Map the product data to match expected format
        const mappedProducts = productData.data.map((product) => ({
          id: product.id || product.srno,
          name: product.product_name || product.productName,
        }));
        setProducts(mappedProducts);
      } else {
        throw new Error(productData.error || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredData = (data || []).filter((item) => {
    // First filter by search term
    const matchesSearch = item.client?.toLowerCase().includes(search.toLowerCase()) ||
        item.product?.toLowerCase().includes(search.toLowerCase()) ||
        item.user?.toLowerCase().includes(search.toLowerCase())
    
    // Then filter by status
    let matchesStatus = true;
    if (activeFilter === 'Pending') {
      matchesStatus = item?.status?.toLowerCase() === 'pending';
    } else if (activeFilter === 'Completed') {
      matchesStatus = item?.status?.toLowerCase() === 'completed';
    }
    // For 'All', matchesStatus remains true
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id, status) => {
    try {
      const orderToUpdate = data.find((item) => item.id === id);
      if (!orderToUpdate) return;

      const updateData = {
        client_id: orderToUpdate.fClientID,
        product_id: orderToUpdate.fProductID,
        user_id: orderToUpdate.fAssignUserID,
        qty: orderToUpdate.qty,
        size: orderToUpdate.size,
        order_date: orderToUpdate.orderDate,
        status: status,
      };

      const response = await fetch(`${API_ENDPOINTS.CASTING_ORDERS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        setData((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
      } else {
        throw new Error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
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
      status: "pending",
      orderDate: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
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
    setError(null);

    try {
      // Validate required fields
      if (
        !formData.client ||
        !formData.user ||
        !formData.product ||
        !formData.qty ||
        !formData.size ||
        !formData.orderDate
      ) {
        alert("Please fill in all required fields.");
        return;
      }

      // Prepare data for PHP API
      const orderData = {
        client_id: parseInt(formData.client),
        user_id: parseInt(formData.user),
        product_id: parseInt(formData.product),
        qty: formData.qty,
        size: formData.size,
        status: formData.status,
        order_date: formData.orderDate,
      };

      let response;
      let url = API_ENDPOINTS.CASTING_ORDERS;
      let method = "POST";

      if (editingId) {
        // Update existing order
        url = `${API_ENDPOINTS.CASTING_ORDERS}/${editingId}`;
        method = "PUT";
      }

      response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Reset and refresh the casting orders data
        await resetAndFetchData();
        handleGoBack();
      } else {
        throw new Error(result.error || "Failed to save order");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert(`Failed to save order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewItem = (type) => {
    if (type === "Client") {
      // Redirect to client creation page or show client creation form
      nav("/dashboard/client-master");
    } else if (type === "Product") {
      // Redirect to product creation page or show product creation form
      nav("/dashboard/products");
    } else if (type === "User") {
      // Redirect to user creation page or show user creation form
      nav("/dashboard/user");
    }
  };

  // Handle Edit Order
  const handleEdit = (order) => {
    setFormData({
      client: order.fClientID?.toString() || "",
      user: order.fAssignUserID?.toString() || "",
      product: order.fProductID?.toString() || "",
      qty: order.qty?.toString() || "",
      size: order.size?.toString() || "",
      status: order.status || "pending",
      orderDate: order.orderDate || new Date().toISOString().split("T")[0],
    });

    setEditingId(order.id);
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
      const response = await fetch(
        `${API_ENDPOINTS.CASTING_ORDERS}/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Remove from local state
        setData((prev) => prev.filter((item) => item.id !== deleteId));
        // Update pagination count
        setPagination(prev => ({
          ...prev,
          totalCount: prev.totalCount > 0 ? prev.totalCount - 1 : 0,
        }));
      } else {
        throw new Error(result.error || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert(`Failed to delete order: ${error.message}`);
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

  // Loading component for infinite scroll
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900"></div>
      <span className="ml-2 text-sm text-gray-600">Loading more...</span>
    </div>
  );

  // Show loading state for initial load
  if (initialLoading) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <span className="ml-3">Loading...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && data.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={fetchAllData}
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            {editingId ? "Edit Casting Order" : "Add New Casting Order"}
          </h2>
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
                placeholder="Enter size"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                required
                min="1"
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
                <option value="pending">Pending</option>
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
              {loading
                ? "Saving..."
                : editingId
                ? "Update Order"
                : "Save Order"}
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
            placeholder="Search by client, product, or user..."
            className="border px-4 py-2 rounded w-full sm:w-64 order-2 sm:order-1"
            value={search}
            onChange={handleSearch}
          />
          {user.isAdmin && 
          <button
            onClick={handleAddOrder}
            className={`bg-blue-900 text-white px-4 py-2 rounded flex items-center justify-center gap-2 whitespace-nowrap order-1 sm:order-2 `}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Order</span>
            <span className="sm:hidden">Add Order</span>
          </button>
          }
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setActiveFilter("All")}
          className={`px-4 py-2 rounded transition-colors ${
            activeFilter === "All"
              ? "bg-blue-900 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter("Pending")}
          className={`px-4 py-2 rounded transition-colors ${
            activeFilter === "Pending"
              ? "bg-blue-900 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveFilter("Completed")}
          className={`px-4 py-2 rounded transition-colors ${
            activeFilter === "Completed"
              ? "bg-blue-900 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Pagination Info */}
      {pagination.totalCount > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredData.length} of {data.length} orders
          {pagination.totalCount && ` (Total: ${pagination.totalCount})`}
        </div>
      )}

      {/* Infinite Scroll Container */}
      <InfiniteScroll
        dataLength={filteredData.length}
        next={fetchMoreData}
        hasMore={pagination.hasMore}
        loader={<LoadingSpinner />}
        endMessage={
          <div className="text-center py-4 text-gray-500">
            <p>No more orders to load</p>
          </div>
        }
        scrollThreshold={0.8}
      >
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
              <th className="p-3 font-medium">Order Date</th>
              <th className={`p-3 font-medium ${user.operationTypeID == 2 ? "hidden" : ""}`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} className="border-t-[0.5px]">
                  <td className="p-3">{row.id}</td>
                  <td className="p-3">{row.client || "N/A"}</td>
                  <td className="p-3">{row.user || "N/A"}</td>
                  <td className="p-3">{row.product || "N/A"}</td>
                  <td className="p-3">{row.qty}</td>
                  <td className="p-3">{row.size}</td>
                  <td className="p-3">
                    <select
                      value={row.status}
                      onChange={(e) =>
                        handleStatusChange(row.id, e.target.value)
                      }
                      disabled={user.operationTypeID == 2 }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="pending">🔴 Pending</option>
                      <option value="completed">🟢 Completed</option>
                    </select>
                  </td>
                  <td className="p-3">{row.orderDate}</td>
                  <td className={`p-3 ${user.operationTypeID == 2 ? "hidden" : ""}`}>
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
                <td colSpan="9" className="text-center p-4 text-gray-500">
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
                <div className={`flex gap-2 ${user.operationTypeID == 2 ? "hidden" : ""}`}>
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
                  <div>{row.client || "N/A"}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">User Name :</span>
                  <div>{row.user || "N/A"}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Product :</span>
                  <div>{row.product || "N/A"}</div>
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
                  <span className="font-medium text-gray-600">
                    Order Date :
                  </span>
                  <div>{row.orderDate}</div>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-medium text-gray-600">Status :</span>
                  <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    disabled={user.operationTypeID == 2 }
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
      </InfiniteScroll>

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
