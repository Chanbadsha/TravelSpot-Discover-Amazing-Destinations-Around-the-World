"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/Components/Animations";
import { FiSearch, FiTrash2, FiUserPlus, FiX, FiChevronLeft, FiChevronRight, FiShield, FiClock, FiCheck, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { authClient } from "@/src/lib/auth-client";
import GlobalLoader from "@/src/Components/UI/GlobalLoader";
import { getUsers } from "@/src/services/usersService";
import { deleteUser as deleteUserApi, suspendUser, unsuspendUser, setUserRole } from "@/src/services/usersCommandService";

interface User {
  id: string;
  name: string;
  email: string;
  role: "User" | "Moderator" | "Admin";
  status: "Active" | "Suspended";
  joined: string;
  avatar: string;
  image?: string | null;
  suspendedAt?: string;
  suspendReason?: string;
}

const ITEMS_PER_PAGE = 5;

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function mapBackendUser(item: Record<string, unknown>): User {
  const name = (item.name as string) || "Unknown";
  const image = item.image as string | null | undefined;
  return {
    id: (item._id as string) || (item.id as string) || "",
    name,
    email: (item.email as string) || "",
    role: (String(item.role || "user").charAt(0).toUpperCase() + String(item.role || "user").slice(1)) as User["role"],
    status: item.banned ? "Suspended" : "Active",
    joined: item.createdAt ? new Date(item.createdAt as string).toISOString().split("T")[0] : "",
    avatar: image || getInitials(name),
    image,
    suspendedAt: item.bannedAt ? new Date(item.bannedAt as string).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : undefined,
    suspendReason: (item.bannedReason as string) || undefined,
  };
}

function normalizeUsersResponse(res: unknown): Record<string, unknown>[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object" && "data" in (res as Record<string, unknown>) && Array.isArray((res as Record<string, unknown>).data)) {
    return (res as Record<string, unknown>).data as Record<string, unknown>[];
  }
  return [];
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [unsuspendTarget, setUnsuspendTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await getUsers();
        if (!mounted) return;
        const list = normalizeUsersResponse(res);
        setUsers(list.map(mapBackendUser));
      } catch {
        if (!mounted) return;
        toast.error("Failed to load users");
        setUsers([]);
      }
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const changeRole = async (id: string, newRole: User["role"]) => {
    const res = await setUserRole(id, newRole.toLowerCase());
    if (res && (res as Record<string, unknown>).success !== false) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      toast.success("User role updated");
    } else {
      toast.error(((res as Record<string, unknown>)?.message as string) || "Failed to update role");
    }
    setEditingUser(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteUserApi(deleteTarget.id);
    if (res && (res as Record<string, unknown>).success !== false) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      toast.success("User deleted");
    } else {
      toast.error(((res as Record<string, unknown>)?.message as string) || "Failed to delete user");
    }
    setDeleteTarget(null);
  };

  const confirmSuspend = async () => {
    if (!suspendTarget) return;
    const res = await suspendUser(suspendTarget.id, suspendReason || undefined);
    if (res && (res as Record<string, unknown>).success !== false) {
      const now = new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
      setUsers((prev) => prev.map((u) => (u.id === suspendTarget.id ? { ...u, status: "Suspended", suspendedAt: now, suspendReason: suspendReason || undefined } : u)));
      toast.success("User suspended");
    } else {
      toast.error(((res as Record<string, unknown>)?.message as string) || "Failed to suspend user");
    }
    setSuspendTarget(null);
    setSuspendReason("");
  };

  const confirmUnsuspend = async () => {
    if (!unsuspendTarget) return;
    const res = await unsuspendUser(unsuspendTarget.id);
    if (res && (res as Record<string, unknown>).success !== false) {
      setUsers((prev) => prev.map((u) => (u.id === unsuspendTarget.id ? { ...u, status: "Active", suspendedAt: undefined, suspendReason: undefined } : u)));
      toast.success("User reactivated");
    } else {
      toast.error(((res as Record<string, unknown>)?.message as string) || "Failed to reactivate user");
    }
    setUnsuspendTarget(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <GlobalLoader variant="pulse" size="md" />
      </div>
    );
  }

  return (
    <div>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-(--foreground)">User Management</h1>
            <p className="text-(--muted-foreground) text-sm mt-1">
              Manage all users, assign roles, and control access.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <FiUserPlus />
            Add User
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground)" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search users by name or email..."
            className="w-full bg-(--card) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
          className="bg-(--card) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) outline-none cursor-pointer focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
        >
          <option value="All">All Roles</option>
          <option value="User">User</option>
          <option value="Moderator">Moderator</option>
          <option value="Admin">Admin</option>
        </select>
      </motion.div>

      {/* Users Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-(--card) border border-(--border) rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--border) bg-(--background)">
                <th className="text-left px-5 py-3.5 font-semibold text-(--muted-foreground) text-xs uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 font-semibold text-(--muted-foreground) text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 font-semibold text-(--muted-foreground) text-xs uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 font-semibold text-(--muted-foreground) text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-(--muted-foreground) text-xs uppercase tracking-wider">Joined</th>
                <th className="text-right px-5 py-3.5 font-semibold text-(--muted-foreground) text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border)">
              {paginated.map((user) => (
                <tr key={user.id} className="hover:bg-(--background)/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-(--primary)/10 text-(--primary) text-xs font-bold flex items-center justify-center overflow-hidden shrink-0">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.avatar
                        )}
                      </div>
                      <span className="font-medium text-(--foreground)">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-(--muted-foreground)">{user.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      user.role === "Admin"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : user.role === "Moderator"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => user.status === "Active" ? setSuspendTarget(user) : setUnsuspendTarget(user)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors w-fit ${
                          user.status === "Active"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                            : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                        }`}
                      >
                        {user.status}
                      </button>
                      {user.suspendedAt && (
                        <span className="text-[9px] text-(--muted-foreground) flex items-center gap-1">
                          <FiClock className="text-[8px]" />
                          {user.suspendedAt}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-(--muted-foreground) text-xs">{user.joined}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingUser(editingUser?.id === user.id ? null : user)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--primary) hover:bg-(--primary)/10 transition-colors cursor-pointer"
                        title="Change role"
                      >
                        <FiShield className="text-sm" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(user)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--error) hover:bg-(--error)/10 transition-colors cursor-pointer"
                        title="Delete user"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-(--muted-foreground) text-sm">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-(--border)">
            <span className="text-xs text-(--muted-foreground)">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors disabled:opacity-30 cursor-pointer"
              >
                <FiChevronLeft className="text-sm" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    page === currentPage
                      ? "bg-(--primary) text-white"
                      : "text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border)"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors disabled:opacity-30 cursor-pointer"
              >
                <FiChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Role Change Inline */}
      {editingUser && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-(--card) border border-(--border) rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-(--foreground)">
              Change Role: <span className="text-(--primary)">{editingUser.name}</span>
            </h3>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors cursor-pointer"
            >
              <FiX className="text-sm" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {(["User", "Moderator", "Admin"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => changeRole(editingUser.id, role)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  editingUser.role === role
                    ? "bg-(--primary) text-white"
                    : "bg-(--background) text-(--muted-foreground) hover:text-(--foreground) border border-(--border)"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Suspend Confirmation Modal */}
      {suspendTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => { setSuspendTarget(null); setSuspendReason(""); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-(--card) border border-(--border) rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-(--foreground)">Suspend User</h2>
              <button type="button" onClick={() => { setSuspendTarget(null); setSuspendReason(""); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors cursor-pointer">
                <FiX className="text-lg" />
              </button>
            </div>
            <p className="text-sm text-(--muted-foreground) mb-1">
              You are about to suspend <span className="font-semibold text-(--foreground)">{suspendTarget.name}</span>
            </p>
            <p className="text-xs text-(--muted-foreground) mb-4 flex items-center gap-1.5">
              <FiClock className="text-[11px]" />
              Suspension time: {new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-(--foreground) mb-1">Reason (optional)</label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                rows={3}
                placeholder="Provide a reason for suspension..."
                className="w-full bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setSuspendTarget(null); setSuspendReason(""); }} className="flex-1 bg-(--background) border border-(--border) text-(--foreground) rounded-xl py-2.5 text-sm font-medium hover:bg-(--border) transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={confirmSuspend} className="flex-1 bg-(--error) hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
                <FiX /> Suspend
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Unsuspend Confirmation Modal */}
      {unsuspendTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setUnsuspendTarget(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-(--card) border border-(--border) rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-(--foreground)">Reactivate User</h2>
              <button type="button" onClick={() => setUnsuspendTarget(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors cursor-pointer">
                <FiX className="text-lg" />
              </button>
            </div>
            <p className="text-sm text-(--muted-foreground) mb-1">
              Reactivate <span className="font-semibold text-(--foreground)">{unsuspendTarget.name}</span>?
            </p>
            {unsuspendTarget.suspendedAt && (
              <p className="text-xs text-(--muted-foreground) mb-4 flex items-center gap-1.5">
                <FiClock className="text-[11px]" />
                Suspended on {unsuspendTarget.suspendedAt}
              </p>
            )}
            <div className="flex gap-3">
              <button type="button" onClick={() => setUnsuspendTarget(null)} className="flex-1 bg-(--background) border border-(--border) text-(--foreground) rounded-xl py-2.5 text-sm font-medium hover:bg-(--border) transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={confirmUnsuspend} className="flex-1 bg-(--success) hover:bg-green-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
                <FiCheck /> Reactivate
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDeleteTarget(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-(--card) border border-(--border) rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-(--foreground)">Delete User</h2>
              <button type="button" onClick={() => setDeleteTarget(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors cursor-pointer">
                <FiX className="text-lg" />
              </button>
            </div>
            <p className="text-sm text-(--muted-foreground)">
              Are you sure you want to delete <span className="font-semibold text-(--foreground)">{deleteTarget.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setDeleteTarget(null)} className="flex-1 bg-(--background) border border-(--border) text-(--foreground) rounded-xl py-2.5 text-sm font-medium hover:bg-(--border) transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete} className="flex-1 bg-(--error) hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
                <FiTrash2 /> Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal onClose={() => setShowAddModal(false)} onAdded={() => { setShowAddModal(false); window.location.reload(); }} />
      )}
    </div>
  );
}

function AddUserModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<User["role"]>("User");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({ email, password, name });
      if (error) {
        toast.error(error.message || "Failed to create user");
        setLoading(false);
        return;
      }
      const userId = data?.user?.id;
      if (userId && role !== "User") {
        await authClient.admin.setRole({ userId, role: role.toLowerCase() as "admin" | "user" | ("admin" | "user")[] });
      }
      onAdded();
      toast.success("User added successfully");
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-(--card) border border-(--border) rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-(--foreground)">Add New User</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors cursor-pointer">
            <FiX className="text-lg" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-(--foreground) mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="w-full bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--foreground) mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@example.com" className="w-full bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--foreground) mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground)" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 8 characters" minLength={8} className="w-full bg-(--background) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-(--foreground) mb-1">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as User["role"])} className="w-full bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) outline-none cursor-pointer focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20">
              <option value="User">User</option>
              <option value="Moderator">Moderator</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-(--background) border border-(--border) text-(--foreground) rounded-xl py-2.5 text-sm font-medium hover:bg-(--border) transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-(--primary) hover:bg-(--primary-hover) text-white rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><GlobalLoader variant="spinner" size="sm" /> Creating...</> : "Add User"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
