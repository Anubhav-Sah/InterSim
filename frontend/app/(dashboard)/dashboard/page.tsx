// "use client";

// import { Key, useEffect, useState } from "react";
// import Link from "next/link";
// import { Plus, X, Briefcase, Clock, Calendar } from "lucide-react"; // Added icons
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter, // Added for better button placement
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { apiFetch } from "@/lib/api";
// import { API_BASE_URL } from "@/lib/config";

// // --- Types ---
// type Skill = {
//   name: string;
//   level: "beginner" | "intermediate" | "advanced";
// };

// type Internship = {
//   _id: Key | null | undefined;
//   id: string;
//   title: string;
//   domain: string;
//   durationWeeks: number;
//   overallProgress?: number;
// };

// // --- Helper Component: Simple Progress Bar ---
// const ProgressBar = ({ value }: { value: number }) => (
//   <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2">
//     <div
//       className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
//       style={{ width: `${value}%` }}
//     />
//   </div>
// );

// export default function DashboardPage() {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Internship list
//   const [internships, setInternships] = useState<Internship[]>([]);

//   // Form state
//   const [title, setTitle] = useState("");
//   const [domain, setDomain] = useState("");
//   const [durationWeeks, setDurationWeeks] = useState("");
//   const [daysPerWeek, setDaysPerWeek] = useState("");
//   const [skills, setSkills] = useState<Skill[]>([]);

//   // Load internships
//   useEffect(() => {
//     loadInternships();
//   }, []);

//   async function loadInternships() {
//     try {
//       const data = await apiFetch<Internship[]>(`${API_BASE_URL}/internships`);
//       setInternships(data);
//     } catch (err) {
//       console.error("Fetch failed:", err);
//     }
//   }

//   function addSkill() {
//     setSkills([...skills, { name: "", level: "beginner" }]);
//   }

//   function updateSkill(index: number, field: keyof Skill, value: string) {
//     const updated = [...skills];

//     updated[index] = { ...updated[index], [field]: value };
//     setSkills(updated);
//   }

//   function removeSkill(index: number) {
//     setSkills(skills.filter((_, i) => i !== index));
//   }

//   async function handleCreateInternship() {
//     setLoading(true);

//     try {
//       await apiFetch(`${API_BASE_URL}/internships/generate`, {
//         method: "POST",
//         body: JSON.stringify({
//           title,
//           domain,
//           durationWeeks: Number(durationWeeks),
//           daysPerWeek: Number(daysPerWeek),
//           skills: skills.map((s) => [s.name, s.level]),
//         }),
//       });

//       // Reset form
//       setTitle("");
//       setDomain("");
//       setDurationWeeks("");
//       setDaysPerWeek("");
//       setSkills([]);
//       setOpen(false);

//       // Reload internships
//       loadInternships();
//     } catch (err) {
//       alert(
//         err instanceof Error ? err.message : "Failed to generate internship",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
//           <p className="text-slate-500 mt-1">
//             Manage your active simulations and progress.
//           </p>
//         </div>
//         <div className="mt-4 md:mt-0">
//           <Button
//             onClick={() => setOpen(true)}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             New Internship
//           </Button>
//         </div>
//       </div>

//       {/* Internship Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* CREATE NEW CARD (Alternative Trigger) */}
//         <button
//           onClick={() => setOpen(true)}
//           className="group relative flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200"
//         >
//           <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-white group-hover:shadow-sm transition-all">
//             <Plus className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
//           </div>
//           <span className="font-medium text-slate-600 group-hover:text-indigo-700">
//             Create New Simulation
//           </span>
//         </button>

//         {/* EXISTING INTERNSHIPS */}
//         {internships.map((internship) => (
//           <Link
//             key={internship._id}
//             href={`/internship/${internship._id}`}
//             className="block h-full"
//           >
//             <Card className="h-full hover:shadow-md hover:border-indigo-200 transition-all duration-200 group">
//               <CardContent className="p-6 flex flex-col h-full">
//                 {/* Card Header */}
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
//                     <Briefcase size={20} />
//                   </div>
//                   {/* Status Badge (mock) */}
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                     Active
//                   </span>
//                 </div>

//                 {/* Content */}
//                 <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
//                   {internship.title}
//                 </h3>
//                 <p className="text-sm text-slate-500 mb-4">
//                   {internship.domain}
//                 </p>

//                 {/* Meta Data */}
//                 <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 mt-auto">
//                   <div className="flex items-center gap-1">
//                     <Clock size={14} />
//                     <span>{internship.durationWeeks} weeks</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Calendar size={14} />
//                     <span>Flexible</span>
//                   </div>
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="mt-2">
//                   <div className="flex justify-between text-xs mb-1">
//                     <span className="font-medium text-slate-600">Progress</span>
//                     <span className="text-slate-900">
//                       {internship.overallProgress || 0}%
//                     </span>
//                   </div>
//                   <ProgressBar value={internship.overallProgress || 0} />
//                 </div>
//               </CardContent>
//             </Card>
//           </Link>
//         ))}
//       </div>

//       {/* CREATE INTERNSHIP MODAL */}
//       {/* ... previous code ... */}

//       {/* CREATE INTERNSHIP MODAL */}
//       {/* CREATE INTERNSHIP MODAL */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-lg w-full max-h-[85vh] flex flex-col bg-white p-0 border-0 shadow-xl rounded-xl gap-0">
//           {/* Header */}
//           <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
//             <DialogTitle className="text-xl font-bold text-slate-900">
//               Create Internship
//             </DialogTitle>
//             <p className="text-sm text-slate-500">
//               Define your simulation parameters.
//             </p>
//           </DialogHeader>

//           {/* Scrollable Content */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-6">
//             {/* Basic Info Group */}
//             <div className="space-y-4">
//               <div className="space-y-1">
//                 <label className="text-sm font-medium text-slate-700">
//                   Role Title <span className="text-red-500">*</span>
//                 </label>
//                 <Input
//                   placeholder="e.g. Frontend Engineer"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   className="focus:ring-indigo-500"
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-sm font-medium text-slate-700">
//                   Domain <span className="text-red-500">*</span>
//                 </label>
//                 <Input
//                   placeholder="e.g. Web Development"
//                   value={domain}
//                   onChange={(e) => setDomain(e.target.value)}
//                   className="focus:ring-indigo-500"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-slate-700">
//                     Duration (Weeks)
//                   </label>
//                   <Input
//                     type="number"
//                     placeholder="4"
//                     value={durationWeeks}
//                     onChange={(e) => setDurationWeeks(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-slate-700">
//                     Days / Week
//                   </label>
//                   <Input
//                     type="number"
//                     placeholder="5"
//                     value={daysPerWeek}
//                     onChange={(e) => setDaysPerWeek(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Divider */}
//             <div className="relative py-2">
//               <div
//                 className="absolute inset-0 flex items-center"
//                 aria-hidden="true"
//               >
//                 <div className="w-full border-t border-slate-200" />
//               </div>
//               <div className="relative flex justify-center">
//                 <span className="bg-white px-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
//                   Required Skills
//                 </span>
//               </div>
//             </div>

//             {/* SKILLS */}
//             <div className="space-y-3 pb-2">
//               {skills.map((skill, index) => (
//                 <div
//                   key={index}
//                   className="flex gap-2 items-center p-2 bg-slate-50 rounded-lg border border-slate-100"
//                 >
//                   <Input
//                     placeholder="Skill name"
//                     value={skill.name}
//                     onChange={(e) => updateSkill(index, "name", e.target.value)}
//                     className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-2 h-auto min-w-0 flex-1"
//                   />

//                   <Select
//                     value={skill.level}
//                     onValueChange={(value) =>
                     
//                       updateSkill(index, "level", value)
//                     }
//                   >
//                     <SelectTrigger className="w-[110px] sm:w-[130px] h-8 text-xs border-slate-200 bg-white flex-shrink-0">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="beginner">Beginner</SelectItem>
//                       <SelectItem value="intermediate">Intermediate</SelectItem>
//                       <SelectItem value="advanced">Advanced</SelectItem>
//                     </SelectContent>
//                   </Select>

//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
//                     onClick={() => removeSkill(index)}
//                   >
//                     <X size={16} />
//                   </Button>
//                 </div>
//               ))}

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={addSkill}
//                 className="w-full border-dashed border-slate-300 text-slate-500 hover:border-indigo-500 hover:text-indigo-600"
//               >
//                 <Plus size={16} className="mr-2" /> Add Skill
//               </Button>
//             </div>
//           </div>

//           {/* Footer - Buttons Stacked Vertically */}
//           <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-3 flex-shrink-0">
//             {/* 1. Cancel Button (Top) */}
//             <Button
//               variant="outline"
//               className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
//               onClick={() => setOpen(false)}
//             >
//               Cancel
//             </Button>

//             {/* 2. Generate Button (Bottom) */}
//             <Button
//               className={`w-full transition-all duration-200 ${
//                 !title || !domain
//                   ? "bg-slate-300 text-slate-500 cursor-not-allowed"
//                   : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
//               }`}
//               onClick={handleCreateInternship}
//               // LOGIC: Disable if loading OR if title/domain are empty
//               disabled={loading || !title.trim() || !domain.trim()}
//             >
//               {loading ? (
//                 <span className="flex items-center gap-2">
//                   <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                       fill="none"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   Generating...
//                 </span>
//               ) : (
//                 "Generate Simulation"
//               )}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
"use client";

import { Key, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Plus, X, Briefcase, Clock, Calendar } from "lucide-react";
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
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

// --- Types ---
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

// --- Helper Component: Simple Progress Bar ---
const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2">
    <div 
      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
      style={{ width: `${value}%` }} 
    />
  </div>
);

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

  // Ref to track if we just added a skill for auto-focus
  const isAddingSkill = useRef(false);

  // Load internships
  useEffect(() => {
    loadInternships();
  }, []);

  // Auto-focus logic: When skills array length increases, focus the last input
  useEffect(() => {
    if (isAddingSkill.current && skills.length > 0) {
      const lastIndex = skills.length - 1;
      const inputElement = document.getElementById(`skill-input-${lastIndex}`);
      if (inputElement) {
        inputElement.focus();
      }
      isAddingSkill.current = false;
    }
  }, [skills.length]);

  async function loadInternships() {
    try {
      const data = await apiFetch<Internship[]>(`${API_BASE_URL}/internships`);
      setInternships(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }

  function addSkill() {
    isAddingSkill.current = true; // Set flag to trigger focus
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

  // Handle Days Input specifically to enforce 1-7 range
  function handleDaysChange(val: string) {
    // Allow empty string for typing
    if (val === "") {
        setDaysPerWeek("");
        return;
    }
    const num = parseInt(val);
    if (!isNaN(num)) {
        // Clamp strictly between 1 and 7 implies logic, 
        // but for UX, let's just let them type and validate on button state
        // or prevent > 7 typing.
        if (num > 7) return; 
        if (num < 1) return;
        setDaysPerWeek(val);
    }
  }

  // Validation Check
  const isFormValid = 
    title.trim() !== "" &&
    domain.trim() !== "" &&
    durationWeeks !== "" &&
    daysPerWeek !== "" &&
    Number(daysPerWeek) >= 1 && 
    Number(daysPerWeek) <= 7;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your active simulations and progress.</p>
        </div>
        <div className="mt-4 md:mt-0">
           <Button onClick={() => setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
             <Plus className="w-4 h-4 mr-2" />
             New Internship
           </Button>
        </div>
      </div>

      {/* Internship Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CREATE NEW CARD */}
        <button 
          onClick={() => setOpen(true)}
          className="group relative flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-white group-hover:shadow-sm transition-all">
            <Plus className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
          </div>
          <span className="font-medium text-slate-600 group-hover:text-indigo-700">Create New Simulation</span>
        </button>

        {/* EXISTING INTERNSHIPS */}
        {internships.map((internship) => (
          <Link key={internship._id} href={`/internship/${internship._id}`} className="block h-full">
            <Card className="h-full hover:shadow-md hover:border-indigo-200 transition-all duration-200 group">
              <CardContent className="p-6 flex flex-col h-full">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Briefcase size={20} />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {internship.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4">{internship.domain}</p>
                
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 mt-auto">
                   <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{internship.durationWeeks} weeks</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Flexible</span>
                   </div>
                </div>

                <div className="mt-2">
                   <div className="flex justify-between text-xs mb-1">
                     <span className="font-medium text-slate-600">Progress</span>
                     <span className="text-slate-900">{internship.overallProgress || 0}%</span>
                   </div>
                   <ProgressBar value={internship.overallProgress || 0} />
                </div>

              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* CREATE INTERNSHIP MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg w-full max-h-[85vh] flex flex-col bg-white p-0 border-0 shadow-xl rounded-xl gap-0">
          
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
            <DialogTitle className="text-xl font-bold text-slate-900">Create Internship</DialogTitle>
            <p className="text-sm text-slate-500">Define your simulation parameters.</p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Basic Info Group */}
            <div className="space-y-4">
               <div className="space-y-1">
                 <label className="text-sm font-medium text-slate-700">
                   Role Title <span className="text-red-500">*</span>
                 </label>
                 <Input
                   placeholder="e.g. Frontend Engineer"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   className="focus:ring-indigo-500"
                 />
               </div>

               <div className="space-y-1">
                 <label className="text-sm font-medium text-slate-700">
                   Domain <span className="text-red-500">*</span>
                 </label>
                 <Input
                   placeholder="e.g. Web Development"
                   value={domain}
                   onChange={(e) => setDomain(e.target.value)}
                   className="focus:ring-indigo-500"
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">
                        Duration (Weeks) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="4"
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(e.target.value)}
                      className="focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">
                        Days / Week (1-7) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="7"
                      placeholder="5"
                      value={daysPerWeek}
                      onChange={(e) => handleDaysChange(e.target.value)}
                      className="focus:ring-indigo-500"
                    />
                  </div>
               </div>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs font-medium text-slate-400 uppercase tracking-wide">Required Skills</span>
              </div>
            </div>

            {/* SKILLS */}
            <div className="space-y-3 pb-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex gap-2 items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  {/* Fixed: Visible White Input for Skill Name */}
                  <Input
                    id={`skill-input-${index}`} 
                    placeholder="e.g. React.js"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, "name", e.target.value)}
                    className="flex-1 bg-white border-slate-300 focus:ring-indigo-500 shadow-sm"
                  />

                  <Select
                    value={skill.level}
                    onValueChange={(value) =>
                 
                      updateSkill(index, "level", value)
                    }
                  >
                    <SelectTrigger className="w-[110px] sm:w-[130px] h-10 text-xs border-slate-300 bg-white flex-shrink-0">
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
                    className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                    onClick={() => removeSkill(index)}
                  >
                    <X size={18} />
                  </Button>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addSkill} 
                className="w-full border-dashed border-slate-300 text-slate-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <Plus size={16} className="mr-2" /> Add Skill
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-3 flex-shrink-0">
             
             {/* Cancel - Top */}
             <Button 
               variant="outline" 
               className="w-full border-slate-300 text-slate-700 hover:bg-slate-50" 
               onClick={() => setOpen(false)}
             >
               Cancel
             </Button>

             {/* Generate - Bottom */}
             <Button
              className={`w-full transition-all duration-200 ${
                !isFormValid
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
              }`}
              onClick={handleCreateInternship}
              disabled={loading || !isFormValid} 
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  Generating...
                </span>
              ) : (
                "Generate Simulation"
              )}
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}