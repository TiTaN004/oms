import React from "react";

export default function index() {
  return (
    <>
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-800 text-lg">
                In Progress Order
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">1,234</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-800 text-lg">
              Completed Order
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">456</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-purple-800 text-lg">Total Order</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">789</p>
          </div>
        </div>
      </div>
    </>
  );
}
