import React from 'react';
import { HorrorCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: HorrorCategory;
  onSelectCategory: (cat: HorrorCategory) => void;
  storyCounts: Record<HorrorCategory, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  storyCounts,
}) => {
  const categories: { key: HorrorCategory; label: string }[] = [
    { key: 'all', label: `جميع الكوابيس (${(storyCounts['all'] || 24).toLocaleString('ar-EG')})` },
    { key: 'haunted_houses', label: 'بيوت مسكونة' },
    { key: 'folk_legends', label: 'أساطير شعبية' },
    { key: 'dark_entities', label: 'كيانات مظلمة' },
    { key: 'mysterious_crimes', label: 'جرائم غامضة' },
  ];

  return (
    <section id="category-filter-section" className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              id={`cat-filter-${cat.key}`}
              type="button"
              onClick={() => onSelectCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-red-600 text-white shadow-[0_0_16px_rgba(220,38,38,0.5)] border border-red-500 scale-105'
                  : 'bg-[#201f23]/90 text-[#ac8884] hover:text-white hover:bg-[#2a292e] border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
