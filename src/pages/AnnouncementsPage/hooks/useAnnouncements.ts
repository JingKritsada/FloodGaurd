import { useEffect, useState } from "react";

import type { Announcement } from "@/interfaces/incidents.interfaces";
import { announcementsService } from "@/services/announcements.service";
import { useAuth } from "@/providers/AuthContext";

export function useAnnouncements() {
	const { username } = useAuth();
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		announcementsService
			.fetchAnnouncements()
			.then(setAnnouncements)
			.catch((e: unknown) => setError(String(e)))
			.finally(() => setLoading(false));
	}, []);

	const handleCreate = async (data: Partial<Announcement>) => {
		const created = await announcementsService.createAnnouncement({ ...data, createdBy: username ?? "admin" });
		setAnnouncements((prev) => [...prev, created]);
	};

	const handleUpdate = async (id: string, data: Partial<Announcement>) => {
		const updated = await announcementsService.updateAnnouncement(id, data);
		setAnnouncements((prev) => prev.map((a) => (a.id === id ? updated : a)));
	};

	const handleDelete = async (id: string) => {
		await announcementsService.deleteAnnouncement(id);
		setAnnouncements((prev) => prev.filter((a) => a.id !== id));
	};

	return { announcements, loading, error, handleCreate, handleUpdate, handleDelete };
}
