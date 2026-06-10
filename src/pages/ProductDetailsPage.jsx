import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ShoppingCart, Heart, Send, Star, ChevronRight, Home, Truck, Store, RotateCcw, Banknote, ShieldCheck, ArrowRight, ChevronDown, ChevronUp, CheckCircle2, CheckCircle, X, Play } from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useApp } from '../context/AppContext';
import { CRAZY_DEALS } from '../data/mockData';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { totalCartItems, addToCart, cart, toggleWishlist, isInWishlist, user, setSearchQuery } = useApp();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [fullscreenImage, setFullscreenImage] = useState(null);
  
  // Accordion and Tab States
  const [isHighlightsOpen, setIsHighlightsOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isReviewsOpen, setIsReviewsOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('specifications');
  
  // Review Media Viewer State
  const [selectedReviewMedia, setSelectedReviewMedia] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (selectedReviewMedia?.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(e => console.error("Autoplay prevented:", e));
    }
  }, [selectedReviewMedia]);

  useEffect(() => {
    setIsLoading(true);
    // Find product from mockData. In a real app, this would be an API call.
    const foundProduct = CRAZY_DEALS.find(p => p.id === id);
    
    // Small delay to make the page transition feel like a completely new page load
    const timer = setTimeout(() => {
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // Fallback if not found
        setProduct({
          id: 'fallback',
          name: 'Product Details',
          desc: 'Product description goes here',
          price: 999,
          originalPrice: 1999,
          discount: '50%',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
        });
      }
      setActiveImageIndex(0);
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 200);

    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pb-20">
        <div className="w-8 h-8 border-4 border-[#ee4923] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium text-sm mt-4 animate-pulse">Loading product...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
    setToastMessage('Item added to cart!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const itemInCart = cart.find(item => item.id === product.id);
    if (!itemInCart) {
      addToCart(product);
    }
    navigate('/review-order');
  };

  const handleShare = async () => {
    const shareData = {
      title: product?.name || 'Check out this product',
      text: product?.desc || 'Great product on Mynzo',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-slate-100 font-sans relative pb-[80px] animate-fade-in">
      
      {/* Sticky Header */}
      <header className="bg-white sticky top-0 z-50 flex items-center justify-between px-3 py-2 shadow-sm before:absolute before:top-[-50vh] before:left-0 before:right-0 before:h-[50vh] before:bg-white before:-z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex-1 mx-2 bg-slate-50 rounded flex items-center px-3 py-1.5 border border-slate-200">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search for products" 
            className="w-full bg-transparent outline-none text-sm text-slate-700"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && localSearchQuery.trim() !== '') {
                setSearchQuery(localSearchQuery);
                navigate('/categories');
              }
            }}
          />
        </div>

        <button onClick={() => navigate('/cart')} className="p-2 relative text-slate-700">
          <ShoppingCart className="w-6 h-6" />
          {totalCartItems > 0 && (
            <span className="absolute top-0 right-0 bg-[#ee4923] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              {totalCartItems}
            </span>
          )}
        </button>
      </header>


      {/* Hero Image Section */}
      <div className="relative bg-white">
        <div className="w-full aspect-[3/4] relative overflow-hidden">
          {/* Main Product Images Slider */}
          <div 
            className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
            style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
            onScroll={(e) => {
              const scrollPosition = e.target.scrollLeft;
              const width = e.target.offsetWidth;
              setActiveImageIndex(Math.round(scrollPosition / width));
            }}
          >
            {[
              product.image,
              product.image,
              product.image,
              product.image
            ].map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                onClick={() => setFullscreenImage(img)}
                alt={`${product.name} - view ${idx + 1}`} 
                className="w-full h-full flex-shrink-0 object-cover snap-center cursor-pointer" 
              />
            ))}
          </div>



          {/* Right Action Overlays */}
          <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
            <button 
              onClick={() => {
                if (!user) {
                  navigate('/login');
                  return;
                }
                toggleWishlist(product);
              }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
            </button>
            <button 
              onClick={handleShare}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <Send className="w-5 h-5 text-slate-600 ml-[-2px]" />
            </button>
          </div>

          {/* Left Rating Badge Overlay */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-md flex items-center gap-1">
            <span className="text-[11px] font-bold text-[#02006c]">4.5</span>
            <Star className="w-2.5 h-2.5 fill-[#ee4923] text-[#ee4923]" />
            <span className="text-slate-300 text-[10px] mx-0.5">|</span>
            <span className="text-[10px] text-slate-500 font-medium">1.2k</span>
          </div>

          {/* Highlights Overlay (Gradient Mask) */}
          <div className={`absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none flex flex-col justify-center px-4 transition-opacity duration-300 ${activeImageIndex === 1 ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-white font-black tracking-tight text-xl mb-4 drop-shadow-md">Key Highlights</h2>
            
            <div className="space-y-3">
              <div className="flex flex-col border-b border-white/20 pb-1 w-24">
                <span className="text-[10px] text-white/70">Fit</span>
                <span className="text-sm font-bold text-white drop-shadow">Boxy</span>
              </div>
              <div className="flex flex-col border-b border-white/20 pb-1 w-24">
                <span className="text-[10px] text-white/70">Collar</span>
                <span className="text-sm font-bold text-white drop-shadow">Spread</span>
              </div>
              <div className="flex flex-col border-b border-white/20 pb-1 w-24">
                <span className="text-[10px] text-white/70">Fabric</span>
                <span className="text-sm font-bold text-white drop-shadow">Cotton Blend</span>
              </div>
              <div className="flex flex-col border-b border-white/20 pb-1 w-24">
                <span className="text-[10px] text-white/70">Pattern</span>
                <span className="text-sm font-bold text-white drop-shadow">Solid / Printed</span>
              </div>
              <div className="flex flex-col border-b border-white/20 pb-1 w-24">
                <span className="text-[10px] text-white/70">Occasion</span>
                <span className="text-sm font-bold text-white drop-shadow">Casual</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="bg-white p-3 pb-1">
        <h1 className="text-sm font-bold text-[#02006c] mb-1.5 leading-tight">{product.desc}</h1>
        <div className="flex items-end gap-1.5 mb-1">
          <span className="text-[#ee4923] font-bold text-lg">↓ {product.discount}</span>
          <span className="text-2xl font-black text-[#02006c] tracking-tight">₹{product.price}</span>
        </div>
        <p className="text-[10px] text-slate-400 mb-2 line-through">MRP ₹{product.originalPrice}</p>
      </div>

      {/* Size Selector */}
      {['tee', 'pants', 'blouse', 'outfit'].includes(product.type) && (
        <div className="bg-white p-3 pt-2">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-sm text-[#02006c]">Select Size</span>
          <button 
            onClick={() => setIsSizeChartOpen(true)}
            className="text-[#ee4923] font-bold text-[11px]"
          >
            Size Chart
          </button>
        </div>
        
        <div className="flex gap-3">
          {['XS', 'S', 'M', 'L', 'XL'].map((size) => {
            const isSelected = selectedSize === size;
            const isOutOfStock = size === 'S'; // Mock out of stock state for 'S'
            
            return (
              <button
                key={size}
                disabled={isOutOfStock}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center text-sm font-bold transition-all relative overflow-hidden
                  ${isSelected ? 'border-[#ee4923] text-[#ee4923] bg-[#ee4923]/5' : 
                    isOutOfStock ? 'border-dashed border-slate-300 text-slate-300 bg-slate-50 cursor-not-allowed' : 
                    'border-slate-300 text-slate-700 hover:border-slate-400'
                  }
                `}
              >
                {size}
                {isOutOfStock && <div className="absolute w-[150%] h-[1px] bg-slate-300 -rotate-45" />}
              </button>
            )
          })}
        </div>
      </div>
      )}

      {/* Product Details Description */}
      <div className="bg-white px-4 pt-4 pb-1">
        <h3 className="font-bold text-base text-[#02006c] mb-1">Product Details</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Premium oversized comfort fit raglan tee. Crafted from the finest cotton blend for ultimate comfort all day long.
        </p>
      </div>

      {/* Delivery Details Section */}
      <div className="bg-white px-4 py-2">
        <h3 className="font-bold text-base text-[#02006c] mb-3">Delivery details</h3>
        
        <div className="flex flex-col -mx-1 rounded-xl overflow-hidden">
          {/* Home Address */}
          <div className="bg-[#FFE4D6] flex items-center justify-between py-2.5 px-3.5 border-b border-white/60">
            <div className="flex items-center gap-2 overflow-hidden">
              <Home className="w-4 h-4 text-[#02006c] flex-shrink-0" />
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs font-bold text-slate-800 flex-shrink-0">HOME</span>
                <span className="text-xs text-slate-500 truncate">83 kishan pura mataji mandir, sector n...</span>
              </div>
            </div>
          </div>
          
          {/* Delivery Date */}
          <div className="bg-[#FFE4D6] flex items-center gap-2 py-2.5 px-3.5 border-b border-white/60">
            <Truck className="w-4 h-4 text-[#02006c] flex-shrink-0" />
            <span className="text-xs font-bold text-slate-800">Delivery by 27 May, Wed</span>
          </div>

          {/* Seller Details */}
          <div className="bg-[#FFE4D6] flex items-start gap-2 py-2.5 px-3.5">
            <Store className="w-4 h-4 text-[#02006c] flex-shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-700 font-medium">Fulfilled by PumaSportsIndia</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] text-slate-500">4.3</span>
                <Star className="w-2.5 h-2.5 fill-slate-400 text-slate-400" />
                <span className="text-[10px] text-slate-400">• 9 years with Mynzo</span>
              </div>
              <span className="text-[10px] font-bold text-[#02006c] mt-1 cursor-pointer">See other sellers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white px-4 pt-1 pb-4 flex justify-around items-center border-b border-slate-100">
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50">
            <RotateCcw className="w-4 h-4 text-[#02006c]" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-600 text-center leading-tight">10-Day<br/>Return</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50">
            <Banknote className="w-4 h-4 text-[#02006c]" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-600 text-center leading-tight">Cash on<br/>Delivery</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50">
            <ShieldCheck className="w-4 h-4 text-[#02006c]" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-600 text-center leading-tight">Mynzo<br/>Assured</span>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="bg-white py-4 mt-2">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3 className="font-semibold text-lg tracking-tight text-[#02006c]">Similar Products</h3>
          <div 
            onClick={() => navigate('/similar-products')}
            className="w-7 h-7 bg-slate-800 hover:bg-[#ee4923] transition-colors rounded-full flex items-center justify-center cursor-pointer shadow-sm"
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
        
        {/* Horizontal Scroll List */}
        <div className="flex overflow-x-auto gap-4 pl-6 pr-4 pb-2 snap-x scroll-pl-6 scrollbar-none">
          {CRAZY_DEALS.map((deal) => (
            <div key={deal.id} className="w-32 flex-shrink-0 snap-start flex flex-col cursor-pointer" onClick={() => { navigate(`/product/${deal.id}`); window.scrollTo(0,0); }}>
              <div className="aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden relative mb-2">
                <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-1 left-1 bg-white/90 px-1.5 rounded flex items-center gap-0.5">
                  <span className="text-[9px] font-bold text-slate-800">4.2</span>
                  <Star className="w-2 h-2 fill-emerald-600 text-emerald-600" />
                </div>
              </div>
              <h4 className="text-[10px] font-bold text-[#02006c] truncate">{deal.name}</h4>
              <p className="text-[9px] text-slate-400 truncate mb-1">{deal.desc}</p>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#ee4923]">₹{deal.price}</span>
                <span className="text-[9px] text-slate-400 line-through">₹{deal.originalPrice}</span>
              </div>
              <span className="text-[8px] text-emerald-600 font-bold mt-0.5">60% OFF</span>
              <span className="text-[8px] text-slate-500 mt-0.5">Get it by 29 May</span>
            </div>
          ))}
        </div>
      </div>

      {/* Product Highlights */}
      <div className="bg-white px-4 py-3 mt-2 border-b border-slate-100">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsHighlightsOpen(!isHighlightsOpen)}>
          <div className="flex flex-col">
            <span className="font-bold text-base text-slate-800">Product highlights</span>
            {!isHighlightsOpen && <span className="text-xs text-slate-500">Key features, specifications and more</span>}
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center transition-transform duration-300">
            {isHighlightsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>
        
        {isHighlightsOpen && (
          <div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-6 animate-fade-in">
            <div className="flex flex-col border-b border-slate-100 pb-2">
              <span className="text-[11px] text-slate-500 mb-0.5">Sleeve</span>
              <span className="text-xs font-medium text-slate-800">Half Sleeve</span>
            </div>
            <div className="flex flex-col border-b border-slate-100 pb-2">
              <span className="text-[11px] text-slate-500 mb-0.5">Fabric</span>
              <span className="text-xs font-medium text-slate-800">Polyester</span>
            </div>
            <div className="flex flex-col border-b border-slate-100 pb-2">
              <span className="text-[11px] text-slate-500 mb-0.5">Neck Type</span>
              <span className="text-xs font-medium text-slate-800">Round Neck</span>
            </div>
            <div className="flex flex-col border-b border-slate-100 pb-2">
              <span className="text-[11px] text-slate-500 mb-0.5">Pattern</span>
              <span className="text-xs font-medium text-slate-800">Solid</span>
            </div>
          </div>
        )}
      </div>

      {/* All Details */}
      <div className="bg-white px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
          <div className="flex flex-col">
            <span className="font-bold text-base text-slate-800">All details</span>
            {!isDetailsOpen && <span className="text-xs text-slate-500">Features, description and more</span>}
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center transition-transform duration-300">
            {isDetailsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {isDetailsOpen && (
          <div className="mt-4 animate-fade-in">
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setActiveDetailTab('specifications')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${activeDetailTab === 'specifications' ? 'bg-[#1E1E1E] text-white' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}
              >
                Specifications
              </button>
              <button 
                onClick={() => setActiveDetailTab('manufacturer')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${activeDetailTab === 'manufacturer' ? 'bg-[#1E1E1E] text-white' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}
              >
                Manufacturer info
              </button>
            </div>

            {activeDetailTab === 'specifications' && (
              <div className="animate-fade-in">
                <h4 className="font-bold text-sm text-slate-800 mb-3">General</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div className="flex flex-col border-b border-slate-100 pb-2">
                    <span className="text-[11px] text-slate-500 mb-0.5">Brand</span>
                    <span className="text-xs font-medium text-slate-800">MYo2</span>
                  </div>
                  <div className="flex flex-col border-b border-slate-100 pb-2">
                    <span className="text-[11px] text-slate-500 mb-0.5">Type</span>
                    <span className="text-xs font-medium text-slate-800">Round Neck</span>
                  </div>
                  <div className="flex flex-col border-b border-slate-100 pb-2">
                    <span className="text-[11px] text-slate-500 mb-0.5">Sleeve</span>
                    <span className="text-xs font-medium text-slate-800">Half Sleeve</span>
                  </div>
                  <div className="flex flex-col border-b border-slate-100 pb-2">
                    <span className="text-[11px] text-slate-500 mb-0.5">Fit</span>
                    <span className="text-xs font-medium text-slate-800">Regular</span>
                  </div>
                  <div className="flex flex-col border-b border-slate-100 pb-2">
                    <span className="text-[11px] text-slate-500 mb-0.5">Fabric</span>
                    <span className="text-xs font-medium text-slate-800">Polyester</span>
                  </div>
                  <div className="flex flex-col border-b border-slate-100 pb-2">
                    <span className="text-[11px] text-slate-500 mb-0.5">Sales Package</span>
                    <span className="text-xs font-medium text-slate-800">1 T-shirt</span>
                  </div>
                  <div className="flex flex-col border-b border-slate-100 pb-2">
                    <span className="text-[11px] text-slate-500 mb-0.5">Pack of</span>
                    <span className="text-xs font-medium text-slate-800">1</span>
                  </div>
                  <div className="flex flex-col border-b border-slate-100 pb-2">
                    <span className="text-[11px] text-slate-500 mb-0.5">Style Code</span>
                    <span className="text-xs font-medium text-slate-800">Apple Cut Dark Grey</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeDetailTab === 'manufacturer' && (
              <div className="text-sm text-slate-600 animate-fade-in">
                <p>Manufactured by: Apparel Corp India Ltd.</p>
                <p>Country of Origin: India</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ratings and reviews */}
      <div className="bg-white px-4 py-3 mb-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsReviewsOpen(!isReviewsOpen)}>
          <span className="font-bold text-base text-slate-800">Ratings and reviews</span>
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center transition-transform duration-300">
            {isReviewsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {isReviewsOpen && (
          <div className="mt-3 animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl font-bold text-slate-800">4.1</span>
              <Star className="w-6 h-6 fill-emerald-600 text-emerald-600" />
              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-bold">Very Good</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-4">
              <span>based on 63 ratings by</span>
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verified Buyers</span>
            </div>

            <h4 className="text-[13px] text-slate-800 mb-2">Features customers loved</h4>
            <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-none snap-x">
              {['Fabric Quality', 'Colour', 'Style', 'True to Specs', 'Stitching'].map(feature => (
                <div key={feature} className="snap-start flex-shrink-0 bg-blue-50/50 text-slate-700 px-3 py-1.5 rounded-full text-[11px] font-medium border border-blue-100">
                  {feature}
                </div>
              ))}
            </div>

            {/* User Review with Video */}
            <div className="border-t border-slate-100 pt-4 mt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-700">A</div>
                  <span className="text-xs font-bold text-slate-800">Aman Sharma</span>
                </div>
                <div className="flex items-center gap-0.5 bg-emerald-600 px-1.5 py-0.5 rounded text-white">
                  <span className="text-[10px] font-bold">4</span>
                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                Amazing quality! The fabric feels premium and the fit is exactly as shown. The color hasn't faded even after multiple washes. Definitely recommend buying this.
              </p>
              
              {/* Video/Reel Thumbnail */}
              <div className="flex gap-2 overflow-x-auto scrollbar-none mb-2">
                <div 
                  onClick={() => setSelectedReviewMedia({ type: 'video', url: '/fit-check.mp4' })}
                  className="relative w-20 h-[104px] rounded-md overflow-hidden flex-shrink-0 bg-slate-100 cursor-pointer shadow-sm"
                >
                  <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200" alt="User review video" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center transition-colors hover:bg-black/40">
                    <Play className="w-6 h-6 text-white fill-white opacity-90 drop-shadow-md" />
                  </div>
                </div>
                <div 
                  onClick={() => setSelectedReviewMedia({ type: 'image', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800' })}
                  className="w-20 h-[104px] rounded-md overflow-hidden flex-shrink-0 bg-slate-100 cursor-pointer shadow-sm"
                >
                  <img src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=200" alt="User review photo" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 py-2 text-[11px] font-bold text-[#02006c] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              View All Reviews
            </button>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2.5 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] max-w-md mx-auto w-full">
        <div className="flex gap-2 h-12">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-white border border-[#02006c] rounded text-[#02006c] font-bold text-[13px] flex items-center justify-center active:bg-slate-50 transition-colors"
          >
            Add to cart
          </button>
          <button 
            onClick={handleBuyNow}
            className="flex-1 bg-[#ee4923] rounded text-white font-bold text-[13px] flex items-center justify-center active:bg-orange-600 shadow-sm transition-colors"
          >
            Buy at ₹{product.price}
          </button>
        </div>
      </div>

      {/* Size Chart Modal */}
      {['tee', 'pants', 'blouse', 'outfit'].includes(product.type) && isSizeChartOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-fade-in font-sans">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200 sticky top-0 bg-white">
            <button onClick={() => setIsSizeChartOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
              <X className="w-6 h-6 text-slate-500" />
            </button>
            <h2 className="text-[17px] text-slate-800">Size Chart</h2>
          </div>

          <div className="overflow-y-auto flex-1 bg-slate-100">
            {/* Title */}
            <div className="bg-slate-200 px-4 py-4 text-center">
              <h3 className="font-bold text-slate-900 text-sm">{product.name}</h3>
            </div>

            {/* Table */}
            <div className="bg-white overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-800">Size</th>
                    <th className="p-3 font-bold text-slate-800">Chest</th>
                    <th className="p-3 font-bold text-slate-800">Brand Size</th>
                    <th className="p-3 font-bold text-slate-800">Shoulder</th>
                    <th className="p-3 font-bold text-slate-800">Length</th>
                    <th className="p-3 font-bold text-slate-800">Sleeve Length</th>
                    <th className="p-3 font-bold text-slate-800">Waist</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3 font-black text-black">M</td>
                    <td className="p-3 whitespace-nowrap">35.5 - 37</td>
                    <td className="p-3">M</td>
                    <td className="p-3">14</td>
                    <td className="p-3">23</td>
                    <td className="p-3">6</td>
                    <td className="p-3">34</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-black">L</td>
                    <td className="p-3 whitespace-nowrap">37.5 - 39</td>
                    <td className="p-3">L</td>
                    <td className="p-3">15</td>
                    <td className="p-3">23.5</td>
                    <td className="p-3">6.5</td>
                    <td className="p-3">36</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-black">XL</td>
                    <td className="p-3 whitespace-nowrap">39.5 - 41</td>
                    <td className="p-3">XL</td>
                    <td className="p-3">16</td>
                    <td className="p-3">24</td>
                    <td className="p-3">7</td>
                    <td className="p-3">38</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Measurement Guidelines */}
            <div className="bg-slate-200 p-4 pb-12 mt-1 h-full">
              <h4 className="font-bold text-slate-900 text-sm mb-3">Measurement Guidelines:</h4>
              <p className="text-sm text-slate-800 mb-2 leading-snug">
                <span className="font-bold">Measuring T Shirt Size</span> Not sure about your t shirt size? Follow these simple steps to figure it out:
              </p>
              <ul className="text-sm text-slate-800 space-y-2 leading-snug">
                <li><span className="font-bold">Shoulder</span> - Measure the shoulder at the back, from edge to edge with arms relaxed on both sides</li>
                <li><span className="font-bold">Chest</span> - Measure around the body under the arms at the fullest part of the chest with your arms relaxed at both sides.</li>
                <li><span className="font-bold">Sleeve</span> - Measure from the shoulder seam through the outer arm to the cuff/hem</li>
                <li><span className="font-bold">Neck</span> - Measured horizontally across the neck Length - Measure from the highest point of the shoulder seam to the bottom hem of the garment's</li>
              </ul>
              
              <div className="mt-6 flex justify-center bg-white rounded-lg p-3 max-w-[280px] mx-auto border border-slate-300">
                <svg viewBox="0 0 200 150" className="w-full h-auto text-slate-800" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M60,40 Q100,20 140,40 L180,90 L160,110 L140,90 L140,150 L60,150 L60,90 L40,110 L20,90 Z" />
                  <path strokeDasharray="4 4" d="M100,30 L100,150" stroke="#ee4923" />
                  <path strokeDasharray="4 4" d="M60,90 L140,90" stroke="#ee4923" />
                  <path strokeDasharray="4 4" d="M60,40 L140,40" stroke="#ee4923" />
                  <path strokeDasharray="4 4" d="M40,65 L80,65" stroke="#ee4923" />
                  <text x="90" y="20" fontSize="8" fill="currentColor" stroke="none">NECK</text>
                  <text x="130" y="35" fontSize="8" fill="currentColor" stroke="none">SHOULDER</text>
                  <text x="95" y="100" fontSize="8" fill="currentColor" stroke="none">CHEST</text>
                  <text x="25" y="125" fontSize="8" fill="currentColor" stroke="none">SLEEVE</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-[70px] left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-bold animate-slide-up z-[60] flex items-center gap-2 whitespace-nowrap">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Media Viewer Modal */}
      {selectedReviewMedia && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col animate-fade-in font-sans">
          <div className="flex justify-end p-4">
            <button 
              onClick={() => setSelectedReviewMedia(null)} 
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            {selectedReviewMedia.type === 'video' ? (
              <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl">
                <video 
                  ref={videoRef}
                  src={selectedReviewMedia.url} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  controls
                  onTimeUpdate={(e) => {
                    if (e.target.currentTime >= 8) {
                      e.target.currentTime = 0;
                      e.target.play();
                    }
                  }}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-[10px] font-bold">A</div>
                    <span className="text-xs font-bold shadow-sm">Aman Sharma</span>
                  </div>
                  <p className="text-[10px] line-clamp-2 text-white/90">Amazing quality! The fabric feels premium and the fit is exactly as shown.</p>
                </div>
              </div>
            ) : (
              <img src={selectedReviewMedia.url} alt="Review" className="w-full max-w-sm rounded-xl object-contain max-h-[80vh] shadow-2xl" />
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Image Zoom Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-[300] bg-black flex flex-col animate-fade-in font-sans touch-none">
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-end z-[310]">
            <button 
              onClick={() => setFullscreenImage(null)} 
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center w-full h-full overflow-hidden">
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={4}
              centerOnInit={true}
              wheel={{ step: 0.1 }}
              doubleClick={{ mode: 'toggle' }}
              pinch={{ step: 5 }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <TransformComponent wrapperStyle={{ width: '100vw', height: '100vh' }} contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={fullscreenImage} 
                    alt="Zoomed Product" 
                    className="w-full h-auto max-h-[100dvh] object-contain pointer-events-auto" 
                  />
                </TransformComponent>
              )}
            </TransformWrapper>
          </div>
        </div>
      )}
    </div>
  );
}
