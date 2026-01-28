
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import Icon from './Icon';
import { getFruitInsight } from '../services/geminiService';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [insight, setInsight] = useState<string>('');
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    // Only fetch insight if user hovers or interacts (optional optimization)
    // For this demo, we'll fetch on mount but only show on demand
  }, []);

  const handleInfoClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!insight) {
      const text = await getFruitInsight(product.name);
      setInsight(text);
    }
    setShowInsight(!showInsight);
  };

  return (
    <div className="flex flex-col gap-3 pb-3 bg-white dark:bg-[#1a2e20] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md group">
      <div className="relative">
        <div 
          className="w-full bg-center bg-no-repeat aspect-square bg-cover transition-transform duration-500 group-hover:scale-105" 
          style={{ backgroundImage: `url("${product.image}")` }}
        />
        {product.discountBadge && (
          <div className="absolute top-2 left-2 bg-primary px-2 py-1 rounded text-[10px] font-bold text-[#111813] z-10 shadow-sm">
            {product.discountBadge}
          </div>
        )}
        <button 
          onClick={handleInfoClick}
          className="absolute top-2 right-2 size-7 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center text-[#111813] dark:text-white z-10 hover:bg-white dark:hover:bg-black/60 transition-colors"
        >
          <Icon name="info" className="text-sm" />
        </button>

        {showInsight && (
          <div className="absolute inset-0 bg-primary/90 dark:bg-primary/80 backdrop-blur-sm p-4 flex items-center justify-center text-center z-20 animate-in fade-in duration-200">
            <p className="text-[#111813] text-xs font-bold leading-relaxed px-2">
              {insight || "Loading fresh facts..."}
            </p>
            <button 
              onClick={() => setShowInsight(false)}
              className="absolute top-2 right-2 text-[#111813]"
            >
              <Icon name="close" className="text-sm" />
            </button>
          </div>
        )}
      </div>

      <div className="px-3 pb-1">
        <p className="text-[#111813] dark:text-white text-sm font-bold leading-tight line-clamp-1">
          {product.name}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <div>
            <p className="text-[#111813] dark:text-primary text-base font-bold">
              ${product.price.toFixed(2)}
            </p>
            {product.originalPrice && (
              <p className="text-[#61896f] text-[10px] font-normal line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
            )}
            {!product.originalPrice && (
              <p className="text-[#61896f] text-[10px] font-normal">&nbsp;</p>
            )}
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            className="size-8 rounded-lg bg-primary flex items-center justify-center text-[#111813] shadow-md hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Icon name="add" className="text-lg font-bold" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
