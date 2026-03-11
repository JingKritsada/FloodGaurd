import type { Announcement } from "@/interfaces/incidents.interfaces";

import api from "./api";

function mapAnnouncement(raw: Record<string, unknown>): Announcement {
  return {
    id: String(raw._id ?? raw.id),
    title: String(raw.title ?? ""),
    content: String(raw.content ?? ""),
    priority: (raw.priority as Announcement["priority"]) ?? "MEDIUM",
    image: raw.image as string | undefined,
    isPublished: Boolean(raw.isPublished),
    createdBy: String(raw.createdBy ?? ""),
    publishedAt: raw.publishedAt as string | undefined,
    createdAt: String(raw.createdAt ?? ""),
    updatedAt: String(raw.updatedAt ?? ""),
  };
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const res = await api.get("/announcements");
  return ((res as unknown[]) || []).map((a) => mapAnnouncement(a as Record<string, unknown>));
}

export async function createAnnouncement(data: Partial<Announcement> & { createdBy?: string }): Promise<Announcement> {
  const res = await api.post("/announcements", data);
  return mapAnnouncement(res as Record<string, unknown>);
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>): Promise<Announcement> {
  const res = await api.patch(`/announcements/${id}`, data);
  return mapAnnouncement(res as Record<string, unknown>);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await api.delete(`/announcements/${id}`);
}

export const announcementsService = {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
export default announcementsService;
