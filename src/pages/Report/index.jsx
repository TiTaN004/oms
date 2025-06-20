import React, { useState } from "react";
import { Pencil, Trash2, ChevronDown, Plus } from "lucide-react";
const sampleData = [
  {
    SrNo: 5,
    OrderNo: 1,
    OrderDate: "26-May-2025",
    ClientName: "fortune casting",
    AssignTo: "jasmin Bhai",
    Product: "LOCK DABI",
    ProductWeight: "070 gram",
    TotalWeight: "210 kilogram",
    ProductQty: "3000",
    PricePerQty: "0",
    TotalPrice: "3000",
  },
  {
    SrNo: 6,
    OrderNo: 1,
    OrderDate: "26-May-2025",
    ClientName: "fortune casting",
    AssignTo: "jasmin Bhai",
    Product: "LOCK DABI",
    ProductWeight: "070 gram",
    TotalWeight: "210 kilogram",
    ProductQty: "3000",
    PricePerQty: "0",
    TotalPrice: "3000",
  },
];
export default function index() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(sampleData);

  const handleSearch = (e) => {
        setSearch(e.target.value);
      };

  const filteredData = data.filter((item) =>
    item.ClientName.toLowerCase().includes(search.toLowerCase())
  );
  return (
<div className="bg-white p-4 sm:p-6 rounded shadow">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold">Client Master</h2>
  </div>

  {/* Filter Form */}
  <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
    {/* From Date */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
      <input
        type="date"
        className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="From Date"
      />
    </div>

    {/* To Date */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
      <input
        type="date"
        className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="To Date"
      />
    </div>

    {/* Select Client */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
      <select className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
        <option>--All Client--</option>
        {/* dynamic options */}
      </select>
    </div>

    {/* Select Product */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
      <select className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
        <option>--All Product--</option>
      </select>
    </div>

    {/* Select Operation Type */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Operation Type</label>
      <select className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
        <option>--All Operation Type--</option>
      </select>
    </div>

    {/* Select User Assign To */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Select User Assign To</label>
      <select className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
        <option>--All User Assign To--</option>
      </select>
    </div>

    {/* Status */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <select className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
        <option>--All Status--</option>
      </select>
    </div>

    {/* Search Input */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
      <input
        type="text"
        placeholder="Search"
        className="w-full border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={handleSearch}
      />
    </div>

    {/* Search Button - Full width on mobile, auto on larger screens */}
    <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-center lg:justify-start">
      <button
        type="submit"
        className="bg-blue-900 text-white px-8 py-2 rounded hover:bg-blue-800 transition w-full sm:w-auto"
      >
        Search
      </button>
    </div>
  </form>

  {/* Desktop Table View */}
  <div className="hidden xl:block overflow-x-auto">
    <table className="min-w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-3 font-medium">Sr. No.</th>
          <th className="p-3 font-medium">Order No</th>
          <th className="p-3 font-medium">Order Date</th>
          <th className="p-3 font-medium">Client Name</th>
          <th className="p-3 font-medium">Assign To</th>
          <th className="p-3 font-medium">Product</th>
          <th className="p-3 font-medium">Product Weight</th>
          <th className="p-3 font-medium">Total Weight</th>
          <th className="p-3 font-medium">Product Qty</th>
          <th className="p-3 font-medium">Product Per Qty</th>
          <th className="p-3 font-medium">Total</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length > 0 ? (
          filteredData.map((row) => (
            <tr key={row.srno} className="border-t-[0.5px]">
              <td className="p-3">{row.SrNo}</td>
              <td className="p-3">{row.OrderNo}</td>
              <td className="p-3">{row.OrderDate}</td>
              <td className="p-3">{row.ClientName}</td>
              <td className="p-3">{row.AssignTo}</td>
              <td className="p-3">{row.Product}</td>
              <td className="p-3">{row.ProductWeight}</td>
              <td className="p-3">{row.TotalWeight}</td>
              <td className="p-3">{row.ProductQty}</td>
              <td className="p-3">{row.PricePerQty}</td>
              <td className="p-3">{row.TotalPrice}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="11" className="text-center p-4 text-gray-500">
              No matching records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Tablet Horizontal Scroll Table */}
  <div className="hidden lg:block xl:hidden overflow-x-auto">
    <table className="min-w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2 text-sm font-medium min-w-[60px]">Sr. No.</th>
          <th className="p-2 text-sm font-medium min-w-[100px]">Order No</th>
          <th className="p-2 text-sm font-medium min-w-[100px]">Date</th>
          <th className="p-2 text-sm font-medium min-w-[120px]">Client</th>
          <th className="p-2 text-sm font-medium min-w-[100px]">Assign To</th>
          <th className="p-2 text-sm font-medium min-w-[100px]">Product</th>
          <th className="p-2 text-sm font-medium min-w-[80px]">P. Weight</th>
          <th className="p-2 text-sm font-medium min-w-[80px]">T. Weight</th>
          <th className="p-2 text-sm font-medium min-w-[60px]">Qty</th>
          <th className="p-2 text-sm font-medium min-w-[80px]">Per Qty</th>
          <th className="p-2 text-sm font-medium min-w-[80px]">Total</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length > 0 ? (
          filteredData.map((row) => (
            <tr key={row.srno} className="border-t-[0.5px]">
              <td className="p-2 text-sm">{row.SrNo}</td>
              <td className="p-2 text-sm">{row.OrderNo}</td>
              <td className="p-2 text-sm">{row.OrderDate}</td>
              <td className="p-2 text-sm">{row.ClientName}</td>
              <td className="p-2 text-sm">{row.AssignTo}</td>
              <td className="p-2 text-sm">{row.Product}</td>
              <td className="p-2 text-sm">{row.ProductWeight}</td>
              <td className="p-2 text-sm">{row.TotalWeight}</td>
              <td className="p-2 text-sm">{row.ProductQty}</td>
              <td className="p-2 text-sm">{row.PricePerQty}</td>
              <td className="p-2 text-sm">{row.TotalPrice}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="11" className="text-center p-4 text-gray-500">
              No matching records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Mobile/Small Tablet Card View */}
  <div className="lg:hidden space-y-4">
    {filteredData.length > 0 ? (
      filteredData.map((row) => (
        <div key={row.srno} className="border rounded-lg p-4 bg-gray-50">
          {/* Card Header */}
          <div className="flex justify-between items-start mb-3 pb-2 border-b border-gray-200">
            <div>
              <div className="text-xs text-gray-500">Order #{row.SrNo}</div>
              <div className="font-semibold text-lg">{row.OrderNo}</div>
              <div className="text-sm text-gray-600">{row.OrderDate}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Total</div>
              <div className="font-semibold text-lg text-green-600">{row.TotalPrice}</div>
            </div>
          </div>

          {/* Card Content - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Client:</span>
              <div className="font-medium">{row.ClientName}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Assigned To:</span>
              <div>{row.AssignTo}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Product:</span>
              <div>{row.Product}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Quantity:</span>
              <div>{row.ProductQty}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Product Weight:</span>
              <div>{row.ProductWeight}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Total Weight:</span>
              <div>{row.TotalWeight}</div>
            </div>
            <div className="sm:col-span-2">
              <span className="font-medium text-gray-600">Price Per Qty:</span>
              <div>{row.PricePerQty}</div>
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
</div>
  );
}
