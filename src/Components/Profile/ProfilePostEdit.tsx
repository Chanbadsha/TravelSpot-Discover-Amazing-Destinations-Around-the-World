"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/Components/Animations";
import { FiMapPin, FiTag, FiSave, FiArrowLeft, FiPlus, FiX, FiLoader } from "react-icons/fi";
import { MdTravelExplore } from "react-icons/md";
import { getPostById } from "@/src/services/postsService";
import { updatePost } from "@/src/services/postsCommandService";
import toast from "react-hot-toast";

const categories = [
  "Adventure", "Beach", "Mountain", "Culture",
  "Food & Wine", "Nature", "Historical", "Urban",
];

export default function ProfilePostEdit() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
    facilities: [""] as string[],
  });

  useEffect(() => {
    if (!id) return;
    getPostById(id).then((data) => {
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setNotFound(true);
        return;
      }
      const p = Array.isArray(data) ? data[0] : data;
      setForm({
        name: (p.name as string) || "",
        location: (p.location as string) || "",
        category: (p.category as string) || "",
        description: (p.description as string) || "",
        facilities: Array.isArray(p.facilities) && (p.facilities as string[]).length
          ? (p.facilities as string[])
          : [""],
      });
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [id]);

  const addFacility = () => setForm((p) => ({ ...p, facilities: [...p.facilities, ""] }));
  const removeFacility = (idx: number) => setForm((p) => ({ ...p, facilities: p.facilities.filter((_, i) => i !== idx) }));
  const updateFacility = (idx: number, value: string) => setForm((p) => {
    const updated = [...p.facilities];
    updated[idx] = value;
    return { ...p, facilities: updated };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePost({
        id,
        name: form.name,
        location: form.location,
        category: form.category,
        description: form.description,
        facilities: form.facilities.filter((f) => f.trim() !== ""),
      });
      toast.success("Post updated successfully");
      router.push("/user/posts");
    } catch {
      toast.error("Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <FiLoader className="text-2xl text-(--muted-foreground) animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h2 className="text-xl font-bold text-(--foreground) mb-2">Post not found</h2>
        <p className="text-sm text-(--muted-foreground) mb-4">This destination doesn&apos;t exist or has been deleted.</p>
        <button type="button" onClick={() => router.push("/user/posts")}
          className="inline-flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer">
          <FiArrowLeft /> Back to My Posts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
        <button type="button" onClick={() => router.push("/user/posts")}
          className="inline-flex items-center gap-1.5 text-sm text-(--muted-foreground) hover:text-(--foreground) transition-colors mb-3 cursor-pointer">
          <FiArrowLeft className="text-sm" /> Back to My Posts
        </button>
        <h1 className="text-2xl font-bold text-(--foreground)">Edit Post</h1>
        <p className="text-(--muted-foreground) text-sm mt-1">Update the details of your destination.</p>
      </motion.div>

      <motion.form variants={fadeUp} initial="hidden" animate="visible" onSubmit={handleSubmit} className="bg-(--card) border border-(--border) rounded-2xl p-6 md:p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-(--foreground) mb-1.5">Spot Name *</label>
          <div className="relative">
            <MdTravelExplore className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-lg" />
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required
              className="w-full bg-(--background) border border-(--border) rounded-xl pl-11 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-(--foreground) mb-1.5">Location *</label>
          <div className="relative">
            <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-lg" />
            <input type="text" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} required
              className="w-full bg-(--background) border border-(--border) rounded-xl pl-11 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-(--foreground) mb-1.5">Category *</label>
          <div className="relative">
            <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-lg z-10" />
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} required
              className="w-full bg-(--background) border border-(--border) rounded-xl pl-11 pr-4 py-2.5 text-sm text-(--foreground) outline-none appearance-none cursor-pointer focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20">
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-(--foreground) mb-1.5">Description *</label>
          <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} required
            className="w-full bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-(--foreground) mb-1.5">Facilities & Amenities</label>
          <div className="space-y-2">
            {form.facilities.map((facility, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="text" value={facility} onChange={(e) => updateFacility(idx, e.target.value)}
                  placeholder="e.g., Parking, Restrooms"
                  className="flex-1 bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20" />
                {form.facilities.length > 1 && (
                  <button type="button" onClick={() => removeFacility(idx)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--error) hover:bg-(--error)/10 transition-colors cursor-pointer">
                    <FiX className="text-sm" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addFacility}
            className="mt-2 flex items-center gap-1.5 text-sm text-(--primary) hover:text-(--primary-hover) font-medium transition-colors cursor-pointer">
            <FiPlus className="text-xs" /> Add Facility
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-(--border)">
          <button type="button" onClick={() => router.push("/user/posts")}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-(--muted-foreground) hover:text-(--foreground) border border-(--border) hover:bg-(--background) transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50">
            {saving ? (
              <><FiLoader className="text-sm animate-spin" /> Saving...</>
            ) : (
              <><FiSave className="text-sm" /> Save Changes</>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
