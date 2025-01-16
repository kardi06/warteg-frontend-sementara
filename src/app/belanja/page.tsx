"use client";

import Header from "@/app/(components)/Header";
import { PlusCircleIcon, Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
    useGetBahanBakuQuery,
    useCreateBelanjaMutation
} from '@/state/api';
import Select from "react-select";
import { v4 } from "uuid";

interface TemporaryBelanja {
    bahanBakuId: string;
    namaBahanBaku: string;
    tanggal: Date;
    hargaSatuan: number;
    qty: number;
    hargaTotal: number;
}

type SelectOption = {
    label: string;
    value: string; // Sesuaikan tipe dengan properti value yang ada
};

type BahanBaku = {
    bahanBakuId: string;
    namaBahanBaku: string;
};

const Belanja = () => {
    const [temporaryData, setTemporaryData] = useState<TemporaryBelanja[]>([]);
    const [bahanBakuId, setBahanBakuId] = useState<string>("");
    const [namaBahanBaku, setNamaBahanBaku] = useState<string>("");
    const [tanggal, setTanggal] = useState<Date | null>(new Date());
    const [hargaSatuan, setHargaSatuan] = useState<number>(0);
    const [qty, setQty] = useState<number>(1);

    const { data: bahanBakuList, isLoading, isError } = useGetBahanBakuQuery(namaBahanBaku);
    const [createBelanja] = useCreateBelanjaMutation();
    const handleSelectBahanBaku = (selectedOption: SelectOption | null) => {
        if (selectedOption) {
            setBahanBakuId(selectedOption.value);
            setNamaBahanBaku(selectedOption.label);
        }
    };

    const handleAdd = () => {
        if (!bahanBakuId || !namaBahanBaku || !tanggal || hargaSatuan <= 0 || qty <= 0) {
            toast.error("Semua field harus diisi!");
            return;
        }

        const hargaTotal = hargaSatuan * qty;

        setTemporaryData([
        ...temporaryData,
        { bahanBakuId, namaBahanBaku, tanggal, hargaSatuan, qty, hargaTotal },
        ]);

        setBahanBakuId("");
        setNamaBahanBaku("");
        setHargaSatuan(0);
        setQty(1);
        setTanggal(new Date());
        toast.success("Item berhasil ditambahkan ke tabel!");
    };

    const handleDelete = (index: number) => {
        setTemporaryData(temporaryData.filter((_, i) => i !== index));
        toast.info("Item berhasil dihapus dari tabel.");
    };

    const handleSave = async () => {
        if (temporaryData.length === 0) {
            toast.error("Tidak ada data untuk disimpan!");
            return;
        }

        try {
            for (const item of temporaryData) {
                const newBelanja = {
                    belanjaId: v4(),
                    bahanBakuId: item.bahanBakuId,
                    namaBahanBaku: item.namaBahanBaku,
                    tanggal: item.tanggal.toISOString(),
                    hargaSatuan: item.hargaSatuan,
                    qty: item.qty,
                    hargaTotal: item.hargaTotal,
                };
        
                // Menyimpan data ke database
                await createBelanja(newBelanja).unwrap();
            }
        
            setTemporaryData([]);  // Menghapus data setelah berhasil disimpan
            toast.success("Data berhasil disimpan!");
        } catch (error) {
            console.error("Error saat menyimpan data:", error);
            toast.error("Gagal menyimpan data.");
        }
    };

    const totalHarga = temporaryData.reduce((total, item) => total + item.hargaTotal, 0);

    return (
        <div className="mx-auto pb-5 w-full">
            <Header name="Belanja Harian" />
            <div className="bg-white shadow-lg p-6 rounded-lg mb-6 mt-5">
                <h2 className="text-lg font-semibold mb-4">Tambah Belanja</h2>
                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        placeholder="ID Bahan Baku"
                        value={bahanBakuId}
                        readOnly
                        className="border rounded px-4 py-2"
                    />
                    <Select
                        isLoading={isLoading}
                        isDisabled={isError || isLoading}
                        placeholder="Cari Nama Bahan Baku"
                        value={namaBahanBaku ? { label: namaBahanBaku, value: bahanBakuId } : null}
                        onChange={handleSelectBahanBaku}
                        options={
                        bahanBakuList
                            ? bahanBakuList.map((item: BahanBaku) => ({
                                label: item.namaBahanBaku,
                                value: item.bahanBakuId,
                            }))
                            : []
                        }
                    />
                    <DatePicker
                        selected={tanggal}
                        onChange={(date) => setTanggal(date)}
                        dateFormat="yyyy-MM-dd"
                        className="border rounded px-4 py-2"
                        placeholderText="Pilih Tanggal"
                    />
                    <NumericFormat
                    value={hargaSatuan}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="Rp "
                    onValueChange={(values) => {
                        const { floatValue } = values;
                        setHargaSatuan(floatValue || 0);
                    }}
                    placeholder="Harga Satuan"
                    className="border rounded px-4 py-2"
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="border rounded px-4 py-2"
                        min={1}
                    />
                </div>
                <button
                    className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={handleAdd}
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Tambahkan
                </button>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Daftar Belanja</h2>
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">ID Bahan Baku</th>
                        <th className="border px-4 py-2">Nama Bahan Baku</th>
                        <th className="border px-4 py-2">Tanggal</th>
                        <th className="border px-4 py-2">Harga Satuan</th>
                        <th className="border px-4 py-2">Quantity</th>
                        <th className="border px-4 py-2">Harga Total</th>
                        <th className="border px-4 py-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {temporaryData.map((item, index) => (
                    <tr key={index}>
                        <td className="border px-4 py-2">{item.bahanBakuId}</td>
                        <td className="border px-4 py-2">{item.namaBahanBaku}</td>
                        <td className="border px-4 py-2">{item.tanggal.toISOString().split("T")[0]}</td>
                        <td className="border px-4 py-2">Rp {item.hargaSatuan.toLocaleString("id-ID")}</td>
                        <td className="border px-4 py-2">{item.qty}</td>
                        <td className="border px-4 py-2">Rp {item.hargaTotal.toLocaleString("id-ID")}</td>
                        <td className="border px-4 py-2">
                        <button
                            onClick={() => handleDelete(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <Trash className="w-5 h-5" />
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-100 font-semibold">
                    <td colSpan={5} className="border px-4 py-2 text-right">Total:</td>
                    <td className="border px-4 py-2">Rp {totalHarga.toLocaleString("id-ID")}</td>
                    <td className="border px-4 py-2"></td>
                    </tr>
                </tfoot>
            </table>
                <button
                    className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={handleSave}
                >
                    Simpan
                </button>
            </div>
        </div>
    );
};

export default Belanja;