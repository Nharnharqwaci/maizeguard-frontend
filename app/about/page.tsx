import Navbar from "@/components/Navbar";
import { Target, Cpu, Globe, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

        {/* Hero Section */}
        <section className="bg-green-700 dark:bg-green-900 text-white py-20 transition-colors duration-200">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6 text-white">
              About MaizeAI
            </h1>
            <p className="text-xl text-green-100 dark:text-green-200 max-w-3xl mx-auto leading-relaxed">
              Empowering farmers with AI-driven maize disease detection
              for healthier crops and improved food security.
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
                Our Mission
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              MaizeAI aims to provide farmers with an accessible, affordable,
              and reliable way to detect maize diseases early. By leveraging
              Artificial Intelligence, the system helps reduce crop losses and
              supports sustainable agriculture across Ghana and beyond.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="text-4xl font-bold mb-10 text-center text-slate-900 dark:text-slate-50">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900 flex items-center justify-center mb-5">
                <span className="text-green-700 dark:text-green-400 font-bold text-lg">1</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-50">
                Upload Image
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Farmers upload a maize leaf image through the web platform
                or take a photo directly with their camera.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-5">
                <span className="text-blue-700 dark:text-blue-400 font-bold text-lg">2</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-50">
                AI Analysis
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                A trained YOLO classification model analyses the image
                and identifies disease symptoms with confidence scoring.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-5">
                <span className="text-orange-700 dark:text-orange-400 font-bold text-lg">3</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-50">
                Get Results
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                The system provides a clear diagnosis — Healthy, MSV, MLS,
                or Not Maize — with tailored treatment recommendations.
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
                Technology Stack
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Model", value: "YOLOv11 Classification", color: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300" },
                { label: "Backend", value: "FastAPI + Python", color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300" },
                { label: "Frontend", value: "Next.js + Tailwind CSS", color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300" },
                { label: "Database", value: "MongoDB Atlas", color: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300" },
                { label: "Storage", value: "Local file system", color: "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-300" },
                { label: "Inference", value: "Real-time AI prediction", color: "bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${item.color}`}
                >
                  <span className="font-semibold text-sm">{item.label}:</span>
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
                Expected Impact
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
              By enabling early disease detection, MaizeAI can help reduce
              crop losses, improve maize yields, increase farmer productivity,
              and contribute to food security in Ghana and beyond.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { stat: "Early", label: "Disease detection", color: "text-green-600 dark:text-green-400" },
                { stat: "4", label: "Disease classes", color: "text-blue-600 dark:text-blue-400" },
                { stat: "Real-time", label: "AI inference", color: "text-purple-600 dark:text-purple-400" },
                { stat: "Ghana", label: "Primary focus region", color: "text-orange-600 dark:text-orange-400" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700"
                >
                  <div className={`text-2xl font-bold mb-1 ${item.color}`}>
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