"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";

type Task = {
  _id: string;
  title: string;
  description: string;
  contentType: string;
  difficulty: string;
  estimatedHours: number;
  expectedDeliverables: string;
};

export default function WeekPage() {
  const params = useParams();
  const internshipId = params.internshipId as string;
  const weekNumber = params.weekNumber as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeekData() {
      try {
        // Fetch tasks for this week
        const tasksData = await apiFetch<Task[]>(
          `${API_BASE_URL}/internships/${internshipId}/tasks?week=${weekNumber}`,
        );

        // Fetch internship metadata (authoritative)
        const internship = await apiFetch<{
          daysPerWeek: number;
        }>(`${API_BASE_URL}/internships/${internshipId}`);

        setTasks(tasksData);
        // setDaysPerWeek(internship.daysPerWeek || 5);
        setDaysPerWeek(Number(internship.daysPerWeek) || 5);
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

  if (loading) {
    return <Container>Loading week...</Container>;
  }

  return (
    <Container>
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-56">
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold mb-2">Week {weekNumber}</h3>

              {Array.from({ length: daysPerWeek }).map((_, index) => {
                const day = index + 1;
                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                      selectedDay === day
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Day {day}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <main className="flex-1 space-y-4">
          {tasksByDay[selectedDay].length === 0 && (
            <p className="text-sm text-muted-foreground">
              No tasks for this day.
            </p>
          )}

          {tasksByDay[selectedDay].map((task) => (
            <Link
              key={task._id}
              href={`/internship/${internshipId}/week/${weekNumber}/task/${task._id}`}
              className="block"
            >
              <Card className="cursor-pointer hover:shadow-md transition">
                <CardContent className="p-5 space-y-2">
                  <h4 className="font-semibold">{task.title}</h4>

                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>

                  <div className="text-xs text-gray-500">
                    ⏱ {task.estimatedHours} hrs · {task.difficulty}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </main>
      </div>
    </Container>
  );
}
