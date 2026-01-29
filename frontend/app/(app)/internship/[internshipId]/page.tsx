"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  BarChart3, 
  CheckCircle2, 
  ChevronRight 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

// --- Types ---
type Internship = {
  _id: string;
  title: string;
  domain: string;
  durationWeeks: number;
  daysPerWeek: number;
  overallProgress?: number;
};

type Week = {
  weekNumber: number;
  progress: number;
};

// --- Components ---

// 1. Simple Circular Spinner for Loading State
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    <p className="text-slate-500 text-sm animate-pulse">Loading simulation details...</p>
  </div>
);

// 2. Linear Progress Bar
const ProgressBar = ({ value, className = "" }: { value: number; className?: string }) => (
  <div className={`w-full bg-slate-100 rounded-full h-2 ${className}`}>
    <div 
      className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
      style={{ width: `${value}%` }} 
    />
  </div>
);

export default function InternshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const internshipId = params.internshipId as string;

  const [internship, setInternship] = useState<Internship | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const internshipData = await apiFetch<Internship>(
          `${API_BASE_URL}/internships/${internshipId}`
        );

        const weeksData = await apiFetch<Week[]>(
          `${API_BASE_URL}/internships/${internshipId}/weeks`
        );

        setInternship(internshipData);
        setWeeks(weeksData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load internship");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [internshipId]);

  if (loading) return <LoadingSpinner />;

  if (error || !internship) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-block">
          {error || "Internship not found"}
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. HEADER & NAVIGATION */}
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          className="pl-0 text-slate-500 hover:text-slate-900 hover:bg-transparent"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                Active Simulation
              </span>
              <span className="text-slate-400 text-sm">ID: {internshipId.slice(-6)}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{internship.title}</h1>
            <p className="text-lg text-slate-500 mt-1">{internship.domain}</p>
          </div>

          {/* Overall Progress Card (Top Right) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500">Total Progress</span>
              <span className="text-xl font-bold text-indigo-600">{internship.overallProgress ?? 0}%</span>
            </div>
            <ProgressBar value={internship.overallProgress ?? 0} />
          </div>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Duration</p>
              <p className="text-xl font-bold text-slate-900">{internship.durationWeeks} Weeks</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Commitment</p>
              <p className="text-xl font-bold text-slate-900">{internship.daysPerWeek} Days / Week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Current Status</p>
              <p className="text-xl font-bold text-slate-900">On Track</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. WEEKS ROADMAP */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
             Weekly Roadmap
           </h2>
           <span className="text-sm text-slate-500">
             {weeks.length} Modules
           </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weeks.map((week) => {
            const isCompleted = week.progress === 100;
            const isStarted = week.progress > 0;
            
            return (
              <div 
                key={week.weekNumber}
                onClick={() => router.push(`/internship/${internshipId}/week/${week.weekNumber}`)}
                className="group cursor-pointer"
              >
                <Card className={`h-full border transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                  isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 
                  isStarted ? 'border-indigo-200 bg-white' : 
                  'border-slate-200 bg-slate-50'
                }`}>
                  <CardContent className="p-6">
                    {/* Week Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                          Module {week.weekNumber}
                        </span>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Week {week.weekNumber}
                        </h3>
                      </div>
                      {isCompleted ? (
                         <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                           isStarted ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'
                         }`}>
                           {week.weekNumber}
                         </div>
                      )}
                    </div>

                    {/* Progress Section */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className={`${isCompleted ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                          {isCompleted ? 'Completed' : isStarted ? 'In Progress' : 'Not Started'}
                        </span>
                        <span className="font-medium text-slate-900">{week.progress}%</span>
                      </div>
                      
                      {/* Custom Progress Bar Color based on status */}
                      <div className="w-full bg-white rounded-full h-2 border border-slate-100">
                         <div 
                           className={`h-full rounded-full transition-all duration-500 ${
                             isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                           }`} 
                           style={{ width: `${week.progress}%` }} 
                         />
                      </div>
                    </div>

                    {/* Action Hint */}
                    <div className="mt-6 flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      View Tasks <ChevronRight className="w-4 h-4 ml-1" />
                    </div>

                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}