import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Save,
  User,
  SaveAll,
  X,
  Edit2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import API_ENDPOINTS from "../../utils/apiConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../login/ProtectedRoute";

// const sampleData = [
//   {
//     client: "DEF Industries",
//     id: "ORD001",
//     product: "LCOK DABI",
//     orderDate: "2024-06-07",
//     weight: 50,
//     weightType: "kg",
//     productWeight: 45,
//     productWeightType: "kg",
//     totalQty: 3000,
//     pricePerQty: 0,
//     totalPrice: 3000,
//     description: "High precision valve casting for industrial application",
//     operationType: "admin",
//     assignedUser: "null",
//     status: "in progress",
//   },
//   {
//     client: "DEF Manufacturing",
//     id: "ORD002",
//     product: "s hendal 4",
//     orderDate: "2024-06-08",
//     weight: 50,
//     weightType: "kg",
//     productWeight: 45,
//     productWeightType: "kg",
//     totalQty: 10,
//     pricePerQty: 150,
//     totalPrice: 1500,
//     description: "High precision valve casting for industrial application",
//     operationType: "Tunning",
//     assignedUser: "null",
//     status: "in progress",
//   },
// ];

// // Sample dropdown data (this would come from PHP backend)
// const sampleClients = [
//   { id: 1, name: "ABC Corp" },
//   { id: 2, name: "XYZ Ltd" },
//   { id: 3, name: "DEF Industries" },
//   { id: 4, name: "GHI Manufacturing" },
// ];

// const sampleProduct = [
//   { id: 1, name: "LCOK DABI" },
//   { id: 2, name: "s hendal 4" },
// ];

// const sampleWeightType = [
//   { id: 1, name: "kg" },
//   { id: 2, name: "gram" },
// ];
// const sampleProductWeightType = [
//   { id: 1, name: "kg" },
//   { id: 2, name: "gram" },
// ];
// const sampleOperationType = [
//   { id: 1, name: "admin" },
//   { id: 2, name: "GE" },
//   { id: 3, name: "Buff" },
//   { id: 4, name: "Tunning" },
// ];
// const sampleAssginedUser = [{ id: 1, name: "null" }];
// // Status utility functions
// const getStatusLabel = (status) => {
//   return status === 1 ? "Completed" : "Processing";
// };

const getStatusValue = (status) => {
  if (typeof status === "string") {
    return status.toLowerCase() === "completed" ? 1 : 0;
  }
  return status;
};

const getStatusIcon = (status) => {
  return status === 1 ? "🟢" : "🔴";
};

export default function index() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState();
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
    status: 0, // Changed to numeric default
  });

  // Dropdown data states
  const [clients, setClients] = useState();
  const [product, setProduct] = useState();
  const [weightTypes, setWeightTypes] = useState([]);
  const [productWeightType, setProductWeightType] = useState();
  const [operationType, setOperationType] = useState();
  const [assignedTo, setAssignedTo] = useState();
  const [loading, setLoading] = useState(false);

  // all filtered users
  const [allUsers, setAllUsers] = useState([]); // Store all users
  const [filteredAssignedTo, setFilteredAssignedTo] = useState([]); // Filtered users based on operation

  const nav = useNavigate();

  const {user} = useAuth()

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
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/?userID=${user.userID}&isAdmin=${user.isAdmin}`);
      const result = await response.json();
      // console.log(result.data)
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
          description: order.description,
          operationType: order.operationName,
          assignedUser: order.assignUser,
          status: order.status,
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
        operationTypeID: user.operationTypeID, // Add operationTypeID from API
      }));
      setAllUsers(mappedUsers); // Store all users
      setAssignedTo(mappedUsers); // Keep original state for compatibility
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // effect for operationType and allUsers to filter assigned users
  useEffect(() => {
    if (formData.operationType && allUsers.length > 0) {
      // Filter users based on selected operation type
      const filtered = allUsers.filter(
        (user) => user.operationTypeID.toString() === formData.operationType
      );
      setFilteredAssignedTo(filtered);

      // Reset assigned user if current selection is not valid for the new operation type
      const currentAssignedUser = filtered.find(
        (user) => user.id.toString() === formData.assignedUser
      );
      if (!currentAssignedUser) {
        setFormData((prev) => ({
          ...prev,
          assignedUser: "", // Reset if current user is not valid for selected operation
        }));
      }
    } else {
      // If no operation type selected, show all users
      setFilteredAssignedTo(allUsers);
    }
  }, [formData.operationType, allUsers]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredData = (data || []).filter((item) =>
    item?.client?.toLowerCase()?.includes(search?.toLowerCase())
  );

  const handleStatusChange = async (id, status) => {
    console.log(id)
    setLoading(true);
    try {
      // console.log(data)
      // Find the order to get its details
      // const order = data.find((item) => item.orderID === id);
      // console.log(order)
      // if (!order) {
      //   throw new Error("Order not found");
      // }

      // Prepare the status update payload - convert status to API format
      const statusUpdateData = {
        status: status === "Completed" ? "1" : "0", // Convert to string format expected by API
      };

      // Call API to update status
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusUpdateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state only if API call succeeds
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );

      console.log("Status updated successfully:", { id, status });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
      // Optionally refresh data from API to ensure consistency
      fetchOrders();
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
      status: 0, // Reset to numeric default
    });
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    console.log("value in int ", getStatusValue(value));
    // Handle status field specifically
    // if (name === "status") {
    //   setFormData((prev) => ({
    //     ...prev,
    //     [name]: getStatusValue(value), // Convert to numeric
    //   }));
    // } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // }
  };

  const handleFormSubmit = async () => {
    setLoading(true);

    try {
      // Get selected names for display
      const selectedClient = clients.find(
        (c) => c.id.toString() === formData.client
      );
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
        fClientID: formData.client,
        fProductID: formData.product,
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
        fAssignUserID: formData.assignedUser,
        status: formData.status === "Completed" ? "1" : "0", // Already numeric
      };

      if (editingId) {
        // Update existing order
        const response = await fetch(`${API_ENDPOINTS.ORDERS}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          throw new Error("Failed to update order");
        }

        // Update local state
        const updatedOrder = {
          id: editingId,
          client: selectedClient?.name || "",
          product: selectedProduct?.name || "",
          orderDate: formData.orderDate,
          weight: formData.weight,
          weightType: selectedWeightType?.name || "",
          productWeight: formData.productWeight,
          productWeightType: selectedProductWeightType?.name || "",
          totalQty: formData.totalQty,
          pricePerQty: formData.pricePerQty,
          totalPrice: formData.totalPrice,
          description: formData.description,
          operationType: selectedOperationType?.name || "",
          assignedUser: selectedAssignedTo?.name || "",
          status: formData.status === "Completed" ? "1" : "0",
          // Keep original IDs for editing
          fClientID: selectedClient?.id || "",
          fProductID: selectedProduct?.id || "",
          WeightTypeID: selectedWeightType?.id || "",
          productWeightTypeID: selectedProductWeightType?.id || "",
          fOperationID: selectedOperationType?.id || "",
          fAssignUserID: selectedAssignedTo?.id || "",
        };

        setData((prev) =>
          prev.map((item) => (item.id === editingId ? updatedOrder : item))
        );

        console.log("Order updated successfully:", orderData);
        setEditingId(null);
      } else {
        // Create new order
        const newOrderData = {
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
          status: formData.status === "Completed" ? "1" : "0", // Keep numeric
        };

        const response = await fetch(API_ENDPOINTS.ORDERS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrderData),
        });

        if (!response.ok) {
          throw new Error("Failed to create order");
        }

        const result = await response.json();

        // Create new order for local state
        const newOrder = {
          id: result.orderId, // Use returned ID or fallback
          client: selectedClient?.name || "",
          product: selectedProduct?.name || "",
          orderDate: formData.orderDate,
          weight: formData.weight,
          weightType: selectedWeightType?.name || "",
          productWeight: formData.productWeight,
          productWeightType: selectedProductWeightType?.name || "",
          totalQty: formData.totalQty,
          pricePerQty: formData.pricePerQty,
          totalPrice: formData.totalPrice,
          description: formData.description,
          operationType: selectedOperationType?.name || "",
          assignedUser: selectedAssignedTo?.name || "",
          status: formData.status, // Keep numeric
          // Store IDs for future editing
          fClientID: selectedClient?.id || "",
          fProductID: selectedProduct?.id || "",
          WeightTypeID: selectedWeightType?.id || "",
          productWeightTypeID: selectedProductWeightType?.id || "",
          fOperationID: selectedOperationType?.id || "",
          fAssignUserID: selectedAssignedTo?.id || "",
        };

        setData((prev) => [...prev, newOrder]);
        console.log("Order created successfully:", orderData);
      }

      handleGoBack();
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order. Please try again.");
    } finally {
      fetchOrders();
      setLoading(false);
    }
  };

  const handleAddNewItem = (type) => {
    if (type === "Client") {
      nav("/dashboard/client-master");
    } else if (type === "Product") {
      nav("/dashboard/products");
    } else if (type === "assignedUser") {
      nav("/dashboard/user");
    } else if (type === "operationType") {
      nav("/dashboard/operation-type");
    }
  };

  // Handle Edit Order
  // const handleEdit = async (order) => {
  //   console.log(order)
  //   const response = await fetch(
  //     API_ENDPOINTS.ORDERS + `/history/${order.id ? order.id : order.orderID}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   const result = await response.json();
  //   console.log(result)
  //   setOrderHistory(result.data);

  //   // Find the corresponding IDs for the dropdowns
  //   const clientId = clients.find((c) => c.name === order.client)?.id || "";
  //   console.log(clientId)
  //   const weightTypeId =
  //     weightTypes.find((p) => p.id === order.WeightTypeID)?.id || "";
  //   console.log(weightTypeId)

  //   const productId = product.find((p) => p.name === order.product)?.id || "";
  //   console.log(productId)

  //   const productWeightTypeId =
  //     productWeightType.find((p) => p.id === order.productWeightTypeID)?.id ||
  //     "";
  //   console.log(productWeightTypeId)

  //     const operationTypeId =
  //     operationType.find((p) => p.name === order.operationType)?.id || "";
  //   console.log(operationTypeId)

  //     const assignedToId =
  //     assignedTo.find((p) => p.id === order.fAssignUserID)?.id || "";
  //   console.log(assignedToId)

  //   setFormData({
  //     client: clientId.toString(),
  //     product: productId.toString(),
  //     orderDate: new Date(order.orderDate).toISOString().split("T")[0],
  //     weight: order.weight,
  //     weightType: weightTypeId.toString(),
  //     productWeight: order.productWeight,
  //     productWeightType: productWeightTypeId.toString(),
  //     totalQty: order.totalQty,
  //     pricePerQty: order.pricePerQty,
  //     totalPrice: order.totalPrice,
  //     description: order.description,
  //     operationType: operationTypeId.toString(),
  //     assignedUser: assignedToId.toString(),
  //     status: order.status, // Keep numeric status
  //   });

  //   console.log("formdata : ",{
  //     client: clientId.toString(),
  //     product: productId.toString(),
  //     orderDate: new Date(order.orderDate).toISOString().split("T")[0],
  //     weight: order.weight,
  //     weightType: weightTypeId.toString(),
  //     productWeight: order.productWeight,
  //     productWeightType: productWeightTypeId.toString(),
  //     totalQty: order.totalQty,
  //     pricePerQty: order.pricePerQty,
  //     totalPrice: order.totalPrice,
  //     description: order.description,
  //     operationType: operationTypeId.toString(),
  //     assignedUser: assignedToId.toString(),
  //     status: order.status, // Keep numeric status
  //   })

  //   setEditingId(order.id ? order.id : order.orderID);
  //   setShowAddForm(true);
  // };

  const handleEdit = async (order) => {
  const orderID = order.id || order.orderID;

  try {
    // Get full order details first
    const orderResponse = await fetch(`${API_ENDPOINTS.ORDERS}/${orderID}`);
    const fullOrder = await orderResponse.json();

    if (fullOrder.outVal !== 1 || !fullOrder.data) {
      alert("Full order data not found");
      return;
    }

    const o = fullOrder.data;

    // Fetch history too (optional, if needed for side panel)
    const historyResponse = await fetch(`${API_ENDPOINTS.ORDERS}/history/${orderID}`);
    const historyResult = await historyResponse.json();
    if (historyResult.outVal === 1) {
      setOrderHistory(historyResult.data);
    }

    // Find matching dropdown IDs
    const clientId = clients.find((c) => c.name === o.clientName)?.id || "";
    const productId = product.find((p) => p.name === o.productName)?.id || "";
    const weightTypeId = weightTypes.find((p) => p.id === o.weightTypeID)?.id || "";
    const productWeightTypeId = productWeightType.find((p) => p.id === o.productWeightTypeID)?.id || "";
    const operationTypeId = operationType.find((p) => p.name === o.operationName)?.id || "";
    const assignedToId = assignedTo.find((p) => p.id === o.fUserAssignID)?.id || "";

    // Set form data with full fields
    setFormData({
      client: clientId.toString(),
      product: productId.toString(),
      orderDate: new Date(o.orderOnRaw || o.orderOn).toISOString().split("T")[0],
      weight: o.weight,
      weightType: weightTypeId.toString(),
      productWeight: o.productWeight,
      productWeightType: productWeightTypeId.toString(),
      totalQty: o.productQty,
      pricePerQty: o.pricePerQty,
      totalPrice: o.totalPrice,
      description: o.description,
      operationType: operationTypeId.toString(),
      assignedUser: assignedToId.toString(),
      status: (o.status === "Completed" || o.status === 1 || o.status === "1") ? "Completed" : "Processing",
      // status: o.status === "Completed" || o.status === 1 ? "Completed" : "Processing",
    });

    setEditingId(orderID);
    setShowAddForm(true);
  } catch (error) {
    console.error("Error fetching order data for editing:", error);
    alert("Failed to load order for editing.");
  }
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
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      // Delete locally
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

  //logic to calculate totalQty and totalPrice
  const calculateQuantityAndPrice = (
    weight,
    weightType,
    productWeight,
    productWeightType,
    pricePerQty
  ) => {
    if (!weight || !weightType || !productWeight || !productWeightType) {
      return { totalQty: "", totalPrice: "" };
    }

    // Convert both weights to grams for consistent calculation
    let totalWeightInGrams = 0;
    let productWeightInGrams = 0;

    // Convert total weight to grams
    if (weightType === "KG") {
      totalWeightInGrams = parseFloat(weight) * 1000;
    } else {
      totalWeightInGrams = parseFloat(weight);
    }

    // Convert product weight to grams
    if (productWeightType === "KG") {
      productWeightInGrams = parseFloat(productWeight) * 1000;
    } else {
      productWeightInGrams = parseFloat(productWeight);
    }

    // Calculate total quantity (how many pieces can be made)
    const totalQty = Math.floor(totalWeightInGrams / productWeightInGrams);

    // Calculate total price
    const totalPrice = pricePerQty ? totalQty * parseFloat(pricePerQty) : "";

    return { totalQty, totalPrice };
  };

  useEffect(() => {
    // Get weight type names, handling both API response formats
    const selectedWeightType = weightTypes.find(
      (wt) => wt.id.toString() === formData.weightType
    );
    const selectedProductWeightType = productWeightType?.find(
      (pwt) => pwt.id.toString() === formData.productWeightType
    );

    const weightTypeName =
      selectedWeightType?.name || selectedWeightType?.weightType;
    const productWeightTypeName =
      selectedProductWeightType?.name || selectedProductWeightType?.weightType;
    const { totalQty, totalPrice } = calculateQuantityAndPrice(
      formData.weight,
      weightTypeName,
      formData.productWeight,
      productWeightTypeName,
      formData.pricePerQty
    );

    // Only update if values have changed to avoid infinite loop
    if (
      totalQty.toString() !== formData.totalQty ||
      totalPrice.toString() !== formData.totalPrice
    ) {
      setFormData((prev) => ({
        ...prev,
        totalQty: totalQty.toString(),
        totalPrice: totalPrice.toString(),
      }));
    }
  }, [
    formData.weight,
    formData.weightType,
    formData.productWeight,
    formData.productWeightType,
    formData.pricePerQty,
    weightTypes,
    productWeightType,
  ]);

  //history logic
  const [orderHistory, setOrderHistory] = useState([]);
  const [editingHistory, setEditingHistory] = useState({});

  const handleHistorySave = async (index) => {
    const historyItem = orderHistory[index];
    const updatedData = editingHistory[index];

    try {
      // API call to update order history
      const response = await fetch(`/api/order/${historyItem.orderID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: updatedData.status === "Completed" ? 1 : 0,
          description: updatedData.description,
        }),
      });

      if (response.ok) {
        setOrderHistory((prev) =>
          prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  status: updatedData.status,
                  description: updatedData.description,
                  isEditing: false,
                }
              : item
          )
        );

        // Clear editing state
        setEditingHistory((prev) => {
          const newState = { ...prev };
          delete newState[index];
          return newState;
        });
      }
    } catch (error) {
      console.error("Error updating history:", error);
    }
  };

  const handleHistoryCancel = (index) => {
    setOrderHistory((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isEditing: false } : item
      )
    );

    setEditingHistory((prev) => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  const handleHistoryInputChange = (index, field, value) => {
    setEditingHistory((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Processing":
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
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
        disabled={!user.isAdmin ? true : false}
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
  {formData}
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
            {/* <div>
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
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Qty *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="totalQty"
                  value={formData.totalQty}
                  readOnly
                  className="w-full border rounded px-3 py-2 outline-none bg-gray-50 text-gray-700"
                  placeholder="Calculated automatically"
                />
                <div className="absolute right-3 top-2 text-xs text-gray-500">
                  Auto-calculated
                </div>
              </div>
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
            {/* <div>
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
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Price *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="totalPrice"
                  value={formData.totalPrice}
                  readOnly
                  className="w-full border rounded px-3 py-2 outline-none bg-gray-50 text-gray-700"
                  placeholder="Calculated automatically"
                />
                <div className="absolute right-3 top-2 text-xs text-gray-500">
                  Auto-calculated
                </div>
              </div>
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
                options={filteredAssignedTo} // Use filtered users instead of assignedTo
                placeholder="Select User"
                type="assignedUser"
              />
              {formData.operationType && filteredAssignedTo.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  No users available for the selected operation type
                </p>
              )}
            </div>
            {/* Status */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              {console.log(formData)}
              {console.log(formData.status)}
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                disabled={!user.isAdmin ? true : false}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* <div>
              {console.log(data.product_image)}
              <img src={data.product_image} alt="" />
            </div> */}
          </div>

          {/* history  */}
          <div>
            <h3 className="font-bold pb-2">Order History</h3>
            {console.log("order history : ",orderHistory)}
            {Array.isArray(orderHistory) && orderHistory.length > 0 ? (
            // {orderHistory.length > 0 ? (
              orderHistory.map((row) => (
                <div key={row.orderID} className="border rounded-lg p-4 bg-gray-50 mt-2">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-sm text-gray-600">
                        Order ID
                      </div>
                      <div className="font-medium">{row.orderID}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded cursor-pointer"
                      >
                        <Pencil size={16} />
                      </button>
                      {/* <button
                        onClick={() => handleDelete(row.orderID)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button> */}
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
                    <div>
                      <span className="font-medium text-gray-600">
                        Operation Name :
                      </span>
                      <div>{row.operationType}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Assign To :
                      </span>
                      <div>{row.assignUser}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Description :
                      </span>
                      <div>{row.description}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Status :
                      </span>
                      <select
                        value={row.status}
                        onChange={(e) =>
                          handleStatusChange(row.orderID, e.target.value)
                        }
                        className="border px-2 py-1 rounded text-sm"
                        disabled={true}
                      >
                        <option value="Processing">🔴 Processing</option>
                        <option value="Completed">🟢 Completed</option>
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

          {/* {orderHistory.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{item.orderID}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.operation}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {item.assignTo}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(item.assignDate).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {item.isEditing ? (
                        <select
                          className="text-sm px-2 py-1 border border-gray-300 rounded"
                          value={editingHistory[index]?.status || item.status}
                          onChange={(e) => handleHistoryInputChange(index, 'status', e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {item.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      {item.isEditing ? (
                        <textarea
                          className="w-full text-sm px-2 py-1 border border-gray-300 rounded resize-none"
                          rows="2"
                          value={editingHistory[index]?.description || item.description}
                          onChange={(e) => handleHistoryInputChange(index, 'description', e.target.value)}
                        />
                      ) : (
                        <span className="text-sm text-gray-600">{item.description}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.isEditing ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleHistorySave(index)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Save"
                          >
                            <SaveAll className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleHistoryCancel(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleHistoryEdit(index)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))} */}

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
              <th className="p-3 font-medium">Description</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* {console.log("data ",data)}
            {console.log("filtered data ",filteredData)} */}
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
                  <td className="p-3">{row.description}</td>
                  {/* <td className="p-3">
                    <select
                      value={row.status}
                      onChange={(e) =>
                        handleStatusChange(row.id, e.target.value)
                      }
                      className="border px-2 py-1 rounded text-sm"
                      disabled={loading}
                    >
                      <option value="Processing">🔴 Processing</option>
                      <option value="Completed">🟢 Completed</option>
                    </select>
                  </td> */}
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
                        className={`text-red-600 hover:underline cursor-pointer ${!user.isAdmin ? "hidden" : ""}`}
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
                    className={`text-red-600 hover:bg-red-50 p-2 rounded cursor-pointer ${!user.isAdmin ? "hidden" : ""}` }
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
                  <span className="font-medium text-gray-600">
                    Description :
                  </span>
                  <div>{row.description}</div>
                </div>
                {/* <div>
                  <span className="font-medium text-gray-600">Status :</span> */}
                {/* <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                    disabled={loading}
                  >
                    <option value="Processing">🔴 Processing</option>
                    <option value="Completed">🟢 Completed</option>
                  </select> */}
                {/* <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    className="border px-3 py-1 rounded mt-1 w-full"
                  >
                    <option value="pending">🔴 Pending</option>
                    <option value="completed">🟢 Completed</option>
                  </select> */}
                {/* </div> */}
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
