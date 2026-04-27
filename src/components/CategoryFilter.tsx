'use client';

import { useStore } from '@/lib/store';
import { t, tCat } from '@/lib/translations';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const { darkMode, language } = useStore();

  return (
    <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
      <button
        onClick={() => onSelect('')}
        className={`relative shrink-0 px-5 md:px-6 py-2.5 md:py-3 rounded-2xl md:rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-500 border ${
          selected === ''
            ? 'bg-slate-950 text-white border-transparent shadow-xl dark:bg-orange-600'
            : darkMode
            ? 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200 shadow-sm'
        }`}
      >
        <span className="relative z-10">{t(language, 'allCategories')}</span>
        {selected === '' && (
          <motion.div 
            layoutId="catUnderline"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full"
          />
        )}
      </button>
      
      {categories.map((cat) => {
        const isSelected = selected === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`relative shrink-0 flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-2xl md:rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-500 border ${
              isSelected
                ? 'bg-slate-950 text-white border-transparent shadow-xl dark:bg-orange-600'
                : darkMode
                ? 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200 shadow-sm'
            }`}
          >
            <span className="relative z-10">{tCat(language, cat)}</span>
            {isSelected && (
              <motion.div 
                layoutId="catUnderline"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
