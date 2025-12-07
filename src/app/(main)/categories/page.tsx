"use client";

import { Suspense } from "react";
import { CategoryManagement } from "@/components/molecules/category-management";
import { Spinner } from "@/components/ui/spinner";

function CategoriesContent() {
  return (
    <section className="space-y-6">
      <CategoryManagement />
    </section>
  );
}

export default function Categories() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner /> Loading...
        </div>
      }
    >
      <CategoriesContent />
    </Suspense>
  );
}
