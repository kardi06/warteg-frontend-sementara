"use client";

import { useState, useMemo } from "react";
import CategoryList from "./CategoryList";
import ProductList from "./ProductList";
import OrderList from "./OrderList";
import { useCreatePenjualanMutation } from "@/state/api";
import { toast } from 'react-toastify';

export interface OrderItem {
  produkId: string;
  namaProduk: string;
  harga: number;
  qty: number;
  hargaTotal: number;
}

export default function POSPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk daftar pesanan
  const [orderList, setOrderList] = useState<OrderItem[]>([]);

  const [createPenjualan] = useCreatePenjualanMutation();

  // Tambahkan item ke order list atau update qty jika produk sama
  const handleAddToOrder = (produkId: string, namaProduk: string, harga: number) => {
    setOrderList((prev) => {
      const existingIndex = prev.findIndex((item) => item.produkId === produkId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const existingItem = updated[existingIndex];
        const newQty = existingItem.qty + 1;
        updated[existingIndex] = {
          ...existingItem,
          qty: newQty,
          hargaTotal: newQty * existingItem.harga,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            produkId,
            namaProduk,
            harga,
            qty: 1,
            hargaTotal: harga,
          },
        ];
      }
    });
  };

  // Hapus item dari orderList atau turunkan qty (sesuai kebutuhan)
  // (Atau bisa menambahkan modal konfirmasi delete)
  const handleRemoveItem = (produkId: string) => {
    setOrderList((prev) => prev.filter((item) => item.produkId !== produkId));
  };

  // Hitung total harga
  const totalHarga = useMemo(() => {
    return orderList.reduce((acc, item) => acc + item.hargaTotal, 0);
  }, [orderList]);

  // Simpan penjualan ke database
  const handleSaveOrder = async () => {
    // Buat payload penjualan yang sesuai backend
    const items = orderList.map((item) => ({
      produkId: item.produkId,
      qty: item.qty,
      harga: item.harga,
      hargaTotal: item.hargaTotal,
    }));

    try {
        // Asumsikan endpoint createPenjualan menerima { items: PenjualanItem[] }
        await createPenjualan({ items }).unwrap();
        toast.success("Penjualan berhasil disimpan!", { theme: "colored" });
        // Reset order list
        setOrderList([]);
    } catch (error) {
        console.error("Error saving penjualan:", error);
        toast.error("Gagal menyimpan penjualan.", { theme: "colored" });
    }
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-7  w-full h-screen gap-3">
      {/* Panel Kiri: Kategori */}
      <div className="border shadow rounded-md p-2 md:h-1/3 overflow-y-auto bg-white">
        <CategoryList
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(catId) => setSelectedCategoryId(catId)}
        />
      </div>

      {/* Panel Tengah: Produk */}
      <div className="col-span-2 md:col-span-4 border shadow rounded-md bg-white p-2">
        {/* SEARCH BAR */}
        <div className="mb-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Cari Produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ProductList
          categoryId={selectedCategoryId}
          searchTerm={searchTerm}
          onAddToOrder={handleAddToOrder}
        />
      </div>

      {/* Panel Kanan: Order List */}
      <div className="col-span-3 md:col-span-2 p-2 border shadow rounded-md bg-white flex flex-col">
        <OrderList
          orderList={orderList}
          onRemoveItem={handleRemoveItem}
          total={totalHarga}
          onSaveOrder={handleSaveOrder}
        />
      </div>
    </div>
  );
}
