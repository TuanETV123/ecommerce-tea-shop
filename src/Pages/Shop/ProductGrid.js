import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ displayedProducts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedProducts.length > 0 ? (
        displayedProducts.map((item) => (
          <ProductCard item={item} key={item.id} />
        ))
      ) : (
        <div className="col-span-full py-20 text-center text-gray-500 font-bold">
          Không tìm thấy trà phù hợp với bộ lọc.
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
