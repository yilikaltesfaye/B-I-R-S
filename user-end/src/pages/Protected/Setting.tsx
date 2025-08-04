// src/pages/Protected/setting.tsx

import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router";

export default function SettingPage() {
	const { user } = useAuth();

	return (
		<div className="max-w-xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-semibold">Settings</h1>

			{/* User Info */}
			<div className="border rounded p-4">
				<p className="font-medium">Name: {user?.name}</p>
				<p>Email: {user?.email}</p>
				<p>Role: {user?.role}</p>
			</div>

			<Link to="/logout">
				<button className="text-red-600 underline mt-6 block">Log out</button>
			</Link>
		</div>
	);
}
