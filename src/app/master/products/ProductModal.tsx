import React, { useEffect, useState, FormEvent } from "react";
import Select from "react-select";
import Dropzone from "react-dropzone";
import { v4 } from "uuid";
import { NumericFormat } from "react-number-format";
import { useGetCategoryQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { X } from "lucide-react";
import Image from "next/image";

type ProductFormData = {
    produkId: string;
    namaProduk: string;
    harga: number;
    categoryId: string;
    image?: File | null;
};

type SelectOption = {
    label: string;
    value: string;
};


type ProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (formData: ProductFormData) => void;
    onUpdate?: (formData: ProductFormData) => void;
    initialData?: ProductFormData | null;
    isEdit?: boolean;
};

const ProductModal = ({
    isOpen,
    onClose,
    onCreate,
    onUpdate,
    initialData = null,
    isEdit = false,
}: ProductModalProps) => {
    const [formData, setFormData] = useState<ProductFormData>({
        produkId: initialData?.produkId || v4(),
        namaProduk: initialData?.namaProduk || "",
        harga: initialData?.harga || 0,
        categoryId: initialData?.categoryId || "",
        image: null,
    });

    const [previewImage, setPreviewImage] = useState<string | null>(
        initialData?.image ? URL.createObjectURL(initialData.image) : null
    );

    const { data: categories, isLoading: isLoadingCategories } =
        useGetCategoryQuery("");

    useEffect(() => {
        if (isOpen) {
        setFormData({
            produkId: initialData?.produkId || v4(),
            namaProduk: initialData?.namaProduk || "",
            harga: initialData?.harga || 0,
            categoryId: initialData?.categoryId || "",
            image: null,
        });
        setPreviewImage(
            initialData?.image ? URL.createObjectURL(initialData.image) : null
        );
        }
    }, [isOpen, initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (values: { value: string }) => {
        const { value } = values;
        setFormData((prev) => ({ ...prev, harga: parseInt(value) || 0 }));
    };

    const handleCategoryChange = (selectedOption: SelectOption | null) => {
        setFormData((prev) => ({
        ...prev,
        categoryId: selectedOption?.value || "",
        }));
    };

    const handleDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setFormData((prev) => ({ ...prev, image: file }));
        setPreviewImage(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEdit && onUpdate) {
            onUpdate(formData);
        } else {
            onCreate(formData);
        }
        onClose();
    };

    if (!isOpen) return null;

    const categoryOptions =
        categories?.map((category) => ({
        value: category.categoryId,
        label: category.categoryName,
        })) || [];

    const labelCssStyles = "block text-sm font-medium text-gray-700";
    const inputCssStyles =
        "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            {/* Close Button */}
            <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            aria-label="Close modal"
            >
            <X size={24} />
            </button>
            <Header
            name={isEdit ? "Edit Product" : "Create New Product"}
            />
            <form onSubmit={handleSubmit} className="mt-5">
            {/* Nama Produk */}
            <label htmlFor="namaProduk" className={labelCssStyles}>
                Nama Produk
            </label>
            <input
                type="text"
                name="namaProduk"
                placeholder="Nama Produk"
                onChange={handleInputChange}
                value={formData.namaProduk}
                className={inputCssStyles}
                required
            />

            {/* Harga */}
            <label htmlFor="harga" className={labelCssStyles}>
                Harga
            </label>
            <NumericFormat
                className={inputCssStyles}
                value={formData.harga}
                displayType="input"
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                placeholder="Masukkan Harga"
                onValueChange={handlePriceChange}
            />

            {/* Kategori */}
            <label htmlFor="categoryId" className={labelCssStyles}>
                Kategori
            </label>
            <Select
                options={categoryOptions}
                isLoading={isLoadingCategories}
                placeholder="Pilih Kategori"
                onChange={handleCategoryChange}
                value={categoryOptions.find(
                (option) => option.value === formData.categoryId
                ) || null}
            />

            {/* Upload Gambar */}
            <label htmlFor="image" className={labelCssStyles}>
                Upload Gambar
            </label>
            <Dropzone onDrop={handleDrop} accept={{ "image/*": [] }} multiple={false}>
                {({ getRootProps, getInputProps }) => (
                <div
                    {...getRootProps()}
                    className="border-2 border-dashed p-4 text-center cursor-pointer mb-2"
                >
                    <input {...getInputProps()} />
                    {formData.image ? (
                    <p>{formData.image.name}</p>
                    ) : (
                    <p>Drag & drop or click to select a file</p>
                    )}
                </div>
                )}
            </Dropzone>
            {previewImage && (
                <div className="mt-2">
                    <Image
                        src={previewImage}
                        alt="Preview"
                        width={150} // Ganti dengan lebar sesuai kebutuhan
                        height={150} // Ganti dengan tinggi sesuai kebutuhan
                        className="mb-3 rounded-2xl w-36 h-36" 
                    />
                </div>
            )}

            {/* Action Buttons */}
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

export default ProductModal;
