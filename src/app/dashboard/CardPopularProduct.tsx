"use client";

import { useGetDashboardMetricsQuery } from "@/state/api";
import { ShoppingBag } from "lucide-react";
import React from "react";
import Image from "next/image";

// Jika perlu: import { PopularProduct } from "@/state/api";

const CardPopularProducts = () => {
  // Tipe data => data: DashboardResponse | undefined
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
            Popular Products
          </h3>
          <hr />
          <div className="overflow-auto h-full">
            {dashboardMetrics?.popularProducts.map((product, index) => (
              <div
                key={product.productId ?? index}
                className="flex items-center justify-between gap-3 px-5 py-7 border-b"
              >
                <div className="flex items-center gap-3">
                  {/* Gambar produk */}
                    {product.image ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/public${product.image}`}
                        alt={product.name}
                        width={45}
                        height={45}
                        className="rounded w-full h-full object-cover"
                    />
                    ) : (
                    <span className="text-gray-500">No Image</span>
                    )}

                  {/* Info produk */}
                  <div className="flex flex-col justify-between gap-1">
                    <div className="font-bold text-gray-700">
                      {product.name}
                    </div>
                    <div className="flex text-sm items-center">
                      {/* Format rupiah */}
                      <span className="font-bold text-blue-500 text-xs">
                        Rp {product.harga?.toLocaleString("id-ID")}
                      </span>
                      <span className="mx-2">|</span>
                      {/* Sold info */}
                      <span className="text-xs text-gray-500">
                        {(product.totalQty ?? 0)} Terjual
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info total penjualan */}
                <div className="text-xs flex items-center">
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 mx-2">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-600">
                    Total Penjualan: Rp{" "}
                    {product.totalSales
                      ? product.totalSales.toLocaleString("id-ID")
                      : 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CardPopularProducts;
