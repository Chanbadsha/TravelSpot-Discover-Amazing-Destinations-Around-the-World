"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

export type SpotStatus = "pending" | "verified" | "cancelled";
export type SaveStatus = "wantToVisit" | "visited";

export interface Destination {
  id: string;
  name: string;
  location: string;
  category: string;
  description: string;
  facilities: string[];
  status: SpotStatus;
  userId: string;
  submittedBy: string;
  image: string;
  rating: number;
  reviews: number;
  createdAt: string;
}

export interface SavedDestination {
  destinationId: string;
  status: SaveStatus;
  savedAt: string;
}

export interface SavedCounts {
  total: number;
  visited: number;
  wantToVisit: number;
}

interface DestinationContextType {
  destinations: Destination[];
  addDestination: (dest: Omit<Destination, "id" | "status" | "rating" | "reviews" | "createdAt">) => void;
  updateDestination: (id: string, updates: Partial<Destination>) => void;
  deleteDestination: (id: string) => void;
  getUserDestinations: (userId: string) => Destination[];
  getDestinationById: (id: string) => Destination | undefined;
  savedDestinations: Record<string, SavedDestination[]>;
  saveDestination: (userId: string, destinationId: string, status: SaveStatus) => void;
  removeSavedDestination: (userId: string, destinationId: string) => void;
  updateSavedStatus: (userId: string, destinationId: string, status: SaveStatus) => void;
  getUserSavedDestinations: (userId: string) => SavedDestination[];
  getUserSavedDestinationsWithData: (userId: string) => (SavedDestination & { destination: Destination | undefined })[];
  getSavedStatus: (userId: string, destinationId: string) => SaveStatus | null;
  getSavedCounts: (userId: string) => SavedCounts;
}

const DestinationContext = createContext<DestinationContextType | null>(null);

const seedData: Destination[] = [
  { id: "1", name: "Santorini Sunset Point", location: "Santorini, Greece", category: "beach", description: "Breathtaking sunset views over the Aegean Sea.", facilities: ["Parking", "Restrooms", "Photo Spots"], status: "verified", userId: "", submittedBy: "Alice J.", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop", rating: 4.8, reviews: 234, createdAt: "2026-01-15" },
  { id: "2", name: "Machu Picchu", location: "Cusco, Peru", category: "historical", description: "Ancient Incan citadel set high in the Andes.", facilities: ["Guided Tours", "Restrooms", "Cafe"], status: "verified", userId: "", submittedBy: "Bob S.", image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop", rating: 4.9, reviews: 567, createdAt: "2026-01-10" },
  { id: "3", name: "Northern Lights Deck", location: "Tromsø, Norway", category: "nature", description: "Prime northern lights viewing platform.", facilities: ["Heated Waiting Room", "Hot Drinks", "Parking"], status: "verified", userId: "", submittedBy: "Charlie B.", image: "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=400&h=300&fit=crop", rating: 4.7, reviews: 189, createdAt: "2026-01-05" },
  { id: "4", name: "Grand Canyon Skywalk", location: "Arizona, USA", category: "adventure", description: "Glass bridge over the Grand Canyon.", facilities: ["Parking", "Restrooms", "Gift Shop"], status: "verified", userId: "", submittedBy: "Diana R.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop", rating: 4.6, reviews: 412, createdAt: "2025-12-20" },
  { id: "5", name: "Tokyo Street Food Tour", location: "Tokyo, Japan", category: "food & wine", description: "Walk through the best street food alleys.", facilities: ["Guide", "Food Tasting"], status: "cancelled", userId: "", submittedBy: "Eve A.", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop", rating: 4.4, reviews: 98, createdAt: "2025-11-28" },
  { id: "6", name: "Bali Rice Terraces", location: "Ubud, Bali", category: "nature", description: "Lush green rice paddies and traditional farming.", facilities: ["Walking Trails", "Photo Spots", "Local Guide"], status: "verified", userId: "", submittedBy: "Frank M.", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop", rating: 4.8, reviews: 321, createdAt: "2025-11-15" },
  { id: "7", name: "Dubai Marina Walk", location: "Dubai, UAE", category: "urban", description: "Modern waterfront promenade with dining.", facilities: ["Restaurants", "Parking", "Bike Rental"], status: "verified", userId: "", submittedBy: "Grace L.", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop", rating: 4.5, reviews: 276, createdAt: "2025-10-20" },
  { id: "8", name: "Swiss Alps Hiking Trail", location: "Interlaken, Switzerland", category: "mountain", description: "Spectacular alpine hiking routes.", facilities: ["Mountain Huts", "Parking", "Maps"], status: "verified", userId: "", submittedBy: "Henry W.", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop", rating: 4.9, reviews: 445, createdAt: "2025-10-10" },
];

function loadSaved(): Record<string, SavedDestination[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("travelspot_saved");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistSaved(saved: Record<string, SavedDestination[]>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("travelspot_saved", JSON.stringify(saved));
  } catch { /* ignore quota errors */ }
}

export function DestinationProvider({ children }: { children: ReactNode }) {
  const [destinations, setDestinations] = useState<Destination[]>(seedData);
  const [savedDestinations, setSavedDestinations] = useState<Record<string, SavedDestination[]>>(loadSaved);

  const syncSaved = useCallback((updater: (prev: Record<string, SavedDestination[]>) => Record<string, SavedDestination[]>) => {
    setSavedDestinations((prev) => {
      const next = updater(prev);
      persistSaved(next);
      return next;
    });
  }, []);

  const addDestination = useCallback((dest: Omit<Destination, "id" | "status" | "rating" | "reviews" | "createdAt">) => {
    const newDest: Destination = {
      ...dest,
      id: Date.now().toString(),
      status: "pending",
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setDestinations((prev) => [newDest, ...prev]);
  }, []);

  const updateDestination = useCallback((id: string, updates: Partial<Destination>) => {
    setDestinations((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  }, []);

  const deleteDestination = useCallback((id: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
    syncSaved((prev) => {
      const next = { ...prev };
      for (const uid of Object.keys(next)) {
        next[uid] = next[uid].filter((s) => s.destinationId !== id);
      }
      return next;
    });
  }, [syncSaved]);

  const getUserDestinations = useCallback(
    (userId: string) => destinations.filter((d) => d.userId === userId),
    [destinations]
  );

  const getDestinationById = useCallback(
    (id: string) => destinations.find((d) => d.id === id),
    [destinations]
  );

  const saveDestination = useCallback((userId: string, destinationId: string, status: SaveStatus) => {
    syncSaved((prev) => {
      const userSaved = prev[userId] || [];
      const existing = userSaved.findIndex((s) => s.destinationId === destinationId);
      if (existing >= 0) {
        const updated = [...userSaved];
        updated[existing] = { ...updated[existing], status };
        return { ...prev, [userId]: updated };
      }
      return {
        ...prev,
        [userId]: [...userSaved, { destinationId, status, savedAt: new Date().toISOString().split("T")[0] }],
      };
    });
  }, [syncSaved]);

  const removeSavedDestination = useCallback((userId: string, destinationId: string) => {
    syncSaved((prev) => {
      const userSaved = (prev[userId] || []).filter((s) => s.destinationId !== destinationId);
      return { ...prev, [userId]: userSaved };
    });
  }, [syncSaved]);

  const updateSavedStatus = useCallback((userId: string, destinationId: string, status: SaveStatus) => {
    syncSaved((prev) => {
      const userSaved = (prev[userId] || []).map((s) =>
        s.destinationId === destinationId ? { ...s, status } : s
      );
      return { ...prev, [userId]: userSaved };
    });
  }, [syncSaved]);

  const getUserSavedDestinations = useCallback(
    (userId: string) => savedDestinations[userId] || [],
    [savedDestinations]
  );

  const getUserSavedDestinationsWithData = useCallback(
    (userId: string) => {
      const saved = savedDestinations[userId] || [];
      return saved.map((s) => ({
        ...s,
        destination: destinations.find((d) => d.id === s.destinationId),
      }));
    },
    [savedDestinations, destinations]
  );

  const getSavedStatus = useCallback(
    (userId: string, destinationId: string) => {
      const userSaved = savedDestinations[userId] || [];
      return userSaved.find((s) => s.destinationId === destinationId)?.status || null;
    },
    [savedDestinations]
  );

  const getSavedCounts = useCallback(
    (userId: string): SavedCounts => {
      const userSaved = savedDestinations[userId] || [];
      return {
        total: userSaved.length,
        visited: userSaved.filter((s) => s.status === "visited").length,
        wantToVisit: userSaved.filter((s) => s.status === "wantToVisit").length,
      };
    },
    [savedDestinations]
  );

  const value = useMemo(
    () => ({
      destinations, addDestination, updateDestination, deleteDestination,
      getUserDestinations, getDestinationById,
      savedDestinations, saveDestination, removeSavedDestination,
      updateSavedStatus, getUserSavedDestinations, getUserSavedDestinationsWithData,
      getSavedStatus, getSavedCounts,
    }),
    [destinations, addDestination, updateDestination, deleteDestination,
      getUserDestinations, getDestinationById,
      savedDestinations, saveDestination, removeSavedDestination,
      updateSavedStatus, getUserSavedDestinations, getUserSavedDestinationsWithData,
      getSavedStatus, getSavedCounts]
  );

  return (
    <DestinationContext.Provider value={value}>
      {children}
    </DestinationContext.Provider>
  );
}

export function useDestinations() {
  const ctx = useContext(DestinationContext);
  if (!ctx) throw new Error("useDestinations must be used within DestinationProvider");
  return ctx;
}
