"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Leaf,
  ScanSearch,
  ShieldCheck,
  ArrowRight,
  Cpu,
  Cloud,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">

            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded-full font-medium">
              <Leaf size={18} />
              AI-Powered Agriculture
            </div>

            <h1 className="mt-8 text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight">
              Detect
              <span className="text-green-600 dark:text-green-400">
                {" "}Maize Diseases
              </span>
              <br />
              Instantly
            </h1>

            <p className="mt-8 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Upload a maize leaf image and let our AI determine whether
              the leaf is Healthy, infected with MSV, MLS, or not a maize
              plant — with tailored treatment recommendations.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/detect"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors duration-200 inline-flex items-center gap-2"
              >
                Analyze Leaf
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/treatments"
                className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl font-semibold hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200"
              >
                Treatment Guide
              </Link>
            </div>

          </div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              Key Features
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3">
              Everything farmers need for early disease detection.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-8 rounded-3xl shadow-md transition-colors duration-200">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-5">
                <Leaf className="text-green-600 dark:text-green-400" size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                Disease Detection
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                Identify healthy and infected maize leaves — MSV, MLS,
                or not maize — with high accuracy AI.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-8 rounded-3xl shadow-md transition-colors duration-200">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-5">
                <ScanSearch className="text-blue-600 dark:text-blue-400" size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                AI Analysis
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                YOLO-powered image classification trained on
                real maize disease datasets with confidence scoring.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-8 rounded-3xl shadow-md transition-colors duration-200">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mb-5">
                <ShieldCheck className="text-orange-600 dark:text-orange-400" size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                Treatment Guidance
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                Receive actionable recommendations for disease
                prevention, management, and crop recovery.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-700 py-24 transition-colors duration-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                How It Works
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-3">
                Three simple steps from field to diagnosis
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Leaf size={36} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  Upload
                </h3>
                <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                  Take a clear picture of a maize leaf or upload from your gallery.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Cpu size={36} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  AI Processing
                </h3>
                <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                  The YOLO model analyses the image in seconds
                  and returns a confident prediction.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Cloud size={36} className="text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  Get Results
                </h3>
                <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                  View your diagnosis, confidence score,
                  and tailored treatment tips instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* IMPACT SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-green-600 dark:bg-green-800 rounded-3xl p-12 text-white transition-colors duration-200">
            <h2 className="text-4xl font-bold text-center mb-12">
              Supporting Farmers Through AI
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-5xl font-bold text-white">24/7</h3>
                <p className="text-green-100 mt-2">Availability</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold text-white">4</h3>
                <p className="text-green-100 mt-2">Disease Classes Detected</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold text-white">Fast</h3>
                <p className="text-green-100 mt-2">Real-time Diagnosis</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24">
          <div className="text-center px-6">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              Ready to Analyze Your Crop?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg">
              Start detecting maize diseases with AI — free and instant.
            </p>
            <Link
              href="/detect"
              className="inline-flex items-center gap-2 mt-8 bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-semibold transition-colors duration-200"
            >
              Start Detection
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}