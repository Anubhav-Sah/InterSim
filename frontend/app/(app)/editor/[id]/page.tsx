"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // Safety check
  if (!id) {
    return <div>Invalid task</div>;
  }

  const storageKey = `editor-draft-${id}`;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [code, setCode] = useState("// Start coding here...");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Load saved draft
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setCode(saved);
    }
  }, [storageKey]);

  // 🔹 Handle submit
  function handleSubmit() {
    setIsSubmitting(true);

    // simulate API call
    setTimeout(() => {
      router.push("/feedback/sub_1");
    }, 1000);
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium">
          Code Editor – Task {id}
        </h2>

        <Button
          disabled={isSubmitting || !code.trim()}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit Code"}
        </Button>
      </div>

      {/* Editor */}
      <Card className="p-4">
        <textarea
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            localStorage.setItem(storageKey, e.target.value);
          }}
          className="w-full h-100 resize-none border rounded p-3 font-mono text-sm focus:outline-none"
        />
      </Card>
    </Container>
  );
}
