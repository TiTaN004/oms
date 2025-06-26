import React, { useEffect, useState } from "react";
import API_ENDPOINTS from "../../utils/apiConfig";
import { useAuth } from "../login/ProtectedRoute";

export default function index() {
const [data,setData] = useState([])
const [loading,setLoading] = useState(true)
const {user} = useAuth()

  const fetchReports = async () => {
    setLoading(true);
    
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

  useEffect(() => {
    fetchReports()
  
  }, [])
  
  return (
    <>
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-800 text-lg">
                In Progress Order
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{data.processing_orders}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-800 text-lg">
              Completed Order
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{data.completed_orders}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-purple-800 text-lg">Total Order</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{data.total_orders}</p>
          </div>
        </div>
        
      </div>
    </>
  );
}
