import React, { useState } from 'react';
import { Property } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Send, Phone, MessageSquare, CheckCircle2, Shield } from 'lucide-react';

interface InquiryModalProps {
  property: Property;
  onClose: () => void;
  defaultMode?: 'inquire' | 'whatsapp';
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  property,
  onClose,
  defaultMode = 'inquire'
}) => {
  const { addLead, settings } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    `Hello Rafeeq Homes, I am interested in "${property.title}" (Ref: ${property.id.toUpperCase()}) listed at Rs. ${property.price.toLocaleString('en-PK')}. Please provide more details and arrange a visit.`
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    await addLead({
      name,
      phone,
      email: email.trim() || undefined,
      propertyId: property.id,
      propertyTitle: property.title,
      status: 'New',
      notes: message
    });

    setIsSubmitted(true);
  };

  const openWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Rafeeq Homes! I am inquiring about "${property.title}" (ID: ${property.id}) in ${property.location} - Price: Rs. ${property.price.toLocaleString('en-PK')}. Can you share more details?`
    );
    window.open(`https://wa.me/${settings.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Modal Header */}
        <div className="bg-[#0f2f45] px-6 py-4 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              Official Property Inquiry
            </span>
            <h3 className="font-bold text-lg leading-tight line-clamp-1">
              {property.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-[#0f2f45]">
                Inquiry Successfully Logged!
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Thank you, <span className="font-semibold">{name}</span>. Our lead Chitral property consultant will contact you via WhatsApp/Call at <span className="font-semibold font-mono">{phone}</span> shortly.
              </p>
              <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={openWhatsAppDirect}
                  className="px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp Now</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block">Demand Price:</span>
                  <span className="font-bold text-sm text-[#0f2f45]">
                    Rs. {property.price.toLocaleString('en-PK')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Location:</span>
                  <span className="font-medium text-slate-700">{property.location}</span>
                </div>
              </div>

              {/* Instant WhatsApp Shortcut Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">Quickest Response:</p>
                    <p className="text-[11px] text-emerald-800">Chat with Director Rafeeq immediately</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openWhatsAppDirect}
                  className="px-3 py-1.5 rounded-lg bg-[#2f6b3a] hover:bg-[#25552e] text-white text-xs font-semibold shrink-0"
                >
                  Open WhatsApp
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Asad Ullah Khan"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0345 1234567"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inquiry Details / Visiting Schedule
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a] focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Your contact details are kept strictly private & confidential.</span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#2f6b3a] hover:bg-[#25552e] text-white text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
