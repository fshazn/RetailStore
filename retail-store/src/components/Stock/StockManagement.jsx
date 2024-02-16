import React, { useState, useEffect } from "react";
import EditIcon from "../../assets/edit1.png";
import DeleteIcon from "../../assets/delete.png";
import axios from "axios";

const StockManagement = () => {
  const currentDate = new Date();
  const options = {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  const [stocks, setStocks] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [productName, setProductName] = useState("");
  const [stockType, setStockType] = useState("");
  const [productType, setProductType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryType, setCategoryType] = useState("");

  useEffect(() => {
    fetchStock();
    fetchCategory();
  }, []);

  const fetchStock = () => {
    fetch("http://localhost:8081/stocks")
      .then((response) => response.json())
      .then((data) => {
        setStocks(data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  };

  const fetchCategory = async () => {
    const result = await axios.get("http://localhost:8081/categories");
    setCategory(result.data);
  };

  const handleEditRow = (stock) => {
    setEditMode(true);
    setSelectedProduct(stock); // Set the selected product
    setProductName(stock.product.productName);
    setCategoryType(stock.product.category.categoryName);
    setQuantity(stock.stockQuantity);
  };

  const clearFields = () => {
    setProductName("");
    setProductType("");
    setQuantity("");
  };
  const updateStock = async () => {
    try {
      await axios.put(
        "http://localhost:8081/stocks/${selectedProduct.product.productID}",
        quantity,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedStocks = stocks.map((stock) =>
        stock.stockID === selectedProduct.stockID
          ? { ...stock, type: stockType, quantity: quantity }
          : stock
      );
      setStocks(updatedStocks);

      clearFields();
      setEditMode(false);
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDeleteRow = (stock) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this row?"
    );
    if (isConfirmed) {
      const updatedStocks = stocks.filter((s) => s.stockID !== stock.stockID);
      setStocks(updatedStocks);

      axios
        .delete(`http://localhost:8081/stocks/${stock.stockID}`)
        .then((response) => {
          console.log("Row deleted successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error deleting row:", error);
        });
    }
  };

  return (
    <div className="flex-1">
      <div className="min-h-screen h-auto w-screen flex flex-col bg-purple-200 top-0">
        <div className="flex space-x-72 text-black font-medium mt-3">
          <h2 className="text-black font-bold text-xl ml-96">
            Stock Management
          </h2>
          <h1>{formattedDate}</h1>
        </div>

        <div className="mt-2 ml-14 justify-center">
          <h1 className="text-purple-800 font-bold text-left mb-1">
            Stock Details
          </h1>
          <div className="bg-white inline-block p-3 rounded-lg shadow-md">
            <table className="table-auto border-separate border border-none text-black">
              <thead>
                <tr>
                  <th className="border-none px-4 py-2">Stock ID</th>
                  <th className="border-none px-4 py-2">Product Code</th>
                  <th className="border-none px-4 py-2">Product Name</th>
                  <th className="border-none px-4 py-2">Quantity</th>
                  <th className="border-none px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-purple-100">
                {stocks.map((stock, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{stock.stockID}</td>
                    <td className="border px-4 py-2">
                      {stock.product?.productID}
                    </td>
                    <td className="border px-4 py-2">
                      {stock.product?.productName}
                    </td>
                    <td className="border px-4 py-2">{stock.stockQuantity}</td>
                    <td className="border px-4 py-2 flex justify-center gap-8">
                      <img
                        src={EditIcon}
                        alt="EditIcon"
                        className="inline-block h-6 w-6 cursor-pointer"
                        onClick={() => handleEditRow(stock)}
                      />
                      <img
                        src={DeleteIcon}
                        alt="DeleteIcon"
                        className="inline-block h-6 w-6 cursor-pointer"
                        onClick={() => handleDeleteRow(stock)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-row">
          <div className="mt-4 ml-14 justify-center">
            <h1 className="text-purple-800 font-bold text-left mb-1">
              Add New Stock
            </h1>
            <div className="inline-block bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <label
                  htmlFor="type"
                  className="text-black font-bold mr-4 whitespace-nowrap"
                >
                  Category Type
                </label>
                <select
                  id="type"
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                  className="block w-72 ml-9 px-4 py-1 bg-gray-100 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:bg-white focus:border-purple-700"
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
                  htmlFor="name"
                  className="text-black font-bold mr-4 whitespace-nowrap"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="block w-72 ml-9 px-4 py-1 bg-gray-100 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:bg-white focus:border-purple-700"
                />
              </div>
              <div className="flex items-center mb-2">
                <label
                  htmlFor="quantity"
                  className="text-black font-bold mr-4 whitespace-nowrap"
                >
                  Quantity
                </label>
                <input
                  type="text"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="block w-72 ml-20 px-4 py-1 bg-gray-100 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:bg-white focus:border-purple-700"
                />
              </div>

              <button
                className="bg-purple-800 text-white py-2 px-4 rounded-full ml-40 mt-3"
                onClick={updateStock}
              >
                Add New Stock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
