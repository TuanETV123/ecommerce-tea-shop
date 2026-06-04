import React from "react";

const CategoryFilter = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
      {categories.map((cat) => {
        const isActive = selected === cat;
        const baseClasses =
          "whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors";
        const activeClasses = "bg-[#0d1b10] text-white";
        const inactiveClasses =
          "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-[#0d1b10]";

        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
