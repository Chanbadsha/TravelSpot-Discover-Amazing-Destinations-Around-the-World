"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/Components/Animations";
import { FiSearch, FiCheck, FiX, FiTrash2, FiEye, FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

type Status = "Pending" | "Approved" | "Rejected";

interface Destination {
  id: string;
  name: string;
  location: string;
  category: string;
  status: Status;
  submittedBy: string;
  date: string;
  image: string;
  rejectedAt?: string;
  rejectReason?: string;
}

const initialDestinations: Destination[] = [
  { id: "1", name: "Santorini Sunset Point", location: "Santorini, Greece", category: "Beach", status: "Pending", submittedBy: "Alice J.", date: "2026-07-10", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=100&h=100&fit=crop" },
  { id: "2", name: "Machu Picchu", location: "Cusco, Peru", category: "Historical", status: "Approved", submittedBy: "Bob S.", date: "2026-07-08", image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=100&h=100&fit=crop" },
  { id: "3", name: "Northern Lights Deck", location: "Tromsø, Norway", category: "Nature", status: "Pending", submittedBy: "Charlie B.", date: "2026-07-05", image: "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=100&h=100&fit=crop" },
  { id: "4", name: "Grand Canyon Skywalk", location: "Arizona, USA", category: "Adventure", status: "Approved", submittedBy: "Diana R.", date: "2026-07-03", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=100&h=100&fit=crop" },
  { id: "5", name: "Tokyo Street Food Tour", location: "Tokyo, Japan", category: "Food & Wine", status: "Rejected", submittedBy: "Eve A.", date: "2026-06-28", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&h=100&fit=crop", rejectedAt: "2026-07-01 14:30" },
  { id: "6", name: "Bali Rice Terraces", location: "Ubud, Bali", category: "Nature", status: "Pending", submittedBy: "Frank M.", date: "2026-06-25", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100&h=100&fit=crop" },
  { id: "7", name: "Dubai Marina Walk", location: "Dubai, UAE", category: "Urban", status: "Approved", submittedBy: "Grace L.", date: "2026-06-20", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100&h=100&fit=crop" },
  { id: "8", name: "Swiss Alps Hiking Trail", location: "Interlaken, Switzerland", category: "Mountain", status: "Pending", submittedBy: "Henry W.", date: "2026-06-18", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=100&h=100&fit=crop" },
];

const ITEMS_PER_PAGE = 6;

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingDest, setViewingDest] = useState<Destination | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Destination | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Destination | null>(null);

  const filtered = destinations.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const updateStatus = (id: string, status: Status, extra?: Partial<Destination>) => {
    setDestinations((prev) => prev.map((d) => (d.id === id ? { ...d, status, ...extra } : d)));
    toast.success(`Destination ${status.toLowerCase()}`);
    setViewingDest(null);
    setRejectTarget(null);
    setRejectReason("");
  };

  const confirmReject = () => {
    if (!rejectTarget) return;
    const now = new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
    updateStatus(rejectTarget.id, "Rejected", { rejectedAt: now, rejectReason: rejectReason || undefined });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDestinations((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    toast.success("Destination deleted");
    setViewingDest(null);
    setDeleteTarget(null);
  };

  const statusBadge = (status: Status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      case "Rejected":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      case "Pending":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
    }
  };

  return (
    <div>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--foreground)">Destination Management</h1>
        <p className="text-(--muted-foreground) text-sm mt-1">Review, approve, or reject destination submissions.</p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground)" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search destinations..."
            className="w-full bg-(--card) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="bg-(--card) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) outline-none cursor-pointer focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </motion.div>

      {/* Destinations Grid */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginated.map((dest) => (
          <div key={dest.id} className="bg-(--card) border border-(--border) rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-36 bg-gray-200 dark:bg-gray-800">
              <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusBadge(dest.status)}`}>
                  {dest.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-(--foreground) truncate">{dest.name}</h3>
              <p className="text-xs text-(--muted-foreground) mt-0.5">{dest.location}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-(--background) text-(--muted-foreground) px-2 py-0.5 rounded-full border border-(--border)">
                  {dest.category}
                </span>
                <span className="text-[10px] text-(--muted-foreground)">by {dest.submittedBy}</span>
              </div>
              {dest.rejectedAt && (
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-(--muted-foreground)">
                  <FiClock className="text-[9px]" />
                  Rejected {dest.rejectedAt}
                  {dest.rejectReason && <span className="truncate ml-0.5">&middot; {dest.rejectReason}</span>}
                </div>
              )}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-(--border)">
                <span className="text-[10px] text-(--muted-foreground)">{dest.date}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewingDest(dest)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--primary) hover:bg-(--primary)/10 transition-colors cursor-pointer"
                    title="View details"
                  >
                    <FiEye className="text-xs" />
                  </button>
                  {dest.status === "Pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus(dest.id, "Approved")}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--success) hover:bg-(--success)/10 transition-colors cursor-pointer"
                        title="Approve"
                      >
                        <FiCheck className="text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectTarget(dest)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--error) hover:bg-(--error)/10 transition-colors cursor-pointer"
                        title="Reject"
                      >
                        <FiX className="text-xs" />
                      </button>
                    </>
                  )}
                  {dest.status === "Rejected" && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus(dest.id, "Approved")}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--success) hover:bg-(--success)/10 transition-colors cursor-pointer"
                        title="Approve"
                      >
                        <FiCheck className="text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(dest.id, "Pending")}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
                        title="Send back to review"
                      >
                        <FiClock className="text-xs" />
                      </button>
                    </>
                  )}
                  {dest.status === "Approved" && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus(dest.id, "Pending")}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
                        title="Send back to review"
                      >
                        <FiClock className="text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectTarget(dest)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--error) hover:bg-(--error)/10 transition-colors cursor-pointer"
                        title="Reject"
                      >
                        <FiX className="text-xs" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(dest)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--error) hover:bg-(--error)/10 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {paginated.length === 0 && (
          <div className="col-span-full text-center py-10 text-(--muted-foreground) text-sm">
            No destinations found
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 px-1">
          <span className="text-xs text-(--muted-foreground)">Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors disabled:opacity-30 cursor-pointer">
              <FiChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${page === currentPage ? "bg-(--primary) text-white" : "text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border)"}`}>
                {page}
              </button>
            ))}
            <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors disabled:opacity-30 cursor-pointer">
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDeleteTarget(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-(--card) border border-(--border) rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-(--foreground)">Delete Destination</h2>
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

      {/* Reject Confirmation Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => { setRejectTarget(null); setRejectReason(""); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-(--card) border border-(--border) rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-(--foreground)">Reject Destination</h2>
              <button type="button" onClick={() => { setRejectTarget(null); setRejectReason(""); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors cursor-pointer">
                <FiX className="text-lg" />
              </button>
            </div>
            <p className="text-sm text-(--muted-foreground) mb-1">
              You are about to reject <span className="font-semibold text-(--foreground)">{rejectTarget.name}</span>
            </p>
            <p className="text-xs text-(--muted-foreground) mb-4 flex items-center gap-1.5">
              <FiClock className="text-[11px]" />
              Rejection time: {new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-(--foreground) mb-1">Reason (optional)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Provide a reason for rejection..."
                className="w-full bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setRejectTarget(null); setRejectReason(""); }} className="flex-1 bg-(--background) border border-(--border) text-(--foreground) rounded-xl py-2.5 text-sm font-medium hover:bg-(--border) transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={confirmReject} className="flex-1 bg-(--error) hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
                <FiX /> Reject
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setViewingDest(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-(--card) border border-(--border) rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-(--foreground)">{viewingDest.name}</h2>
              <button type="button" onClick={() => setViewingDest(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors cursor-pointer">
                <FiX className="text-lg" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-(--muted-foreground) w-24 shrink-0">Location:</span>
                <span className="text-(--foreground)">{viewingDest.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-(--muted-foreground) w-24 shrink-0">Category:</span>
                <span className="text-(--foreground)">{viewingDest.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-(--muted-foreground) w-24 shrink-0">Status:</span>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusBadge(viewingDest.status)}`}>{viewingDest.status}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-(--muted-foreground) w-24 shrink-0">Submitted by:</span>
                <span className="text-(--foreground)">{viewingDest.submittedBy}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-(--muted-foreground) w-24 shrink-0">Date:</span>
                <span className="text-(--foreground)">{viewingDest.date}</span>
              </div>
              {viewingDest.rejectedAt && (
                <div className="flex items-start gap-3">
                  <span className="text-(--muted-foreground) w-24 shrink-0">Rejected:</span>
                  <div className="text-(--foreground)">
                    <span className="text-(--error)">{viewingDest.rejectedAt}</span>
                    {viewingDest.rejectReason && <p className="text-xs text-(--muted-foreground) mt-0.5">Reason: {viewingDest.rejectReason}</p>}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-(--border)">
              {viewingDest.status === "Pending" && (
                <>
                  <button type="button" onClick={() => updateStatus(viewingDest.id, "Approved")} className="flex-1 bg-(--success) hover:bg-green-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <FiCheck /> Approve
                  </button>
                  <button type="button" onClick={() => setRejectTarget(viewingDest)} className="flex-1 bg-(--error) hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <FiX /> Reject
                  </button>
                </>
              )}
              {viewingDest.status === "Approved" && (
                <>
                  <button type="button" onClick={() => updateStatus(viewingDest.id, "Pending")} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <FiClock /> Send to Review
                  </button>
                  <button type="button" onClick={() => setRejectTarget(viewingDest)} className="flex-1 bg-(--error) hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <FiX /> Reject
                  </button>
                </>
              )}
              {viewingDest.status === "Rejected" && (
                <>
                  <button type="button" onClick={() => updateStatus(viewingDest.id, "Approved")} className="flex-1 bg-(--success) hover:bg-green-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <FiCheck /> Approve
                  </button>
                  <button type="button" onClick={() => updateStatus(viewingDest.id, "Pending")} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <FiClock /> Send to Review
                  </button>
                </>
              )}
              <button type="button" onClick={() => setDeleteTarget(viewingDest)} className={`flex-1 bg-(--background) border border-(--border) text-(--error) rounded-xl py-2.5 text-sm font-medium hover:bg-(--error)/10 transition-colors cursor-pointer flex items-center justify-center gap-2`}>
                <FiTrash2 /> Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
