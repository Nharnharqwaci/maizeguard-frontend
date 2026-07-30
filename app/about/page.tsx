"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Target, Globe, TrendingUp, Sprout, Camera, ShieldCheck } from "lucide-react";

type Language = "en" | "tw" | "dag";

const T: Record<string, Record<Language, string>> = {
  heroTitle: {
    en: "About MaizeGuard",
    tw: "MaizeGuard Ho Nsɛm",
    dag: "MaizeGuard Yɛl'",
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
    en: "MaizeGuide aims to provide farmers with an accessible, affordable, and reliable way to detect maize diseases early. By leveraging Artificial Intelligence, the system helps reduce crop losses and supports sustainable agriculture across Ghana and beyond.",
    tw: "MaizeGuide botae ne sɛ ɛbɛma akuafo anya ɔkwan a ɛyɛ mmerɛw, ne bo nyɛ den, na wotumi de ho to so a wɔbɛfa so ahu atoko nyarewa ntɛm. Ɛnam Artificial Intelligence a wɔde di dwuma so no, nhyehyɛe no boa ma nnɔbae a wɔhwere no so tew na ɛboa kuayɛ a ɛbɛkɔ so atra hɔ daa wɔ Ghana nyinaa ne akyirikyiri.",
    dag: "MaizeGuide tuhi n-ti tiŋda kparibɔ maize yɛl' pampam. AI n tiŋa ni kpamli sal' ni tiŋa Ghana ni aman pahi.",
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
    tw: "Eyi bɛma wo mmuaeɛ a emu da hɔ fann a ɛfa nwura no ahoɔden tebea ho: sɛ ɛyɛ deɛ ahoɔden wɔ mu (Healthy), Ahaban nsensaneeɛ(MSV), Aburoo mfofoeeɛ(Common Rust), Ahaban nkaeɛ kɔkɔbiri(Gray Leaf Spot), Ahaban hyeeɛ kɛseɛ(Northern Leaf Blight), anaa Ahaban hyeeɛ nketewa(Southern Leaf Blight), ɛna ama wo nsaano nnuro ne afutuo a ɛbɛsa yadeɛ no pɔtee.",
    dag: "N-niŋsim n-nya diagnosis: Kpalim zaa, MSV, Common Rust, Gray Leaf Spot, Northern Leaf Blight, bee Southern Leaf Blight, ni kyaŋsim.",
  },
  benefitsTitle: {
    en: "How MaizeGuard Helps You",
    tw: "Kwan a MaizeGuard Boa Wo",
    dag: "N-Niŋsim MaizeGuard Boa A",
  },
  benefit1Title: {
    en: "Catch Diseases Early",
    tw: "Hunu Yaree Ntɛm",
    dag: "Nya Yɛl' Pampam",
  },
  benefit1Desc: {
    en: "Spot problems in your maize before they spread across your whole farm. Early action means more food for your family.",
    tw: "Hunu aburoo yareɛ ansa na atrɛw w'afuw no mu nyinaa. Sɛ wo yɛ ho adwuma ntɛm a, ɛkyerɛ sɛ wubenya aduan ma wo fifoɔ.",
    dag: "Nya maize yɛl' saŋa din biɛla a kuɣu. Sɛ a yɛn yɛl' pampam a, a sal' la aduan.",
  },
  benefit2Title: {
    en: "Easy as Taking a Photo",
    tw: "Twa Mfonin, Ɛyɛ Mmerɛw koraa",
    dag: "Zaŋ Nimli bee Yɛl' Suhira",
  },
  benefit2Desc: {
    en: "No need for expert knowledge. Just snap a picture of your maize leaf with your phone and get answers instantly.",
    tw: "Ɛnhia nimdeɛ soronko bia. Twa aburoo ahaban mfonini bi  na nya mmuaeɛ ntɛm.",
    dag: "Biɛla n-ti kparibɔ zaŋ. Zaŋ maize kpamli nimli phone ni ni nya n-niŋsim pampam.",
  },
  benefit3Title: {
    en: "Speak Your Language",
    tw: "Kasa Wo Kasa Mu",
    dag: "Yɛli A Yɛl' Kasi Ni",
  },
  benefit3Desc: {
    en: "Get your results and farming advice in Twi, Dagbani, or English — whichever you understand best.",
    tw: "Nya wo mmuaeɛ ne kuayɛ afotuo Twi, Dagbani, anaa English mu — kasa biara a wo te aseɛ yie.",
    dag: "Nya n-niŋsim ni kyaŋsim Twi, Dagbani, bee English — yɛl' shɛli n-yɛn n-ti a.",
  },
  benefit4Title: {
    en: "Expert Treatment Advice",
    tw: "Afotuo a Ɛfiri Ɔkwanhunufoɔ",
    dag: "Kyaŋsim din Be Kparibɔ",
  },
  benefit4Desc: {
    en: "Know exactly what to do next — from which spray to use, to when to replant — so you never lose your harvest.",
    tw: "Hunu  nea ɛsɛ sɛ woyɛ pɛpɛɛpɛ ɛyi akyi — firi sɛnea ɛbɛfa spray a wobɛtumi de di dwuma so, kɔsi bere a wobɛdua foforo bio — sɛnea ɛbɛyɛ a worenhwere wo nnɔbaeɛ da.",
    dag: "Nya shɛli n-ti a yɛn — shɛli spray n-yɛn, saŋa din n-sow kpamli — ka chɛ ka a kɔbga.",
  },
  impactTitle: {
    en: "Expected Impact",
    tw: "Nea a Yɛnhwɛ Kwan",
    dag: "N-Niŋsim din Yɛn",
  },
  impactDesc: {
    en: "By enabling early disease detection, MaizeGaurd can help reduce crop losses, improve maize yields, increase farmer productivity, and contribute to food security in Ghana and beyond.",
    tw: "Ɛdenam sɛnea ɛma wotumi hu nyarewa ntɛm so no, MaizeGuard betumi aboa ma nnɔbae a wɔhwere no so atew, ama aburow aba atu mpɔn, ama akuafo nnɔbae akɔ soro, na aboa ma aduan a wobenya wɔ Ghana ne akyirikyiri.",
    dag: "Sɛ a kparibɔ yɛl' pampam a, MaizeGuard bɛtum atiŋda tuuma, maize bɛboro, ni aduan biɛla wɔ Ghana ni aman pahi.",
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

        {/* Benefits for Farmers (replaces Technology Stack) */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="text-4xl font-bold mb-10 text-center text-slate-900 dark:text-slate-50">
            {t("benefitsTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900 flex items-center justify-center mb-5">
                <Sprout size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-50">
                {t("benefit1Title")}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("benefit1Desc")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-5">
                <Camera size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-50">
                {t("benefit2Title")}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("benefit2Desc")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-5">
                <Globe size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-50">
                {t("benefit3Title")}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("benefit3Desc")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900 flex items-center justify-center mb-5">
                <ShieldCheck size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-50">
                {t("benefit4Title")}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("benefit4Desc")}
              </p>
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