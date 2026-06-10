import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist, user } = useApp();
  const navigate = useNavigate();

  // Generate a random mock review count based on product id to stay consistent
  const getReviewCount = (id) => {
    const num = (id.length * 3.4) % 100;
    return `${num.toFixed(1)}k`;
  };

  // Generate a dynamic "Best Price" (e.g. 15% off)
  const bestPrice = Math.floor(product.price * 0.85);

  const getProductBrand = (type) => {
    switch (type) {
      case 'earbuds':
      case 'headphones':
      case 'powerbank':
      case 'smartwatch': return 'TechBrand';
      case 'skincare':
      case 'makeup':
      case 'tint': return 'Glow & Co';
      case 'tee':
      case 'pants':
      case 'outfit': return 'Roadster';
      default: return 'Mynzo Originals';
    }
  };

  const getBadgeText = (type) => {
    switch (type) {
      case 'earbuds':
      case 'headphones': return 'Best Seller';
      case 'skincare':
      case 'makeup': return 'Top Rated';
      case 'tee':
      case 'pants':
      case 'outfit': return 'House of Brands';
      default: return 'Trending';
    }
  };

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="flex flex-col group cursor-pointer w-full bg-white rounded-xl shadow-xs hover:shadow-md border border-slate-100/80 overflow-hidden transition-shadow duration-300"
    >
      {/* Image container */}
      <div className="relative aspect-[1/1.1] w-full bg-slate-100">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            No Image
          </div>
        )}
        
        {/* Top Left Badge */}
        <div className="absolute top-0 left-0 bg-[#6b52a3] text-white text-[8px] font-bold px-2 py-1 rounded-br-lg shadow-sm z-10 uppercase tracking-wide">
          {getBadgeText(product.type)}
        </div>

        {/* Bottom Left Rating Pill */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm z-10">
          <span className="text-[10px] font-bold text-slate-800">{product.rating}</span>
          <Star className="w-2.5 h-2.5 text-teal-600 fill-current" />
          <div className="w-px h-2.5 bg-slate-300 mx-0.5"></div>
          <span className="text-[9px] font-medium text-slate-600">{getReviewCount(product.id)}</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col w-full p-1.5 pt-1">
        
        {/* Title & Wishlist */}
        <div className="flex items-start justify-between gap-1">
          <h3 className="text-sm font-bold text-slate-800 truncate leading-tight mt-0.5">
            {getProductBrand(product.type)}
          </h3>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!user) {
                navigate('/login');
                return;
              }
              toggleWishlist(product);
            }}
            className="p-1 -mr-1 -mt-1 hover:bg-slate-100 rounded-full transition-colors z-10 flex-shrink-0"
          >
            <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-[#FF4500] text-[#FF4500]' : 'text-slate-500'}`} />
          </button>
        </div>
        
        {/* Description / Product Name */}
        <p className="text-[10px] text-slate-500 truncate mt-0">
          {product.name} - {product.desc}
        </p>

        {/* Prices */}
        <div className="mt-1 flex items-baseline gap-1.5 flex-wrap leading-none">
          <span className="text-[11px] text-slate-400 line-through">₹{product.originalPrice}</span>
          <span className="text-[14px] font-black text-slate-800">₹{product.price}</span>
        </div>

        {/* Discount Line */}
        <div className="mt-0.5 text-[9.5px] font-bold text-[#FF7A45] leading-tight">
          {product.discount.replace('-', '').replace('%', '% OFF')}
        </div>

        {/* Best Price (Coupon) */}
        <div className="mt-1 text-[8.5px] text-slate-500 bg-slate-50/50 p-1 rounded inline-block w-fit leading-tight">
          <span className="font-bold text-emerald-600">Best Price ₹{bestPrice}</span> with coupon
        </div>
      </div>
    </div>
  );
}
