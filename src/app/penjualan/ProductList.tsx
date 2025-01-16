"use client";

import Image from "next/image";
import { useGetProdukQuery } from "@/state/api";

interface Props {
  categoryId: string | null;
  searchTerm: string;
  onAddToOrder: (produkId: string, namaProduk: string, harga: number) => void;
}

export default function ProductList({
  categoryId,
  searchTerm,
  onAddToOrder,
}: Props) {
  const queryParams = {
    search: searchTerm || undefined,
    categoryId: categoryId || undefined,
  };

  const { data: products, isLoading, isError } = useGetProdukQuery(queryParams);

  if (isLoading) return <div>Loading products...</div>;
  if (isError || !products) return <div>Error loading products...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-auto">
      {products.map((prod) => (
        <div
          key={prod.produkId}
          className="border p-2 rounded shadow cursor-pointer hover:bg-gray-100 ite"
          onClick={() => onAddToOrder(prod.produkId, prod.namaProduk, prod.harga)}
        >
            {/* Gambar Produk */}
            <div className="w-36 h-36 bg-gray-200 rounded-2xl mb-3 flex items-center justify-center overflow-hidden">
                {prod.image ? (
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/public${prod.image}`}
                    alt={prod.namaProduk}
                    width={150}
                    height={150}
                    className="rounded-2xl w-full h-full object-cover"
                />
                ) : (
                <span className="text-gray-500">No Image</span>
                )}
            </div>
        
            <div className="font-semibold">{prod.namaProduk}</div>
            <div className="text-sm text-gray-600">Rp {prod.harga.toLocaleString("id-ID")}</div>
        </div>
      ))}
    </div>
  );
}
