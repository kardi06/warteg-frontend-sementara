import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";
import { X } from "lucide-react";

type BahanBakuFormData = {
    bahanBakuId: string;
    namaBahanBaku: string;
    supplier?: string;
    merk?: string;
};

type BahanBakuModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (formData: BahanBakuFormData) => void;
    onUpdate?: (formData: BahanBakuFormData) => void;
    initialData?: BahanBakuFormData | null;
    isEdit?: boolean;
};

const BahanBakuModal = ({
    isOpen,
    onClose,
    onCreate,
    onUpdate,
    initialData = null,
    isEdit = false,
}: BahanBakuModalProps) => {
    const [formData, setFormData] = useState<BahanBakuFormData>({
        bahanBakuId: initialData?.bahanBakuId || v4(),
        namaBahanBaku: initialData?.namaBahanBaku || "",
        supplier: initialData?.supplier || "",
        merk: initialData?.merk || "",
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                bahanBakuId: initialData?.bahanBakuId || v4(),
                namaBahanBaku: initialData?.namaBahanBaku || "",
                supplier: initialData?.supplier || "",
                merk: initialData?.merk || "",
            });
        }
    }, [isOpen, initialData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                <Header name={isEdit ? "Edit Bahan Baku" : "Create New Bahan Baku"} />
                <form onSubmit={handleSubmit} className="mt-5">
                    {/* BAHAN BAKU NAME */}
                    <label htmlFor="namaBahanBaku" className={labelCssStyles}>
                        Nama Bahan Baku
                    </label>
                    <input
                        type="text"
                        name="namaBahanBaku"
                        placeholder="Nama Bahan Baku"
                        onChange={handleChange}
                        value={formData.namaBahanBaku}
                        className={inputCssStyles}
                        required
                    />
                     {/* SUPPLIER */}
                    <label htmlFor="supplier" className={labelCssStyles}>
                        Supplier
                    </label>
                    <input
                        type="text"
                        name="supplier"
                        placeholder="Nama Supplier"
                        onChange={handleChange}
                        value={formData.supplier}
                        className={inputCssStyles}
                    />

                    {/* MERK */}
                    <label htmlFor="merk" className={labelCssStyles}>
                        Merk
                    </label>
                    <input
                        type="text"
                        name="merk"
                        placeholder="Merk Bahan Baku"
                        onChange={handleChange}
                        value={formData.merk}
                        className={inputCssStyles}
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

export default BahanBakuModal;