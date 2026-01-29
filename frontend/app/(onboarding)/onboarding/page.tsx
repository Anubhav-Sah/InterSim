"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import PageTitle from "@/components/ui/page-title";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

export default function OnboardingPage() {
  const router = useRouter();

  // 🔒 Access control state
  const [checking, setChecking] = useState(true);

  // Step control
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Form state
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 HARD GUARD: block onboarding if already completed
  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        const user = await apiFetch<{
          onboardingCompleted: boolean;
        }>(`${API_BASE_URL}/users/me`);

        if (user.onboardingCompleted) {
          router.replace("/dashboard");
          return;
        }
      } catch {
        // auth handled globally
      } finally {
        setChecking(false);
      }
    }

    checkOnboardingStatus();
  }, [router]);

  // ⛔ Do NOT render page until check finishes
  if (checking) {
    return null; // or a spinner later
  }

  // Validation per step
  function isStepValid() {
    if (step === 1) return college.trim() !== "";
    if (step === 2) return course.trim() !== "";
    if (step === 3) return semester.trim() !== "";
    return false;
  }

  async function handleFinish() {
    setLoading(true);
    setError("");

    try {
      await apiFetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        body: JSON.stringify({
          college,
          course,
          semester,
          onboardingCompleted: true,
        }),
      });

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save onboarding data");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  return (
    <Container>
      <Section>
        <PageTitle
          title="Let’s get you set up"
          subtitle={`Step ${step} of ${totalSteps}`}
        />

        {/* Progress bar */}
        <div className="mb-6 h-2 w-full rounded bg-gray-200">
          <div
            className="h-2 rounded bg-black transition-all"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <Card className="max-w-xl mx-auto">
          <CardContent className="p-6 space-y-6">
            {step === 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  College / University
                </label>
                <Input
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Course / Degree
                </label>
                <Input
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Current Semester
                </label>
                <Input
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                disabled={step === 1 || loading}
                onClick={handleBack}
              >
                Back
              </Button>

              <Button
                disabled={!isStepValid() || loading}
                onClick={handleNext}
              >
                {loading
                  ? "Saving..."
                  : step < totalSteps
                  ? "Next"
                  : "Finish"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
