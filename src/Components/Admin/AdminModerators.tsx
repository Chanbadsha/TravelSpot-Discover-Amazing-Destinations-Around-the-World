"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/Components/Animations";
import { FiShield, FiTrash2, FiUserPlus, FiX, FiMail, FiCalendar, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

interface Moderator {
  id: string;
  name: string;
  email: string;
  addedDate: string;
  assignedSpots: number;
  avatar: string;
}

const initialModerators: Moderator[] = [
  { id: "1", name: "Bob Smith", email: "bob@example.com", addedDate: "2025-11-20", assignedSpots: 34, avatar: "BS" },
  { id: "2", name: "Eve Adams", email: "eve@example.com", addedDate: "2025-07-04", assignedSpots: 28, avatar: "EA" },
  { id: "3", name: "David Chen", email: "david@example.com", addedDate: "2026-02-15", assignedSpots: 15, avatar: "DC" },
  { id: "4", name: "Sarah Williams", email: "sarah@example.com", addedDate: "2026-04-01", assignedSpots: 7, avatar: "SW" },
  { id: "5", name: "Mike Johnson", email: "mike@example.com", addedDate: "2025-09-12", assignedSpots: 42, avatar: "MJ" },
];

export default function AdminModerators() {
  const [moderators, setModerators] = useState<Moderator[]>(initialModerators);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const removeModerator = (id: string) => {
    setModerators((prev) => prev.filter((m) => m.id !== id));
    toast.success("Moderator removed");
    setConfirmDelete(null);
  };

  return (
    <div>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-(--foreground)">Moderator Management</h1>
            <p className="text-(--muted-foreground) text-sm mt-1">
              Manage moderators who review and verify destination submissions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <FiUserPlus />
            Add Moderator
          </button>
        </div>
      </motion.div>

      {/* Moderator Cards */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {moderators.map((mod) => (
          <div key={mod.id} className="bg-(--card) border border-(--border) rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 text-sm font-bold flex items-center justify-center">
                {mod.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-(--foreground) truncate">{mod.name}</h3>
                <p className="text-xs text-(--muted-foreground) truncate flex items-center gap-1">
                  <FiMail className="text-[10px]" />
                  {mod.email}
                </p>
              </div>
              <FiShield className="text-purple-500 text-lg shrink-0" />
            </div>
            <div className="flex items-center justify-between text-xs text-(--muted-foreground) mb-4">
              <span className="flex items-center gap-1">
                <FiCalendar className="text-[10px]" />
                Added {mod.addedDate}
              </span>
              <span className="bg-(--background) border border-(--border) px-2 py-0.5 rounded-full">
                {mod.assignedSpots} spots
              </span>
            </div>
            {confirmDelete === mod.id ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => removeModerator(mod.id)}
                  className="flex-1 bg-(--error) hover:bg-red-600 text-white text-xs font-semibold rounded-xl py-2 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <FiCheck /> Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 bg-(--background) border border-(--border) text-(--foreground) text-xs font-medium rounded-xl py-2 hover:bg-(--border) transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(mod.id)}
                className="w-full bg-(--background) border border-(--border) text-(--muted-foreground) hover:text-(--error) hover:border-(--error) text-xs font-medium rounded-xl py-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FiTrash2 />
                Remove Moderator
              </button>
            )}
          </div>
        ))}
      </motion.div>

      {/* Stats Summary */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-6 bg-(--card) border border-(--border) rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-(--foreground)">{moderators.length}</p>
          <p className="text-xs text-(--muted-foreground)">Total Moderators</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-(--foreground)">{moderators.reduce((sum, m) => sum + m.assignedSpots, 0)}</p>
          <p className="text-xs text-(--muted-foreground)">Total Assigned Spots</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-(--foreground)">{Math.round(moderators.reduce((sum, m) => sum + m.assignedSpots, 0) / moderators.length)}</p>
          <p className="text-xs text-(--muted-foreground)">Avg Spots / Moderator</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-(--foreground)">{moderators.filter((m) => m.assignedSpots > 20).length}</p>
          <p className="text-xs text-(--muted-foreground)">Senior Moderators</p>
        </div>
      </motion.div>

      {/* Add Moderator Modal */}
      {showAddModal && (
        <AddModeratorModal
          onClose={() => setShowAddModal(false)}
          onAdd={(mod) => { setModerators((prev) => [mod, ...prev]); setShowAddModal(false); }}
        />
      )}
    </div>
  );
}

function AddModeratorModal({ onClose, onAdd }: { onClose: () => void; onAdd: (mod: Moderator) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    const newMod: Moderator = {
      id: Date.now().toString(),
      name,
      email,
      addedDate: new Date().toISOString().split("T")[0],
      assignedSpots: 0,
      avatar: initials,
    };
    onAdd(newMod);
    toast.success("Moderator added successfully");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-(--card) border border-(--border) rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-(--foreground)">Add Moderator</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors cursor-pointer">
            <FiX className="text-lg" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-(--foreground) mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Moderator name" className="w-full bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--foreground) mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="moderator@example.com" className="w-full bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-(--background) border border-(--border) text-(--foreground) rounded-xl py-2.5 text-sm font-medium hover:bg-(--border) transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="flex-1 bg-(--primary) hover:bg-(--primary-hover) text-white rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer">Add Moderator</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
