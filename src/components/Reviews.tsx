'use client';

import { useStore } from '@/lib/store';
import { Review } from '@/lib/types';
import { Star, Quote, PenLine, X, Check, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

const AVATAR_COLORS = [
  'from-orange-500 to-amber-500',
  'from-pink-500 to-rose-500',
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-indigo-500',
  'from-green-500 to-teal-500',
  'from-red-500 to-orange-400',
];

function Stars({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star
          key={s}
          onClick={() => interactive && onRate?.(s)}
          onMouseEnter={() => interactive && setHovered(s)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
            s <= (hovered || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
          } ${interactive ? 'w-6 h-6' : 'w-3 h-3'}`}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { darkMode, user } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: user?.name ?? '', text: '', rating: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => {
        setReviews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch reviews:', err);
        setReviews([]);
        setLoading(false);
      });
  }, []);

  const avg = reviews.length > 0 
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.text.trim() || form.text.length < 10) e.text = 'Please write at least 10 characters';
    if (!form.rating) e.rating = 'Please select a rating';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const initials = form.name.trim().split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    
    const reviewData = {
      name: form.name.trim(),
      avatar: initials,
      color: AVATAR_COLORS[reviews.length % AVATAR_COLORS.length],
      rating: form.rating,
      date: new Date().toLocaleDateString('en-RW', { month: 'long', year: 'numeric' }),
      text: form.text.trim(),
    };

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const savedReview = await response.json();
        setReviews([savedReview, ...reviews]);
        setActive(0);
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setShowForm(false);
          setForm({ name: user?.name ?? '', text: '', rating: 0 });
        }, 2000);
      }
    } catch (error) {
      console.error('Error posting review:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Header + rating summary */}
      <div className={`rounded-2xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'} shadow-sm`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-extrabold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ⭐ Customer Reviews
          </h3>
          <button
            onClick={() => setShowForm((v) => !v)}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
              showForm
                ? darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white hover:scale-105 active:scale-95'
            }`}
          >
            {showForm ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><PenLine className="w-3.5 h-3.5" /> Write Review</>}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-3xl font-extrabold gradient-text">{avg}</div>
            <Stars rating={Math.round(parseFloat(avg))} />
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5,4,3,2,1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-1.5">
                  <span className={`text-xs w-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{star}</span>
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`text-xs w-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      {showForm && (
        <div className={`rounded-2xl p-4 border-2 border-orange-400 ${darkMode ? 'bg-gray-800' : 'bg-orange-50'} animate-slide-up`}>
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-orange-500" />
              </div>
              <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Thank you!</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your review has been posted.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Share your experience</h4>

              {/* Star picker */}
              <div>
                <label className={`text-xs font-semibold block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your Rating</label>
                <Stars rating={form.rating} interactive onRate={(r) => setForm({ ...form, rating: r })} />
                {errors.rating && <p className="text-red-400 text-xs mt-0.5">{errors.rating}</p>}
              </div>

              {/* Name */}
              <div>
                <label className={`text-xs font-semibold block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your name"
                  className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition ${
                    errors.name ? 'border-red-400' : 'focus:border-orange-500'
                  } ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-0.5">{errors.name}</p>}
              </div>

              {/* Review text */}
              <div>
                <label className={`text-xs font-semibold block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your Review</label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="What did you think about Simba Supermarket?"
                  rows={3}
                  className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition resize-none ${
                    errors.text ? 'border-red-400' : 'focus:border-orange-500'
                  } ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
                />
                {errors.text && <p className="text-red-400 text-xs mt-0.5">{errors.text}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-orange-500/30"
              >
                Post Review
              </button>
            </form>
          )}
        </div>
      )}

      {/* Reviews Display */}
      {reviews.length > 0 ? (
        <>
          {/* Featured review */}
          <div className={`relative overflow-hidden rounded-2xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100'}`}>
            <Quote className="absolute top-3 right-3 w-10 h-10 text-orange-200/60" />
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${reviews[active]?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {reviews[active]?.avatar || '?'}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{reviews[active]?.name}</p>
                  {reviews[active]?.verified && (
                    <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">✓ Verified</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Stars rating={reviews[active]?.rating || 0} />
                  <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>· {reviews[active]?.date}</span>
                </div>
              </div>
            </div>
            <p className={`text-xs leading-relaxed italic relative z-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              &ldquo;{reviews[active]?.text}&rdquo;
            </p>
            <div className="flex gap-1.5 mt-3">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${i === active ? 'w-5 bg-orange-500' : 'w-1 bg-orange-200'}`}
                />
              ))}
            </div>
          </div>

          {/* Review list */}
          <div className="space-y-2">
            {reviews.map((review, i) => (
              <button
                key={`${review.name}-${i}`}
                onClick={() => setActive(i)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                  active === i
                    ? darkMode ? 'border-orange-500 bg-orange-500/10' : 'border-orange-400 bg-orange-50'
                    : darkMode ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-100 bg-white hover:border-orange-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${review.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                    {review.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-xs truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{review.name}</p>
                    <div className="flex items-center gap-1">
                      <Stars rating={review.rating} />
                      <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className={`text-xs line-clamp-2 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  &ldquo;{review.text}&rdquo;
                </p>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className={`p-12 text-center rounded-2xl border border-dashed ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No reviews yet.</p>
          <p className="text-xs text-gray-400 mt-1">Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
}
