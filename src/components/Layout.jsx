import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  FileText,
  Mail,
  Search,
  Menu,
  LogOut,
  ShoppingCart,
  Package,
  Users,
  Box,
  BookUser,
  Workflow,
  IdCardLanyard,
  FileTextIcon,
  Database,
} from "lucide-react";
import Dashboard from "../pages/dashboard";
import CastingOrder from "../pages/CastingOrder";
import Orders from "../pages/Orders";
import { useNavigate } from "react-router-dom";
import UserComponent from "../pages/User";
import Product from "../pages/Product";
import ClientMaster from "../pages/ClientMaster";
import OperationType from "../pages/OperationTypeMaster";
import Report from "../pages/Report";
import logo from "../assets/OTPlogo.png";
import { useAuth, useRouteGuard } from "../pages/login/ProtectedRoute";

export default function Sidebar() {
  const { user, logout, isLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('/dashboard');

  // const [userName] = useState(user?.fullName || "User");
  const userName = user?.fullName || 'User';

  const { canAccess } = useRouteGuard();

  const navigation = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuClick = (route,label) => {
      setCurrentPage(label);     // for showing label in header
  setCurrentRoute(route);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // const handleLogout = () => {
  //   console.log("Logging out...");
  //   // logout();
  //   navigation("/");
  //   setIsDropdownOpen(false);
  // };

  const handleLogout = () => {
  logout();            // centralised cleanup
  navigation('/');
  setIsDropdownOpen(false);
};

  if (isLoading) {
  return (
    <div className="flex items‑center justify‑center h‑screen bg‑gray‑100">
      <div className="text‑gray‑600">Loading&nbsp;...</div>
    </div>
  );
}

  // const menuItems = [
  //   { icon: Home, label: 'Dashboard', component: Dashboard },
  //   { icon: Box, label: 'Casting Order', component: CastingOrder },
  //   { icon: Database, label: 'Orders', component: Orders },
  //   { icon: Users, label: 'User', component: UserComponent },
  //   { icon: Package, label: 'Products', component: Product },
  //   { icon: IdCardLanyard, label: 'Client Master', component: ClientMaster },
  //   { icon: Workflow, label: 'Operation Type', component: OperationType },
  //   { icon: FileTextIcon, label: 'Report', component: Report },
  // ];

  const menuItems = [
    { icon: Home, label: "Dashboard", route: "/dashboard" },
    { icon: Box, label: "Casting Order", route: "/casting-orders" },
    { icon: Database, label: "Orders", route: "/orders" },
    { icon: Users, label: "User", route: "/user" },
    { icon: Package, label: "Products", route: "/products" },
    { icon: IdCardLanyard, label: "Client Master", route: "/client-master" },
    { icon: Workflow, label: "Operation Type", route: "/operation-type" },
    { icon: FileTextIcon, label: "Report", route: "/report" },
  ];

  // Only render items user can access
  const filteredMenuItems = menuItems.filter((item) => canAccess(item.route));

  const componentMap = {
    "/dashboard": Dashboard,
    "/casting-orders": CastingOrder,
    "/orders": Orders,
    "/user": UserComponent,
    "/products": Product,
    "/client-master": ClientMaster,
    "/operation-type": OperationType,
    "/report": Report,
  };

  // Get current page component
  // const getCurrentPageComponent = () => {
  //   const currentMenuItem = menuItems.find(
  //     (item) => item.label === currentPage
  //   );
  //   const Component = currentMenuItem ? currentMenuItem.component : Dashboard;
  //   return <Component />;
  // };

  // const getCurrentPageComponent = () => {
  //   const currentMenuItem = menuItems.find(
  //     (item) => item.label === currentPage
  //   );
  //   const Component = currentMenuItem
  //     ? componentMap[currentMenuItem.route]
  //     : Dashboard;
  //   return <Component />;
  // };

  const getCurrentPageComponent = () => {
  const Component = componentMap[currentRoute] || Dashboard;
  return <Component />;
};

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-[#002981] text-white transition-all duration-300 ease-in-out flex flex-col md:relative md:z-auto fixed left-0 top-0 h-full z-40 shadow-xl ${
          isCollapsed ? "md:w-20 -translate-x-full md:translate-x-0" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700">
          <div className={"flex items-center justify-between"}>
            <img
              src={logo}
              className={`bg-white rounded-full m-auto w-[150px] shadow-[0px_0px_10px_3px_#fff] hover:shadow-[0px_0px_15px_5px_#fff] ring-white font-bold text-xl transition-opacity duration-300 ${
                isCollapsed ? "opacity-0 overflow-hidden" : "opacity-100"
              }`}
            />
            <button
              onClick={toggleSidebar}
              className=" md:hidden p-2 rounded-lg hover:bg-[#004181] transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredMenuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <button
                    onClick={() => handleMenuClick(item.route,item.label)}
                    className={`w-full flex items-center p-3 rounded-lg hover:bg-[#004181] transition-colors group ${
                      currentRoute === item.route ? "bg-[#004181]" : ""
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span
                      className={`ml-3 transition-all duration-300 text-left ${
                        isCollapsed
                          ? "opacity-0 w-0 overflow-hidden hidden"
                          : "opacity-100"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
            {/* {filteredMenuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <button
                    onClick={() => handleMenuClick(item.route)}
                    className={`... ${
                      currentRoute === item.route ? "bg-[#004181]" : ""
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })} */}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? "" : "md:ml-0"
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:block"
                aria-label="Toggle sidebar"
              >
                <Menu size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  Welcome {userName}
                </h1>
                <p className="text-sm text-gray-500">{currentPage}</p>
              </div>
            </div>

            {/* Right side */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content - This is where your different page components will render */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {getCurrentPageComponent()}
        </main>
      </div>
    </div>
  );
}
