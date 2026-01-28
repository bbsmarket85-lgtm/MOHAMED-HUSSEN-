
import React, { useState, useMemo, useCallback } from 'react';
import { INITIAL_PRODUCTS } from './constants';
import { Product, CartItem, FilterType, SortOption } from './types';
import Icon from './components/Icon';
import ProductCard from './components/ProductCard';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.ALL);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.NONE);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const totalCartItems = useMemo(() => 
    cart.reduce((sum, item) => sum + item.quantity, 0), 
    [cart]
  );

  const filteredProducts = useMemo(() => {
    let result = INITIAL_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (activeFilter) {
      case FilterType.ORGANIC:
        result = result.filter(p => p.isOrganic);
        break;
      case FilterType.ON_SALE:
        result = result.filter(p => !!p.discountBadge);
        break;
      case FilterType.TROPICAL:
        result = result.filter(p => p.isTropical);
        break;
    }

    switch (sortOption) {
      case SortOption.PRICE_LOW_HIGH:
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case SortOption.PRICE_HIGH_LOW:
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case SortOption.NAME:
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [searchTerm, activeFilter, sortOption]);

  const handleAddToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    [cart]
  );

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-background-light dark:bg-background-dark shadow-2xl relative">
      {/* Header Section */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111813]/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="flex items-center gap-2">
            <button className="text-[#111813] dark:text-white flex size-10 items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Icon name="arrow_back_ios" className="ml-1" />
            </button>
            <h2 className="text-[#111813] dark:text-white text-xl font-bold leading-tight tracking-tight">Fruits</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex size-10 items-center justify-center rounded-lg bg-transparent text-[#111813] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon name="shopping_cart" />
              {totalCartItems > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-[#111813] animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="flex w-full h-11 items-stretch rounded-xl overflow-hidden shadow-sm">
            <div className="text-[#61896f] dark:text-primary flex border-none bg-gray-100 dark:bg-gray-800 items-center justify-center pl-4">
              <Icon name="search" />
            </div>
            <input 
              className="flex w-full min-w-0 flex-1 border-none bg-gray-100 dark:bg-gray-800 focus:outline-0 focus:ring-0 text-[#111813] dark:text-white placeholder:text-[#61896f] px-3 text-sm font-medium" 
              placeholder="Search for fresh fruits..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="relative shrink-0">
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)}
              className={`flex h-9 items-center justify-center gap-x-2 rounded-lg px-4 transition-colors border ${
                sortOption !== SortOption.NONE 
                  ? 'bg-primary/20 dark:bg-primary/10 border-primary/20 text-primary' 
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-[#111813] dark:text-white'
              }`}
            >
              <span className="text-xs font-semibold">Sort By</span>
              <Icon name="expand_more" className="text-sm" />
            </button>

            {showSortMenu && (
              <div className="absolute top-11 left-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-2">
                {Object.values(SortOption).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortOption(opt);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 ${sortOption === opt ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {[FilterType.ORGANIC, FilterType.ON_SALE, FilterType.TROPICAL].map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(activeFilter === filter ? FilterType.ALL : filter)}
              className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 border transition-all ${
                activeFilter === filter 
                ? 'bg-primary text-[#111813] border-primary shadow-sm' 
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-[#111813] dark:text-white'
              }`}
            >
              <span className="text-xs font-semibold">{filter}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="p-4 flex-1">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Icon name="search_off" className="text-6xl mb-4 opacity-20" />
            <p className="text-sm font-medium">No fruits found matching your search.</p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 md:right-[calc(50%-12rem+1.5rem)] lg:right-[calc(50%-12rem+1.5rem)]">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="group flex items-center justify-center size-14 rounded-full bg-primary text-[#111813] shadow-xl hover:shadow-primary/50 active:scale-90 transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-full transition-transform" />
          <Icon name="add_shopping_cart" className="text-3xl font-bold relative z-10" />
        </button>
      </div>

      {/* Cart Drawer / Modal Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in" 
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white dark:bg-background-dark h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold">Your Cart ({totalCartItems})</h3>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="size-10 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Icon name="close" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Icon name="shopping_basket" className="text-6xl mb-2 opacity-20" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="flex gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                    <div 
                      className="size-20 rounded-lg bg-cover bg-center shrink-0 border border-gray-100 dark:border-gray-700"
                      style={{ backgroundImage: `url("${item.product.image}")` }}
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-bold">{item.product.name}</p>
                        <p className="text-xs text-primary font-bold">${item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                          <button 
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="size-7 flex items-center justify-center text-gray-500"
                          >
                            <Icon name="remove" className="text-sm" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="size-7 flex items-center justify-center text-primary"
                          >
                            <Icon name="add" className="text-sm" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <Icon name="delete_outline" className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t dark:border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 dark:text-gray-400 font-semibold">Total</span>
                <span className="text-xl font-black text-primary">${cartTotal.toFixed(2)}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                className="w-full h-12 bg-primary text-[#111813] font-bold rounded-xl shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
              >
                Checkout Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Spacer */}
      <div className="h-20 shrink-0"></div>
    </div>
  );
};

export default App;
