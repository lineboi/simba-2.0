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
    text: 'Simba Supermarket ni aho nagurana ibintu byose. Ibicuruzwa byabo biza kandi bireshya cyane. Natumije amakoperative menshi kandi byose byageze vuba kandi nta kibazo. Ndashimira cyane aba bakoze iyi website nziza!',
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
    text: 'Best online supermarket in Rwanda. The product variety is amazing — from food to cosmetics to baby products. Will definitely keep ordering!',
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
    text: 'Fast delivery, great quality products, and excellent customer service. Simba has everything I need at prices I can afford.',
    verified: true,
  },
  {
    name: 'Marie Claire Ingabire',
    avatar: 'MI',
    color: 'from-amber-500 to-orange-500',
    rating: 5,
    date: 'Mutarama 2025',
    location: 'Kigali, Rwanda',
    text: 'Ndashimishwa cyane na Simba! Baby products zabo ziza kandi zifite ibiciro byiza. Ntabwo nzarekura gutura hano.',
    verified: true,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} className={`w-3 h-3 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { darkMode } = useStore();
  const [active, setActive] = useState(0);
  const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Header + rating summary */}
      <div className={`rounded-2xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'} shadow-sm`}>
        <h3 className={`font-extrabold text-base mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          ⭐ Customer Reviews
        </h3>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-3xl font-extrabold gradient-text">{avg}</div>
            <Stars rating={5} />
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{REVIEWS.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5,4,3].map((star) => {
              const count = REVIEWS.filter((r) => r.rating === star).length;
              const pct = Math.round((count / REVIEWS.length) * 100);
              return (
                <div key={star} className="flex items-center gap-1.5">
                  <span className={`text-xs w-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{star}</span>
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`text-xs w-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured review */}
      <div className={`relative overflow-hidden rounded-2xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100'}`}>
        <Quote className="absolute top-3 right-3 w-10 h-10 text-orange-200/60" />
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${REVIEWS[active].color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
            {REVIEWS[active].avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{REVIEWS[active].name}</p>
              {REVIEWS[active].verified && (
                <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">✓</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Stars rating={REVIEWS[active].rating} />
              <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>· {REVIEWS[active].date}</span>
            </div>
          </div>
        </div>
        <p className={`text-xs leading-relaxed italic relative z-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          &ldquo;{REVIEWS[active].text}&rdquo;
        </p>
        {/* Dots */}
        <div className="flex gap-1.5 mt-3">
          {REVIEWS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === active ? 'w-5 bg-orange-500' : 'w-1 bg-orange-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-2">
        {REVIEWS.map((review, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-full text-left p-3 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
              active === i
                ? darkMode ? 'border-orange-500 bg-orange-500/10' : 'border-orange-400 bg-orange-50'
                : darkMode ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-100 bg-white hover:border-orange-200'
            } animate-slide-up opacity-0`}
            style={{ animationDelay: `${i * 0.07}s`, animationFillMode: 'forwards' }}
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
    </div>
  );
}
