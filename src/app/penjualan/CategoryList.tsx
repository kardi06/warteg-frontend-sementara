"use client";
import { useGetCategoryQuery } from "@/state/api";

interface Props {
  selectedCategoryId: string | null;
  onSelectCategory: (catId: string | null) => void;
}

export default function CategoryList({
  selectedCategoryId,
  onSelectCategory,
}: Props) {
  const { data: categories, isLoading, isError } = useGetCategoryQuery();

  if (isLoading) return <div>Loading categories...</div>;
  if (isError || !categories) return <div>Error loading categories...</div>;

  return (
    <div>
      <button
        className={`block w-full text-left p-2 mb-1 ${
          selectedCategoryId === null ? "bg-blue-100" : ""
        }`}
        onClick={() => onSelectCategory(null)}
      >
        All Category
      </button>
      {categories.map((cat) => (
        <button
          key={cat.categoryId}
          className={`block w-full text-left p-2 mb-1 ${
            selectedCategoryId === cat.categoryId ? "bg-blue-100" : ""
          }`}
          onClick={() => onSelectCategory(cat.categoryId)}
        >
          {cat.categoryName}
        </button>
      ))}
    </div>
  );
}
