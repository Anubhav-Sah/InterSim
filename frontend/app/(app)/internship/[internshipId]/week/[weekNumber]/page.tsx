"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Clock, 
  BarChart2, 
  FileText, 
  ChevronRight, 
  CheckCircle,
  BookOpen 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

// --- Types ---
type Task = {
  _id: string;
  title: string;
  description: string;
  contentType: string;
  difficulty: "easy" | "medium" | "hard" | string;
  estimatedHours: number;
  expectedDeliverables: string;
};

// --- Helper Components ---

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    <p className="text-slate-500 text-sm animate-pulse">Loading modules...</p>
  </div>
);

const DifficultyBadge = ({ level }: { level: string }) => {
  const styles = {
    easy: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    hard: "bg-red-100 text-red-700 border-red-200",
  };
  // @ts-ignore
  const style = styles[level.toLowerCase()] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border capitalize ${style}`}>
      {level}
    </span>
  );
};

export default function WeekPage() {
  const params = useParams();
  const router = useRouter();
  const internshipId = params.internshipId as string;
  const weekNumber = params.weekNumber as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeekData() {
      try {
        const tasksData = await apiFetch<Task[]>(
          `${API_BASE_URL}/internships/${internshipId}/tasks?week=${weekNumber}`,
        );

        const internship = await apiFetch<{
          daysPerWeek: number;
        }>(`${API_BASE_URL}/internships/${internshipId}`);

        setTasks(tasksData);
        setDaysPerWeek(Number(internship.daysPerWeek) || 5);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    }

    loadWeekData();
  }, [internshipId, weekNumber]);

  // Distribute tasks into days sequentially
  const tasksByDay: Record<number, Task[]> = {};
  for (let day = 1; day <= daysPerWeek; day++) {
    tasksByDay[day] = [];
  }

  tasks.forEach((task, index) => {
    const day = (index % daysPerWeek) + 1;
    tasksByDay[day].push(task);
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 1. Header & Navigation */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="pl-0 text-slate-500 hover:text-slate-900 mb-4 hover:bg-transparent"
          onClick={() => router.push(`/internship/${internshipId}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>
        <h1 className="text-3xl font-bold text-slate-900">Week {weekNumber} Curriculum</h1>
        <p className="text-slate-500 mt-1">Complete the daily modules to advance your progress.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 2. Sidebar Navigation (Curriculum) */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Schedule
              </h3>
            </div>
            
            <nav className="p-2 space-y-1">
              {Array.from({ length: daysPerWeek }).map((_, index) => {
                const day = index + 1;
                const isActive = selectedDay === day;
                const taskCount = tasksByDay[day].length;

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex justify-between items-center ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {isActive ? (
                         <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                      ) : (
                         <div className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                      Day {day}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                      {taskCount}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* 3. Main Content (Tasks List) */}
        <main className="flex-1 space-y-6">
          
          {/* Day Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
             <h2 className="text-xl font-bold text-slate-800">Day {selectedDay} Tasks</h2>
             <span className="text-sm text-slate-500">{tasksByDay[selectedDay].length} assignments pending</span>
          </div>

          {tasksByDay[selectedDay].length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                 <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-slate-900 font-medium">Free Day!</h3>
              <p className="text-sm text-slate-500 mt-1">
                No tasks assigned for this day. Use it to review previous work.
              </p>
            </div>
          )}

          {tasksByDay[selectedDay].map((task) => (
            <Link
              key={task._id}
              href={`/internship/${internshipId}/week/${weekNumber}/task/${task._id}`}
              className="block group"
            >
              <Card className="border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    
                    {/* Icon & Content */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {task.title}
                          </h4>
                        </div>
                        
                        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Metadata Tags */}
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <DifficultyBadge level={task.difficulty} />
                          
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {task.estimatedHours} hrs
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium border-l border-slate-200 pl-3">
                             <BarChart2 className="w-3.5 h-3.5" />
                             {task.contentType}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Action */}
                    <div className="hidden sm:flex items-center justify-center h-full text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                      <ChevronRight className="w-6 h-6" />
                    </div>

                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </main>
      </div>
    </div>
  );
}