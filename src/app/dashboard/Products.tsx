import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import ProductGrid from "./ProductGrid";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import AddProductComponent from "./AddProductComponent";

const Products = () => {
  const [keyword, setKeyword] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full justify-between items-center order-heading">
        <h1 className="text-3xl md:text-4xl font-semibold">All Products</h1>
        <div className="flex gap-2">
          <AddProductComponent />
          <Input
            className="w-[15rem] products-searchbar-dashboard"
            placeholder="Enter something"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>
      <ProductGrid keyword={keyword} />
    </div>
  );
};

export default Products;
