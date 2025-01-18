import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PopularProduct {
    productId: string;
    name: string;
    harga: number;
    image?: string;
    totalQty?: number;
    totalSales?: number;
  }
  
  export interface DashboardResponse {
    popularProducts: PopularProduct[];
  
    // Jika ada data lain:
    salesTrend: Array<{
      date: string;
      totalPenjualan: number;
    }>;
    purchaseTrend: Array<{
      date: string;
      totalBelanja: number;
    }>;
    totalSales: number;
    totalPurchase: number;
    profit: number;
  }

export interface Category {
    categoryId: string;
    categoryName: string;
}

export interface NewCategory {
    categoryName: string;
}

/* BAHAN BAKU TYPES */
export interface BahanBaku {
    bahanBakuId: string;
    namaBahanBaku: string;
    supplier?: string;
    merk?: string;
}

export interface NewBahanBaku {
    namaBahanBaku: string;
    supplier?: string;
    merk?: string;
}

/* BELANJA TYPES */
export interface Belanja {
    belanjaId: string;
    bahanBakuId: string;
    namaBahanBaku?: string;
    tanggal: string; // Pastikan format string sesuai ISO (YYYY-MM-DD)
    hargaSatuan: number;
    qty: number;
    hargaTotal: number;
    created_at: string;
    updated_at: string;
}

export interface NewBelanja {
    bahanBakuId: string;
    tanggal: string;
    namaBahanBaku?: string;
    hargaSatuan: number;
    qty: number;
    hargaTotal: number;
}

/* PRODUK TYPES */
export interface Produk {
    produkId: string;
    namaProduk: string;
    harga: number;
    image?: string;
    categoryId: string;
    created_at: string;
    updated_at: string;
    Category?: {
        categoryId: string;
        categoryName: string;
    };
}

export interface NewProduk {
    namaProduk: string;
    harga: number;
    image?: string;
    categoryId: string;
}

// Tipe data penjualan
export interface Penjualan {
    penjualanId: string;
    produkId: string;
    qty: number;
    harga: number;
    hargaTotal: number;
    tanggal: string;
    created_at?: string;
    updated_at?: string;
    // Jika relasi:
    produk?: Produk;
}

export interface PenjualanItem {
    produkId: string;
    qty: number;
    harga: number;
    hargaTotal: number;
}
export interface CreatePenjualanBody {
    items: PenjualanItem[];
}

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl:process.env.NEXT_PUBLIC_API_BASE_URL }),
    reducerPath: "api",
    tagTypes:["Dashboard","Category","BahanBaku","Belanja","Produk","Penjualan"],
    endpoints: (build) => ({
        getDashboardMetrics: build.query<DashboardResponse, void>({
            query: () => "/dashboard",
            providesTags: ["Dashboard"],
        }),
        getCategory: build.query<Category[], string | void>({
            query: (search) => ({
                url: "/category",
                params: search ? { search } : {},
            }),
            providesTags: ["Category"]
        }),
        createCategory: build.mutation<Category, NewCategory>({

            query: (newCategory) => ({
                url: "/category",
                method: "POST",
                body: newCategory,
            }),
            invalidatesTags: ["Category"],
        }),
        // Update category
        updateCategory: build.mutation<Category, { categoryId: string; categoryName: string }>({
            query: ({ categoryId, categoryName }) => ({
                url: `/category/${categoryId}`,
                method: "PUT",
                body: { categoryName },
            }),
            // Invalidasi cache kategori untuk mendapatkan data terbaru
            invalidatesTags: ["Category"], 
        }),
         // Delete category
        deleteCategory: build.mutation<void, string>({
            query: (categoryId) => ({
                url: `/category/${categoryId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"], // Invalidasi cache kategori
        }),
        /* BAHAN BAKU ENDPOINTS */
        getBahanBaku: build.query<BahanBaku[], string | void>({
            query: (search) => ({
                url: "/bahan-baku",
                params: search ? { search } : {},
            }),
            providesTags: ["BahanBaku"],
        }),
        createBahanBaku: build.mutation<BahanBaku, NewBahanBaku>({
            query: (newBahanBaku) => ({
                url: "/bahan-baku",
                method: "POST",
                body: newBahanBaku,
            }),
            invalidatesTags: ["BahanBaku"],
        }),
        updateBahanBaku: build.mutation<BahanBaku, BahanBaku>({
            query: ({ bahanBakuId, ...data }) => ({
                url: `/bahan-baku/${bahanBakuId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["BahanBaku"],
        }),
        deleteBahanBaku: build.mutation<void, string>({
            query: (bahanBakuId) => ({
                url: `/bahan-baku/${bahanBakuId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BahanBaku"],
        }),
        /* BELANJA ENDPOINTS */
        getBelanja: build.query<Belanja[], { search?: string; startDate?: string; endDate?: string }>({
            query: ({ search, startDate, endDate }) => ({
                url: "/belanja",
                params: {
                    ...(search ? { search } : {}),
                    ...(startDate ? { startDate } : {}),
                    ...(endDate ? { endDate } : {}),
                },
            }),
            providesTags: ["Belanja"],
        }),
        createBelanja: build.mutation<Belanja, NewBelanja>({
            query: (newBelanja) => ({
                url: "/belanja",
                method: "POST",
                body: newBelanja,
            }),
            invalidatesTags: ["Belanja"],
        }),
        updateBelanja: build.mutation<Belanja, { belanjaId: string; data: Partial<NewBelanja> }>({
            query: ({ belanjaId, data }) => ({
                url: `/belanja/${belanjaId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Belanja"],
        }),
        deleteBelanja: build.mutation<void, string>({
            query: (belanjaId) => ({
                url: `/belanja/${belanjaId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Belanja"],
        }),
        /* PRODUK ENDPOINTS */
        getProduk: build.query<Produk[], { search?: string; categoryId?: string }>({
            query: ({ search, categoryId }) => ({
                url: "/produk",
                params: { search, categoryId },
            }),
            providesTags: ["Produk"],
        }),
        createProduk: build.mutation<Produk, FormData>({
            query: (formData) => ({
                url: "/produk",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Produk"],
        }),
        updateProduk: build.mutation<Produk, { produkId: string; data: Partial<NewProduk> }>({
            query: ({ produkId, data }) => ({
                url: `/produk/${produkId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Produk"],
        }),
        deleteProduk: build.mutation<void, string>({
            query: (produkId) => ({
                url: `/produk/${produkId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Produk"],
        }),
        // PENJUALAN
        createPenjualan: build.mutation<{ message: string; count: number }, CreatePenjualanBody>({
            query: (body) => ({
                url: "/penjualan",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Penjualan"],
        }),
        getPenjualan: build.query<Penjualan[], void>({
            query: () => "/penjualan",
            providesTags: ["Penjualan"],
        }),
    })
});

export const { 
    useGetCategoryQuery, 
    useCreateCategoryMutation, 
    useUpdateCategoryMutation, 
    useDeleteCategoryMutation,
    useGetBahanBakuQuery,
    useCreateBahanBakuMutation,
    useUpdateBahanBakuMutation,
    useDeleteBahanBakuMutation,
    useGetBelanjaQuery, 
    useCreateBelanjaMutation, 
    useUpdateBelanjaMutation, 
    useDeleteBelanjaMutation,
    useGetProdukQuery,
    useCreateProdukMutation,
    useUpdateProdukMutation,
    useDeleteProdukMutation,
    useCreatePenjualanMutation,
    useGetPenjualanQuery ,
    useGetDashboardMetricsQuery,
} = api;