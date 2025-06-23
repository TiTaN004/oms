import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Save } from "lucide-react";
import API_ENDPOINTS from "../../utils/apiConfig";
import { useNavigate } from "react-router-dom";
const sampleData = [
  // {
  //   id: 5,
  //   client: "fortune casting",
  //   operation: "Tunning",
  //   assignto: "jasmin bhai",
  //   product: "LOCK DABI",
  //   qty: 10,
  //   price: 0,
  //   totalprice: 3000,
  //   status: "pending",
  // },
  // {
  //   id: 4,
  //   client: "fortune casting",
  //   operation: "Tunning",
  //   assignto: "jasmin bhai",
  //   product: "LOCK DABI",
  //   qty: 10,
  //   price: 0,
  //   totalprice: 3000,
  //   status: "pending",
  // },
  {
    client: "DEF Industries",
    id: "ORD001",
    product: "LCOK DABI",
    orderDate: "2024-06-07",
    weight: 50,
    weightType: "kg",
    productWeight: 45,
    productWeightType: "kg",
    totalQty: 3000,
    pricePerQty: 0,
    totalPrice: 3000,
    description: "High precision valve casting for industrial application",
    operationType: "admin",
    assignedUser: "null",
    status: "in progress",
  },
  {
    client: "DEF Manufacturing",
    id: "ORD002",
    product: "s hendal 4",
    orderDate: "2024-06-08",
    weight: 50,
    weightType: "kg",
    productWeight: 45,
    productWeightType: "kg",
    totalQty: 10,
    pricePerQty: 150,
    totalPrice: 1500,
    description: "High precision valve casting for industrial application",
    operationType: "Tunning",
    assignedUser: "null",
    status: "in progress",
  },
];

// Sample dropdown data (this would come from PHP backend)
const sampleClients = [
  { id: 1, name: "ABC Corp" },
  { id: 2, name: "XYZ Ltd" },
  { id: 3, name: "DEF Industries" },
  { id: 4, name: "GHI Manufacturing" },
];

const sampleProduct = [
  { id: 1, name: "LCOK DABI" },
  { id: 2, name: "s hendal 4" },
];

const sampleWeightType = [
  { id: 1, name: "kg" },
  { id: 2, name: "gram" },
];
const sampleProductWeightType = [
  { id: 1, name: "kg" },
  { id: 2, name: "gram" },
];
const sampleOperationType = [
  { id: 1, name: "admin" },
  { id: 2, name: "GE" },
  { id: 3, name: "Buff" },
  { id: 4, name: "Tunning" },
];
const sampleAssginedUser = [{ id: 1, name: "null" }];

export default function index() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(sampleData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    client: "",
    product: "",
    orderDate: "",
    weight: "",
    weightType: "",
    productWeight: "",
    productWeightType: "",
    totalQty: "",
    pricePerQty: "",
    totalPrice: "",
    description: "",
    operationType: "",
    assignedUser: "",
    status: "",
  });

  // Dropdown data states
  const [clients, setClients] = useState(sampleClients);
  const [product, setProduct] = useState(sampleProduct);
  const [weightTypes, setWeightTypes] = useState([]);
  const [productWeightType, setProductWeightType] = useState(
    sampleProductWeightType
  );
  const [operationType, setOperationType] = useState(sampleOperationType);
  const [assignedTo, setAssignedTo] = useState(sampleAssginedUser);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  // Fetch dropdown data from PHP backend
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchOrders(),
        fetchClients(),
        fetchProducts(),
        fetchWeightTypes(),
        fetchOperationTypes(),
        fetchUsers(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ORDERS);
      const result = await response.json();

      if (result.outVal === 1) {
        // Transform API data to match UI expectations
        const transformedData = result.data.map((order) => ({
          id: order.orderID,
          orderNo: order.orderNo,
          client: order.clientName,
          product: order.productName,
          orderDate: order.orderOn,
          weight: order.weight,
          weightType: order.weightTypeText,
          productWeight: order.productWeight,
          productWeightType: order.productWeightText,
          totalQty: order.productQty,
          pricePerQty: order.pricePerQty,
          totalPrice: order.totalPrice,
          description: order.orderDetails,
          operationType: order.operationName,
          assignedUser: order.assignUser,
          status: order.status === 1 ? "Completed" : "Processing",
          // Keep original IDs for editing
          fClientID: order.fClientID,
          fProductID: order.fProductID,
          WeightTypeID: order.weightTypeID,
          productWeightTypeID: order.productWeightTypeID,
          fOperationID: order.fOperationID,
          fAssignUserID: order.fUserAssignID,
        }));
        setData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CLIENTS);
      const result = await response.json();
      const mappedClients = result.data.map((product) => ({
        id: product.id,
        name: product.clientName,
      }));
        setClients(mappedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS);
      const result = await response.json();
      const mappedProducts = result.data.map((product) => ({
        id: product.id || product.srno,
        name: product.product_name || product.productName,
      }));
      setProduct(mappedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchWeightTypes = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.WEIGHT);
      const result = await response.json();
      setProductWeightType(result.data);
      setWeightTypes(result.data);
    } catch (error) {
      console.error("Error fetching weight types:", error);
      // Fallback data
      setWeightTypes([
        { id: 1, name: "kg" },
        { id: 2, name: "gram" },
      ]);
    }
  };

  const fetchOperationTypes = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.OPERATIONS);
      const result = await response.json();
      const mappedOperationTypes = result.data.map((product) => ({
        id: product.id,
        name: product.operationName,
      }));
        setOperationType(mappedOperationTypes);
    } catch (error) {
      console.error("Error fetching operation types:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USERS);
      const result = await response.json();
      const mappedUsers = result.data.map((user) => ({
        id: user.userID,
        name: user.userName,
      }));
        setAssignedTo(mappedUsers);
      
    } catch (error) {
      console.error("Error fetching users:", error);
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
      product: "",
      orderDate: new Date().toISOString().split("T")[0],
      weight: "",
      weightType: "",
      productWeight: "",
      productWeightType: "",
      totalQty: "",
      pricePerQty: "",
      totalPrice: "",
      description: "",
      operationType: "",
      assignedUser: "",
      status: "processing",
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

    try {
      // Get selected names for display
      const selectedClient = clients.find(
        (c) => c.id.toString() === formData.client
      );
      console.log(selectedClient);
      const selectedProduct = product.find(
        (p) => p.id.toString() === formData.product
      );
      const selectedWeightType = weightTypes.find(
        (u) => u.id.toString() === formData.weightType
      );
      const selectedProductWeightType = productWeightType.find(
        (u) => u.id.toString() === formData.productWeightType
      );
      const selectedOperationType = operationType.find(
        (u) => u.id.toString() === formData.operationType
      );
      const selectedAssignedTo = assignedTo.find(
        (u) => u.id.toString() === formData.assignedUser
      );

      // Prepare data for PHP API
      const orderData = {
        client_id: formData.client,
        product_id: formData.product,
        order_date: formData.orderDate,
        weight: formData.weight,
        weightType: formData.weightType,
        productWeight: formData.productWeight,
        productWeightType: formData.productWeightType,
        totalQty: formData.totalQty,
        pricePerQty: formData.pricePerQty,
        totalPrice: formData.totalPrice,
        description: formData.description,
        operationType: formData.operationType,
        assignedUser: formData.assignedUser,
        status: formData.status,
      };

      if (editingId) {
        // For demo purposes, update order locally
        const updatedOrder = {
          id: editingId,
          fClientID: selectedClient?.id || "",
          fProductID: selectedProduct?.id || "",
          orderDate: formData.orderDate,
          weight: formData.weight,
          WeightTypeID: selectedWeightType?.id || "",
          productWeight: formData.productWeight,
          productWeightTypeID: selectedProductWeightType?.id || "",
          productQty: formData.totalQty,
          pricePerQty: formData.pricePerQty,
          totalPrice: formData.totalPrice,
          description: formData.description,
          fOperationID: selectedOperationType?.id || "",
          fAssignUserID: selectedAssignedTo?.id || "",
          status: formData.status,
        };
        // Update existing order
        const response = await fetch(`/api/casting-orders/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        });

        // const updatedOrder = {
        //   id: editingId,
        //   client: selectedClient?.name || "",
        //   product: selectedProduct?.name || "",
        //   orderDate: formData.orderDate,
        //   weight: formData.weight,
        //   weightType: selectedWeightType?.name || "",
        //   productWeight: formData.productWeight,
        //   productWeightType: selectedProductWeightType?.name || "",
        //   totalQty: formData.totalQty,
        //   pricePerQty: formData.pricePerQty,
        //   totalPrice: formData.totalPrice,
        //   description: formData.description,
        //   operationType: selectedOperationType?.name || "",
        //   assignedUser: selectedAssignedTo?.name || "",
        //   status: formData.status,
        // };

        setData((prev) =>
          prev.map((item) => (item.id === editingId ? updatedOrder : item))
        );

        console.log("Order updated successfully:", orderData);
        setEditingId(null);
      } else {
        // Create new order
        // For demo purposes, create new order locally
        const newOrder = {
          fClientID: selectedClient?.id || "",
          fProductID: selectedProduct?.id || "",
          orderDate: formData.orderDate,
          weight: formData.weight,
          WeightTypeID: selectedWeightType?.id || "",
          productWeight: formData.productWeight,
          productWeightTypeID: selectedProductWeightType?.id || "",
          productQty: formData.totalQty,
          pricePerQty: formData.pricePerQty,
          totalPrice: formData.totalPrice,
          description: formData.description,
          fOperationID: selectedOperationType?.id || "",
          fAssignUserID: selectedAssignedTo?.id || "",
          status: formData.status,
        };
        const response = await fetch(API_ENDPOINTS.ORDERS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newOrder)
        });

        // "Missing required fields: fClientID, fProductID, fOperationID, fAssignUserID, productQty, WeightTypeID, productWeightTypeID"

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
    if (type === "Client") {
      // Redirect to client creation page or show client creation form
      nav("/dashboard/client-master");
    }
    else if (type === "Product") {
      // Redirect to product creation page or show product creation form
      nav("/dashboard/products");
    } else if (type === "assignedUser") {
      // Redirect to user creation page or show user creation form
      nav("/dashboard/user");
    }else if (type === "operationType") {
      // Redirect to user creation page or show user creation form
      nav("/dashboard/operation-type");
    }
  };


  // Handle Edit Order
  const handleEdit = (order) => {
    console.log("order ", order);
    // Find the corresponding IDs for the dropdowns
    const clientId = clients.find((c) => c.name === order.client)?.id || "";

    console.log("clients", clients);
    const weightTypeId =
      weightTypes.find((p) => p.id === order.WeightTypeID)?.id || "";
    const productId = product.find((p) => p.name === order.product)?.id || "";
    const productWeightTypeId =
      productWeightType.find((p) => p.id === order.productWeightTypeID)?.id ||
      "";
    const operationTypeId =
      operationType.find((p) => p.name === order.operationType)?.id || "";
    const assignedToId =
      assignedTo.find((p) => p.id === order.fAssignUserID)?.id || "";

    setFormData({
      client: clientId.toString(),
      product: productId.toString(),
      orderDate: order.orderDate,
      weight: order.weight,
      weightType: weightTypeId.toString(),
      productWeight: order.productWeight,
      productWeightType: productWeightTypeId.toString(),
      totalQty: order.totalQty,
      pricePerQty: order.pricePerQty,
      totalPrice: order.totalPrice,
      description: order.description,
      operationType: operationTypeId.toString(),
      assignedUser: assignedToId.toString(),
      status: order.status,
    });

    setEditingId(order.id);
    setShowAddForm(true);
  };

  // Handle Delete Order
  const handleDelete = (id) => {
    console.log("clicked");
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      // Call PHP API to delete
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${deleteId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

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
                options={product}
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

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                weight *
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter size (e.g., 10x20cm)"
                required
              />
            </div>

            {/* Weight Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight Type *
              </label>
              <CustomDropdown
                name="weightType"
                value={formData.weightType}
                onChange={handleFormChange}
                options={weightTypes}
                placeholder="Select Weight Type"
                type="text"
              />
            </div>

            {/* Product Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Weight *
              </label>
              <input
                type="text"
                name="productWeight"
                value={formData.productWeight}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Product Weight Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Weight Type *
              </label>
              <CustomDropdown
                name="productWeightType"
                value={formData.productWeightType}
                onChange={handleFormChange}
                options={productWeightType}
                placeholder="Select Product Weight Type"
                type="productWeightType"
              />
            </div>

            {/* Total Qty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Qty *
              </label>
              <input
                type="text"
                name="totalQty"
                value={formData.totalQty}
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
                type="text"
                name="pricePerQty"
                value={formData.pricePerQty}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Total Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Price *
              </label>
              <input
                type="text"
                name="totalPrice"
                value={formData.totalPrice}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Opertional Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operation Type *
              </label>
              <CustomDropdown
                name="operationType"
                value={formData.operationType}
                onChange={handleFormChange}
                options={operationType}
                placeholder="Select User"
                type="operationType"
              />
            </div>

            {/* Assigned User Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned User *
              </label>
              <CustomDropdown
                name="assignedUser"
                value={formData.assignedUser}
                onChange={handleFormChange}
                options={assignedTo}
                placeholder="Select User"
                type="assignedUser"
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

  return (
    <div className="bg-white p-6 rounded shadow">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-lg font-semibold">Orders</h2>

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

      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left ">
              <th className="p-3 font-medium">Order ID</th>
              <th className="p-3 font-medium">Client Name</th>
              <th className="p-3 font-medium">Operation Name</th>
              <th className="p-3 font-medium">Assgin to</th>
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
                <tr key={row.id} className="border-t-[0.5px]">
                  <td className="p-3">{row.id}</td>
                  <td className="p-3">{row.client}</td>
                  <td className="p-3">{row.operationType}</td>
                  <td className="p-3">{row.assignedUser}</td>
                  <td className="p-3">{row.product}</td>
                  <td className="p-3">{row.totalQty}</td>
                  <td className="p-3">{row.pricePerQty}</td>
                  <td className="p-3">{row.totalPrice}</td>
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
                  <div className="font-semibold text-sm text-gray-600">
                    Order ID
                  </div>
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
                  <div>{row.client}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Operation Name :
                  </span>
                  <div>{row.operationType}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Assign To :</span>
                  <div>{row.assignedUser}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Product :</span>
                  <div>{row.product}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Product Qty :
                  </span>
                  <div>{row.totalQty}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Price :</span>
                  <div>{row.pricePerQty}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Total Price :
                  </span>
                  <div>{row.totalPrice}</div>
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
