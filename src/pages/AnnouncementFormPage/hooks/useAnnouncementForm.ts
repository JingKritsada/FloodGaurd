import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Announcement } from "@/interfaces/incidents.interfaces";
import { announcementsService } from "@/services/announcements.service";
import { useAuth } from "@/providers/AuthContext";

export function useAnnouncementForm() {
	const { id } = useParams<{ id: string }>();
	const { username } = useAuth();
	const navigate = useNavigate();
	const isEdit = !!id;

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [priority, setPriority] = useState<Announcement["priority"]>("MEDIUM");
	const [image, setImage] = useState("");
	const [isPublished, setIsPublished] = useState(false);
	const [loading, setLoading] = useState(isEdit);

	useEffect(() => {
		if (!id) return;
		announcementsService.fetchAnnouncements().then((list) => {
			const found = list.find((a) => a.id === id);
			if (found) {
				setTitle(found.title);
				setContent(found.content);
				setPriority(found.priority);
				setImage(found.image ?? "");
				setIsPublished(found.isPublished);
			}
		}).catch(console.error).finally(() => setLoading(false));
	}, [id]);

	const handleSubmit = async () => {
		if (!title.trim() || !content.trim()) return;
		const data: Partial<Announcement> = { title, content, priority, image: image || undefined, isPublished };
		try {
			if (isEdit && id) {
				await announcementsService.updateAnnouncement(id, data);
			} else {
				await announcementsService.createAnnouncement({ ...data, createdBy: username ?? "admin" });
			}
			navigate("/announcements");
		} catch (e) {
			console.error(e);
		}
	};

	const handleCancel = () => navigate("/announcements");

	return {
		isEdit, loading,
		title, setTitle,
		content, setContent,
		priority, setPriority,
		image, setImage,
		isPublished, setIsPublished,
		handleSubmit, handleCancel,
	};
}
