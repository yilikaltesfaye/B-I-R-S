// import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FaUser } from "react-icons/fa";

const SettingsPage = () => {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Settings</h1>
				<p className="text-gray-600 mt-2">
					Manage your account settings and system preferences
				</p>
			</div>

			{/* Settings Sections */}
			<div className="space-y-6">
				<ProfileSettings />
				{/* <SecuritySettings /> */}
				{/* <NotificationSettings /> */}
				{/* <SystemSettings /> */}
			</div>
		</div>
	);
};

export default SettingsPage;
const SettingsSection = ({
	icon,
	title,
	children,
}: {
	icon: React.ReactNode;
	title: string;
	children: React.ReactNode;
}) => (
	<div className="admin-card">
		<div className="flex items-center mb-4">
			<div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
			<h3 className="text-lg font-semibold text-gray-900 ml-3">{title}</h3>
		</div>
		{children}
	</div>
);

const ProfileSettings = () => {
	const { user } = useAuth();
	// const [isEditing, setIsEditing] = useState(false);
	// const [formData, setFormData] = useState({
	// 	name: user?.name || "",
	// 	email: user?.email || "",
	// 	phone: user?.phone || "",
	// });

	// const handleSave = () => {
	// 	console.log("Save profile:", formData);
	// 	setIsEditing(false);
	// };

	return (
		<SettingsSection
			icon={<FaUser className="text-blue-600" />}
			title="Profile Information"
		>
			<div className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Full Name
						</label>
						<input
							type="text"
							value={user?.name}
							// onChange={(e) =>
							// 	setFormData((prev) => ({ ...prev, name: e.target.value }))
							// }
							// disabled={!isEditing}
							disabled
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email Address
						</label>
						<input
							type="email"
							value={user?.email}
							// onChange={(e) =>
							// 	setFormData((prev) => ({ ...prev, email: e.target.value }))
							// }
							// disabled={!isEditing}
							disabled
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Phone Number
						</label>
						<input
							type="tel"
							value={user?.phone}
							// onChange={(e) =>
							// 	setFormData((prev) => ({ ...prev, phone: e.target.value }))
							// }
							// disabled={!isEditing}
							disabled
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Role
						</label>
						<input
							type="text"
							value={user?.role || "ADMIN"}
							disabled
							className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
						/>
					</div>
				</div>
				{/* <div className="flex justify-end space-x-3">
					{isEditing ? (
						<>
							<button
								onClick={() => setIsEditing(false)}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
							>
								Save Changes
							</button>
						</>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
						>
							Edit Profile
						</button>
					)}
				</div> */}
			</div>
		</SettingsSection>
	);
};

// const NotificationSettings = () => {
// 	const [notifications, setNotifications] = useState({
// 		emailReports: true,
// 		emailUsers: false,
// 		pushNotifications: true,
// 		weeklyDigest: true,
// 	});

// 	const handleToggle = (key: keyof typeof notifications) => {
// 		setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
// 	};

// 	return (
// 		<SettingsSection
// 			icon={<FaBell className="text-blue-600" />}
// 			title="Notification Preferences"
// 		>
// 			<div className="space-y-4">
// 				<div className="flex items-center justify-between">
// 					<div>
// 						<h4 className="text-sm font-medium text-gray-900">
// 							New Report Notifications
// 						</h4>
// 						<p className="text-xs text-gray-500">
// 							Receive email notifications for new reports
// 						</p>
// 					</div>
// 					<button
// 						onClick={() => handleToggle("emailReports")}
// 						className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
// 							notifications.emailReports ? "bg-blue-600" : "bg-gray-200"
// 						}`}
// 					>
// 						<span
// 							className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
// 								notifications.emailReports ? "translate-x-6" : "translate-x-1"
// 							}`}
// 						/>
// 					</button>
// 				</div>
// 				<div className="flex items-center justify-between">
// 					<div>
// 						<h4 className="text-sm font-medium text-gray-900">
// 							User Registration Notifications
// 						</h4>
// 						<p className="text-xs text-gray-500">
// 							Receive email notifications for new user registrations
// 						</p>
// 					</div>
// 					<button
// 						onClick={() => handleToggle("emailUsers")}
// 						className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
// 							notifications.emailUsers ? "bg-blue-600" : "bg-gray-200"
// 						}`}
// 					>
// 						<span
// 							className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
// 								notifications.emailUsers ? "translate-x-6" : "translate-x-1"
// 							}`}
// 						/>
// 					</button>
// 				</div>
// 				<div className="flex items-center justify-between">
// 					<div>
// 						<h4 className="text-sm font-medium text-gray-900">
// 							Push Notifications
// 						</h4>
// 						<p className="text-xs text-gray-500">
// 							Receive browser push notifications for urgent issues
// 						</p>
// 					</div>
// 					<button
// 						onClick={() => handleToggle("pushNotifications")}
// 						className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
// 							notifications.pushNotifications ? "bg-blue-600" : "bg-gray-200"
// 						}`}
// 					>
// 						<span
// 							className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
// 								notifications.pushNotifications
// 									? "translate-x-6"
// 									: "translate-x-1"
// 							}`}
// 						/>
// 					</button>
// 				</div>
// 				<div className="flex items-center justify-between">
// 					<div>
// 						<h4 className="text-sm font-medium text-gray-900">Weekly Digest</h4>
// 						<p className="text-xs text-gray-500">
// 							Receive a weekly summary of system activity
// 						</p>
// 					</div>
// 					<button
// 						onClick={() => handleToggle("weeklyDigest")}
// 						className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
// 							notifications.weeklyDigest ? "bg-blue-600" : "bg-gray-200"
// 						}`}
// 					>
// 						<span
// 							className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
// 								notifications.weeklyDigest ? "translate-x-6" : "translate-x-1"
// 							}`}
// 						/>
// 					</button>
// 				</div>
// 			</div>
// 		</SettingsSection>
// 	);
// };

// const SystemSettings = () => {
// 	return (
// 		<SettingsSection
// 			icon={<FaDatabase className="text-blue-600" />}
// 			title="System Configuration"
// 		>
// 			<div className="space-y-4">
// 				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 					<div className="admin-card bg-gray-50">
// 						<h4 className="text-sm font-medium text-gray-900 mb-2">
// 							Database Status
// 						</h4>
// 						<div className="flex items-center">
// 							<div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
// 							<span className="text-sm text-gray-600">Connected</span>
// 						</div>
// 					</div>
// 					<div className="admin-card bg-gray-50">
// 						<h4 className="text-sm font-medium text-gray-900 mb-2">
// 							System Version
// 						</h4>
// 						<span className="text-sm text-gray-600">BIRS Admin v1.0.0</span>
// 					</div>
// 				</div>
// 				<div className="admin-card bg-gray-50">
// 					<h4 className="text-sm font-medium text-gray-900 mb-2">
// 						Last Backup
// 					</h4>
// 					<span className="text-sm text-gray-600">
// 						January 15, 2024 at 3:00 AM
// 					</span>
// 				</div>
// 			</div>
// 		</SettingsSection>
// 	);
// };

// const SecuritySettings = () => {
// 	const [passwordData, setPasswordData] = useState({
// 		currentPassword: "",
// 		newPassword: "",
// 		confirmPassword: ""
// 	});

// 	const handlePasswordChange = () => {
// 		console.log("Change password:", passwordData);
// 		setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
// 	};

// 	return (
// 		<SettingsSection icon={<FaLock className="text-blue-600" />} title="Security Settings">
// 			<div className="space-y-4">
// 				<div>
// 					<label className="block text-sm font-medium text-gray-700 mb-1">
// 						Current Password
// 					</label>
// 					<input
// 						type="password"
// 						value={passwordData.currentPassword}
// 						onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
// 						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
// 						placeholder="Enter current password"
// 					/>
// 				</div>
// 				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 					<div>
// 						<label className="block text-sm font-medium text-gray-700 mb-1">
// 							New Password
// 						</label>
// 						<input
// 							type="password"
// 							value={passwordData.newPassword}
// 							onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
// 							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
// 							placeholder="Enter new password"
// 						/>
// 					</div>
// 					<div>
// 						<label className="block text-sm font-medium text-gray-700 mb-1">
// 							Confirm New Password
// 						</label>
// 						<input
// 							type="password"
// 							value={passwordData.confirmPassword}
// 							onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
// 							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
// 							placeholder="Confirm new password"
// 						/>
// 					</div>
// 				</div>
// 				<div className="flex justify-end">
// 					<button
// 						onClick={handlePasswordChange}
// 						className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
// 					>
// 						Update Password
// 					</button>
// 				</div>
// 			</div>
// 		</SettingsSection>
// 	);
// };
