"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AgricChatbot from "@/components/AgricChatbot";
import {
  Leaf,
  ScanSearch,
  AlertTriangle,
  ArrowRight,
  Cpu,
  Cloud,
  Bug,
  Wind,
  Flame,
  Droplets,
} from "lucide-react";

type Language = "en" | "tw" | "dag";

const T: Record<string, Record<Language, string>> = {
  badge: {
    en: "AI-Powered Agriculture",
    tw: "Kuadwuma a AI afidie nyansa boa",
    dag: "AI Tiŋa Yɛl'",
  },
  heroTitle1: {
    en: "Detect",
    tw: "Hunu",
    dag: "Kpɛma",
  },
  heroTitle2: {
    en: "Maize Diseases",
    tw: "Aburow Nyarewa",
    dag: "Maize Yɛl'",
  },
  heroTitle3: {
    en: "Instantly",
    tw: "Ntɛm",
    dag: "Pampam",
  },
  heroDesc: {
    en: "Upload a maize leaf image and let our AI identify Common Rust, Gray Leaf Spot, MSV, Northern Leaf Blight, Southern Leaf Blight, or confirm a Healthy crop with tailored treatment recommendations.",
    tw: "Fa aburow ahaban mfonini gu so na ma yɛn AI nhu Common Rust, Grey Leaf Spot, MSV, Northern Leaf Blight, Southern Leaf Blight, anaasɛ fa ayaresa ho nyansahyɛ ahorow a ɛfata si nnɔbae a Ɛwɔ Akwahosan so dua.",
    dag: "Zaŋ maize kpamli n-ti kpɛma n-nya Common Rust, Gray Leaf Spot, MSV, Northern Leaf Blight, Southern Leaf Blight, bee sɛ a sal' la, n-yɛn n-ti a kyaŋsim.",
  },
  analyzeLeaf: {
    en: "Analyze Leaf",
    tw: "Hwehwɛ Nhaban mu",
    dag: "Kpɛma Kpamli",
  },
  treatmentGuide: {
    en: "Treatment Guide",
    tw: "Ayaresa Ho Akwankyerɛ",
    dag: "Kyaŋsim",
  },
  diseasesTitle: {
    en: "Diseases We Detect",
    tw: "Nyarewa a Yehu",
    dag: "Yɛl' Shɛli din Kparibɔ",
  },
  diseasesSubtitle: {
    en: "Our AI model is trained to identify 6 maize leaf conditions.",
    tw: "Wɔatete yɛn AI afidie no sɛnea ɛbɛyɛ a ɛbɛkyerɛ aburow ahaban tebea 6.",
    dag: "A AI model n daa maize kpamli 6.",
  },
  featuresTitle: {
    en: "Key Features",
    tw: "Nneɛma a Ɛho Hia",
    dag: "Tuun' Tuuma",
  },
  featuresSubtitle: {
    en: "Everything farmers need for early disease detection.",
    tw: "Biribiara a akuafo hia na ama wɔahu nyarewa ntɛm.",
    dag: "Shɛli din tiŋda n yɛn n-ti a kparibɔ.",
  },
  feature1Title: {
    en: "6-Class Detection",
    tw: "6-Yaree Hunu",
    dag: "6-Yɛl' Kparibɔ",
  },
  feature1Desc: {
    en: "Detects 5 maize diseases and confirms healthy plants with high accuracy AI classification.",
    tw: "Ehu aburow nyarewa 5 na ɛhyɛ afifide a ɛwɔ apɔwmuden a ɛwɔ AI nkyekyɛmu a ɛyɛ pɛpɛɛpɛ kɛse no so dua.",
    dag: "N kparibɔ maize yɛl' 5 ni n nyɛ sɛ a sal' la n-nya AI.",
  },
  feature2Title: {
    en: "AI Analysis",
    tw: "AI Nhwehwɛmu",
    dag: "AI Kparibɔ",
  },
  feature2Desc: {
    en: "MobileNetV3-powered image classification trained on real maize disease datasets with confidence scoring.",
    tw: "MobileNetV3 afidie mfididwuma a yɛatete no wɔ aborow yareɛ mfoni pa so, a ɛtumi kyerɛ mfoni mu nsonsonoeɛ ne n'ahotoso nkontabuo.",
    dag: "MobileNetV3 n kparibɔ maize yɛl' so, n-nya din su.",
  },
  feature3Title: {
    en: "Treatment Guidance",
    tw: "Ayaresa Ho Akwankyerɛ",
    dag: "Kyaŋsim",
  },
  feature3Desc: {
    en: "Receive disease-specific actionable recommendations for prevention, management, and crop recovery.",
    tw: "Nya nyansahyɛ ahorow a ɛfa yare pɔtee bi ho a wobetumi de adi dwuma de asiw ano, ntotɔeɛ, ne nnɔbae a wɔbɛsan asiesie.",
    dag: "Nya yɛl' kyaŋsim: kparibɔ, kyaŋsim, ni kpamli lab'li.",
  },
  howItWorksTitle: {
    en: "How It Works",
    tw: "Ɛkwan a Ɛdi So",
    dag: "N-Niŋsim",
  },
  howItWorksSubtitle: {
    en: "Three simple steps from field to diagnosis",
    tw: "Anamɔn abiɛsa a ɛnyɛ den fi afuw mu kosi sɛ wobehu yare no",
    dag: "Tuhi tuhili n-ti tiŋa ni kparibɔ",
  },
  step1Title: {
    en: "Upload",
    tw: "Fa gu so",
    dag: "Zaŋ",
  },
  step1Desc: {
    en: "Take a clear picture of a maize leaf or upload from your gallery.",
    tw: "Twa aburow ahaban bi mfonini a emu da hɔ anaasɛ fa fi wo gallery mu.",
    dag: "Nim maize kpamli bee zaŋ a gallery.",
  },
  step2Title: {
    en: "AI Processing",
    tw: "AI Adwuma",
    dag: "AI Tuuma",
  },
  step2Desc: {
    en: "The MobileNetV3 model analyses the image in seconds and returns a confident prediction.",
    tw: "MobileNetV3 nhwɛsoɔ no hwehwɛ mfonini no mu wɔ anibɔ mu na ɛsan de ahotosoɔ nkɔmhyɛ ba.",
    dag: "MobileNetV3 n kparibɔ nimli pampam ni n-nya din su.",
  },
  step3Title: {
    en: "Get Results",
    tw: "Nya Nea Efi Mu Ba",
    dag: "Nya N-Niŋsim",
  },
  step3Desc: {
    en: "View your diagnosis, confidence score, and tailored treatment tips instantly.",
    tw: "Hwɛ wo yareɛ a wɔahu, ahotosoɔ nkontabuo, ne ayaresa ho afotuo a wɔayɛ ama wo ntɛm ara.",
    dag: "Nya diagnosis, din su, ni kyaŋsim pampam.",
  },
  impactTitle: {
    en: "Supporting Farmers Through AI",
    tw: "Akuafoɔ a Wɔbɛboa Wɔn denam AI so",
    dag: "Tiŋda Tuuma",
  },
  impact1Value: { en: "24/7", tw: "24/7", dag: "24/7" },
  impact1Label: {
    en: "Availability",
    tw: "Aberɛ a Ɛwɔ Hɔ",
    dag: "Saŋa",
  },
  impact2Value: { en: "6", tw: "6", dag: "6" },
  impact2Label: {
    en: "Disease Classes Detected",
    tw: "Nyarewa Akuw Ahorow a Wɔahu",
    dag: "Yɛl' Shɛli din Kparibɔ",
  },
  impact3Value: { en: "Fast", tw: "Ntɛm so", dag: "Pampam" },
  impact3Label: {
    en: "Real-time Diagnosis",
    tw: "Bere Ankasa mu Nhwehwɛmu",
    dag: "Kparibɔ din Daa",
  },
  impact4Value: { en: "Free", tw: "Wontua Hwee", dag: "Biɛla" },
  impact4Label: {
    en: "For All Farmers",
    tw: "Ma Adwumayɛfo Nyinaa",
    dag: "Tiŋda Zaa",
  },
  ctaTitle: {
    en: "Ready to Analyze Your Crop?",
    tw: "Woasiesie Wo Ho Sɛ Wobɛhwehwɛ Wo Nnuadewa Mu?",
    dag: "A Nya a Kpamli?",
  },
  ctaSubtitle: {
    en: "Start detecting maize diseases with AI, free and instant.",
    tw: "Fi ase fa AI hu aburow nyarewa, a wontua hwee na ɛyɛ ntɛm ara.",
    dag: "Di a maize yɛl' kparibɔ ni AI, biɛla ni pampam.",
  },
  startDetection: {
    en: "Start Detection",
    tw: "Fi Ase",
    dag: "Di Dundɔŋ",
  },
};

const diseasesData: Record<Language, { name: string; desc: string }[]> = {
  en: [
    { name: "Common Rust", desc: "Orange-red pustules on leaf surfaces caused by Puccinia sorghi." },
    { name: "Gray Leaf Spot", desc: "Rectangular gray lesions between leaf veins in humid conditions." },
    { name: "Healthy", desc: "Deep uniform green leaves with no spots, streaks, or lesions." },
    { name: "MSV", desc: "Yellow streaks on leaves caused by Maize Streak Virus via leafhoppers." },
    { name: "Northern Leaf Blight", desc: "Long cigar-shaped tan lesions caused by Exserohilum turcicum." },
    { name: "Southern Leaf Blight", desc: "Small tan lesions with brown borders in warm humid conditions." },
  ],
  tw: [
    { name: "Common Rust", desc: "Nsuo a ɛyɛ borɔdɔma-kɔkɔɔ a ɛwɔ nhaban ani a Puccinia sorghi de ba." },
    { name: "Gray Leaf Spot", desc: "Akuru a ɛyɛ fitaa a ɛyɛ ahinanan a ɛwɔ nhaban ntini ntam wɔ tebea horow a ɛyɛ nwini mu." },
    { name: "Apɔwmuden", desc: "Nhaban a ɛyɛ ahabammono a emu dɔ a ɛyɛ pɛ a nsensanee, nsensanee, anaa akuru biara nni so." },
    { name: "MSV", desc: "Ntrɛwmu kɔkɔɔ a ɛwɔ nhaban so a Maize Streak Virus nam leafhoppers so de ba." },
    { name: "Northern Leaf Blight", desc: "Akuru atenten a ɛte sɛ sigaret a ɛyɛ tan a Exserohilum turcicumde ba." },
    { name: "Southern Leaf Blight", desc: "Akuru nketewa a ɛyɛ tan a ɛwɔ hye a ɛyɛ bruu wɔ tebea a ɛyɛ hyew a ɛyɛ nwini mu." },
  ],
  dag: [
    { name: "Common Rust", desc: "Orange-red pustules kpamli so, Puccinia sorghi na ɛde ba." },
    { name: "Gray Leaf Spot", desc: "Gray lesions rectangular, kpamli ntini ntam, bepow saŋa." },
    { name: "Kpalim zaa", desc: "Kpamli green, kuɣu biɛla, spots, streaks, bee lesions." },
    { name: "MSV", desc: "Yellow streaks kpamli so, Maize Streak Virus, leafhoppers." },
    { name: "Northern Leaf Blight", desc: "Tan lesions tenten, cigar, Exserohilum turcicum." },
    { name: "Southern Leaf Blight", desc: "Tan lesions kakraba, brown nkyɛn, bepow saŋa." },
  ],
};

const diseaseIcons = [Bug, Wind, Leaf, AlertTriangle, Droplets, Flame];
const diseaseColors = [
  { color: "bg-orange-100 dark:bg-orange-900", iconColor: "text-orange-600 dark:text-orange-400" },
  { color: "bg-purple-100 dark:bg-purple-900", iconColor: "text-purple-600 dark:text-purple-400" },
  { color: "bg-green-100 dark:bg-green-900", iconColor: "text-green-600 dark:text-green-400" },
  { color: "bg-red-100 dark:bg-red-900", iconColor: "text-red-600 dark:text-red-400" },
  { color: "bg-amber-100 dark:bg-amber-900", iconColor: "text-amber-600 dark:text-amber-400" },
  { color: "bg-rose-100 dark:bg-rose-900", iconColor: "text-rose-600 dark:text-rose-400" },
];

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("chat_language") as Language | null;
    if (savedLang && ["en", "tw", "dag"].includes(savedLang)) {
      setLanguage(savedLang);
    }

    const handleStorage = () => {
      const lang = localStorage.getItem("chat_language") as Language | null;
      if (lang && ["en", "tw", "dag"].includes(lang)) {
        setLanguage(lang);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const t = (key: string) => T[key]?.[language] ?? key;
  const diseases = diseasesData[language];

  return (
    <>
      <Navbar
        language={language}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          localStorage.setItem("chat_language", lang);
        }}
      />

      <main className="bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded-full font-medium">
              <Leaf size={18} />
              {t("badge")}
            </div>

            <h1 className="mt-8 text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight">
              {t("heroTitle1")}
              <span className="text-green-600 dark:text-green-400">
                {" "}{t("heroTitle2")}
              </span>
              <br />
              {t("heroTitle3")}
            </h1>

            <p className="mt-8 text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {t("heroDesc")}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/detect"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors duration-200 inline-flex items-center gap-2"
              >
                {t("analyzeLeaf")}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/treatments"
                className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl font-semibold hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200"
              >
                {t("treatmentGuide")}
              </Link>
            </div>
          </div>
        </section>

        {/* DETECTED DISEASES */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              {t("diseasesTitle")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3">
              {t("diseasesSubtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {diseases.map((d, i) => {
              const Icon = diseaseIcons[i];
              const styles = diseaseColors[i];
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className={`w-12 h-12 ${styles.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={24} className={styles.iconColor} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-50 mb-2">
                    {d.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-700 py-20 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                {t("featuresTitle")}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-3">
                {t("featuresSubtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-5">
                  <Leaf className="text-green-600 dark:text-green-400" size={28} />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  {t("feature1Title")}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                  {t("feature1Desc")}
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-5">
                  <ScanSearch className="text-blue-600 dark:text-blue-400" size={28} />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  {t("feature2Title")}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                  {t("feature2Desc")}
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mb-5">
                  <AlertTriangle className="text-orange-600 dark:text-orange-400" size={28} />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  {t("feature3Title")}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                  {t("feature3Desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              {t("howItWorksTitle")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3">
              {t("howItWorksSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-5">
                <Leaf size={36} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {t("step1Title")}
              </h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("step1Desc")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-5">
                <Cpu size={36} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {t("step2Title")}
              </h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("step2Desc")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-5">
                <Cloud size={36} className="text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {t("step3Title")}
              </h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("step3Desc")}
              </p>
            </div>
          </div>
        </section>

        {/* IMPACT */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="bg-green-600 dark:bg-green-800 rounded-3xl p-12 text-white transition-colors duration-200">
            <h2 className="text-4xl font-bold text-center mb-12">
              {t("impactTitle")}
            </h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-5xl font-bold text-white">{t("impact1Value")}</h3>
                <p className="text-green-100 mt-2">{t("impact1Label")}</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold text-white">{t("impact2Value")}</h3>
                <p className="text-green-100 mt-2">{t("impact2Label")}</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold text-white">{t("impact3Value")}</h3>
                <p className="text-green-100 mt-2">{t("impact3Label")}</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold text-white">{t("impact4Value")}</h3>
                <p className="text-green-100 mt-2">{t("impact4Label")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24">
          <div className="text-center px-6">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              {t("ctaTitle")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg">
              {t("ctaSubtitle")}
            </p>
            <Link
              href="/detect"
              className="inline-flex items-center gap-2 mt-8 bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-semibold transition-colors duration-200"
            >
              {t("startDetection")}
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <AgricChatbot />
    </>
  );
}