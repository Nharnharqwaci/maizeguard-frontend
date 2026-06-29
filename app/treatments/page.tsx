import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ShieldCheck,
  Leaf,
  RefreshCw,
  Bug,
  Sprout,
  ClipboardCheck,
  AlertTriangle,
  XCircle,
} from "lucide-react";

const treatments = [
  {
    icon: ShieldCheck,
    color: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-400",
    tag: "Prevention",
    tagColor: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
    title: "Use Resistant Varieties",
    description:
      "Plant maize varieties resistant to Maize Streak Virus and MLS to significantly reduce infection risk from the start of the season.",
  },
  {
    icon: Bug,
    color: "bg-orange-100 dark:bg-orange-900",
    iconColor: "text-orange-600 dark:text-orange-400",
    tag: "Pest Control",
    tagColor: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
    title: "Control Leafhoppers",
    description:
      "Manage leafhopper populations (Cicadulina spp.) — the primary MSV vector — using imidacloprid or thiamethoxam insecticides early in the season.",
  },
  {
    icon: RefreshCw,
    color: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    tag: "Management",
    tagColor: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
    title: "Crop Rotation",
    description:
      "Rotate maize with non-host crops such as legumes or cowpea to reduce disease pressure and improve soil health between seasons.",
  },
  {
    icon: Leaf,
    color: "bg-red-100 dark:bg-red-900",
    iconColor: "text-red-600 dark:text-red-400",
    tag: "Immediate Action",
    tagColor: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
    title: "Remove Infected Plants",
    description:
      "Uproot and destroy severely infected plants immediately to prevent disease spread. For MLS, burn — do not compost — all infected material.",
  },
  {
    icon: Sprout,
    color: "bg-teal-100 dark:bg-teal-900",
    iconColor: "text-teal-600 dark:text-teal-400",
    tag: "Soil Health",
    tagColor: "bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300",
    title: "Maintain Healthy Crops",
    description:
      "Proper NPK fertilization (60-40-40 kg/ha baseline) and adequate irrigation strengthen plants and improve natural disease resistance.",
  },
  {
    icon: ClipboardCheck,
    color: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-400",
    tag: "Monitoring",
    tagColor: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
    title: "Regular Monitoring",
    description:
      "Inspect fields every 7 days and use MaizeAI to scan suspicious leaves. Early detection gives the best chance of containing disease spread.",
  },
  {
    icon: AlertTriangle,
    color: "bg-yellow-100 dark:bg-yellow-900",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    tag: "MSV Specific",
    tagColor: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
    title: "MSV Early Response",
    description:
      "If MSV is detected, apply reflective mulches to deter leafhoppers, avoid replanting maize immediately in the same field, and report to your agricultural extension officer.",
  },
  {
    icon: XCircle,
    color: "bg-rose-100 dark:bg-rose-900",
    iconColor: "text-rose-600 dark:text-rose-400",
    tag: "MLS Specific",
    tagColor: "bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300",
    title: "MLS Emergency Protocol",
    description:
      "MLS has no cure. Quarantine affected sections immediately, disinfect all tools with 70% alcohol or bleach, plant certified disease-free seed next season, and notify authorities.",
  },
];

export default function TreatmentsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

        {/* Hero */}
        <section className="bg-green-700 dark:bg-green-900 text-white py-16 transition-colors duration-200">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-green-600 dark:bg-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShieldCheck size={16} />
              Evidence-based recommendations
            </div>
            <h1 className="text-5xl font-bold mb-4 text-white">
              Treatment & Prevention
            </h1>
            <p className="text-lg text-green-100 dark:text-green-200 max-w-3xl mx-auto leading-relaxed">
              Practical recommendations to help farmers manage and prevent
              Maize Streak Virus, Maize Lethal Senescence, and other
              common maize diseases effectively.
            </p>
          </div>
        </section>

        {/* Disease quick reference */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            Quick Disease Reference
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-2xl p-5">
              <div className="text-sm font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider mb-2">
                MSV — Maize Streak Virus
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Yellow streaks or mosaic patterns on leaves. Spread by
                leafhoppers. Manageable with early intervention and
                resistant varieties.
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl p-5">
              <div className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wider mb-2">
                MLS — Maize Lethal Senescence
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Rapid yellowing and death of the plant. No cure — immediate
                removal and quarantine is the only response.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-2xl p-5">
              <div className="text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-wider mb-2">
                Healthy Plant Signs
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Deep uniform green colour, firm stalk, no spots or streaks.
                Continue regular monitoring and fertilization.
              </p>
            </div>
          </div>
        </section>

        {/* Treatment Cards */}
        <section className="max-w-6xl mx-auto py-12 px-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-8">
            Treatment Recommendations
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-7 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-200"
                >
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-5`}>
                    <Icon size={28} className={item.iconColor} />
                  </div>
                  <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${item.tagColor}`}>
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
              Suspect a Disease on Your Farm?
            </h2>
            <p className="text-green-100 mb-8 text-lg">
              Upload a photo and get an instant AI diagnosis with treatment advice.
            </p>
            <Link
              href="/detect"
              className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors duration-200"
            >
              <Leaf size={18} />
              Analyze a Leaf Now
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}