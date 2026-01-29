"use client";

import { useEffect, useState } from "react";
import { User, Mail, GraduationCap, BookOpen, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

interface UserProfile {
  name: string;
  email: string;
  college?: string;
  course?: string;
  semester?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    college: "",
    course: "",
    semester: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 1. Fetch Profile Data
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiFetch<UserProfile>(`${API_BASE_URL}/users/me`);
        setProfile({
          name: data.name || "",
          email: data.email || "", // Email is usually read-only
          college: data.college || "",
          course: data.course || "",
          semester: data.semester || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // 2. Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 3. Save Changes
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Assuming PUT /users/me updates the profile
      await apiFetch(`${API_BASE_URL}/users/me`, {
        method: "PUT", // or PATCH depending on your backend
        body: JSON.stringify({
          name: profile.name,
          college: profile.college,
          course: profile.course,
          semester: profile.semester
        }),
      });
      setMessage({ type: 'success', text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: 'error', text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // Get initial for Avatar
  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your personal information and academic details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Identity Card */}
        <div className="lg:col-span-1">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
              
              {/* Large Avatar */}
              <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-white shadow-lg flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-indigo-600">{initial}</span>
              </div>
              
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-sm text-slate-500 mb-6">{profile.email}</p>

              <div className="w-full border-t border-slate-100 pt-4 text-left">
                <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">
                  Account Status
                </p>
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-sm text-slate-700">Active Student</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Edit Form */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-800">
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Feedback Message */}
              {message && (
                <div className={`p-4 rounded-lg text-sm flex items-center gap-2 ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}>
                  {message.type === 'success' ? <div className="w-2 h-2 bg-emerald-500 rounded-full" /> : null}
                  {message.text}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" /> Full Name
                  </label>
                  <Input 
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="focus:ring-indigo-500"
                  />
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" /> Email Address
                  </label>
                  <Input 
                    disabled 
                    value={profile.email} 
                    className="bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-400">Email cannot be changed.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* College */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-slate-400" /> College / University
                    </label>
                    <Input 
                      name="college"
                      placeholder="e.g. Stanford University"
                      value={profile.college}
                      onChange={handleChange}
                      className="focus:ring-indigo-500"
                    />
                  </div>

                  {/* Semester */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-slate-400" /> Current Semester
                    </label>
                    <Input 
                      name="semester"
                      placeholder="e.g. 6th Semester"
                      value={profile.semester}
                      onChange={handleChange}
                      className="focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Course */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Degree / Course
                  </label>
                  <Input 
                    name="course"
                    placeholder="e.g. B.Tech Computer Science"
                    value={profile.course}
                    onChange={handleChange}
                    className="focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save Changes
                    </span>
                  )}
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}