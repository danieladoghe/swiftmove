'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const posts = [
  {
    category: 'Storage',
    date: 'Jul 2, 2026',
    title: '20, 30, or 40 ft? How to size your outdoor space right the first time',
    img: '/yard-container.jpg',
  },
  {
    category: 'Savings',
    date: 'Jun 18, 2026',
    title: 'Prepay & save: how the 6-month (5%) and 12-month (10%) discounts work',
    img: '/yard-door.jpg',
  },
  {
    category: 'Logistics',
    date: 'Jun 5, 2026',
    title: 'From our yard to your door: inside a modern freight day at Mo’s',
    img: '/yard-truck.jpg',
  },
];

export function YardNotes() {
  return (
    <section id="notes" className="scroll-mt-20 bg-[#FAFAFA] px-4 py-24 text-gray-900 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#D97B0C] sm:text-sm">
            Notes from the Yard
          </p>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Tips, Savings & Yard Life
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer overflow-hidden rounded-[24px] bg-white shadow-sm transition-shadow duration-500 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={post.img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D97B0C]">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <h3 className="line-clamp-2 text-lg font-bold leading-snug transition-colors group-hover:text-[#D97B0C]">
                  {post.title}
                </h3>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
