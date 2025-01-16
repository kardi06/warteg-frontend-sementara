"use client";

import { useGetProdukQuery, useCreateProdukMutation } from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import ProductModal from "./ProductModal";
import Image from "next/image";

/** Tipe data untuk form input di modal */
type ProductFormData = {
  produkId: string;
  namaProduk: string;
  harga: number;
  categoryId: string;
  image?: File | null;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Query untuk mendapat data produk
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProdukQuery({ search: searchTerm });

  // Mutasi untuk create produk
  const [createProduk] = useCreateProdukMutation();

  // Fungsi untuk handle create product
  const handleCreateProduct = async (productData: ProductFormData) => {
    try {
      // Buat FormData agar bisa mengirim file
      const formData = new FormData();
      formData.append("produkId", productData.produkId);
      formData.append("namaProduk", productData.namaProduk);
      formData.append("harga", productData.harga.toString());
      formData.append("categoryId", productData.categoryId);

      if (productData.image) {
        formData.append("image", productData.image);
      }

      // Panggil createProduk dengan FormData
      await createProduk(formData).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create
          Product
        </button>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {products.map((product) => (
          <div
            key={product.produkId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              {/* IMAGE */}
              <div className="w-36 h-36 bg-gray-200 rounded-2xl mb-3 flex items-center justify-center">
                {product.image ? (
                  <Image
                    src={
                      // Pastikan base URL sesuai dengan server Anda
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/public${product.image}`
                    }
                    alt={product.namaProduk}
                    width={150}
                    height={150}
                    className="rounded-2xl w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </div>

              {/* NAMA PRODUK */}
              <h3 className="text-lg text-gray-900 font-semibold">
                {product.namaProduk}
              </h3>

              {/* HARGA DALAM FORMAT RUPIAH */}
              <p className="text-gray-800">
                Rp {product.harga.toLocaleString("id-ID")}
              </p>

              {/* KATEGORI */}
              <div className="text-sm text-gray-600 mt-1">
                Category: {product.Category?.categoryName ?? "Unknown"}
              </div>

              {/* ICON BUTTONS (NO onClick) */}
              <div className="flex space-x-2 mt-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <Pencil className="w-5 h-5" />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      />
    </div>
  );
};

export default Products;
