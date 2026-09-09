import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PropertyType, PropertyPurpose, PublicNavRoute } from '../../types';
import { CHITRAL_LOCATIONS, PROPERTY_IMAGES } from '../../data/seedData';
import { 
  Upload, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Image as ImageIcon, 
  Building2,
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';

interface ListPropertyPageProps {
  onNavigate: (route: PublicNavRoute) => void;
}

export const ListPropertyPage: React.FC<ListPropertyPageProps> = ({ onNavigate }) => {
  const { addProperty } = useStore();

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('House');
  const [purpose, setPurpose] = useState<PropertyPurpose>('Sale');
  const [location, setLocation] = useState<string>(CHITRAL_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [bedrooms, setBedrooms] = useState<number | ''>(3);
  const [bathrooms, setBathrooms] = useState<number | ''>(2);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    PROPERTY_IMAGES.mountainHouses[0]
  ]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newPropertyId, setNewPropertyId] = useState('');

  // Handle image upload from file picker
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setUploadedPhotos(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setUploadedPhotos(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const removePhoto = (idx: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const addSampleChitralPhoto = (url: string) => {
    setUploadedPhotos(prev => [...prev, url]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim() || !price || !size.trim()) return;

    const resolvedLocation = customLocation.trim() ? customLocation.trim() : location;

    // Save the new listing into Firestore database with a "Pending Review" status
    const created = await addProperty({
      title: `${size} ${propertyType} in ${resolvedLocation}`,
      type: propertyType,
      purpose,
      location: resolvedLocation,
      size,
      bedrooms: propertyType === 'House' && bedrooms ? Number(bedrooms) : undefined,
      bathrooms: propertyType === 'House' && bathrooms ? Number(bathrooms) : undefined,
      price: Number(price),
      description: description || `Newly listed ${size} ${propertyType} in ${resolvedLocation}. Contact owner ${name} directly via Rafeeq Homes and Properties.`,
      features: ['Road Access', 'Water Supply', 'Clear Ownership Records'],
      images: uploadedPhotos.length > 0 ? uploadedPhotos : [PROPERTY_IMAGES.mountainHouses[1]],
      status: 'Pending Review',
      ownerName: name,
      ownerPhone: whatsapp,
      commissionPercent: purpose === 'Rent' ? 50 : 2
    });

    setNewPropertyId(created.id);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full bg-[#f4f1ea] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2f6b3a] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Submission Received • Status: Pending Review
              </span>
              <h2 className="font-serif-brand text-3xl font-bold text-[#0f2f45]">
                Thank You, {name}!
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Your property <span className="font-semibold text-slate-900">({size} {propertyType})</span> has been securely entered into our database. Reference ID: <span className="font-mono font-bold text-[#2f6b3a]">{newPropertyId.toUpperCase()}</span>.
              </p>
            </div>

            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Owner Name:</span>
                <span className="font-semibold text-slate-800">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">WhatsApp:</span>
                <span className="font-semibold text-slate-800">{whatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800">{customLocation || location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expected Demand:</span>
                <span className="font-bold text-[#2f6b3a]">Rs. {Number(price).toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 text-[11px] text-amber-700 font-semibold">
                <span>Admin Review Status:</span>
                <span>Queued for Verification</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 max-w-md mx-auto">
              Our review committee inspects revenue documents and verifies contact numbers before publishing to the public feed. You can also view this listing immediately in our Admin Portal.
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setName('');
                  setWhatsapp('');
                  setSize('');
                  setPrice('');
                  setDescription('');
                }}
                className="px-5 py-2.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-slate-700 text-xs font-bold"
              >
                Submit Another Property
              </button>

              <button
                onClick={() => onNavigate('properties')}
                className="px-6 py-2.5 rounded-lg bg-[#2f6b3a] hover:bg-[#25552e] text-white text-xs font-bold shadow-md flex items-center gap-2"
              >
                <span>Browse All Properties</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="bg-[#0f2f45] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Free Seller Listing Submission</span>
                </div>
                <h1 className="font-serif-brand text-2xl sm:text-4xl font-bold leading-tight">
                  List Your Property in Chitral
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Sell or rent faster with Chitral’s most trusted real estate network. Reach thousands of verified buyers and investors across Pakistan and overseas.
                </p>
              </div>
            </div>

            {/* Two-Column Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md space-y-8"
            >
              <div className="border-b border-stone-200 pb-4">
                <h2 className="font-serif-brand text-xl font-bold text-[#0f2f45]">
                  Property & Contact Information
                </h2>
                <p className="text-xs text-[#5b6672]">
                  Please fill out the details accurately. Our team will verify the listing before making it active.
                </p>
              </div>

              {/* Grid Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Field 1: Your Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1.5">
                    Your Name (Owner / Agent) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Haji Sher Wali"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                  />
                </div>

                {/* Field 2: WhatsApp Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1.5">
                    WhatsApp / Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. 0345 5429230"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                  />
                </div>

                {/* Field 3: Property Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1.5">
                    Property Type *
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                  >
                    <option value="House">Residential House / Villa</option>
                    <option value="Land">Land / Agricultural / Orchard</option>
                    <option value="Commercial">Commercial Shop / Plot</option>
                    <option value="Building">Commercial Plaza / Building</option>
                  </select>
                </div>

                {/* Field 4: Purpose */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1.5">
                    Purpose *
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as PropertyPurpose)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                  >
                    <option value="Sale">For Sale</option>
                    <option value="Rent">For Rent</option>
                  </select>
                </div>

                {/* Field 5: Location */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1.5">
                    Location in Chitral *
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                  >
                    {CHITRAL_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Or enter specific village, street, or landmark..."
                    className="w-full mt-2 px-3 py-1.5 rounded-lg border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                  />
                </div>

                {/* Field 6: Property Size */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1.5">
                    Property Size (Marla / Kanal / Sq Ft) *
                  </label>
                  <input
                    type="text"
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 10 Marla, 2 Kanal, 500 Sq Ft"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                  />
                </div>

                {/* Bedrooms & Bathrooms if House */}
                {propertyType === 'House' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1.5">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1.5">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                      />
                    </div>
                  </>
                )}

                {/* Field 7: Expected Price */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1.5">
                    Expected Price (in PKR) * {purpose === 'Rent' && '(Monthly Rent)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      Rs.
                    </span>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={price}
                      onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 18000000 (1 Crore 80 Lakh)"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-[#0f2f45] focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                    />
                  </div>
                  {price && (
                    <div className="text-xs text-[#2f6b3a] font-semibold mt-1">
                      Formatted Demand: Rs. {Number(price).toLocaleString('en-PK')}
                    </div>
                  )}
                </div>

                {/* Field 8: Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1.5">
                    Detailed Property Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Highlight features such as spring water connection, mountain/river view, stone boundary wall, access road width, fruit trees, electricity meters..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                  />
                </div>

                {/* Field 9: Upload Photos (drag-and-drop file upload area) */}
                <div className="md:col-span-2 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45]">
                    Upload Property Photos (Accepts multiple images)
                  </label>

                  {/* Drag-and-drop dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                      isDragOver
                        ? 'border-[#2f6b3a] bg-emerald-50/50'
                        : 'border-stone-300 bg-stone-50 hover:bg-stone-100/60'
                    }`}
                  >
                    <input
                      type="file"
                      id="property-file-upload"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="property-file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2f6b3a]">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-semibold text-[#0f2f45]">
                        Click to browse or drag and drop photos here
                      </div>
                      <p className="text-xs text-slate-500">
                        PNG, JPG, JPEG up to 10MB each
                      </p>
                    </label>
                  </div>

                  {/* Quick Preset Photos Picker (for convenience) */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <span>Or quick-add Chitral sample photos:</span>
                    <button
                      type="button"
                      onClick={() => addSampleChitralPhoto(PROPERTY_IMAGES.mountainHouses[1])}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-slate-700 font-medium"
                    >
                      + Traditional House
                    </button>
                    <button
                      type="button"
                      onClick={() => addSampleChitralPhoto(PROPERTY_IMAGES.lands[1])}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-slate-700 font-medium"
                    >
                      + Valley Land
                    </button>
                    <button
                      type="button"
                      onClick={() => addSampleChitralPhoto(PROPERTY_IMAGES.commercial[1])}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-slate-700 font-medium"
                    >
                      + Commercial
                    </button>
                  </div>

                  {/* Preview Thumbnails */}
                  {uploadedPhotos.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-bold text-slate-700 block mb-2">
                        Attached Photos ({uploadedPhotos.length}):
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {uploadedPhotos.map((src, idx) => (
                          <div
                            key={idx}
                            className="relative w-24 h-20 rounded-lg overflow-hidden border border-stone-300 group shadow-sm"
                          >
                            <img
                              src={src}
                              alt={`Upload preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-90 hover:opacity-100 transition-opacity"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {idx === 0 && (
                              <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded">
                                Cover
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Disclaimer */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-[#2f6b3a] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  By submitting your property, you certify you hold legal ownership or authorization. Your submission will land in our Admin Dashboard with status <strong>"Pending Review"</strong> for staff verification.
                </p>
              </div>

              {/* Green Full-Width "Submit Property" Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#2f6b3a] hover:bg-[#25552e] text-white font-serif-brand font-bold text-base shadow-lg transition-all hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Submit Property for Verification</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};
