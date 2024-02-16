import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const SalesManagement = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [category, setCategory] = useState([]);
  const [productType, setProductType] = useState("");
  const [sales, setSales] = useState([]);
  const [salesDate, setSalesDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = () => {
    fetch("http://localhost:8081/sales")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched sales data:", data);
        setSales(data); 
      })
      .catch((error) => {
        console.error("Error fetching sale data:", error);
      });
  };

  const currentDate = new Date();
  const options = {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);


  const handleAddSale = () => {
    
    if (!selectedDate || !productType || !totalAmount) {
      return;
    }
  
    const newSale = {
      saleOrderDate: selectedDate.toISOString(),
      
     
    };
  
   
    axios.post('http://localhost:8081/sales', newSale)
      .then(response => {
        console.log('New sale added successfully:', response.data);
        fetchSales();
      })
      .catch(error => {
        console.error('Error adding new sale:', error);
        
      });
  };

  return (
    <div className="flex-1">
      <div className="min-h-screen h-auto w-screen flex flex-col bg-purple-200 top-0">
        <div className="flex space-x-72 text-black font-medium mt-3">
          <h2 className="text-black font-bold text-xl ml-96">
            Sales Management
          </h2>
          <h1>{formattedDate}</h1>
        </div>

        <div className="mt-2 ml-14 justify-center">
          <h1 className="text-purple-800 font-bold text-left mb-1">
            Sales Details
          </h1>
          <div className=" flex flex-row">
            <div className="bg-white inline-block p-3 rounded-lg shadow-md">
              <table className="table-auto border-separate border border-none text-black">
                <thead>
                  <tr>
                    <th className="border-none px-4 py-2">Sales ID</th>
                    <th className="border-none px-4 py-2">Sales Date</th>
                    <th className="border-none px-4 py-2">Total Amount</th>
                    <th className="border-none px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-purple-100 p-2 text-black">
                  {console.log(sales)}
                  {sales.map((sale, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{sale.saleOrderID}</td>
                      <td className="border px-4 py-2">{sale.saleOrderDate}</td>
                      <td className="border px-4 py-2">{sale.saleOrderTotal}</td>
                      <td className="border px-1 py-1 flex justify-center">
                        <button className="bg-purple-800 text-white px-4 rounded-full">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className=" flex flex-col bg-white ml-16 p-4 rounded-lg shadow-md space-x-52">
              <div className=" flex flex-row">
                <h1 className=" text-black font-normal mr-5">Sales ID: </h1>
                <h1 className=" text-black font-normal">Sales Date: </h1>
              </div>

              <div className=" flex flex-col">
                <table className="table-auto border-separate border border-none text-black mt-3">
                  <thead>
                    <tr>
                      <th className="border-none px-4 py-2">Category ID</th>
                      <th className="border-none px-4 py-2">Product</th>
                      <th className="border-none px-4 py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody className="bg-purple-100 p-2">
                    <tr>
                      <td className="border px-4 py-2"></td>
                      <td className="border px-4 py-2"></td>
                      <td className="border px-4 py-2"></td>
                    </tr>
                  </tbody>
                </table>
                <h1 className=" text-black font-normal mr-5 mt-3">
                  Total Amount:{" "}
                </h1>
                <div>
                  <button
                    className="bg-purple-800 text-white px-4 py-2 rounded-full mt-5"
                    onClick={handleAddSale}
                  >
                    Add Sale
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mt-4 ml-14 justify-center">
            <h1 className="text-purple-800 font-bold text-left mb-1">
              Add New Sale
            </h1>
            <div className="inline-block bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <label
                  htmlFor="name"
                  className="text-black font-bold mr-4 whitespace-nowrap"
                >
                  Sales Date
                </label>
                <DatePicker
                  id="name"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  className="block w-72 ml-20 px-4 py-1 bg-gray-100 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:bg-white focus:border-purple-700"
                />
              </div>

              <div className="flex items-center mb-2">
                <label
                  htmlFor="type"
                  className="text-black font-bold mr-4 whitespace-nowrap"
                >
                  Product Category
                </label>
                <select
                  id="type"
                  value={productType}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-72 ml-8 px-4 py-1 bg-gray-100 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:bg-white focus:border-purple-700"
                >
                  <option value="">Select</option>
                  {category.map((category) => (
                    <option
                      key={category.categoryID}
                      value={category.categoryName}
                    >
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center mb-2">
                <label
                  htmlFor="type"
                  className="text-black font-bold mr-4 whitespace-nowrap"
                >
                  Products
                </label>
                <select
                  id="type"
                  className="block w-72 ml-24 px-4 py-1 bg-gray-100 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:bg-white focus:border-purple-700"
                >
                  <option value="type1">Select</option>
                  <option value="type2">Type 1</option>
                  <option value="type3">Type 2</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesManagement;
