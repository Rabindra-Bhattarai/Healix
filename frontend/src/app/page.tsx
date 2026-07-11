"use client";

import { Fragment, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-md border-b border-white/20">
        <div className="max-w-content mx-auto px-4 sm:px-grid_margin h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[20px]">
                healing
              </span>
            </div>
            <span className="font-h3 text-h3 font-bold text-primary">Healix</span>
          </div>
          <div className="hidden md:flex items-center space-x-stack_gap_lg">
            <a
              className="font-body-md text-on-surface font-medium hover:text-primary transition-colors"
              href="#services"
            >
              Services
            </a>
            <a
              className="font-body-md text-on-surface font-medium hover:text-primary transition-colors"
              href="#how-it-works"
            >
              How it Works
            </a>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface font-body-md font-semibold hover:bg-white/40 transition-all"
            >
              Sign In
            </Link>
            <button className="px-4 py-2 rounded-xl bg-primary text-on-primary font-body-md font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all">
              Get Started
            </button>
          </div>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden text-on-surface p-1"
          >
            <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white/70 backdrop-blur-md border-t border-white/20 px-4 py-4 flex flex-col gap-4">
            <a
              className="font-body-md text-on-surface font-medium"
              href="#services"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </a>
            <a
              className="font-body-md text-on-surface font-medium"
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
            >
              How it Works
            </a>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface font-body-md font-semibold text-center"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
            <button className="px-4 py-2 rounded-xl bg-primary text-on-primary font-body-md font-semibold">
              Get Started
            </button>
          </div>
        )}
      </nav>

      <main className="relative">
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Healix Medical Clinic"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQHNw430vLFe_j5gzodCvg6AUDdCHn7ZFK3ohZe5rZXFzemmJFKN7f6DiD0j-IEmq34Oc5IPjcuOUZvMTHhwuzCjelrX0lM15KTPjnMhl2n-q67nhvwctTwzcgQWtS6DNHzPa_uTL0VJcHogppKxzhUhJ0AND_63rb_nzYcKTMDRRxTNcK6h_NDea6CkIcRG7OUzEUzxRVsniToR3Zvd_gUaEiJ0XskKs0dZAj6Oe_0SfssVz_ASoX_BnjUS5nong6tgUk1IRFevw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-surface" />
          </div>
          <div className="relative z-10 max-w-content mx-auto px-4 sm:px-grid_margin text-center pt-24">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm mb-stack_gap_lg backdrop-blur-sm">
              <span className="material-symbols-outlined text-[16px]">sparkles</span>
              <span>The Future of Healthcare is Here</span>
            </div>
            <h1 className="font-h1 text-h1 md:text-[64px] md:leading-[72px] text-on-surface tracking-tight mb-stack_gap_md max-w-4xl mx-auto drop-shadow-sm">
              Healthcare, simplified
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface max-w-2xl mx-auto mb-stack_gap_lg leading-relaxed font-medium">
              The clinical OS designed for the next generation of healthcare providers.
              Precision management in a quiet, authoritative interface.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary font-body-lg font-semibold rounded-xl shadow-lg hover:shadow-primary/25 hover:translate-y-[-2px] transition-all">
                Get Started Now
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/60 backdrop-blur-md border border-outline-variant text-on-surface font-body-lg font-semibold rounded-xl hover:bg-white/80 transition-all">
                View Demo
              </button>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-24 bg-surface" id="services">
          <div className="max-w-content mx-auto px-4 sm:px-grid_margin">
            <div className="text-center mb-16">
              <h2 className="font-h2 text-h2 text-on-surface mb-4">
                Specialized Care for Everyone
              </h2>
              <p className="font-body-md text-on-surface-variant max-w-lg mx-auto">
                Expert medical attention across various disciplines with our integrated
                platform.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-grid_gutter">
              {[
                {
                  icon: "favorite",
                  title: "Cardiology",
                  copy: "Advanced heart health monitoring and diagnostic tools integrated directly into your workflow.",
                },
                {
                  icon: "child_care",
                  title: "Pediatrics",
                  copy: "Gentle, comprehensive care tracking for our youngest patients, from infancy through adolescence.",
                },
                {
                  icon: "psychology",
                  title: "Neurology",
                  copy: "Cutting-edge neurological assessment tools and secure patient record management.",
                },
              ].map((service) => (
                <div
                  key={service.title}
                  className="p-8 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-on-primary transition-all">
                    <span className="material-symbols-outlined">{service.icon}</span>
                  </div>
                  <h3 className="font-h3 text-h3 mb-2">{service.title}</h3>
                  <p className="font-body-md text-on-surface-variant">{service.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 bg-surface-container-low/30" id="how-it-works">
          <div className="max-w-content mx-auto px-4 sm:px-grid_margin">
            <div className="text-center mb-16">
              <h2 className="font-h2 text-h2 text-on-surface">
                Seamless Journey to Wellness
              </h2>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-12 md:space-y-0 md:space-x-8">
              {[
                {
                  step: "01",
                  title: "Book",
                  copy: "Instant scheduling through our intelligent patient portal.",
                },
                {
                  step: "02",
                  title: "Visit",
                  copy: "Efficient check-in and prioritized patient flow management.",
                },
                {
                  step: "03",
                  title: "Heal",
                  copy: "Comprehensive follow-ups and data-driven recovery paths.",
                },
              ].map((item, i, arr) => (
                <Fragment key={item.step}>
                  <div className="flex-1 text-center">
                    <div className="text-h1 font-bold text-primary/20 mb-4">
                      {item.step}
                    </div>
                    <h4 className="font-h3 text-h3 mb-2">{item.title}</h4>
                    <p className="font-body-md text-on-surface-variant">{item.copy}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="hidden md:block w-12 h-[1px] bg-outline-variant" />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-24 bg-primary text-on-primary text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-grid_margin relative z-10">
            <span className="material-symbols-outlined text-[48px] mb-8 opacity-50">
              format_quote
            </span>
            <blockquote className="font-h2 text-h2 italic leading-relaxed mb-8">
              &ldquo;Healix has completely transformed how our clinic operates. It&apos;s
              the first time medical software feels like it&apos;s actually on our
              side.&rdquo;
            </blockquote>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest mb-3" />
              <p className="font-body-lg font-bold">Dr. Sarah Chen</p>
              <p className="font-body-md opacity-70">
                Chief of Medicine, Northwell Health
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center">
          <div className="max-w-content mx-auto px-4 sm:px-grid_margin">
            <h2 className="font-h2 text-h2 mb-8">Ready to modernize your practice?</h2>
            <button className="px-12 py-4 bg-primary text-on-primary font-body-lg font-semibold rounded-xl shadow-xl hover:scale-105 transition-all">
              Get Started Today
            </button>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-outline-variant bg-surface text-center">
        <div className="max-w-content mx-auto px-4 sm:px-grid_margin">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[14px]">
                  healing
                </span>
              </div>
              <span className="font-h3 text-h3 font-bold text-primary">Healix</span>
            </div>
            <p className="text-on-surface-variant font-body-md">
              © 2024 Healix Healthcare Systems. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
