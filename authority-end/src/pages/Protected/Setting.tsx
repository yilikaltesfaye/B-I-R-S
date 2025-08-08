import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
	FiUser,
	FiSave,
	FiEdit3,
	FiPhone,
	FiMail,
	FiMapPin,
	FiShield,
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

import { toast } from "react-hot-toast";

const Setting = () => {
	const { authority, authorityOffice } = useAuth();
	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [profileForm, setProfileForm] = useState({
		name: authority?.name || "",
		email: authority?.email || "",
		phone: authority?.phone || "",
	});

	const handleProfileSave = () => {
		// TODO: Implement profile update API call
		toast.success("Profile updated successfully!");
		setIsEditingProfile(false);
	};

	const handleProfileChange = (field: string, value: string) => {
		setProfileForm((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto p-6">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
					<p className="text-gray-600">
						Manage your account and authority office settings
					</p>
				</div>

				<div className="space-y-6">
					{/* Profile Settings */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						<div className="p-6 border-b border-gray-200">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<div className="bg-blue-100 p-2 rounded-lg">
										<FiUser className="h-5 w-5 text-blue-600" />
									</div>
									<div>
										<h2 className="text-lg font-semibold text-gray-900">
											Profile Information
										</h2>
										<p className="text-sm text-gray-600">
											Update your personal information
										</p>
									</div>
								</div>
								<button
									onClick={() => setIsEditingProfile(!isEditingProfile)}
									className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
								>
									<FiEdit3 className="h-4 w-4" />
									<span>{isEditingProfile ? "Cancel" : "Edit"}</span>
								</button>
							</div>
						</div>
						<div className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Full Name
									</label>
									{isEditingProfile ? (
										<input
											type="text"
											value={profileForm.name}
											onChange={(e) =>
												handleProfileChange("name", e.target.value)
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									) : (
										<div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
											<FiUser className="h-4 w-4 text-gray-400" />
											<span>{authority?.name}</span>
										</div>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Phone Number
									</label>
									{isEditingProfile ? (
										<input
											type="tel"
											value={profileForm.phone}
											onChange={(e) =>
												handleProfileChange("phone", e.target.value)
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									) : (
										<div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
											<FiPhone className="h-4 w-4 text-gray-400" />
											<span>{authority?.phone}</span>
										</div>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Email Address
									</label>
									{isEditingProfile ? (
										<input
											type="email"
											value={profileForm.email}
											onChange={(e) =>
												handleProfileChange("email", e.target.value)
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
										/>
									) : (
										<div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
											<FiMail className="h-4 w-4 text-gray-400" />
											<span>{authority?.email || "Not provided"}</span>
										</div>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Role
									</label>
									<div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
										<FiShield className="h-4 w-4 text-gray-400" />
										<span>{authority?.role}</span>
									</div>
								</div>
							</div>
							{isEditingProfile && (
								<div className="mt-6 flex justify-end">
									<button
										onClick={handleProfileSave}
										className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
									>
										<FiSave className="h-4 w-4" />
										<span>Save Changes</span>
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Authority Office Information */}
					{authorityOffice && (
						<div className="bg-white rounded-lg shadow-sm border border-gray-200">
							<div className="p-6 border-b border-gray-200">
								<div className="flex items-center space-x-3">
									<div className="bg-green-100 p-2 rounded-lg">
										<FaBuilding className="h-5 w-5 text-green-600" />
									</div>
									<div>
										<h2 className="text-lg font-semibold text-gray-900">
											Authority Office
										</h2>
										<p className="text-sm text-gray-600">
											Your office information
										</p>
									</div>
								</div>
							</div>
							<div className="p-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Office Name
										</label>
										<div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
											<FaBuilding className="h-4 w-4 text-gray-400" />
											<span>{authorityOffice.authorityOffice.officeName}</span>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Position
										</label>
										<div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
											<FiUser className="h-4 w-4 text-gray-400" />
											<span>{authorityOffice.position}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Address Information */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						<div className="p-6 border-b border-gray-200">
							<div className="flex items-center space-x-3">
								<div className="bg-purple-100 p-2 rounded-lg">
									<FiMapPin className="h-5 w-5 text-purple-600" />
								</div>
								<div>
									<h2 className="text-lg font-semibold text-gray-900">
										Address Information
									</h2>
									<p className="text-sm text-gray-600">
										Your registered address
									</p>
								</div>
							</div>
						</div>
						<div className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Region
									</label>
									<div className="p-2 bg-gray-50 rounded-lg">
										<span>{authority?.address?.region}</span>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										City
									</label>
									<div className="p-2 bg-gray-50 rounded-lg">
										<span>{authority?.address?.city}</span>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Zone
									</label>
									<div className="p-2 bg-gray-50 rounded-lg">
										<span>{authority?.address?.zone || "Not specified"}</span>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Woreda
									</label>
									<div className="p-2 bg-gray-50 rounded-lg">
										<span>{authority?.address?.woreda || "Not specified"}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Security Settings */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						<div className="p-6 border-b border-gray-200">
							<div className="flex items-center space-x-3">
								<div className="bg-red-100 p-2 rounded-lg">
									<FiShield className="h-5 w-5 text-red-600" />
								</div>
								<div>
									<h2 className="text-lg font-semibold text-gray-900">
										Security
									</h2>
									<p className="text-sm text-gray-600">
										Manage your account security
									</p>
								</div>
							</div>
						</div>
						<div className="p-6">
							<div className="space-y-4">
								<button className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
									Change Password
								</button>
								<div className="text-sm text-gray-600">
									<p>Last password change: Never</p>
								</div>
							</div>
						</div>
					</div>

					{/* Account Status */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200">
						<div className="p-6 border-b border-gray-200">
							<div className="flex items-center space-x-3">
								<div className="bg-gray-100 p-2 rounded-lg">
									<FiUser className="h-5 w-5 text-gray-600" />
								</div>
								<div>
									<h2 className="text-lg font-semibold text-gray-900">
										Account Status
									</h2>
									<p className="text-sm text-gray-600">
										Your account information
									</p>
								</div>
							</div>
						</div>
						<div className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Account Status
									</label>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<span className="text-sm text-green-600">Active</span>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Member Since
									</label>
									<div className="text-sm text-gray-600">
										{authority?.createdAt
											? new Date(authority.createdAt).toLocaleDateString()
											: "N/A"}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Setting;
