import React from 'react';
import { Property } from '../../types';
import { useStore } from '../../context/StoreContext';
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Heart, 
  ArrowUpRight,
  ShieldCheck,
  Building
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
}

export const formatPricePKR = (amount: number, purpose: 'Sale' | 'Rent'): string => {
  const formatted = amount.toLocaleString('en-PK');
  if (purpose === 'Rent') {
    return `Rs. ${formatted} / Month`;
  }
  if (amount >= 10000000) {
    const crore = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
    return `Rs. ${formatted} (${crore} Crore)`;
  }
  if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(2).replace(/\.00$/, '');
    return `Rs. ${formatted} (${lakh} Lakh)`;
  }
  return `Rs. ${formatted}`;
};

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const { savedPropertyIds, toggleSaveProperty } = useStore();
  const isSaved = savedPropertyIds.includes(property.id);

  const isRent = property.purpose === 'Rent';
  const badgeColor = isRent 
    ? 'bg-[#2563eb] text-white' 
    : 'bg-[#2f6b3a] text-white';

  const typeBg = {
    House: 'bg-amber-100 text-amber-800 border-amber-200',
    Land: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Commercial: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Building: 'bg-slate-100 text-slate-800 border-slate-200'
  }[property.type];

  // Default fallback image if none
  const primaryImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/80 flex flex-col justify-between hover:-translate-y-1">
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient scrim for top badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

        {/* Top-Left: Purpose Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm ${badgeColor}`}>
            {isRent ? 'For Rent' : 'For Sale'}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border backdrop-blur-md shadow-sm ${typeBg}`}>
            {property.type}
          </span>
        </div>

        {/* Top-Right: Heart/Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveProperty(property.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 shadow-md ${
            isSaved 
              ? 'bg-rose-50 text-rose-600 scale-110' 
              : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save property'}
          aria-label="Save Property"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Bottom overlay: Price on image */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white">
          <div className="bg-black/65 backdrop-blur-md px-3 py-1 rounded-md border border-white/10">
            <span className="text-xs text-white/80 block uppercase tracking-wider">Demand</span>
            <span className="font-bold text-base sm:text-lg text-white font-sans-brand">
              {formatPricePKR(property.price, property.purpose)}
            </span>
          </div>
          {property.status !== 'Active' && (
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
              property.status === 'Sold' ? 'bg-rose-600' :
              property.status === 'Rented' ? 'bg-indigo-600' : 'bg-amber-600'
            }`}>
              {property.status}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location line with Pin */}
          <div className="flex items-center gap-1.5 text-xs text-[#5b6672] mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#2f6b3a] shrink-0" />
            <span className="truncate font-medium">{property.location}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(property.id)}
            className="font-bold text-[#0f2f45] text-base line-clamp-2 hover:text-[#2f6b3a] cursor-pointer transition-colors leading-snug"
          >
            {property.title}
          </h3>
        </div>

        {/* Specs Row */}
        <div className="mt-4 pt-3 border-t border-stone-200">
          <div className="flex items-center justify-between text-xs text-[#5b6672]">
            {/* Size Spec */}
            <div className="flex items-center gap-1 font-semibold text-[#0f2f45]">
              <Maximize2 className="w-3.5 h-3.5 text-[#2f6b3a]" />
              <span>{property.size}</span>
            </div>

            {/* Bedrooms (for houses) */}
            {property.type === 'House' && property.bedrooms !== undefined && (
              <div className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}

            {/* Bathrooms (for houses) */}
            {property.type === 'House' && property.bathrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}

            {/* For Land or Commercial, show certified title indicator */}
            {property.type !== 'House' && (
              <div className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Title Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: View Details CTA */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500 truncate">
            ID: <span className="font-mono text-slate-700">{property.id.toUpperCase()}</span>
          </div>
          <button
            onClick={() => onSelect(property.id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2f6b3a] hover:bg-[#25552e] text-white text-xs font-semibold shadow-sm transition-all hover:translate-x-0.5"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
