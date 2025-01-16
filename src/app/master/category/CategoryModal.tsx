import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";
import { X } from "lucide-react";

type CategoryFormData = {
    categoryId: string;
    categoryName: string;
};

type CategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: CategoryFormData) => void;
  onUpdate?: (formData: CategoryFormData) => void; // Fungsi untuk update
  initialData?: CategoryFormData | null; // Data awal untuk edit
  isEdit?: boolean; // Menentukan apakah ini modal edit
};

const CategoryModal = ({
    isOpen,
    onClose,
    onCreate,
    onUpdate,
    initialData = null,
    isEdit = false,
}: CategoryModalProps) => {
    const [formData, setFormData] = useState({
    categoryId: initialData?.categoryId || v4(),
    categoryName: initialData?.categoryName || "",
});

useEffect(() => {
    if (isOpen) {
        setFormData({
            categoryId: initialData?.categoryId || v4(),
            categoryName: initialData?.categoryName || "",
        });
    }
}, [isOpen, initialData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEdit && onUpdate) {
            onUpdate(formData); // Panggil fungsi update jika edit
        } else {
            onCreate(formData); // Panggil fungsi create jika tambah
        }
        onClose();
    };

    if (!isOpen) return null;

    const labelCssStyles = "block text-sm font-medium text-gray-700";
    const inputCssStyles =
        "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            {/* Tombol Close */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                aria-label="Close modal"
            >
                <X size={24} />
            </button>
            <Header name={isEdit ? "Edit Kategori" : "Create New Kategori"} />
            <form onSubmit={handleSubmit} className="mt-5">
            {/* CATEGORY NAME */}
            <label htmlFor="categoryName" className={labelCssStyles}>
                Nama Kategori
            </label>
            <input
                type="text"
                name="categoryName"
                placeholder="Nama Kategori"
                onChange={handleChange}
                value={formData.categoryName}
                className={inputCssStyles}
                required
            />

            {/* CREATE OR UPDATE ACTIONS */}
            <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
                {isEdit ? "Update" : "Create"}
            </button>
            <button
                onClick={onClose}
                type="button"
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
                Cancel
            </button>
            </form>
        </div>
        </div>
    );
};

export default CategoryModal;