'use client';

import { motion } from 'framer-motion';

const posts = [
  {
    category: 'Storage',
    date: 'Jul 2, 2026',
    title: '20, 30, or 40 ft? How to size your outdoor space right the first time',
    img: '/notes/note-sizing.svg',
  },
  {
    category: 'Savings',
    date: 'Jun 18, 2026',
    title: 'Prepay & save: how the 6-month (5%) and 12-month (10%) discounts work',
    img: '/notes/note-savings.svg',
  },
  {
    category: 'Logistics',
    date: 'Jun 5, 2026',
    title: 'From our yard to your door: inside a modern freight day at Mo’s',
    img: '/notes/note-logistics.svg',
  },
];

export function YardNotes() {
  return (
    <section id="notes" className="relative scroll-mt-20 overflow-hidden bg-[var(--surface-2)] px-4 py-24 text-[var(--text)] sm:px-6 md:py-32 lg:px-8">
      <div aria-hidden className="texture-dots pointer-events-none absolute inset-0" />
      <div aria-hidden className="texture-glow pointer-events-none absolute -right-40 top-24 h-[360px] w-[360px] rounded-full" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--accent-dark)] sm:text-sm">
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
              className="group cursor-pointer overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-shadow duration-500 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden bg-[var(--surface-2)] p-5">
                {/* eslint-disable-next-line @next/next/no-img-element -- local SVG illustration */}
                <img
                  src={post.img}
                  alt=""
                  className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-dark)]">
                    {post.category}
                  </span>
                  <span className="text-sm text-[var(--muted)]">{post.date}</span>
                </div>
                <h3 className="line-clamp-2 text-lg font-bold leading-snug transition-colors group-hover:text-[var(--accent-dark)]">
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
