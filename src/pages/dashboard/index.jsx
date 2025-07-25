import React, { useEffect, useState } from "react";
import API_ENDPOINTS from "../../utils/apiConfig";
import { useAuth } from "../login/ProtectedRoute";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `${API_ENDPOINTS.DASHBOARD}?userID=${user.userID}&isAdmin=${user.isAdmin}`;
      let options = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const response = await fetch(url, options);
      
      const result = await response.json();
      if (result.success) {
        setData(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError(`Failed to fetch reports: ${error.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (filterType = null) => {
    setOrdersLoading(true);
    setError(null);
    
    try {
      let url = `${API_ENDPOINTS.ORDERS}?userID=${user.userID}&isAdmin=${user.isAdmin}`;
      let options = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const response = await fetch(url, options);
      
      const result = await response.json();
      if (result.outVal === 1) {
        const fetchedOrders = result.data || [];
        setOrders(fetchedOrders);
        
        // Apply filter immediately after fetching if filterType is provided
        if (filterType) {
          applyFilter(fetchedOrders, filterType);
        } else {
          setFilteredOrders(fetchedOrders);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(`Failed to fetch orders: ${error.message}`);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const applyFilter = (ordersToFilter, filterType) => {
    let filtered = [];
    switch (filterType) {
      case 'processing':
        filtered = ordersToFilter.filter(order => order.status === 'Processing');
        break;
      case 'completed':
        filtered = ordersToFilter.filter(order => order.status === 'Completed');
        break;
      case 'total':
        filtered = ordersToFilter;
        break;
      default:
        filtered = ordersToFilter;
    }
    
    setFilteredOrders(filtered);
  };

  const handleTileClick = (filterType) => {
    setSelectedFilter(filterType);
    
    if (!orders.length) {
      // Pass the filterType to fetchOrders so it can apply the filter immediately
      fetchOrders(filterType);
    } else {
      // Orders already exist, just apply the filter
      applyFilter(orders, filterType);
    }
  };

  const resetFilter = () => {
    setSelectedFilter(null);
    setFilteredOrders([]);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getFilterTitle = () => {
    switch (selectedFilter) {
      case 'processing':
        return 'In Progress Orders';
      case 'completed':
        return 'Completed Orders';
      case 'total':
        return 'All Orders';
      default:
        return 'Orders';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="p-6 w-full">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          className="bg-blue-50 p-6 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => handleTileClick('processing')}
        >
          <h3 className="font-semibold text-blue-800 text-lg">
            In Progress Orders
          </h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {data.processing_orders || 0}
          </p>
        </div>
        
        <div 
          className="bg-green-50 p-6 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
          onClick={() => handleTileClick('completed')}
        >
          <h3 className="font-semibold text-green-800 text-lg">
            Completed Orders
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {data.completed_orders || 0}
          </p>
        </div>
        
        <div 
          className="bg-purple-50 p-6 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
          onClick={() => handleTileClick('total')}
        >
          <h3 className="font-semibold text-purple-800 text-lg">
            Total Orders
          </h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {data.total_orders || 0}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      {selectedFilter && (
  <div className="bg-white rounded-lg shadow-md">
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">
        {getFilterTitle()} ({filteredOrders.length})
      </h2>
      <button
        onClick={resetFilter}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        Close
      </button>
    </div>
    
    <div className="p-4">
      {ordersLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order No
                  </th>
                  {user.isAdmin && <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operation
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <tr key={order.orderID} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNo}
                    </td>
                    {user.isAdmin && <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {order.clientName}
                    </td>}
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {order.productName}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {order.operationName}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {order.productQty}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {order.assignedOn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet View */}
          <div className="hidden md:block lg:hidden">
            <div className="grid gap-4">
              {filteredOrders.map((order, index) => (
                <div key={order.orderID} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.orderNo}</h3>
                      {user.isAdmin && <p className="text-sm text-gray-600">{order.clientName}</p>}
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Product:</span>
                      <p className="font-medium">{order.productName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Operation:</span>
                      <p className="font-medium">{order.operationName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <p className="font-medium">{order.productQty}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Price:</span>
                      <p className="font-medium">{formatCurrency(order.totalPrice)}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-gray-500 text-sm">Assigned On:</span>
                    <p className="font-medium text-sm">{order.assignedOn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <div key={order.orderID} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{order.orderNo}</h3>
                      {user.isAdmin && <p className="text-gray-600 mt-1">{order.clientName}</p>}
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                      order.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Product:</span>
                      <span className="font-medium text-sm text-right">{order.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Operation:</span>
                      <span className="font-medium text-sm text-right">{order.operationName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Quantity:</span>
                      <span className="font-medium text-sm text-right">{order.productQty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Total Price:</span>
                      <span className="font-medium text-sm text-right">{formatCurrency(order.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-500 text-sm">Assigned On:</span>
                      <span className="font-medium text-sm text-right">{order.assignedOn}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No orders found for this filter.</p>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
}