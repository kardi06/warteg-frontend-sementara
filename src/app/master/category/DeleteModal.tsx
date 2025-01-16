type DeleteModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void; // Fungsi untuk delete
};

const DeleteModal = ({ isOpen, onClose, onDelete }: DeleteModalProps) => {
if (!isOpen) return null;

return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
    <div className="relative top-20 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white">
        <h2 className="text-lg font-bold text-gray-700">Konfirmasi Hapus</h2>
        <p className="mt-2 text-gray-600">Apakah Anda yakin ingin menghapus kategori ini?</p>
        <div className="mt-4 flex justify-end">
        <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
        >
            No
        </button>
        <button
            onClick={() => {
            onDelete();
            onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
            Yes
        </button>
        </div>
    </div>
    </div>
);
};

export default DeleteModal;