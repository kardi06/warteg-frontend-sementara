"use client";
import Header from '@/app/(components)/Header';
import { Pencil, PlusCircleIcon, SearchIcon, Trash } from 'lucide-react';
import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
    useCreateBahanBakuMutation, 
    useGetBahanBakuQuery, 
    useUpdateBahanBakuMutation, 
    useDeleteBahanBakuMutation 
} from '@/state/api';
import BahanBakuModal from './BahanBakuModal';
import DeleteModal from './DeleteModal';
import { toast } from 'react-toastify';

type BahanBakuFormData = {
    bahanBakuId: string;
    namaBahanBaku: string;
    supplier?: string;
    merk?: string;
};

const BahanBaku = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBahanBaku, setSelectedBahanBaku] = useState<BahanBakuFormData | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data: bahanBaku, isLoading, isError } = useGetBahanBakuQuery(searchTerm);
    const [createBahanBaku] = useCreateBahanBakuMutation();
    const [updateBahanBaku] = useUpdateBahanBakuMutation();
    const [deleteBahanBaku] = useDeleteBahanBakuMutation();

    const handleCreateBahanBaku = async (bahanBakuData: BahanBakuFormData) => {
        try {
            await createBahanBaku(bahanBakuData).unwrap();
            toast.success("Bahan Baku berhasil dibuat!");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saat membuat bahan baku:", error);
            toast.error("Gagal membuat bahan baku.");
        }
    };

    const handleEdit = (bahanBakuData: BahanBakuFormData) => {
        setSelectedBahanBaku(bahanBakuData);
        setIsModalOpen(true);
    };

    const handleUpdateBahanBaku = async (bahanBakuData: BahanBakuFormData) => {
        if (bahanBakuData.bahanBakuId) {
            try {
                await updateBahanBaku(bahanBakuData).unwrap();
                toast.success("Bahan Baku berhasil diperbarui!");
            } catch (error) {
                console.error("Error saat memperbarui bahan baku:", error);
                toast.error("Gagal memperbarui bahan baku.");
            }
        }
        setIsModalOpen(false);
    };

    const handleDelete = (bahanBakuId: string) => {
        setDeleteId(bahanBakuId);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            try {
                await deleteBahanBaku(deleteId).unwrap();
                toast.success("Bahan Baku berhasil dihapus!");
                setIsDeleteModalOpen(false);
            } catch (error) {
                console.error("Error saat menghapus bahan baku:", error);
                toast.error("Gagal menghapus bahan baku.");
            }
        }
    };

    const columns: GridColDef[] = [
        { field: "bahanBakuId", headerName: "ID", width: 120 },
        { field: "namaBahanBaku", headerName: "Nama Bahan Baku", flex: 1 },
        { 
            field: "supplier", 
            headerName: "Supplier", 
            flex: 1,
            valueGetter: (value, row) => row.supplier || "-", 
        },
        { 
            field: "merk", 
            headerName: "Merk", 
            flex: 1,
            valueGetter: (value, row) => row.merk || "-",
        },
        {
            field: "actions",
            headerName: "Aksi",
            flex: 1,
            renderCell: (params) => (
                <div className="flex gap-2 items-center justify-center mt-5">
                    <button
                        onClick={() => handleEdit(params.row)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(params.row.bahanBakuId)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="mx-auto pb-5 w-full">
            <div className="flex justify-between items-center mb-6">
                <Header name="Bahan Baku" />
                <button
                    className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
                    onClick={() => {
                        setSelectedBahanBaku(null);
                        setIsModalOpen(true);
                    }}
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" /> Tambah Bahan Baku
                </button>
            </div>

            <div className="mb-6 w-1/2 md:w-1/4">
                <div className="flex items-center border-2 border-gray-200 rounded">
                    <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
                    <input
                        className="w-full py-2 px-4 rounded bg-white"
                        placeholder="Cari Bahan Baku..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="py-4">Loading...</div>
            ) : isError || !bahanBaku ? (
                <div className="text-center text-red-500 py-4">
                    Gagal Mengambil Bahan Baku
                </div>
            ) : (
                <DataGrid
                    rows={bahanBaku}
                    columns={columns}
                    getRowId={(row) => row.bahanBakuId}
                    className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
                />
            )}

            <BahanBakuModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateBahanBaku}
                onUpdate={handleUpdateBahanBaku}
                initialData={selectedBahanBaku}
                isEdit={!!selectedBahanBaku}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={confirmDelete}
            />
        </div>
    );
};

export default BahanBaku;
