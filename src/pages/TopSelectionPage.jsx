import React from 'react';
import { ArrowLeft, Search, Camera, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import imgTee from '../assets/CrazyDeals/CrazyDeals2.jpg';
import imgNecklace from '../assets/CrazyDeals/CrazyDeals3.jpg';
import imgWatch from '../assets/CrazyDeals/CrazyDeals4.jpg';
import imgTint from '../assets/CrazyDeals/CrazyDeals5.jpg';

const topOffers = [
  {
    id: 1,
    image: imgTee,
    title: 'XXTRENDZ',
    subtitle: 'Best Selling Products',
  },
  {
    id: 2,
    image: imgNecklace,
    title: 'Cotton Blend',
    subtitle: 'Best Selling Products',
  },
  {
    id: 3,
    image: imgWatch,
    title: 'Vintage Watch',
    subtitle: 'Best Selling Products',
  },
  {
    id: 4,
    image: imgTint,
    title: 'Benetint Lip Tint',
    subtitle: 'Widest Range',
  },
  {
    id: 5,
    image: imgTee,
    title: 'Classic Fit Tee',
    subtitle: 'Top Selection',
  },
  {
    id: 6,
    image: imgNecklace,
    title: 'Gold Plated Jewelry',
    subtitle: 'Best Selling Products',
  }
];

export default function TopSelectionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20 animate-fade-in">
      {/* Simple Header */}
      <div className="bg-[#FFE4D6] px-4 py-4 flex items-center gap-3 shadow-sm z-10 sticky top-0">
        <button onClick={() => navigate(-1)} className="p-1.5 -ml-1 hover:bg-orange-200/50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#02006c]" />
        </button>
        <h1 className="text-[#02006c] text-xl font-bold tracking-tight" style={{ fontFamily: "'Times New Roman', Times, serif" }}>Top picks for you</h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 bg-slate-50 gap-3 p-3">
        {topOffers.map((offer) => (
          <div 
            key={offer.id} 
            onClick={() => navigate(`/product/deal-${offer.id}`)}
            className="bg-white flex flex-col items-center pt-0 px-0 pb-3 cursor-pointer hover:shadow-md transition-all shadow-sm"
          >
            <div className="w-full aspect-[4/5] mb-2 flex items-center justify-center overflow-hidden">
              <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-[12px] font-medium text-slate-600 text-center tracking-wide" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{offer.title}</h3>
            <p className="text-[10px] text-emerald-600 mt-1 text-center font-medium tracking-wide" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{offer.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
