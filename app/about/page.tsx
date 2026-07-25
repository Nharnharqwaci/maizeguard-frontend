"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Target, Cpu, Globe, TrendingUp } from "lucide-react";

type Language = "en" | "tw" | "dag";

const T: Record<string, Record<Language, string>> = {
  heroTitle: {
    en: "About MaizeAI",
    tw: "MaizeAI Ho Nsɛm",
    dag: "MaizeAI Yɛl'",
  },
  heroDesc: {
    en: "Empowering farmers with AI-driven maize disease detection for healthier crops and improved food security.",
    tw: "Akuafoɔ a wɔbɛma wɔn tumi denam aburow yareɛ a AI na ɛma wɔhunu no so ma nnɔbaeɛ a ahoɔden wom ne aduane a wɔnya no tu mpɔn.",
    dag: "N tiŋda tuuma ni AI kparibɔ maize yɛl' ni kpamli sal' ni aduan biɛla.",
  },
  missionTitle: {
    en: "Our Mission",
    tw: "Yɛn Botae",
    dag: "A Tuhi",
  },
  missionDesc: {
    en: "MaizeAI aims to provide farmers with an accessible, affordable, and reliable way to detect maize diseases early. By leveraging Artificial Intelligence, the system helps reduce crop losses and supports sustainable agriculture across Ghana and beyond.",
    tw: "MaizeAI botae ne sɛ ɛbɛma akuafo anya ɔkwan a ɛyɛ mmerɛw, ne bo nyɛ den, na wotumi de ho to so a wɔbɛfa so ahu atoko nyarewa ntɛm. Ɛnam Artificial Intelligence a wɔde di dwuma so no, nhyehyɛe no boa ma nnɔbae a wɔhwere no so tew na ɛboa kuayɛ a ɛbɛkɔ so atra hɔ daa wɔ Ghana nyinaa ne akyirikyiri.",
    dag: "MaizeAI tuhi n-ti tiŋda kparibɔ maize yɛl' pampam. AI n tiŋa ni kpamli sal' ni tiŋa Ghana ni aman pahi.",
  },
  howItWorksTitle: {
    en: "How It Works",
    tw: "Ɛkwan a Ɛdi So",
    dag: "N-Niŋsim",
  },
  step1Title: {
    en: "Upload Image",
    tw: "Twe Mfonin",
    dag: "Zaŋ Nimli",
  },
  step1Desc: {
    en: "Farmers upload a maize leaf image through the web platform or take a photo directly with their camera.",
    tw: "Akuafo de aburow ahaban mfonini bi fa wɛbsaet no so gu so anaasɛ wɔde wɔn mfoninitwa afiri twa mfonini tẽẽ.",
    dag: "Tiŋda zaŋ maize kpamli nimli web so bee camera.",
  },
  step2Title: {
    en: "AI Analysis",
    tw: "AI Nhwehwɛmu",
    dag: "AI Kparibɔ",
  },
  step2Desc: {
    en: "A trained MobileNetV3 classification model analyses the image and identifies disease symptoms with confidence scoring.",
    tw: "MobileNetV3 nkyekyɛmu nhwɛsoɔ a wɔatete no hwehwɛ mfonini no mu na ɛde ahotosoɔ nkontabuo kyerɛ yareɛ ho sɛnkyerɛnne.",
    dag: "MobileNetV3 n kparibɔ nimli ni n-nya yɛl' symptoms ni din su.",
  },
  step3Title: {
    en: "Get Results",
    tw: "Nya Nneyɛe",
    dag: "Nya N-Niŋsim",
  },
  step3Desc: {
    en: "The system provides a clear diagnosis which is Healthy, MSV, Common Rust, Gray Leaf Spot, Northern Leaf Blight, or Southern Leaf Blight with tailored treatment recommendations.",
    tw: "Nhyehyɛe no ma wohu yareɛ a ɛda adi pefee a ɛyɛ Apɔwmuden, MSV, Common Rust, Grey Leaf Spot, Northern Leaf Blight, anaa Southern Leaf Blight a wɔde ayaresa ho nyansahyɛ a wɔayɛ ama.",
    dag: "N-niŋsim n-nya diagnosis: Kpalim zaa, MSV, Common Rust, Gray Leaf Spot, Northern Leaf Blight, bee Southern Leaf Blight, ni kyaŋsim.",
  },
  techStackTitle: {
    en: "Technology Stack",
    tw: "Nneɛma a Yɛde Yɛ",
    dag: "N-Niŋsim Nneɛma",
  },
  impactTitle: {
    en: "Expected Impact",
    tw: "Nneyɛe a Yɛnhwɛ",
    dag: "N-Niŋsim din Yɛn",
  },
  impactDesc: {
    en: "By enabling early disease detection, MaizeAI can help reduce crop losses, improve maize yields, increase farmer productivity, and contribute to food security in Ghana and beyond.",
    tw: "Ɛdenam sɛnea ɛma wotumi hu nyarewa ntɛm so no, MaizeAI betumi aboa ma nnɔbae a wɔhwere no so atew, ama aburow aba atu mpɔn, ama akuafo nnɔbae akɔ soro, na aboa ma aduan a wobenya wɔ Ghana ne akyirikyiri.",
    dag: "Sɛ a kparibɔ yɛl' pampam a, MaizeAI bɛtum atiŋda tuuma, maize bɛboro, ni aduan biɛla wɔ Ghana ni aman pahi.",
  },
};

const techStackLabels: Record<Language, Record<string, string>> = {
  en: {
    Model: "Model",
    Backend: "Backend",
    Frontend: "Frontend",
    Database: "Database",
    Storage: "Storage",
    Inference: "Inference",
  },
  tw: {
    Model: "Model",
    Backend: "Backend",
    Frontend: "Frontend",
    Database: "Database",
    Storage: "Storage",
    Inference: "Nhwehwɛmu",
  },
  dag: {
    Model: "Model",
    Backend: "Backend",
    Frontend: "Frontend",
    Database: "Database",
    Storage: "Storage",
    Inference: "Kparibɔ",
  },
};

const impactStats: Record<Language, { stat: string; label: string }[]> = {
  en: [
    { stat: "Early", label: "Disease detection" },
    { stat: "6", label: "Disease classes" },
    { stat: "Real-time", label: "AI inference" },
    { stat: "Ghana", label: "Primary focus" },
  ],
  tw: [
    { stat: "Ntɛm", label: "Yaree hunu" },
    { stat: "6", label: "Yaree dodow" },
    { stat: "Ntɛm", label: "AI nhwehwɛmu" },
    { stat: "Ghana", label: "Mantam a yɛdwene ho" },
  ],
  dag: [
    { stat: "Pampam", label: "Yɛl' kparibɔ" },
    { stat: "6", label: "Yɛl' zaa" },
    { stat: "Pampam", label: "AI kparibɔ" },
    { stat: "Ghana", label: "Mantam din yɛn" },
  ],
};

const techStackItems = [
  { key: "Model", value: "MobileNetV3", color: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300" },
  { key: "Backend", value: "FastAPI + Python", color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300" },
  { key: "Frontend", value: "Next.js + Tailwind CSS", color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300" },
  { key: "Database", value: "MongoDB Atlas", color: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300" },
  /*{ key: "Storage", value: "Cloudflare R2", color: "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-300" },*/
  /*{ key: "Inference", value: "AI ", color: "bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300" },*/
];

const impactColors = [
  "text-green-600 dark:text-green-400",
  "text-blue-600 dark:text-blue-400",
  "text-purple-600 dark:text-purple-400",
  "text-orange-600 dark:text-orange-400",
];

export default function AboutPage() {
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
  const techLabels = techStackLabels[language];
  const impacts = impactStats[language];

  return (
    <>
      <Navbar
        language={language}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          localStorage.setItem("chat_language", lang);
        }}
      />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

        {/* Hero Section */}
        <section className="bg-green-700 dark:bg-green-900 text-white py-20 transition-colors duration-200">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6 text-white">
              {t("heroTitle")}
            </h1>
            <p className="text-xl text-green-100 dark:text-green-200 max-w-3xl mx-auto leading-relaxed">
              {t("heroDesc")}
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="max-w-6xl mx-auto py-16 px-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-10 transition-colors duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-2xl">
                <Target size={36} className="text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {t("missionTitle")}
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              {t("missionDesc")}
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="text-4xl font-bold mb-10 text-center text-slate-900 dark:text-slate-50">
            {t("howItWorksTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900 flex items-center justify-center mb-5">
                <span className="text-green-700 dark:text-green-400 font-bold text-lg">1</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-50">
                {t("step1Title")}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("step1Desc")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-5">
                <span className="text-blue-700 dark:text-blue-400 font-bold text-lg">2</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-50">
                {t("step2Title")}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("step2Desc")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-5">
                <span className="text-orange-700 dark:text-orange-400 font-bold text-lg">3</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-50">
                {t("step3Title")}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("step3Desc")}
              </p>
            </div>

          </div>
        </section>

        {/* Technology Stack */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-10 transition-colors duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-2xl">
                <Cpu size={36} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {t("techStackTitle")}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {techStackItems.map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${item.color}`}
                >
                  <span className="font-semibold text-sm">{techLabels[item.key]}:</span>
                  <span className="text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expected Impact */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-10 transition-colors duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-2xl">
                <TrendingUp size={36} className="text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {t("impactTitle")}
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
              {t("impactDesc")}
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {impacts.map((item, i) => (
                <div
                  key={item.label}
                  className="text-center p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700"
                >
                  <div className={`text-2xl font-bold mb-1 ${impactColors[i]}`}>
                    {item.stat}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}