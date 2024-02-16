import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import SalesManagement from "../components/Sales/SalesManagement";
import StockManagement from "../components/Stock/StockManagement";
import ProductManagement from "../components/Product/ProductManagement";
import productIcon from "../assets/product.png";
import stockIcon from "../assets/stock.png";
import salesIcon from "../assets/sales.png";

const Home = () => {
  return (
    <Router>
      <div className="flex">
        <div className=" flex-1">
          <div className="bg-white h-full w-56 text-center">
            <h3 className=" text-black text-2xl font-bold p-5">RETAIL STORE</h3>
            <hr className=" border border-gray-300 w-full my-4" />
            <div className="text-black mt-8 space-y-8 font-semibold">
              <NavLink to="/product" className="block">
                <img
                  src={productIcon}
                  alt="ProductIcon"
                  className="inline-block h-6 w-6 mr-2"
                />
                Product Management
              </NavLink>
              
              <NavLink to="/stock" className="block mr-5">
                <img
                  src={stockIcon}
                  alt="ProductIcon"
                  className="inline-block h-6 w-6 mr-2"
                />
                Stock Management
              </NavLink>
              <NavLink to="/sales" className="block mr-5">
                <img
                  src={salesIcon}
                  alt="ProductIcon"
                  className="inline-block h-6 w-6 mr-2"
                />
                Sales Management
              </NavLink>
            </div>
          </div>
        </div>
        <Routes>
          <Route path="/product" element={<ProductManagement />} />
          <Route path="/sales" element={<SalesManagement />} />
          <Route path="/stock" element={<StockManagement />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Home;
