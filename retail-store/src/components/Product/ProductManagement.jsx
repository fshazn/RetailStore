import React, { useState, useEffect } from "react";
import EditIcon from "../../assets/edit1.png";
import axios from "axios";

const ProductManagement = () => {
  const currentDate = new Date();
  const options = {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productType, setProductType] = useState("");
  const [productStock, setProductStock] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState(null);
  const selectedCategory = category.find(
    (cat) => cat.categoryName === productType
  );

  useEffect(() => {
    fetchProducts();
    fetchCategory();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:8081/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  };

  const fetchCategory = async () => {
    const result = await axios.get("http://localhost:8081/categories");
    setCategory(result.data);
  };

 
  const handleEditRow = (product) => {
    setEditMode(true);
    setProductName(product.productName);
    setProductType(product.category.categoryName);
    setProductDescription(product.productDescription);
    setProductPrice(product.productPrice);
    setProductStock(product.stockQuantity);
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = {
        product: {
          productName: productName,
          productDescription: productDescription,
          productPrice: parseFloat(productPrice), 
          category: {
            categoryID: selectedCategory ? selectedCategory.categoryID : null,
          },
        },
        stockQuantity: productStock,
      };
      console.log(newProduct);

      const response = await axios.post(
        "http://localhost:8081/products",
        newProduct
      );
      setProducts([...products, response.data]);

      clearFields();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = () => {
    const updatedProduct = {
      ...selectedProduct,
      productName,
      category: { categoryName: productType },
      productDescription,
      productPrice,
    };

    axios
      .put(
        "http://localhost:8081/products/${selectedProduct.productID}",
        updatedProduct
      )
      .then((response) => {
        console.log("Product updated successfully:", response.data);
       
        const updatedProducts = products.map((product) =>
          product.productID === selectedProduct.productID
            ? updatedProduct
            : product
        );
        setProducts(updatedProducts);
        // Clear input fields
        clearFields();
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post("http://localhost:8081/categories", {
        categoryName: newCategory,
      });
      console.log("New category added:", response.data);
      
      setCategory([...category, response.data]);
     
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const clearFields = () => {
    setProductName("");
    setProductType("");
    setProductDescription("");
    setProductPrice("");
  };

  return (
    <div className="flex-1">
      <div className="min-h-screen h-auto w-screen flex flex-col bg-purple-200 top-0">
        <div className="flex space-x-72 text-black font-medium mt-3">
          <h2 className="text-black font-bold text-xl ml-96">
            Product Management
          </h2>
          <h1>{formattedDate}</h1>
        </div>

        <div className="mt-2 ml-14 justify-center">
          <h1 className="text-purple-800 font-bold text-left mb-1">
            Product Details
          </h1>
          <div className="bg-white inline-block p-3 rounded-lg shadow-md">
            <table className="table-auto border-separate border border-none text-black">
              <thead>
                <tr>
                  <th className="border-none px-4 py-2">Product Code</th>
                  <th className="border-none px-4 py-2">Name</th>
                  <th className="border-none px-4 py-2">Type</th>
                  <th className="border-none px-4 py-2">Description</th>
                  <th className="border-none px-4 py-2">Unit Price</th>
                  {/* <th className="border-none px-4 py-2">Stock</th> */}
                  <th className="border-none px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-purple-100 text-black">
                {console.log(products)}

                {products.map((product, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{product.productID}</td>
                    <td className="border px-4 py-2">{product.productName}</td>
                    <td className="border px-4 py-2">
                      {product.category.categoryName}
                    </td>
                    <td className="border px-4 py-2">
                      {product.productDescription}
                    </td>
                    <td className="border px-4 py-2">{product.productPrice}</td>
                    {/* <td className="border px-4 py-2">{product.stockQuantity}</td> */}
                    <td className="border px-4 py-2 flex justify-center">
                      <img
                        src={EditIcon}
                        alt="EditIcon"
                        className="inline-block h-6 w-6 cursor-pointer"
                        onClick={() => handleEditRow(product)}
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
              Add/Update New Product
            </h1>
            <div className="inline-block bg-white p-4 rounded-lg shadow-md">
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
                  className="block w-72 ml-10 px-4 py-1 bg-gray-100 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:bg-white focus:border-purple-700"
                />
              </div>
              <div className="flex items-center mb-2">
                <label
                  htmlFor="description"
                  className="text-black font-bold mr-4 whitespace-nowrap"
                >
                  Product Description
                </label>
                <textarea
                  id="description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="block w-72 px-4 py-1 bg-gray-100 text-gray-900 border border-gray-400 rounded-md resize-none focus:outline-none focus:bg-white focus:border-purple-700"
                  rows="4"
                ></textarea>
              </div>
              <div className="flex items-center mb-2">
                <label
                  htmlFor="price"
                  className="text-black font-bold mr-4 whitespace-nowrap"
                >
                  Product Price
                </label>
                <input
                  type="number"
                  id="price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="block w-72 ml-11 px-4 py-1 bg-gray-100 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:bg-white focus:border-purple-700"
                />
              </div>
              <div className="flex items-center mb-2">
                <label
                  htmlFor="type"
                  className="text-black font-bold mr-4 whitespace-nowrap"
                >
                  Category Type
                </label>
                <select
                  id="type"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
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
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                  className="block w-72 ml-24 px-4 py-1 bg-gray-100 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:bg-white focus:border-purple-700"
                />
              </div>

              <button
                className="bg-purple-800 text-white py-1 px-4 ml-10 rounded-full mt-3"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
              <button
                className="bg-purple-800 text-white py-1 px-4 rounded-full ml-24 mt-3"
                onClick={handleUpdateProduct}
              >
                Update Product
              </button>
            </div>
          </div>

          <div className="mt-4 ml-14 justify-center">
            <h1 className="text-purple-800 font-bold text-left mb-1">
              Add New Category
            </h1>
            <div className="inline-block bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <label
                  htmlFor="name"
                  className="text-black font-bold mr-4 whitespace-nowrap"
                >
                  Category Type
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="block w-72 ml-10 px-4 py-1 bg-gray-100 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:bg-white focus:border-purple-700"
                />
              </div>

              <button
                className="bg-purple-800 text-white py-1 px-4 rounded-full ml-40 mt-3"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
