"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/layout/container";
import PageTitle from "@/components/ui/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

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

  if (loading) {
    return (
      <Container>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </Container>
    );
  }

  if (error || !internship) {
    return (
      <Container>
        <p className="text-sm text-red-600">{error || "Not found"}</p>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle
        title={internship.title}
        subtitle={internship.domain}
      />

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">
              {internship.durationWeeks} weeks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Days per week
            </p>
            <p className="font-medium">
              {internship.daysPerWeek}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Overall Progress
            </p>
            <p className="font-medium">
              {internship.overallProgress ?? 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* WEEKS GRID */}
      <h2 className="mb-4 font-semibold">Weeks</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {weeks.map((week) => (
          <Card
            key={week.weekNumber}
            className="cursor-pointer hover:shadow-md transition"
            onClick={() =>
              router.push(
                `/internship/${internshipId}/week/${week.weekNumber}`
              )
            }
          >
            <CardContent className="p-5 space-y-2">
              <p className="font-medium">
                Week {week.weekNumber}
              </p>
              <p className="text-sm text-muted-foreground">
                Progress: {week.progress}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
