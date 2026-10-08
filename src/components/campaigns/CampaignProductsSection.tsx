'use client';

import type { CampaignProduct } from '@/lib/api';

// Dispatched when a visitor picks a product from this main-content grid, so the
// sticky CampaignDonatePanel (a separate client component in the sidebar) can
// switch itself to the Products tab and pre-select the same item — keeping the
// two in sync without lifting state across the server/client boundary.
export const SELECT_PRODUCT_EVENT = 'campaign:selectProduct';

export default function CampaignProductsSection({ products }: { products: CampaignProduct[] }) {
  if (!products || products.length === 0) return null;

  function selectProduct(productId: number) {
    window.dispatchEvent(new CustomEvent(SELECT_PRODUCT_EVENT, { detail: { productId } }));
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Donate an Item</h2>
      <p className="text-gray-600 mb-6">
        Prefer to give a specific item instead of cash? Pick anything below — it adds straight to your donation cart.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => selectProduct(product.id)}
            className="group text-left bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-300"
          >
            <div className="relative h-28 sm:h-32 bg-gray-100 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                ₹{product.pricePerUnit.toLocaleString('en-IN')} • {product.availableQty} available
              </p>
              <span className="inline-block mt-2 text-xs font-semibold text-blue-600 group-hover:text-blue-800">
                + Add to Donation
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
