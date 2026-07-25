"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AgricChatbot from "@/components/AgricChatbot";
import {
  ShieldCheck,
  Leaf,
  RefreshCw,
  Bug,
  Sprout,
  ClipboardCheck,
  AlertTriangle,
  Wind,
  Flame,
  Droplets,
} from "lucide-react";

type Language = "en" | "tw" | "dag";

const T: Record<string, Record<Language, string>> = {
  badge: {
    en: "Evidence-based recommendations",
    tw: "Nyansahyɛ ahorow a egyina adanse so",
    dag: "Kyaŋsim din yɛn",
  },
  heroTitle: {
    en: "Treatment & Prevention",
    tw: "Ayaresa ne Nea Wɔde Siw Ano",
    dag: "Kyaŋsim & Kparibɔ",
  },
  heroDesc: {
    en: "Practical recommendations to help farmers manage and prevent Common Rust, Gray Leaf Spot, MSV, Northern Leaf Blight, Southern Leaf Blight, and maintain healthy maize crops.",
    tw: "Nyansahyɛ ahorow a mfaso wɔ so a ɛbɛboa akuafo ma wɔadi Common Rust, Grey Leaf Spot, MSV, Northern Leaf Blight, Southern Leaf Blight ho dwuma na wɔasiw ano, na wɔakura atoko nnɔbae a ahoɔden wom mu.",
    dag: "Kyaŋsim din tiŋda n-ti Common Rust, Gray Leaf Spot, MSV, Northern Leaf Blight, Southern Leaf Blight, ni maize kpamli sal'.",
  },
  quickRefTitle: {
    en: "Quick Disease Reference",
    tw: "Nyarewa Ho Nsɛm a Ɛyɛ Ntɛm",
    dag: "Yɛl' Kparibɔ Bu",
  },
  treatmentTitle: {
    en: "Treatment Recommendations",
    tw: "Ayaresa Ho Nkamfo a Wɔde Ma",
    dag: "Kyaŋsim",
  },
  ctaTitle: {
    en: "Suspect a Disease on Your Farm?",
    tw: "Wosusuw sɛ Yare bi wɔ W’afuw mu?",
    dag: "A Susu a Kpamli n Yɛl'?",
  },
  ctaDesc: {
    en: "Upload a photo and get an instant AI diagnosis with treatment advice.",
    tw: "Fa mfonini bi gu so na nya AI a wohu ntɛm ara a ayaresa ho afotu ka ho.",
    dag: "Zaŋ nimli n-nya AI kparibɔ pampam ni kyaŋsim.",
  },
  analyzeNow: {
    en: "Analyze a Leaf Now",
    tw: "Hwehwɛ Ahaban bi mu Mprempren",
    dag: "Kpɛma Kpamli Pampam",
  },
};

const diseasesData: Record<Language, { name: string; description: string }[]> = {
  en: [
    {
      name: "Common Rust",
      description:
        "Orange-red pustules on both leaf surfaces. Caused by Puccinia sorghi. Spreads rapidly in cool, humid conditions.",
    },
    {
      name: "Gray Leaf Spot",
      description:
        "Rectangular gray-tan lesions between leaf veins. Caused by Cercospora zeae-maydis. Thrives in warm humid weather.",
    },
    {
      name: "Healthy Plant",
      description:
        "Deep uniform green colour, firm stalk, no spots or streaks. Continue regular monitoring and fertilization.",
    },
    {
      name: "MSV — Maize Streak Virus",
      description:
        "Yellow streaks or mosaic patterns on leaves. Viral — spread by leafhoppers. No cure; focus on prevention and vector control.",
    },
    {
      name: "Northern Leaf Blight",
      description:
        "Long cigar-shaped tan lesions. Caused by Exserohilum turcicum. Favoured by moderate temperatures and leaf wetness.",
    },
    {
      name: "Southern Leaf Blight",
      description:
        "Small tan lesions with brown borders covering the leaf. Caused by Cochliobolus heterostrophus. Serious in warm humid regions.",
    },
  ],
  tw: [
    {
      name: "Common Rust",
      description:
        "Nsuo a ɛyɛ borɔdɔma-kɔkɔɔ a ɛwɔ nhaban ani a Puccinia sorghi de ba. Ɛtrɛw ntɛm wɔ bepow a ɛyɛ dinn mu.",
    },
    {
      name: "Gray Leaf Spot",
      description:
        "Akuru a ɛyɛ ahinanan a ɛyɛ fitaa a ɛyɛ tan a ɛwɔ nhaban ntini ntam. Cercospora zeae-maydis na ɛde ba. Ɛyɛ yie wɔ wim tebea a ɛyɛ hyew a ɛyɛ nwini mu.",
    },
    {
      name: "Apɔwmuden Nhahan",
      description:
        "Kɔla a ɛyɛ ahabammono a emu dɔ yɛ pɛ, dua a ɛyɛ den, nsensanee anaa nsensanee biara nni mu. Kɔ so hwɛ so daa na fa nyinsɛn gu so.",
    },
    {
      name: "MSV — Maize Streak Virus",
      description:
        "Ntrɛwmu kɔkɔɔ anaa mosaic nsusuwso wɔ nhaban so. Viral — a nhaban a wɔfrɛ no leafhoppers na ɛtrɛw. Aduru biara nni hɔ; fa w’adwene si yare no ano a wosiw ne mmoawa a wɔde nyarewa ba so.",
    },
    {
      name: "Northern Leaf Blight",
      description:
        "Akuru atenten a ɛte sɛ sigaret a ɛyɛ tan. Exserohilum turcicum na ɛde ba. Ɔhyew a ɛkɔ fam ne nhaban a ɛyɛ nwini na ɛyɛ nea wɔpɛ.",
    },
    {
      name: "Southern Leaf Blight",
      description:
        "Akuru nketenkete a ɛyɛ tan a ɛwɔ hye a ɛyɛ bruu a ɛkata ahaban no so. Cochliobolus heterostrophus na ɛde ba. Aniberesɛm wɔ mmeae a ɛhɔ yɛ hyew a ɛhɔ yɛ nwini.",
    },
  ],
  dag: [
    {
      name: "Common Rust",
      description:
        "Orange-red pustules kpamli mmienu so. Puccinia sorghi na ɛde ba. Ɛtrɛw pampam wɔ bepow saŋa.",
    },
    {
      name: "Gray Leaf Spot",
      description:
        "Gray-tan lesions rectangular, kpamli ntini ntam. Cercospora zeae-maydis na ɛde ba. Ɛyɛ den wɔ bepow hyew saŋa.",
    },
    {
      name: "Kpalim zaa Kpamli",
      description:
        "Green pɛpɛɛpɛ, dua den, kuɣu biɛla. Kpɛma kpamli ni tiŋa.",
    },
    {
      name: "MSV — Maize Streak Virus",
      description:
        "Yellow streaks bee mosaic patterns kpamli so. Virus, leafhoppers na ɛde trɛw. Kyaŋsim n-yɛn; kparibɔ leafhoppers.",
    },
    {
      name: "Northern Leaf Blight",
      description:
        "Tan lesions tenten sɛ cigar. Exserohilum turcicum na ɛde ba. Ɛyɛ den wɔ mpepepamu ni kpamli nwini saŋa.",
    },
    {
      name: "Southern Leaf Blight",
      description:
        "Tan lesions kakraba, brown nkyɛn, ɛkata kpamli so. Cochliobolus heterostrophus na ɛde ba. Ɛyɛ den wɔ bepow hyew saŋa.",
    },
  ],
};

const treatmentsData: Record<Language, { tag: string; title: string; description: string }[]> = {
  en: [
    {
      tag: "Common Rust",
      title: "Treating Common Rust",
      description:
        "Apply fungicides containing azoxystrobin, propiconazole, or mancozeb at first sign of infection. Remove and destroy heavily infected leaves. Plant rust-resistant varieties next season. Avoid consecutive maize planting on the same field.",
    },
    {
      tag: "Gray Leaf Spot",
      title: "Treating Gray Leaf Spot",
      description:
        "Apply strobilurin or triazole fungicides early. Improve drainage and widen plant spacing to reduce humidity. Till crop residue after harvest to destroy overwintering spores. Rotate with soybeans, groundnuts, or cowpea for at least one season.",
    },
    {
      tag: "Healthy Crop Care",
      title: "Maintaining Healthy Crops",
      description:
        "Monitor fields every 7 days. Apply NPK fertilizer at 60-40-40 kg/ha baseline. Space plants at 75cm between rows and 25cm within rows. Irrigate at the base of plants — avoid wetting foliage. Keep fields free of weeds that host pests.",
    },
    {
      tag: "MSV",
      title: "Responding to MSV",
      description:
        "Remove and destroy infected plants immediately. Control leafhoppers using imidacloprid or thiamethoxam. Apply reflective mulches to deter leafhoppers. Plant MSV-resistant varieties next season (e.g. SAMMAZ 14, 15). Report high infection rates to your agricultural extension officer.",
    },
    {
      tag: "Northern Leaf Blight",
      title: "Treating Northern Leaf Blight",
      description:
        "Apply propiconazole, azoxystrobin, or pyraclostrobin fungicides at early symptom stage. Remove infected lower leaves carefully. Widen plant spacing to increase airflow. Bury or burn crop residue after harvest. Plant resistant hybrids in the following season.",
    },
    {
      tag: "Southern Leaf Blight",
      title: "Treating Southern Leaf Blight",
      description:
        "Apply strobilurin or triazole fungicides immediately. Remove and burn severely blighted leaves — do not compost. Ensure proper potassium nutrition. Improve drainage and widen spacing. Rotate with legumes for one to two seasons. Use certified disease-free seed in the next planting.",
    },
    {
      tag: "Prevention",
      title: "Use Resistant Varieties",
      description:
        "Plant certified disease-resistant maize varieties suited to your region. Resistant seed is the most cost-effective long-term strategy against fungal and viral diseases.",
    },
    {
      tag: "Management",
      title: "Crop Rotation",
      description:
        "Rotate maize with non-host crops such as legumes, cowpea, or groundnuts every season. Rotation breaks disease cycles, reduces soil-borne pathogens, and improves soil fertility naturally.",
    },
    {
      tag: "Immediate Action",
      title: "Remove Infected Plants",
      description:
        "Uproot and destroy severely infected plants immediately to prevent disease spread. Burn infected material — never compost it. Disinfect tools used on infected plants with 70% alcohol or bleach solution.",
    },
    {
      tag: "Monitoring",
      title: "Regular Field Monitoring",
      description:
        "Inspect fields every 5-7 days and use MaizeAI to scan suspicious leaves. Early detection gives the best chance of containing disease spread before it affects yield.",
    },
  ],
  tw: [
    {
      tag: "Common Rust",
      title: "Sɛnea Wobɛsa Common Rust",
      description:
        "Fa fungicides a ɛwɔ azoxystrobin, propiconazole, anaa mancozeb gu sɛ yaree no fii ase. Yi na sɛɛ nhahan a yaree no ahyɛ mu den. Dua nhahan a yaree ntumi nka no afe a ɛbɛba. Nnua aburow ansa na woanntwa dua foforo biara.",
    },
    {
      tag: "Gray Leaf Spot",
      title: "Sɛnea Wobɛsa Gray Leaf Spot",
      description:
        "Fa strobilurin anaa triazole nnuru a ekum fungi gu so ntɛm. Ma nsuo a ɛkɔ mu no tu mpɔn na trɛw afifideɛ ntam kwan mu na ama nsuo a ɛyɛ nwini no so ate. Till nnɔbae nkae bere a wɔatwa akyi de asɛe spores a ɛtra awɔw bere mu. Fa soyabeans, asase so nnuadewa, anaa cowpea di akɔneaba anyɛ yiye koraa no bere biako.",
    },
    {
      tag: "Apɔwmuden Ho Kwan",
      title: "Sɛnea Wobɛkora Ahoɔden",
      description:
        "Hwɛ mfuw so nnafua 7 biara. Fa NPK aduannuru gu so wɔ 60-40-40 kg/ha mfiase. Fa afifideɛ a ɛwɔ 75cm ntam wɔ ntoatoasoɔ ntam ne 25cm wɔ ntoatoasoɔ mu. Ngugu so nsu wɔ afifide ase — kwati sɛ wobɛma nhaban ayɛ nsu. Ma mfuw mu nwura a ɛgye mmoawa a wɔsɛe nnɔbae no nni mu.",
    },
    {
      tag: "MSV",
      title: "Sɛnea Wobɛdi MSV So",
      description:
        "Yi nnɔbae a wɔyare no wom no fi hɔ na sɛe no ntɛm ara. Fa imidacloprid anaa thiamethoxam di nhaban a wɔfrɛ no leafhoppers so. Fa nnua a ɛma nhaban a ɛma hann no dannan gu so na ama wɔatumi asiw nhaban a wɔsɛe nnɔbae no kwan. Dua ahorow a ɛko tia MSV wɔ bere a edi hɔ no mu (sɛ nhwɛso no SAMMAZ 14, 15). Fa ɔyare mmoawa dodow a ɛkɔ soro ho amanneɛ kyerɛ wo kuayɛ ntrɛwmu sohwɛfo.",
    },
    {
      tag: "Northern Leaf Blight",
      title: "Sɛnea Wobɛsa Northern Leaf Blight",
      description:
        "Fa propiconazole, azoxystrobin, anaa pyraclostrobin nnuru a ekum fungi gu so wɔ sɛnkyerɛnne no mfiase. Yi nhahan a ɛwɔ fam a wɔyare no wom no yie. Trɛw nnɔbae ntam kwan mu na ama mframa a ɛkɔ mu no akɔ soro. Sie anaa hyew nnɔbae nkae bere a woatwa awie no. Dua afrafra a ɛko tia nnɔbae wɔ bere a edi hɔ no mu.",
    },
    {
      tag: "Southern Leaf Blight",
      title: "Sɛnea Wobɛsa Southern Leaf Blight",
      description:
        "Fa strobilurin anaa triazole nnuru a ekum fungi gu so ntɛm ara. Yi na hyew nhahan a asɛe kɛse — nnyɛ compost. Hwɛ hu sɛ wubenya potassium aduan pa. Tu mpɔn wɔ nsu a ɛkɔ mu no mu na trɛw ntam kwan no mu. Fa legumes di akɔneaba bere biako kosi abien. Fa aba a wɔagye atom sɛ yare biara nni mu di dwuma wɔ dua a edi hɔ no mu.",
    },
    {
      tag: "Siw a Wɔde Siw Ano",
      title: "Fa Nneɛma Ahorow a Ɛko Tia Di Dwuma",
      description:
        "Dua aburow ahorow a wɔagye atom sɛ ɛko tia nyarewa a ɛfata wo mantam. Aba a ɛko tia nyarewa ne bere tenten a ɛho ka sua sen biara a wɔde ko tia fungal ne mmoawa nyarewa.",
    },
    {
      tag: "Ntotoho",
      title: "Dua Foforo Biara",
      description:
        "Dua aburow afe biara na dua legumes, cowpea, anaa groundnuts. Dua foforo biara bɛtwe yaree no, atraa a ɛwɔ asase so, na asase no ayɛ den.",
    },
    {
      tag: "Adwuma a Ɛyɛ Ntɛm",
      title: "Yi Nnɔbae a Wɔyare No",
      description:
        "Tu nhini na sɛe nnɔbae a wɔyare no ayɛ kɛse no ntɛm ara na amma yare no antrɛw. Hyehyɛ nnɔbae a wɔyare mmoawa — da compost no. Fa nsa anaa bleach solution 70% kum nnwinnade a wɔde di dwuma wɔ nnɔbae a ɔyare no wom so.",
    },
    {
      tag: "Nhwɛsoɔ",
      title: "Kɔ Hwɛ Nnɔbae No Daa",
      description:
        "Kɔ hwɛ afuw mu nnawɔtwe 5-7 biara na fa MaizeAI san nhahan a wo susu sɛ wɔyare. Sɛ wohunu ntɛm a, wobɛtumi atwe yaree no ansa na ɛafa nnɔbae no nyinaa.",
    },
  ],
  dag: [
    {
      tag: "Common Rust",
      title: "Kyaŋsim Common Rust",
      description:
        "Zaŋ fungicides din wɔ azoxystrobin, propiconazole, bee mancozeb yɛl' fii ase. Yi ni sɛɛ kpamli din yɛl' ahyɛ mu. Dua kpamli din yɛl' kuɣu biɛla afe din daa. Nnua maize yɛl' pahi.",
    },
    {
      tag: "Gray Leaf Spot",
      title: "Kyaŋsim Gray Leaf Spot",
      description:
        "Zaŋ strobilurin bee triazole fungicides pampam. Siesie nsu kwan ni twe nnua ntam. Twaa nnɔbae a atwa ni spores bɛwu. Dua beans, groundnuts, bee cowpea.",
    },
    {
      tag: "Kpalim zaa Ho Kyaŋsim",
      title: "Kora Kpalim zaa",
      description:
        "Kpɛma nnɔbae nnawɔtwe biara. Zaŋ NPK fertilizer 60-40-40 kg/ha. Twe nnua ntam: 75cm wɔ ntwɛtwɛn ntam ni 25cm wɔ nnua ntam. Tɔ nsu dua ase — nhwɛ kpamli so. Yi nwura.",
    },
    {
      tag: "MSV",
      title: "Di MSV So",
      description:
        "Yi ni sɛɛ nnɔbae a yɛl' ahyɛ mu pampam. Kparibɔ leafhoppers ni imidacloprid bee thiamethoxam. Zaŋ mulches ni leafhoppers bɛsan. Dua MSV-resistant afe din daa (SAMMAZ 14, 15). Kɔ ka kyerɛ agricultural officer.",
    },
    {
      tag: "Northern Leaf Blight",
      title: "Kyaŋsim Northern Leaf Blight",
      description:
        "Zaŋ propiconazole, azoxystrobin, bee pyraclostrobin fungicides yɛl' fii ase. Yi kpamli a ɛwɔ ase no yie. Twe nnua ntam ni mframa ntu. Siesie bee hyɛ nnɔbae a atwa. Dua kpamli a yɛl' kuɣu biɛla afe din daa.",
    },
    {
      tag: "Southern Leaf Blight",
      title: "Kyaŋsim Southern Leaf Blight",
      description:
        "Zaŋ strobilurin bee triazole fungicides pampam. Yi ni hyɛ kpamli a yɛl' ahyɛ mu den — nnyɛ compost. Hwɛ sɛ potassium wɔ hɔ. Siesie nsu kwan ni twe nnua ntam. Dua legumes bere biara bee mmienu. Fa seed a yɛl' n-nya biɛla dua afe din daa.",
    },
    {
      tag: "Kparibɔ",
      title: "Zaŋ Kpamli a Yɛl' Kuɣu Biɛla",
      description:
        "Dua maize a yɛl' kuɣu biɛla din fata a mantam. Kpamli a yɛl' kuɣu biɛla n sika din bɛtua a ɛnnyɛ den wɔ akyirekyire.",
    },
    {
      tag: "Ntotoho",
      title: "Dua Foforo Biara",
      description:
        "Dua maize afe biara ni dua legumes, cowpea, bee groundnuts. Dua foforo biara bɛtwe yɛl', atraa a ɛwɔ asase so, ni asase ayɛ den.",
    },
    {
      tag: "Tuuma din Yɛ Ntɛm",
      title: "Yi Nnɔbae a Wɔyare No",
      description:
        "Yi ni sɛɛ nnɔbae a yɛl' ahyɛ mu den pampam ni yɛl' bɛtwa afoforo. Hyɛ nnɔbae a wɔyare — nnyɛ compost. Horow nneɛma wɔ alcohol 70% bee bleach mu.",
    },
    {
      tag: "Kpɛma",
      title: "Kpɛma Nnɔbae Daa",
      description:
        "Kpɛma nnɔbae nnawɔtwe 5-7 biara ni fa MaizeAI san kpamli a a susu sɛ wɔyare. Sɛ a nya pampam a, a bɛtumi atwe yɛl' ansa na ɛafa nnɔbae zaa.",
    },
  ],
};

const treatmentStyles = [
  { icon: Bug, color: "bg-orange-100 dark:bg-orange-900", iconColor: "text-orange-600 dark:text-orange-400", tagColor: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300" },
  { icon: Wind, color: "bg-purple-100 dark:bg-purple-900", iconColor: "text-purple-600 dark:text-purple-400", tagColor: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300" },
  { icon: Sprout, color: "bg-green-100 dark:bg-green-900", iconColor: "text-green-600 dark:text-green-400", tagColor: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" },
  { icon: AlertTriangle, color: "bg-red-100 dark:bg-red-900", iconColor: "text-red-600 dark:text-red-400", tagColor: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300" },
  { icon: Droplets, color: "bg-amber-100 dark:bg-amber-900", iconColor: "text-amber-600 dark:text-amber-400", tagColor: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300" },
  { icon: Flame, color: "bg-rose-100 dark:bg-rose-900", iconColor: "text-rose-600 dark:text-rose-400", tagColor: "bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300" },
  { icon: ShieldCheck, color: "bg-blue-100 dark:bg-blue-900", iconColor: "text-blue-600 dark:text-blue-400", tagColor: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" },
  { icon: RefreshCw, color: "bg-teal-100 dark:bg-teal-900", iconColor: "text-teal-600 dark:text-teal-400", tagColor: "bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300" },
  { icon: Leaf, color: "bg-red-100 dark:bg-red-900", iconColor: "text-red-600 dark:text-red-400", tagColor: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300" },
  { icon: ClipboardCheck, color: "bg-indigo-100 dark:bg-indigo-900", iconColor: "text-indigo-600 dark:text-indigo-400", tagColor: "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300" },
];

const diseaseStyles = [
  { color: "bg-orange-50 dark:bg-orange-950", border: "border-orange-200 dark:border-orange-800", titleColor: "text-orange-700 dark:text-orange-400" },
  { color: "bg-purple-50 dark:bg-purple-950", border: "border-purple-200 dark:border-purple-800", titleColor: "text-purple-700 dark:text-purple-400" },
  { color: "bg-green-50 dark:bg-green-950", border: "border-green-200 dark:border-green-800", titleColor: "text-green-700 dark:text-green-400" },
  { color: "bg-red-50 dark:bg-red-950", border: "border-red-200 dark:border-red-800", titleColor: "text-red-700 dark:text-red-400" },
  { color: "bg-amber-50 dark:bg-amber-950", border: "border-amber-200 dark:border-amber-800", titleColor: "text-amber-700 dark:text-amber-400" },
  { color: "bg-rose-50 dark:bg-rose-950", border: "border-rose-200 dark:border-rose-800", titleColor: "text-rose-700 dark:text-rose-400" },
];

export default function TreatmentsPage() {
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
  const treatments = treatmentsData[language];

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

        {/* Hero */}
        <section className="bg-green-700 dark:bg-green-900 text-white py-16 transition-colors duration-200">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-green-600 dark:bg-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShieldCheck size={16} />
              {t("badge")}
            </div>
            <h1 className="text-5xl font-bold mb-4 text-white">
              {t("heroTitle")}
            </h1>
            <p className="text-lg text-green-100 dark:text-green-200 max-w-3xl mx-auto leading-relaxed">
              {t("heroDesc")}
            </p>
          </div>
        </section>

        {/* Disease Quick Reference */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            {t("quickRefTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {diseases.map((d, i) => {
              const styles = diseaseStyles[i];
              return (
                <div
                  key={i}
                  className={`${styles.color} border ${styles.border} rounded-2xl p-5`}
                >
                  <div className={`text-sm font-bold uppercase tracking-wider mb-2 ${styles.titleColor}`}>
                    {d.name}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {d.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Treatment Cards */}
        <section className="max-w-6xl mx-auto py-12 px-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-8">
            {t("treatmentTitle")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((item, index) => {
              const Icon = treatmentStyles[index].icon;
              const styles = treatmentStyles[index];
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-7 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-200"
                >
                  <div className={`w-14 h-14 ${styles.color} rounded-2xl flex items-center justify-center mb-5`}>
                    <Icon size={28} className={styles.iconColor} />
                  </div>
                  <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${styles.tagColor}`}>
                    {item.tag}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="bg-green-600 dark:bg-green-800 rounded-3xl p-10 text-center text-white transition-colors duration-200">
            <h2 className="text-3xl font-bold mb-3">
              {t("ctaTitle")}
            </h2>
            <p className="text-green-100 mb-8 text-lg">
              {t("ctaDesc")}
            </p>
            <Link
              href="/detect"
              className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors duration-200"
            >
              <Leaf size={18} />
              {t("analyzeNow")}
            </Link>
          </div>
        </section>

      </main>
      <AgricChatbot />
    </>
  );
}