import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Users, 
  Award,
  TreePine,
  Sparkles
} from 'lucide-react';

interface AboutContactPageProps {
  initialTab?: 'about' | 'contact';
}

export const AboutContactPage: React.FC<AboutContactPageProps> = ({ initialTab = 'about' }) => {
  const { settings, addLead } = useStore();
  const [activeTab, setActiveTab] = useState<'about' | 'contact'>(initialTab);

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;

    await addLead({
      name: contactName,
      phone: contactPhone,
      email: contactEmail.trim() || undefined,
      status: 'New',
      notes: `General agency contact inquiry: ${contactMessage || 'Client reached out via website contact form.'}`
    });

    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#f4f1ea] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Top Tab Toggle */}
        <div className="flex justify-center">
          <div className="bg-white p-1.5 rounded-2xl border border-stone-200 shadow-sm inline-flex">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'about'
                  ? 'bg-[#0f2f45] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0f2f45]'
              }`}
            >
              About Rafeeq Homes
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'contact'
                  ? 'bg-[#0f2f45] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0f2f45]'
              }`}
            >
              Contact Our Chitral Office
            </button>
          </div>
        </div>

        {activeTab === 'about' ? (
          <div className="space-y-10">
            {/* Hero About */}
            <div className="bg-[#0f2f45] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-3xl space-y-4">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                  About Our Agency
                </span>
                <h1 className="font-serif-brand text-3xl sm:text-5xl font-bold leading-tight">
                  Rafeeq Homes and Properties (PVT LTD)
                </h1>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  Established in the heart of Chitral valley, Rafeeq Homes and Properties is the leading real estate consultancy dedicated to empowering local residents, returning Chitralis, and national investors with transparent, certified land and property acquisitions.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-emerald-300">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    SECP Registered Corporate Entity
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                    <TreePine className="w-4 h-4 text-emerald-400" />
                    Indigenous Chitrali Leadership
                  </span>
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#2f6b3a] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif-brand text-lg font-bold text-[#0f2f45]">
                  100% Verified Title Records
                </h3>
                <p className="text-xs text-[#5b6672] leading-relaxed">
                  Land tenure in mountain districts requires meticulous local scrutiny. We verify every Fard, Shajra, and Intiqal through local revenue offices before any agreement is signed.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif-brand text-lg font-bold text-[#0f2f45]">
                  Transparent Commission
                </h3>
                <p className="text-xs text-[#5b6672] leading-relaxed">
                  No hidden margins or speculative inflated prices. Both buyers and sellers negotiate in open sessions with standard 1%–2% agency brokerage.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-serif-brand text-lg font-bold text-[#0f2f45]">
                  Regional Network & Ecotourism
                </h3>
                <p className="text-xs text-[#5b6672] leading-relaxed">
                  From Ayun, Kalash valleys to Booni and Garam Chashma, our agents know every orchard, stream, and road network to guide long-term commercial investments.
                </p>
              </div>
            </div>

            {/* Key Personnel */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
              <h2 className="font-serif-brand text-2xl font-bold text-[#0f2f45]">
                Leadership & Senior Consultants
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { name: 'Rafeeq Ahmad Chitrali', role: 'Founder & Managing Director', exp: '14+ Years in Property & Legal Arbitration' },
                  { name: 'Junaid Chitrali', role: 'Head of Valuation & Residential Acquisitions', exp: 'Over 120+ Successfully Closed Deals' },
                  { name: 'Farhan Ali', role: 'Commercial & Ecotourism Lands Specialist', exp: 'Expert in Highway Plots & Valley Orchards' },
                ].map((member) => (
                  <div key={member.name} className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-full bg-[#0f2f45] text-white flex items-center justify-center font-bold font-serif-brand text-lg mx-auto sm:mx-0 shadow-sm">
                      {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <h4 className="font-bold text-sm text-[#0f2f45]">{member.name}</h4>
                    <p className="text-xs font-semibold text-[#2f6b3a]">{member.role}</p>
                    <p className="text-[11px] text-slate-500">{member.exp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Contact Tab */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Office Info Column */}
            <div className="lg:col-span-5 bg-[#0f2f45] rounded-3xl p-8 text-white shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                  Get in Touch
                </span>
                <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-white mt-1">
                  Chitral Main Office
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Drop by our centrally situated headquarters opposite Radio Pakistan near Polo Grounds or connect with us on phone/WhatsApp.
                </p>
              </div>

              <div className="space-y-4 pt-2 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Head Office</span>
                    <span className="font-semibold text-white">{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Direct Telephone & WhatsApp</span>
                    <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="font-bold text-emerald-300 hover:underline">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Email Inquiries</span>
                    <a href={`mailto:${settings.email}`} className="font-semibold text-white hover:underline">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Operating Hours</span>
                    <span className="text-white">Monday – Saturday: 8:30 AM – 7:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <span>Chat with Director on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-stone-200 shadow-md">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif-brand text-2xl font-bold text-[#0f2f45]">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you, <span className="font-semibold">{contactName}</span>. Your inquiry has been forwarded to our agency desk. We will reach out shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setContactName('');
                      setContactPhone('');
                      setContactEmail('');
                      setContactMessage('');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#2f6b3a] text-white text-xs font-bold"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <h2 className="font-serif-brand text-xl font-bold text-[#0f2f45]">
                      Send Us a Message
                    </h2>
                    <p className="text-xs text-[#5b6672]">
                      Fill in your details and our team will get back to you within a few hours.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Sardar Baig"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="e.g. 0345 5429230"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                      How Can We Assist You?
                    </label>
                    <textarea
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tell us what property type you are looking to buy, sell, or rent in Chitral..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#2f6b3a] hover:bg-[#25552e] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Agency</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
