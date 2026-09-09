import React, { useState } from 'react';
import { Property } from '../../types';
import { useStore } from '../../context/StoreContext';
import { InquiryModal } from './InquiryModal';
import { formatPricePKR } from '../common/PropertyCard';
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Heart, 
  Phone, 
  MessageSquare, 
  Share2, 
  ArrowLeft,
  CheckCircle2, 
  Calendar, 
  User, 
  ShieldCheck,
  Building,
  Sparkles,
  Navigation,
  Copy,
  Check
} from 'lucide-react';

interface PropertyDetailPageProps {
  propertyId: string;
  onBack: () => void;
  onSelectOtherProperty: (id: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  propertyId,
  onBack,
  onSelectOtherProperty
}) => {
  const { properties, savedPropertyIds, toggleSaveProperty, settings } = useStore();
  const property = properties.find((p) => p.id === propertyId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'location' | 'agent'>('overview');
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!property) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-[#0f2f45] mb-2">Property Not Found</h2>
        <p className="text-slate-600 mb-6">The listing you are looking for may have been archived or removed.</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-[#2f6b3a] text-white rounded-lg font-semibold text-sm"
        >
          Return to All Properties
        </button>
      </div>
    );
  }

  const isSaved = savedPropertyIds.includes(property.id);
  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80'];

  const isRent = property.purpose === 'Rent';

  const openWhatsAppNow = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum! I want to inquire about "${property.title}" (ID: ${property.id.toUpperCase()}) in ${property.location} - Demand: Rs. ${property.price.toLocaleString('en-PK')}. Please share details.`
    );
    window.open(`https://wa.me/${settings.whatsapp}?text=${text}`, '_blank');
  };

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Similar properties recommendation
  const similarProperties = properties
    .filter((p) => p.id !== property.id && p.type === property.type && p.status === 'Active')
    .slice(0, 3);

  return (
    <div className="w-full bg-[#f4f1ea] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Breadcrumbs & Back */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0f2f45] hover:text-[#2f6b3a] transition-colors bg-white px-4 py-2 rounded-lg border border-stone-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Listings</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Property Ref:</span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-stone-200 text-[#0f2f45]">
              {property.id.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Main Header Card: Title, Location, Badges, Price, Actions */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white ${
                isRent ? 'bg-[#2563eb]' : 'bg-[#2f6b3a]'
              }`}>
                {isRent ? 'For Rent' : 'For Sale'}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                {property.type}
              </span>
              <span className="text-xs text-slate-400">
                Listed on {property.dateAdded}
              </span>
            </div>

            <h1 className="font-serif-brand text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0f2f45] leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-[#5b6672]">
              <MapPin className="w-4 h-4 text-[#2f6b3a] shrink-0" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 bg-stone-50 p-4 sm:p-5 rounded-xl border border-stone-200">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                Official Asking Price
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-serif-brand text-[#0f2f45]">
                {formatPricePKR(property.price, property.purpose)}
              </div>
            </div>

            {/* Top Quick Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* WhatsApp Now (green, primary) */}
              <button
                onClick={openWhatsAppNow}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Now</span>
              </button>

              {/* Inquire Now (outlined) */}
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-[#2f6b3a] text-[#2f6b3a] hover:bg-[#2f6b3a] hover:text-white text-xs font-bold transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Inquire Now</span>
              </button>

              {/* Save Heart */}
              <button
                onClick={() => toggleSaveProperty(property.id)}
                className={`p-2.5 rounded-lg border transition-all ${
                  isSaved
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white border-stone-300 text-slate-600 hover:text-rose-600'
                }`}
                title={isSaved ? 'Saved to Favorites' : 'Save Property'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm space-y-3">
          {/* Main Large Image */}
          <div className="relative aspect-[16/9] sm:aspect-[21/10] rounded-xl overflow-hidden bg-stone-900 shadow-inner">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-md text-xs font-semibold">
              Photo {selectedImageIndex + 1} of {images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-24 h-16 sm:w-28 sm:h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#2f6b3a] ring-2 ring-[#2f6b3a]/30 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Specs Row with Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#2f6b3a] flex items-center justify-center shrink-0">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Property Area</span>
              <span className="font-bold text-sm text-[#0f2f45]">{property.size}</span>
            </div>
          </div>

          {property.type === 'House' && (
            <>
              <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Bedrooms</span>
                  <span className="font-bold text-sm text-[#0f2f45]">
                    {property.bedrooms || 3} Master Beds
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <Bath className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Bathrooms</span>
                  <span className="font-bold text-sm text-[#0f2f45]">
                    {property.bathrooms || 2} Bathrooms
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Title Verification</span>
              <span className="font-bold text-sm text-[#0f2f45]">Certified Clean</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Property Type</span>
              <span className="font-bold text-sm text-[#0f2f45]">{property.type}</span>
            </div>
          </div>
        </div>

        {/* Two-Column Section: Main Content with Tabs + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Tabs Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tab Navigation Header */}
            <div className="bg-white rounded-xl p-1.5 border border-stone-200 shadow-sm flex items-center gap-1">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'details', label: 'Details & Specs' },
                { id: 'location', label: 'Location & Map' },
                { id: 'agent', label: 'Assigned Agent' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-colors text-center ${
                    activeTab === tab.id
                      ? 'bg-[#0f2f45] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#0f2f45] hover:bg-stone-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif-brand text-xl font-bold text-[#0f2f45] mb-3">
                    Property Description
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <h3 className="font-serif-brand text-lg font-bold text-[#0f2f45] mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2f6b3a]" />
                    <span>Key Features & Amenities</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#2f6b3a] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#2f6b3a] shrink-0" />
                      <span>Dedicated Motorway / Road Access</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#2f6b3a] shrink-0" />
                      <span>Registry Fard & Ownership Verification Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Details */}
            {activeTab === 'details' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-serif-brand text-xl font-bold text-[#0f2f45] mb-2">
                  Comprehensive Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-500">Property ID:</span>
                    <span className="font-mono font-bold text-slate-800">{property.id.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-500">Property Purpose:</span>
                    <span className="font-semibold text-slate-800">For {property.purpose}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-semibold text-slate-800">{property.type}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-500">Total Area / Size:</span>
                    <span className="font-bold text-[#2f6b3a]">{property.size}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-500">Location Area:</span>
                    <span className="font-semibold text-slate-800">{property.location}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-500">Listing Status:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {property.status}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-500">Date Added:</span>
                    <span className="font-semibold text-slate-800">{property.dateAdded}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-slate-500">Agency Commission:</span>
                    <span className="font-semibold text-slate-800">{property.commissionPercent || 2}% (Standard)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Location */}
            {activeTab === 'location' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-brand text-xl font-bold text-[#0f2f45]">
                      Location & Surrounding Area
                    </h3>
                    <p className="text-xs text-slate-500">{property.location}</p>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(property.location + ', Chitral, Pakistan')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2f6b3a] hover:underline"
                  >
                    <span>View on Google Maps</span>
                    <Navigation className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Embedded Map Placeholder with a Pin */}
                <div className="relative w-full h-72 rounded-xl overflow-hidden border border-stone-300 bg-stone-100 flex items-center justify-center">
                  <div 
                    className="absolute inset-0 opacity-40 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80')`
                    }}
                  />
                  <div className="absolute inset-0 bg-[#0f2f45]/20 backdrop-blur-[1px]" />
                  
                  {/* Pin Card */}
                  <div className="relative z-10 bg-white/95 backdrop-blur-md px-5 py-4 rounded-xl shadow-2xl border border-stone-200 text-center max-w-xs animate-bounce">
                    <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto mb-2 shadow-lg">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-xs text-[#0f2f45]">{property.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{property.location}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                      Verified Chitral Revenue Coordinates
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Our regional consultants offer guided vehicle site visits directly from our Markaz Road office opposite Radio Pakistan near Polo Grounds.
                </p>
              </div>
            )}

            {/* Tab 4: Agent */}
            {activeTab === 'agent' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <h3 className="font-serif-brand text-xl font-bold text-[#0f2f45]">
                  Assigned Listing Agent
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-stone-50 p-6 rounded-xl border border-stone-200">
                  <div className="w-20 h-20 rounded-full bg-[#0f2f45] text-white flex items-center justify-center font-serif-brand text-2xl font-bold shrink-0 shadow-md">
                    {(property.assignedAgent || 'Rafeeq Ahmad').split(' ').map(n => n[0]).join('')}
                  </div>

                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <h4 className="text-lg font-bold text-[#0f2f45]">
                      {property.assignedAgent || 'Rafeeq Ahmad Chitrali'}
                    </h4>
                    <p className="text-xs font-semibold text-[#2f6b3a]">
                      Senior Property Consultant & Partner
                    </p>
                    <p className="text-xs text-slate-600">
                      12+ years of verified land arbitration & property acquisition in Chitral.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                      <a
                        href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2f45] text-white text-xs font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{settings.phone}</span>
                      </a>
                      <button
                        onClick={openWhatsAppNow}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Direct WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Share This Property Row */}
            <div className="bg-white rounded-xl p-4 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0f2f45]">
                <Share2 className="w-4 h-4 text-[#2f6b3a]" />
                <span>Share this property with family & partners:</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={openWhatsAppNow}
                  className="px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] text-xs font-bold transition-colors"
                >
                  WhatsApp
                </button>
                <button
                  onClick={handleCopyShare}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-slate-700 text-xs font-semibold transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Sidebar Column (1/3 width) */}
          <div className="space-y-6">
            
            {/* Sidebar Card: Property Owner Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Property Ownership
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Direct Listing
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-300 text-[#0f2f45] flex items-center justify-center font-bold text-base shrink-0">
                  <User className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0f2f45]">
                    {property.ownerName || 'Direct Owner (Disclosed on Inquiry)'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Title Holder / Authorized Representative
                  </p>
                </div>
              </div>

              <a
                href={`tel:${property.ownerPhone ? property.ownerPhone.replace(/\s+/g, '') : settings.phone.replace(/\s+/g, '')}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#2f6b3a] hover:bg-[#25552e] text-white text-xs font-bold transition-all shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call Owner / Agency ({property.ownerPhone || settings.phone})</span>
              </a>
            </div>

            {/* "Have questions?" Box */}
            <div className="bg-gradient-to-br from-[#0f2f45] to-[#17415e] rounded-2xl p-6 text-white shadow-md space-y-4 border border-white/10">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  Expert Assistance
                </span>
                <h4 className="font-serif-brand text-lg font-bold text-white mt-1">
                  Have Questions About This Property?
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Need title verification, pricing negotiation, or an in-person site visit in Chitral? Our local team is here to assist.
                </p>
              </div>

              <div className="pt-1 flex flex-col gap-2.5">
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call {settings.phone}</span>
                </a>

                <button
                  onClick={openWhatsAppNow}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Small Map Preview Widget */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#0f2f45]">
                <span>Chitral Location Map</span>
                <span className="text-[#2f6b3a]">{property.location.split(',')[0]}</span>
              </div>
              <div className="relative h-36 rounded-lg overflow-hidden border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80"
                  alt="Chitral landscape"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0f2f45]/25 flex items-center justify-center">
                  <div className="p-2 rounded-full bg-rose-600 text-white shadow-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('location')}
                className="w-full text-center text-xs font-bold text-[#2f6b3a] hover:underline pt-1"
              >
                Expand Interactive Location Details
              </button>
            </div>

          </div>

        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="pt-8 border-t border-stone-200">
            <h3 className="font-serif-brand text-2xl font-bold text-[#0f2f45] mb-6">
              Similar {property.type} Listings in Chitral
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectOtherProperty(p.id)}
                  className="bg-white rounded-xl overflow-hidden border border-stone-200 p-3 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <div className="text-xs text-slate-500">{p.location}</div>
                  <h4 className="font-bold text-sm text-[#0f2f45] truncate">{p.title}</h4>
                  <div className="text-sm font-bold text-[#2f6b3a] mt-1">
                    {formatPricePKR(p.price, p.purpose)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Inquiry Form Modal */}
      {inquiryModalOpen && (
        <InquiryModal
          property={property}
          onClose={() => setInquiryModalOpen(false)}
        />
      )}
    </div>
  );
};
