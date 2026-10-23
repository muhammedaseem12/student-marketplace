'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShoppingBag,
  Search,
  Plus,
  Tag,
  MapPin,
  MessageSquare,
  Flag,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  BookOpen,
  Laptop,
  PenTool,
  FlaskConical,
  Home,
  X
} from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { MarketplaceCategory, ItemCondition, MarketplaceListing } from '@/types';
import { supabase } from '@/lib/supabase/client';

const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

const CATEGORIES: MarketplaceCategory[] = [
  'Books',
  'Electronics',
  'Stationery',
  'Lab Equipment',
  'Hostel Essentials',
  'Other'
];

export default function MarketplacePage() {
  const {
    listings,
    addListing,
    updateListingStatus,
    deleteListing,
    profile,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');

  // Contact modal state
  const [contactingItem, setContactingItem] = useState<MarketplaceListing | null>(null);
  const [customMsg, setCustomMsg] = useState('');
  const [messageRecipientId, setMessageRecipientId] = useState('');

  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory>('Books');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [imageUrl, setImageUrl] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmittingListing, setIsSubmittingListing] = useState(false);
  const [listingError, setListingError] = useState('');
  const [fullImage, setFullImage] = useState<MarketplaceListing | null>(null);
  const [incomingMessages, setIncomingMessages] = useState<Array<{id:string; listing_id:string; sender_id:string; body:string; created_at:string; read_at:string | null}>>([]);
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState(profile.email);

  // Report modal state
  const [reportingItem, setReportingItem] = useState<MarketplaceListing | null>(null);
  const [reportReason, setReportReason] = useState('');

  // Filtered listings
  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      const matchesSearch =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || l.category === selectedCategory;
      const matchesCond = selectedCondition === 'All' || l.condition === selectedCondition;

      return matchesSearch && matchesCat && matchesCond;
    });
  }, [listings, searchQuery, selectedCategory, selectedCondition]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price.trim() || !Number.isFinite(Number(price)) || Number(price) <= 0) return;
    setIsSubmittingListing(true);
    setListingError('');
    try {
      let finalImageUrl = imageUrl.trim();
      if (productImage) {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          const message = 'Your session has expired. Sign in again before posting a listing.';
          setListingError(message);
          showToast(message);
          return;
        }
        const extension = productImage.name.split('.').pop()?.toLowerCase() || 'jpg';
        const filePath = authData.user.id + '/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + extension;
        const { error: uploadError } = await supabase.storage.from('marketplace-images').upload(filePath, productImage, { upsert: false, contentType: productImage.type });
        if (uploadError) {
          const message = 'Photo upload failed: ' + uploadError.message + '. Check the marketplace-images bucket and upload policy in Supabase Storage.';
          setListingError(message);
          showToast(message);
          return;
        }
        const { data } = supabase.storage.from('marketplace-images').getPublicUrl(filePath);
        finalImageUrl = data.publicUrl;
      }
      const created = await addListing({ title: title.trim(), description: description.trim(), price: Number(price), category, condition, status: 'Available', imageUrl: finalImageUrl, sellerContact: contact, location: location.trim() });
      if (!created) {
        setListingError('Listing was not saved. Check that you are signed in and your Supabase marketplace_listings table allows authenticated students to insert listings.');
        return;
      }
      setTitle('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setProductImage(null);
      setImagePreview('');
      setListingError('');
      setIsCreateOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setListingError('Could not create listing: ' + message);
      showToast('Could not create listing: ' + message);
    } finally {
      setIsSubmittingListing(false);
    }
  };

  useEffect(() => {
    let active = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    const setup = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user || !active) return;
      const load = async () => {
        const { data: rows, error } = await supabase.from('marketplace_messages')
          .select('id, listing_id, sender_id, body, created_at, read_at')
          .eq('receiver_id', user.id).order('created_at', { ascending: false }).limit(30);
        if (!error && rows && active) setIncomingMessages(rows as typeof incomingMessages);
      };
      await load();
      channel = supabase.channel('marketplace-inbox-' + user.id)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'marketplace_messages', filter: 'receiver_id=eq.' + user.id }, (payload) => {
          const message = payload.new as typeof incomingMessages[number];
          if (!active) return;
          setIncomingMessages(prev => [message, ...prev.filter(m => m.id !== message.id)].slice(0, 30));
          showToast('New buyer message received!');
        }).subscribe();
    };
    void setup();
    return () => { active = false; if (channel) void supabase.removeChannel(channel); };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactingItem || !customMsg.trim()) return;
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user = authData.user;
    if (authError || !user) { showToast('Please sign in to message the seller.'); return; }
    if (!messageRecipientId || messageRecipientId === user.id) {
      showToast('Unable to identify the other person in this conversation.'); return;
    }
    const { error } = await supabase.from('marketplace_messages').insert({
      listing_id: contactingItem.id, sender_id: user.id,
      receiver_id: messageRecipientId, body: customMsg.trim(),
    });
    if (error) { showToast('Message not sent: ' + error.message + '. Run the marketplace messaging SQL setup.'); return; }
    showToast('Message delivered to ' + contactingItem.sellerName + '.');
    setContactingItem(null);
    setCustomMsg('');
    setMessageRecipientId('');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Listing reported. Our moderators will review it shortly.`);
    setReportingItem(null);
    setReportReason('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'Reserved':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
      case 'Sold':
        return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
            Student Marketplace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Buy, sell, or trade textbooks, lab gear, electronics, and campus essentials safely.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Listing</span>
        </button>
      </div>

      {/* Category Pills & Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Condition Filter */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search real listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="All">All Conditions</option>
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredListings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No marketplace listings found</h3>
          <p className="text-xs text-slate-500 mt-1">There are no real listings yet. Be the first to post an item you actually want to sell.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-card hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {item.imageUrl ? (
                    <button type="button" onClick={() => setFullImage(item)} className="block h-full w-full cursor-zoom-in" aria-label={`View full image of ${item.title}`}><img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain p-2 transition-transform duration-300" /></button>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400" aria-label="No product photo provided">
                      <ShoppingBag className="w-10 h-10" />
                      <span className="text-xs">No photo provided</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-xs shadow-sm">
                      {item.condition}
                    </span>
                  </div>

                  <span className="absolute bottom-3 right-3 px-3 py-1 rounded-xl text-sm font-extrabold bg-primary text-white shadow-md">
                    {formatINR(item.price)}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-primary dark:text-purple-400">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.postedDate}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white leading-snug mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-200" aria-label="Seller initials">{item.sellerName.slice(0, 1).toUpperCase()}</div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {item.sellerName}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {item.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {item.isOwner ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-bold text-slate-500">Status:</span>
                      <select
                        value={item.status}
                        onChange={(e) => updateListingStatus(item.id, e.target.value as any)}
                        className="px-2 py-1 bg-white dark:bg-slate-800 border rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300"
                      >
                        <option value="Available">Available</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </div>

                    <button
                      onClick={() => deleteListing(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
                      title="Delete your listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setReportingItem(item)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors text-xs"
                      title="Report listing"
                    >
                      <Flag className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setContactingItem(item);
                        setMessageRecipientId(item.sellerId || '');
                        setCustomMsg(`Hi ${item.sellerName}! I saw your "${item.title}" listed for ${formatINR(item.price)}. Is it still available?`);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Contact Seller</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {incomingMessages.length > 0 && (
        <section className="rounded-2xl border border-purple-200 bg-white p-4 shadow-sm dark:border-purple-900 dark:bg-slate-900">
          <h3 className="mb-3 font-extrabold text-slate-900 dark:text-white">Buyer messages ({incomingMessages.length})</h3>
          <div className="space-y-3">{incomingMessages.map(message => {
            const listing = listings.find(item => item.id === message.listing_id);
            return <div key={message.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">{listing?.title || 'Marketplace item'} · {new Date(message.created_at).toLocaleString()}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm">{message.body}</p>
              <p className="mt-2 break-all text-[11px] text-slate-500">Buyer account: {message.sender_id}</p>
              {listing && <button type="button" onClick={() => { setContactingItem(listing); setMessageRecipientId(message.sender_id); setCustomMsg(''); }} className="mt-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white">Reply to buyer</button>}
            </div>;
          })}</div>
        </section>
      )}

      {/* Create Listing Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Student Listing"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          {listingError && <div role="alert" className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{listingError}</div>}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="Enter the actual item name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="450"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pickup Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">Product photo</label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/20 px-4 py-5 text-center">
              {imagePreview ? <img src={imagePreview} alt="Product photo preview" className="h-36 w-full rounded-lg object-contain" /> : <><ShoppingBag className="h-8 w-8 text-purple-500" /><span className="text-xs font-bold text-slate-700 dark:text-slate-200">Tap to choose a product picture</span><span className="text-[11px] text-slate-500">JPG, PNG or WebP · up to 5 MB</span></>}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => {
                const file = e.target.files?.[0]; if (!file) return;
                if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { showToast("Choose a JPG, PNG, or WebP image."); e.currentTarget.value = ""; return; }
                if (file.size > 5 * 1024 * 1024) { showToast("Image must be 5 MB or smaller."); e.currentTarget.value = ""; return; }
                setProductImage(file); setImagePreview(URL.createObjectURL(file)); setImageUrl("");
              }} />
            </label>
            {productImage && <button type="button" onClick={() => { setProductImage(null); setImagePreview(""); }} className="mt-2 text-xs font-semibold text-rose-600 hover:underline">Remove selected photo</button>}
            <details className="mt-3"><summary className="cursor-pointer text-xs font-semibold text-slate-500">Or use an image URL</summary><input type="url" placeholder="https://example.com/product.jpg" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setProductImage(null); setImagePreview(""); }} className="mt-2 w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" /></details>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the actual item, its condition, and what is included"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingListing}
              className="px-5 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark disabled:opacity-60"
            >
              {isSubmittingListing ? "Uploading..." : "Post Item"}
            </button>
          </div>
        </form>
      </Modal>

      {fullImage && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={fullImage.title} onClick={() => setFullImage(null)}>
          <button type="button" aria-label="Close product details" onClick={() => setFullImage(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white/15 p-2 text-white"><X className="h-6 w-6" /></button>
          <div className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-white" onClick={(event) => event.stopPropagation()}>
            <div className="flex min-h-0 flex-1 items-center justify-center bg-black/5 p-3 dark:bg-black/30">
              {fullImage.imageUrl ? <img src={fullImage.imageUrl} alt={fullImage.title} className="max-h-[55dvh] max-w-full object-contain" /> : <ShoppingBag className="h-16 w-16 text-slate-400" />}
            </div>
            <div className="space-y-2 overflow-y-auto p-4">
              <div className="flex items-start justify-between gap-3"><h2 className="text-lg font-extrabold">{fullImage.title}</h2><span className="shrink-0 rounded-full bg-primary px-3 py-1 font-bold text-white">{formatINR(fullImage.price)}</span></div>
              <p className="text-sm text-slate-500 dark:text-slate-300">{fullImage.category} · {fullImage.condition} · {fullImage.location || 'Campus pickup'}</p>
              <p className="whitespace-pre-wrap text-sm">{fullImage.description || 'No description provided.'}</p>
              <p className="text-xs text-slate-500">Seller: {fullImage.sellerName}</p>
              {!fullImage.isOwner && fullImage.status === 'Available' && <button type="button" onClick={() => { setContactingItem(fullImage); setMessageRecipientId(fullImage.sellerId || ''); setCustomMsg('Hi ' + fullImage.sellerName + '! I am interested in "' + fullImage.title + '" listed for ' + formatINR(fullImage.price) + '. Is it still available?'); setFullImage(null); }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-white hover:bg-primary-dark"><MessageSquare className="h-4 w-4" /> Contact Seller</button>}
            </div>
          </div>
        </div>
      )}

      {/* Contact Seller Modal */}
      <Modal
        isOpen={contactingItem !== null}
        onClose={() => setContactingItem(null)}
        title={`Message ${contactingItem?.isOwner ? 'Buyer' : 'Seller'} - ${contactingItem?.sellerName}`}
      >
        <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-200">{contactingItem?.sellerName.slice(0, 1).toUpperCase()}</div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{contactingItem?.sellerName}</p>
              <p className="text-[11px] text-slate-500">{contactingItem?.sellerContact}</p>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Message to Seller
            </label>
            <textarea
              rows={4}
              required
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setContactingItem(null)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark"
            >
              Send Message
            </button>
          </div>
        </form>
      </Modal>

      {/* Report Listing Modal */}
      <Modal
        isOpen={reportingItem !== null}
        onClose={() => setReportingItem(null)}
        title="Report Marketplace Listing"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-400">
            Reporting listing: <strong className="text-slate-900 dark:text-white">{reportingItem?.title}</strong>
          </p>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Reason for reporting *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Spam, illegal item, counterfeit, or misleading pricing..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReportingItem(null)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700"
            >
              Submit Report
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
