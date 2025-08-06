// src/pages/Protected/setting.tsx

import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router";

export default function SettingPage() {
	const { user } = useAuth();

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-2xl cursive font-semibold">Setting</h1>

			<div className="border rounded p-4 w-fit space-y-1 text-base ">
				{user?.name && (
					<p>
						<strong>Name:</strong> {user.name}
					</p>
				)}
				{user?.phone && (
					<p>
						<strong>Phone Number:</strong> {user.phone}
					</p>
				)}
				{user?.email && (
					<p>
						<strong>Email:</strong> {user.email}
					</p>
				)}
				{user?.role && (
					<p>
						<strong>Role:</strong> {user.role}
					</p>
				)}
				{user?.createdAt && (
					<p>
						<strong>Joined:</strong>{" "}
						{new Date(user.createdAt).toLocaleString("en-US", {
							weekday: "long",
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				)}

				{user?.address && (
					<div className="pt-2 space-y-1">
						<p className="font-extrabold text-lg">Address</p>
						{user.address.region && (
							<p>
								<strong>Region:</strong> {user.address.region}
							</p>
						)}
						{user.address.zone && (
							<p>
								<strong>Zone:</strong> {user.address.zone}
							</p>
						)}
						{user.address.woreda && (
							<p>
								<strong>Woreda:</strong> {user.address.woreda}
							</p>
						)}
						{user.address.city && (
							<p>
								<strong>City:</strong> {user.address.city}
							</p>
						)}
						{user.address.subCity && (
							<p>
								<strong>Sub-City:</strong> {user.address.subCity}
							</p>
						)}
						{user.address.kebele && (
							<p>
								<strong>Kebele:</strong> {user.address.kebele}
							</p>
						)}
					</div>
				)}
			</div>

			<Link to="/logout">
				<button className="text-red-600 btn cursor-pointer">Log out</button>
			</Link>
		</div>
	);
}
