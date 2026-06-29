"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import api from "@/services/api";
import {
  Leaf,
  ScanSearch,
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertTriangle,
} from "lucide-react";

interface Scan {
  _id: string;
  prediction: string;
  confidence: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Farmer");
  const [stats, setStats] = useState({
    total_scans: 0,
    disease_cases: 0,
    recent_scans: [] as Scan[],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const storedName = localStorage.getItem("user_name");
    if (storedName) setUserName(storedName);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        router.push("/login");
        return;
      }
      const response = await api.get(`/api/dashboard/stats/${userId}`);
      setStats(response.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const predictionColor = (prediction: string) => {
    switch (prediction) {
      case "Healthy":
        return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
      case "MSV":
        return "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300";
      case "MLS":
        return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300";
      case "Not_Maize":
        return "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300";
      default:
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300";
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

        {/* HERO */}
        <section className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 dark:from-green-900 dark:via-green-800 dark:to-green-700 text-white transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-6 py-14">
            <h1 className="text-5xl font-bold text-white">
              Welcome, {userName}
            </h1>
            <p className="mt-4 text-green-100 text-lg">
              Monitor crop health, review disease reports, and track treatments.
            </p>
          </div>
        </section>

        {/* STATS */}
        <section className="max-w-7xl mx-auto px-6 -mt-10">
          <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-lg transition-colors duration-200">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-4">
                <Leaf size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Total Scans
              </h3>
              <p className="text-4xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                {stats.total_scans}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-lg transition-colors duration-200">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Diseases Found
              </h3>
              <p className="text-4xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                {stats.disease_cases}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-lg transition-colors duration-200">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Treatments Given
              </h3>
              <p className="text-4xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                {stats.disease_cases}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-lg transition-colors duration-200">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                AI Accuracy
              </h3>
              <p className="text-4xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                98%
              </p>
            </div>

          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-50">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-8">

            <Link
              href="/detect"
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 group"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <ScanSearch size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                Analyze Leaf
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Upload maize leaf images for instant AI disease diagnosis.
              </p>
            </Link>

            <Link
              href="/treatments"
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 group"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <ShieldCheck size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                Treatment Guide
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                View treatment and prevention recommendations for maize diseases.
              </p>
            </Link>

            <Link
              href="/about"
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 group"
            >
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                <Activity size={32} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                About System
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Learn how MaizeAI works and its technology stack.
              </p>
            </Link>

          </div>
        </section>

        {/* RECENT SCANS */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-lg p-8 transition-colors duration-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-50">
              Recent Analyses
            </h2>

            {loading ? (
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 py-6">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading recent scans...
              </div>
            ) : stats.recent_scans.length === 0 ? (
              <div className="text-center py-12">
                <Leaf size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  No scans yet
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                  Analyze your first maize leaf to see results here.
                </p>
                <Link
                  href="/detect"
                  className="inline-flex items-center gap-2 mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <ScanSearch size={18} />
                  Analyze a Leaf
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      <th className="text-left py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Prediction
                      </th>
                      <th className="text-left py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="text-left py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_scans.map((scan) => (
                      <tr
                        key={scan._id}
                        className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <td className="py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${predictionColor(scan.prediction)}`}>
                            {scan.prediction === "Not_Maize" ? "Not Maize" : scan.prediction}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-green-500 transition-all"
                                style={{ width: `${scan.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {scan.confidence}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-slate-500 dark:text-slate-400">
                          {new Date(scan.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

      </main>
    </>
  );
}