import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Save } from "lucide-react";
import API_ENDPOINTS from "../../utils/apiConfig";
import { useNavigate } from "react-router-dom";
// const sampleData = [
//   {
//     userID: 5,
//     name: "fortune casting",
//     userName: "Tunning",
//     mobileNo: "jasmin bhai",
//     password: "LOCK DABI",
//     Email: "t2@gmail.com",
//     UserType: "GE",
//   },
//   {
//     userID: 8,
//     name: "fortune casting",
//     userName: "Tunning",
//     mobileNo: "jasmin bhai",
//     password: "LOCK DABI",
//     Email: "t@gmail.com",
//     UserType: "Admin",
//   },
// ];

// Sample dropdown data (this would come from PHP backend)
// const sampleUserType = [
//   { id: 1, name: "Admin" },
//   { id: 2, name: "GE" },
//   { id: 3, name: "Buff" },
//   { id: 4, name: "Tunning" },
// ];

export default function index() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    userID: "",
    fullName: "",
    userName: "",
    mobileNo: "",
    password: "",
    operationTypeID: "",
    emailID: "",
  });

  const nav = useNavigate();

  // Dropdown data states
  const [userType, setUserType] = useState();
  const [loading, setLoading] = useState(true);

  // Fetch dropdown data from PHP backend
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USERS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setData(result.data);

      const resType = await fetch(API_ENDPOINTS.OPERATIONS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const typeData = await resType.json();
      setUserType(typeData.data);
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
    (item.userName || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAddOrder = () => {
    setShowAddForm(true);
  };

  const handleGoBack = () => {
    setShowAddForm(false);
    setFormData({
      userID: "",
      name: "",
      userName: "",
      mobileNo: "",
      password: "",
      operationTypeID: "",
      emailID: "",
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
      // Validate required fields
      if (
        !formData.fullName ||
        !formData.userName ||
        !formData.mobileNo ||
        !formData.password ||
        !formData.operationTypeID ||
        !formData.emailID
      ) {
        alert("Please fill in all required fields.");
        return;
      }
      // Get selected names for display
      const selectedUserType = userType.find(
        (c) => c.id.toString() === formData.operationTypeID
      );

      // Prepare data for PHP API
      const userData = {
        userID: formData.userID,
        fullName: formData.fullName,
        userName: formData.userName,
        mobileNo: formData.mobileNo,
        password: formData.password,
        operationTypeID: formData.operationTypeID,
        emailID: formData.emailID,
      };

      if (editingId) {
        // For demo purposes, update order locally
        const updatedUser = {
          userID: editingId,
          fullName: formData.fullName,
          userName: formData.userName,
          mobileNo: formData.mobileNo,
          password: formData.password,
          operationTypeID: selectedUserType?.id || "",
          emailID: formData.emailID,
        };
        // Update existing order
        const response = await fetch(API_ENDPOINTS.USERS, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        });

        setData((prev) =>
          prev.map((item) => (item.userID === editingId ? updatedUser : item))
        );
        setEditingId(null);
      } else {
        // For demo purposes, create new order locally
        const newUser = {
          fullName: formData.fullName,
          userName: formData.userName,
          mobileNo: formData.mobileNo,
          password: formData.password,
          operationTypeID: selectedUserType?.id || "",
          emailID: formData.emailID,
        };
        // Create new order
        const response = await fetch(API_ENDPOINTS.USERS, {
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
      fetchUser();
      setLoading(false);
    }
  };

  const handleAddNewItem = (type) => {
    nav(`/dashboard/${type.replace(" ", "-").toLowerCase()}`);
  };

  // Handle Edit Order
  const handleEdit = (user) => {
    setFormData({
      userID: user.userID,
      fullName: user.fullName,
      userName: user.userName,
      mobileNo: user.mobileNo,
      password: user.password,
      operationTypeID: user.operationTypeID,
      emailID: user.emailID,
    });

    setEditingId(user.userID);
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
      const response = await fetch(`${API_ENDPOINTS.USERS}/?id=${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // For demo purposes, delete locally
      setData((prev) => prev.filter((item) => item.userID !== deleteId));
    } catch (error) {
      console.error("Error deleting User:", error);
      alert("Failed to delete User. Please try again.");
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
            {option.operationName}
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
            <span className="hidden sm:inline">Back to User</span>
            <span className="sm:hidden">Back</span>
          </button>
          <h2 className="text-lg font-semibold cursor-pointer">Add New User</h2>
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
                name="fullName"
                value={formData.fullName}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="emailID"
                value={formData.emailID}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Email"
                required
              />
            </div>

            {/* userName */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                userName *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="userName"
                  placeholder="userName"
                  value={formData.userName}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>

            {/* mobileNo No. */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                mobileNo *
              </label>
              <input
                type="number"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter mobileNo No."
                required
              />
            </div>

            {/* UserType Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select UserType *
              </label>
              <CustomDropdown
                name="operationTypeID"
                value={formData.operationTypeID}
                onChange={handleFormChange}
                options={userType}
                placeholder="Select UserType"
                type="operation type"
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
        <h2 className="text-lg font-semibold">User</h2>

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
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">Add User</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left ">
              <th className="p-3 font-medium">Sr No.</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">userName</th>
              <th className="p-3 font-medium">mobileNo</th>
              <th className="p-3 font-medium">Password</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.userID} className="border-t-[0.5px]">
                  <td className="p-3">{row.userID}</td>
                  <td className="p-3">{row.fullName}</td>
                  <td className="p-3">{row.userName}</td>
                  <td className="p-3">{row.mobileNo}</td>
                  <td className="p-3">{row.password}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(row.userID)}
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

      {/* mobileNo/Tablet Card View */}
      <div className="lg:hidden space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((row) => (
            <div key={row.userID} className="border rounded-lg p-4 bg-gray-50">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-600">
                    Sr. No.
                  </div>
                  <div className="font-medium">{row.userID}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(row)}
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded cursor-pointer"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(row.userID)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card Content - 2 Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Name :</span>
                  <div>{row.fullName}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">userName :</span>
                  <div>{row.userName}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">mobileNo :</span>
                  <div>{row.mobileNo}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Password :</span>
                  <div>{row.password}</div>
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
                  Order ID: {data.find((item) => item.id === deleteId)?.userID}
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
