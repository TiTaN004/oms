import React, { useState, useEffect } from "react";
import { Search, Download, RefreshCw, BarChart3, AlertCircle } from "lucide-react";
import API_ENDPOINTS from "../../utils/apiConfig";

// Update this to match your actual API path
const API_BASE_URL = API_ENDPOINTS.REPORT; // Adjust this path as needed

export default function ReportsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    clients: [],
    products: [],
    operationTypes: [],
    users: [],
    statusOptions: []
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    clientId: '',
    productId: '',
    operationTypeId: '',
    assignedUserId: '',
    status: '',
    search: ''
  });
  
  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    totalQuantity: 0,
    statusBreakdown: {}
  });

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
    fetchReports(); // Load initial data
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/filter-options`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setFilterOptions(result);
      setError('');
    } catch (error) {
      console.error('Error fetching filter options:', error);
      setError('Failed to load filter options. Please check your API connection.');
    }
  };

  const fetchReports = async (filterData = null) => {
    setLoading(true);
    setError('');
    
    try {
      let url = `${API_BASE_URL}/reports`;
      let options = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      // If filters are provided, use POST method with filters
      if (filterData && Object.values(filterData).some(value => value !== '')) {
        options.method = 'POST';
        options.body = JSON.stringify(filterData);
      } else {
        options.method = 'GET';
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data || []);
        if (result.summary) {
          setSummaryStats(result.summary);
        } else if (result.data) {
          // Calculate summary if not provided by API
          const calculatedStats = calculateClientSideSummary(result.data);
          setSummaryStats(calculatedStats);
        }
        setError('');
      } else {
        throw new Error(result.error || 'Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError(`Failed to fetch reports: ${error.message}`);
      setData([]);
      setSummaryStats({
        totalOrders: 0,
        totalAmount: 0,
        totalQuantity: 0,
        statusBreakdown: {}
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateClientSideSummary = (reports) => {
    const stats = {
      totalOrders: reports.length,
      totalAmount: 0,
      totalQuantity: 0,
      statusBreakdown: {
        Processing: 0,
        Completed: 0,
        Cancelled: 0
      }
    };
    
    reports.forEach(report => {
      stats.totalAmount += parseFloat(report.totalPrice) || 0;
      stats.totalQuantity += parseInt(report.productQty) || 0;
      
      if (stats.statusBreakdown.hasOwnProperty(report.status)) {
        stats.statusBreakdown[report.status]++;
      }
    });
    
    return stats;
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    fetchReports(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      fromDate: '',
      toDate: '',
      clientId: '',
      productId: '',
      operationTypeId: '',
      assignedUserId: '',
      status: '',
      search: ''
    };
    setFilters(resetFilters);
    fetchReports(); // Fetch all reports without filters
  };

  const exportToCSV = () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }
    
    const headers = [
      'Order No', 'Order Date', 'Client Name', 'Assigned To', 'Product',
      'Product Weight', 'Total Weight', 'Product Qty', 'Price Per Qty', 'Total Price', 'Status', 'Operation Type'
    ];
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        `"${row.orderNo || ''}"`,
        `"${row.orderDate || ''}"`,
        `"${row.clientName || ''}"`,
        `"${row.assignedTo || ''}"`,
        `"${row.product || ''}"`,
        `"${row.productWeight || ''}"`,
        `"${row.totalWeight || ''}"`,
        row.productQty || 0,
        row.pricePerQty || 0,
        row.totalPrice || 0,
        `"${row.status || ''}"`,
        `"${row.operationType || ''}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reports_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order Reports</h2>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={data.length === 0}
          >
            <Download size={16} />
            Export CSV
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <div>
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Filter Form */}
      <form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        {/* From Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.fromDate}
            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.toDate}
            onChange={(e) => handleFilterChange('toDate', e.target.value)}
          />
        </div>

        {/* Select Client */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
          <select 
            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.clientId}
            onChange={(e) => handleFilterChange('clientId', e.target.value)}
          >
            <option value="">--All Clients--</option>
            {filterOptions.clients.map(client => (
              <option key={client.id} value={client.id}>{client.clientName}</option>
            ))}
          </select>
        </div>

        {/* Select Product */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
          <select 
            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.productId}
            onChange={(e) => handleFilterChange('productId', e.target.value)}
          >
            <option value="">--All Products--</option>
            {filterOptions.products.map(product => (
              <option key={product.id} value={product.id}>{product.product_name}</option>
            ))}
          </select>
        </div>

        {/* Select Operation Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Operation Type</label>
          <select 
            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.operationTypeId}
            onChange={(e) => handleFilterChange('operationTypeId', e.target.value)}
          >
            <option value="">--All Operation Types--</option>
            {filterOptions.operationTypes.map(opType => (
              <option key={opType.id} value={opType.id}>{opType.operationName}</option>
            ))}
          </select>
        </div>

        {/* Select User Assign To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select User Assign To</label>
          <select 
            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.assignedUserId}
            onChange={(e) => handleFilterChange('assignedUserId', e.target.value)}
          >
            <option value="">--All Users--</option>
            {filterOptions.users.map(user => (
              <option key={user.userID} value={user.userID}>{user.fullName}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">--All Status--</option>
            {filterOptions.statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search orders, clients, products..."
            className="w-full border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Search Button */}
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-center lg:justify-start gap-2">
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center gap-2 bg-blue-900 text-white px-8 py-2 rounded hover:bg-blue-800 transition w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <Search size={16} />
            {loading ? 'Searching...' : 'Search Reports'}
          </button>
        </div>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <RefreshCw className="animate-spin mr-2" size={20} />
          <span>Loading reports...</span>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 font-medium">Order No</th>
              <th className="p-3 font-medium">Order Date</th>
              <th className="p-3 font-medium">Client Name</th>
              <th className="p-3 font-medium">Assigned To</th>
              <th className="p-3 font-medium">Product</th>
              <th className="p-3 font-medium">Product Weight</th>
              <th className="p-3 font-medium">Total Weight</th>
              <th className="p-3 font-medium">Product Qty</th>
              <th className="p-3 font-medium">Price Per Qty</th>
              <th className="p-3 font-medium">Total Price</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Operation Type</th>
            </tr>
          </thead>
          <tbody>
            {!loading && data.length > 0 ? (
              data.map((row, index) => (
                <tr key={row.orderID || index} className="border-t hover:bg-gray-50">
                  <td className="p-3">{row.orderNo || '-'}</td>
                  <td className="p-3">{row.orderDate || '-'}</td>
                  <td className="p-3">{row.clientName || '-'}</td>
                  <td className="p-3">{row.assignedTo || '-'}</td>
                  <td className="p-3">{row.product || '-'}</td>
                  <td className="p-3">{row.productWeight || '-'}</td>
                  <td className="p-3">{row.totalWeight || '-'}</td>
                  <td className="p-3">{row.productQty || 0}</td>
                  <td className="p-3">₹{row.pricePerQty || 0}</td>
                  <td className="p-3 font-semibold">₹{row.totalPrice || 0}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      row.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      row.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {row.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="p-3">{row.operationType || '-'}</td>
                </tr>
              ))
            ) : !loading ? (
              <tr>
                <td colSpan="12" className="text-center p-8 text-gray-500">
                  {error ? 'Unable to load reports. Please check your connection and try again.' : 'No reports found matching your criteria.'}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="xl:hidden space-y-4">
        {!loading && data.length > 0 ? (
          data.map((row, index) => (
            <div key={row.orderID || index} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3 pb-2 border-b border-gray-200">
                <div>
                  <div className="text-xs text-gray-500">Order</div>
                  <div className="font-semibold text-lg">{row.orderNo || '-'}</div>
                  <div className="text-sm text-gray-600">{row.orderDate || '-'}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="font-semibold text-lg text-green-600">₹{row.totalPrice || 0}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    row.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    row.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {row.status || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Client:</span>
                  <div className="font-medium">{row.clientName || '-'}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Assigned To:</span>
                  <div className="font-medium">{row.assignedTo || '-'}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Product:</span>
                  <div className="font-medium">{row.product || '-'}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Operation:</span>
                  <div className="font-medium">{row.operationType || '-'}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Product Weight:</span>
                  <div>{row.productWeight || '-'}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Total Weight:</span>
                  <div>{row.totalWeight || '-'}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Quantity:</span>
                  <div>{row.productQty || 0}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Price Per Qty:</span>
                  <div>₹{row.pricePerQty || 0}</div>
                </div>
              </div>
            </div>
          ))
        ) : !loading ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            {error ? 'Unable to load reports. Please check your connection and try again.' : 'No reports found matching your criteria.'}
          </div>
        ) : null}
      </div>
    </div>
  );
}