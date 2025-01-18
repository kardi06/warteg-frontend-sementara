"use client";
import React, { useState } from 'react';
import Header from '@/app/(components)/Header';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SearchIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { useGetBelanjaQuery } from '@/state/api';


const DataBelanja = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data: belanja, isLoading, isError } = useGetBelanjaQuery({
    search: searchTerm,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
  });

  const columns: GridColDef[] = [
    { field: "belanjaId", headerName: "ID", width: 120 },
    { field: "bahanBaku", headerName: "Nama Bahan Baku", flex: 1 },
    { field: "tanggal", headerName: "Tanggal", flex: 1 },
    { field: "hargaSatuan", headerName: "Harga Satuan", flex: 1 },
    { field: "qty", headerName: "Quantity", flex: 1 },
    { field: "hargaTotal", headerName: "Harga Total", flex: 1 },
  ];

  const rows = belanja?.map((item) => ({
    id: item.belanjaId,
    belanjaId: item.belanjaId,
    bahanBaku: item.namaBahanBaku,
    tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
    hargaSatuan: `Rp ${item.hargaSatuan.toLocaleString("id-ID")}`,
    qty: item.qty,
    hargaTotal: `Rp ${item.hargaTotal.toLocaleString("id-ID")}`,
  }));

  return (
    <div className="mx-auto pb-5 w-full">
      <Header name="Data Belanja" />
      {/* Filter */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search Nama Bahan Baku..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Start Date"
          className="border rounded px-4 py-2"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="End Date"
          className="border rounded px-4 py-2"
        />
      </div>
      {/* Table */}
      {isLoading ? (
        <div className="py-4">Loading...</div>
      ) : isError || !rows ? (
        <div className="text-center text-red-500 py-4">Gagal Mengambil Data Belanja</div>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
        />
      )}
    </div>
  )
}

export default DataBelanja