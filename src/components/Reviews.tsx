'use client';

import { useStore } from '@/lib/store';
import { Star, Quote } from 'lucide-react';
import { useState } from 'react';

const REVIEWS = [
  {
    name: 'Gwiza Moise',
    avatar: 'GM',
    color: 'from-orange-500 to-amber-500',
    rating: 5,
    date: 'Mata 2025',
    location: 'Kigali, Rwanda',
    text: 'Simba Supermarket ni aho nagurana ibintu byose. Ibicuruzwa byabo biza kandi bireshya cyane. Natumije amakoperative menshi kandi byose byageze vuba kandi nta kibazo. Ndashimira cyane aba bakoze iyi website nziza! Muzakomeze mukore neza.',
    verified: true,
  },
  {
    name: 'Amina Uwase',
    avatar: 'AU',
    color: 'from-pink-500 to-rose-500',
    rating: 5,
    date: 'Mata 2025',
    location: 'Kigali, Rwanda',
    text: 'I love shopping on Simba! The prices are unbeatable and delivery is always on time. Highly recommend to everyone in Kigali.',
    verified: true,
  },
  {
    name: 'Jean Pierre Habimana',
    avatar: 'JP',
    color: 'from-blue-500 to-cyan-500',
    rating: 5,
    date: 'Werurwe 2025',
    location: 'Musanze, Rwanda',
    text: "Best online supermarket in Rwanda. The product variety is amazing — from food to cosmetics to baby products. Will definitely keep ordering!",
    verified: true,
  },
  {
    name: 'Claudine Mukamana',
    avatar: 'CM',
    color: 'from-purple-500 to-indigo-500',
    rating: 4,
    date: 'Werurwe 2025',
    location: 'Kigali, Rwanda',
    text: 'Simba niyo isoko nziza mu Rwanda. Ibicuruzwa bisa neza kandi abashoramari barabyita neza. Nzagaruka buri gihe!',
    verified: true,
  },
  {
    name: 'Eric Nshimiyimana',
    avatar: 'EN',
    color: 'from-green-500 to-teal-500',
    rating: 5,
    date: 'Gashyantare 2025',
    location: 'Huye, Rwanda',
    text: "Fast delivery, great quality products, and excellent customer service. Simba has everything I need at prices I can afford.",
    verified: true,
  },
  {
    name: 'Marie Claire Ingabire',
    avatar: 'MI',
    color: 'from-amber-500 to-orange-500',
    rating: 5,
    date: 'Mutarama 2025',
    location: 'Kigali, Rwanda',
    text: 'Ndashimishwa cyane na Simba Supermarket! Baby products zabo ziza kandi zifite ibiciro byiza. Ntabwo nzarekura gutura hano.',
    verified: true,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { darkMode } = useStore();
  const [activeIdx, setActiveIdx] = useState(0);

  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <section className="py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            What Our Customers Say
          </h2>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Real reviews from real customers across Rwanda
          </p>
        </div>

        {/* Overall rating */}
        <div className={`flex items-center gap-4 px-5 py-3 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'} shadow-sm`}>
          <div className="text-center">
            <div className="text-4xl font-extrabold gradient-text">{avgRating}</div>
            <StarRating rating={5} />
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{REVIEWS.length} reviews</p>
          </div>
          <div className="space-y-1.5">
            {[5, 4, 3].map((star) => {
              const count = REVIEWS.filter((r) => r.rating === star).length;
              const pct = Math.round((count / REVIEWS.length) * 100);
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className={`text-xs w-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{star}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <div className={`w-24 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured review (large) */}
      <div className={`relative overflow-hidden rounded-3xl p-6 md:p-8 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100'}`}>
        <Quote className="absolute top-6 right-6 w-16 h-16 text-orange-200 opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${REVIEWS[activeIdx].color} flex items-center justify-center text-white font-extrabold text-lg shadow-lg`}>
              {REVIEWS[activeIdx].avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {REVIEWS[activeIdx].name}
                </p>
                {REVIEWS[activeIdx].verified && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">✓ Verified</span>
                )}
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {REVIEWS[activeIdx].location} · {REVIEWS[activeIdx].date}
              </p>
              <StarRating rating={REVIEWS[activeIdx].rating} />
            </div>
          </div>
          <p className={`text-base md:text-lg leading-relaxed italic ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            &ldquo;{REVIEWS[activeIdx].text}&rdquo;
          </p>
        </div>

        {/* Navigation dots */}
        <div className="flex gap-2 mt-6">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIdx ? 'w-6 bg-orange-500' : 'w-1.5 bg-orange-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Review cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REVIEWS.map((review, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`text-left p-5 rounded-2xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
              activeIdx === i
                ? darkMode
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-orange-400 bg-orange-50 shadow-md'
                : darkMode
                ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                : 'border-gray-100 bg-white hover:border-orange-200'
            } animate-slide-up opacity-0`}
            style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${review.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {review.avatar}
              </div>
              <div className="min-w-0">
                <p className={`font-semibold text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{review.name}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{review.location}</p>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className={`text-sm line-clamp-3 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              &ldquo;{review.text}&rdquo;
            </p>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{review.date}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
