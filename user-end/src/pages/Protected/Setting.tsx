// src/pages/Protected/setting.tsx

import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";

export default function SettingPage() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const settings = [
		{ label: "Notifications", value: true },
		{ label: "Dark Mode", value: false },
	];

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<div className="max-w-xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-semibold">Settings</h1>

			{/* User Info */}
			<div className="border rounded p-4">
				<p className="font-medium">Name: {user?.name}</p>
				<p>Email: {user?.email}</p>
				<p>Role: {user?.role}</p>
			</div>

			{/* Settings List */}
			<div className="space-y-4">
				{settings.map((s) => (
					<div
						key={s.label}
						className="flex items-center justify-between border-b py-2"
					>
						<span>{s.label}</span>
						<span>{s.value ? "On" : "Off"}</span>
					</div>
				))}
			</div>

			{/* Logout Button */}
			<button
				onClick={handleLogout}
				className="text-red-600 underline mt-6 block"
			>
				Log out
			</button>
		</div>
	);
}
