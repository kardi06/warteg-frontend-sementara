"use client";
import Header from '@/app/(components)/Header';
import { Pencil, PlusCircleIcon, SearchIcon, Trash } from 'lucide-react';
import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
    useCreateCategoryMutation, 
    useGetCategoryQuery, 
    useUpdateCategoryMutation, 
    useDeleteCategoryMutation 
} from '@/state/api';
import CategoryModal from './CategoryModal';
import DeleteModal from './DeleteModal';
import { toast } from 'react-toastify';


type CategoryFormData = {
    categoryId: string;
    categoryName: string;
};

const Category = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryFormData | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const {data: category, isLoading, isError} = useGetCategoryQuery(searchTerm);
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    // HandleCreate
    const handleCreateCategory = async (categoryData: CategoryFormData) => {
        try {
            await createCategory(categoryData).unwrap();
            toast.success("Kategori berhasil dibuat!");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saat membuat kategori:", error);
            toast.error("Gagal membuat kategori.");
        }
    };

    // Handle Edit
    const handleEdit = (categoryData: CategoryFormData) => {
        setSelectedCategory(categoryData); // Set the selected category for editing
        setIsModalOpen(true); // Open the modal
    };

    // Handle update category
    const handleUpdateCategory = async (categoryData: CategoryFormData) => {
        if (categoryData.categoryId) {
            try {
                await updateCategory(categoryData).unwrap();
                toast.success("Kategori berhasil diperbarui!");
            } catch (error) {
                console.error("Error saat update kategori:", error);
                toast.error("Gagal memperbarui kategori.");
            }
        }
        setIsModalOpen(false); // Close the modal
    };

    // Handle delete category
    const handleDelete = (categoryId: string) => {
        setDeleteId(categoryId); // Set the ID to be deleted
        setIsDeleteModalOpen(true); // Open the delete modal
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await deleteCategory(deleteId); // Call delete mutation
            toast.success("Kategori berhasil dihapus!");
            setIsDeleteModalOpen(false); // Close the modal
        }
    };

    const columns: GridColDef[] = [
        { field: "categoryId", headerName: "ID", width: 120 },
        { field: "categoryName", headerName: "Kategori", flex:1 },
        {
            field: "actions",
            headerName: "Aksi",
            flex:1,
            renderCell: (params) => (
                <div className="flex gap-2 items-center justify-center mt-5">
                    <button
                        onClick={() => (handleEdit(params.row))}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(params.row.categoryId)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];
    // if (isLoading) {
    //     return <div className="py-4">Loading...</div>;
    // }

    // if (isError || !category) {
    //     return (
    //         <div className="text-center text-red-500 py-4">
    //             Gagal Mengambil Kategori
    //         </div>
    //     );
    // }
    return (
        <div className="mx-auto pb-5 w-full">
            {/* HEADER BAR */}
            <div className="flex justify-between items-center mb-6">
                <Header name="Kategori" />
                <button
                    className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
                    onClick={() => {
                        setSelectedCategory(null); // Reset selected category for create
                        setIsModalOpen(true);
                    }}
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Tambah Kategori
                </button>
            </div>

            {/* SEARCH BAR */}
            <div className="mb-6 w-1/2 md:w-1/4">
                <div className="flex items-center border-2 border-gray-200 rounded">
                    <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
                    <input
                    className="w-full py-2 px-4 rounded bg-white"
                    placeholder="Search Kategory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            {/* Table */}
            {isLoading ? (<div className="py-4">Loading...</div>) : ('') }
            {(isError || !category) ? (
                <div className="text-center text-red-500 py-4">
                    Gagal Mengambil Kategori
                </div>
            ) : (
                <DataGrid
                    rows={category}
                    columns={columns}
                    getRowId={(row) => row.categoryId}
                    className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
                /> 
            ) }

            {/* MODAL */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateCategory}
                onUpdate={handleUpdateCategory}
                initialData={selectedCategory}
                isEdit={!!selectedCategory}
            />
            {/* DELETE MODAL */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={confirmDelete}
            />
        </div>
    )
}

export default Category;