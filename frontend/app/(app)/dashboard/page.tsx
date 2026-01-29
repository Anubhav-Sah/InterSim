"use client";

import { Key, useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/container";
import PageTitle from "@/components/ui/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

type Skill = {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
};

type Internship = {
  _id: Key | null | undefined;
  id: string;
  title: string;
  domain: string;
  durationWeeks: number;
  overallProgress?: number;
};

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Internship list
  const [internships, setInternships] = useState<Internship[]>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);

  // Load internships
  useEffect(() => {
    loadInternships();
  }, []);

  async function loadInternships() {
    console.log("loadInternships CALLED");

    try {
      console.log("Requesting:", `${API_BASE_URL}/internships`);

      const data = await apiFetch<Internship[]>(`${API_BASE_URL}/internships`);

      console.log("Response received:", data);
      setInternships(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }

  function addSkill() {
    setSkills([...skills, { name: "", level: "beginner" }]);
  }

  function updateSkill(index: number, field: keyof Skill, value: string) {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
  }

  function removeSkill(index: number) {
    setSkills(skills.filter((_, i) => i !== index));
  }

  async function handleCreateInternship() {
    setLoading(true);

    try {
      await apiFetch(`${API_BASE_URL}/internships/generate`, {
        method: "POST",
        body: JSON.stringify({
          title,
          domain,
          durationWeeks: Number(durationWeeks),
          daysPerWeek: Number(daysPerWeek),
          skills: skills.map((s) => [s.name, s.level]),
        }),
      });

      // Reset form
      setTitle("");
      setDomain("");
      setDurationWeeks("");
      setDaysPerWeek("");
      setSkills([]);
      setOpen(false);

      // Reload internships
      loadInternships();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to generate internship",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <PageTitle
        title="Dashboard"
        subtitle="Create and manage your internships"
      />

      {/* Internship Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CREATE INTERNSHIP CARD */}
        <Card
          className="flex items-center justify-center h-48 cursor-pointer border-dashed"
          onClick={() => setOpen(true)}
        >
          <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
            <Plus size={32} />
            <span>Create Internship</span>
          </CardContent>
        </Card>

        {/* EXISTING INTERNSHIPS */}
        {internships.map((internship) => (
          <Link key={internship._id} href={`/internship/${internship._id}`}>
            <Card className="h-48 cursor-pointer hover:shadow-md transition">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold">{internship.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {internship.domain}
                </p>
                <p className="text-xs">
                  Duration: {internship.durationWeeks} weeks
                </p>
                {internship.overallProgress !== undefined && (
                  <p className="text-xs">
                    Progress: {internship.overallProgress}%
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* CREATE INTERNSHIP MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Internship</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Internship Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input
              placeholder="Domain (e.g. Web Development)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Duration (weeks)"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Days per week"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(e.target.value)}
              />
            </div>

            {/* SKILLS */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Skills</span>
                <Button size="sm" variant="outline" onClick={addSkill}>
                  Add Skill
                </Button>
              </div>

              {skills.map((skill, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="Skill name"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, "name", e.target.value)}
                  />

                  <Select
                    value={skill.level}
                    onValueChange={(value) =>
                      updateSkill(index, "level", value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkill(index)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              onClick={handleCreateInternship}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Internship"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
