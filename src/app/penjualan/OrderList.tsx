"use client";
import { OrderItem } from "./page";

interface Props {
  orderList: OrderItem[];
  onRemoveItem: (produkId: string) => void;
  total: number;
  onSaveOrder: () => void;
}

export default function OrderList({
  orderList,
  onRemoveItem,
  total,
  onSaveOrder,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto border mb-2 p-2">
        {orderList.length === 0 ? (
          <div className="text-gray-500 italic">No items in order.</div>
        ) : (
          orderList.map((item) => (
            <div
              key={item.produkId}
              className="p-2 border-b flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{item.namaProduk}</div>
                <div className="text-sm text-gray-600">
                  Qty: {item.qty} x Rp {item.harga.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="text-right">
                <div>Rp {item.hargaTotal.toLocaleString("id-ID")}</div>
                <button
                  className="text-red-500 text-sm hover:text-red-700 mt-1"
                  // Belum ada modal, langsung remove
                  onClick={() => onRemoveItem(item.produkId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Bagian total & tombol save */}
      <div className="border p-2">
        <div className="text-lg font-semibold mb-2">
          Total: Rp {total.toLocaleString("id-ID")}
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={onSaveOrder}
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
