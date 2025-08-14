import { Link, useLocation } from "react-router";
import {
	FaHome,
	FaUsers,
	FaBuilding,
	FaClipboardList,
	FaTags,
	FaCog,
	FaSignOutAlt,
	FaTimes,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
	const location = useLocation();
	const { logout, user } = useAuth();

	const navItems = [
		{
			path: "/dashboard",
			label: "Dashboard",
			icon: <FaHome className="text-lg" />,
		},
		{
			path: "/users",
			label: "Users",
			icon: <FaUsers className="text-lg" />,
		},
		{
			path: "/authorities",
			label: "Authorities",
			icon: <FaBuilding className="text-lg" />,
		},
		{
			path: "/reports",
			label: "Reports",
			icon: <FaClipboardList className="text-lg" />,
		},
		{
			path: "/categories",
			label: "Categories",
			icon: <FaTags className="text-lg" />,
		},
		{
			path: "/settings",
			label: "Settings",
			icon: <FaCog className="text-lg" />,
		},
	];

	const handleLogout = () => {
		logout();
	};

	return (
		<>
			{/* Sidebar */}
			<div className="w-fit whitespace-nowrap">
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-gray-200">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">A</span>
							</div>
							<div>
								<h2 className="font-bold text-gray-900">Admin Panel</h2>
								<p className="text-xs text-gray-500">BIRS Admin</p>
							</div>
						</div>
						<button className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
							<FaTimes className="text-lg" />
						</button>
					</div>

					{/* User Info */}
					<div className="p-6 border-b border-gray-200">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
								<span className="text-gray-600 font-medium text-sm">
									{user?.name?.charAt(0).toUpperCase() || "A"}
								</span>
							</div>
							<div>
								<p className="font-medium text-gray-900">
									{user?.name || "Admin"}
								</p>
								<p className="text-xs text-gray-500">{user?.role || "ADMIN"}</p>
							</div>
						</div>
					</div>

					{/* Navigation */}
					<nav className="flex-1 p-6">
						<ul className="space-y-2">
							{navItems.map((item, index) => {
								const isActive = location.pathname === item.path;

								return (
									<li key={index}>
										<Link
											to={item.path}
											className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
												isActive
													? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
													: "text-gray-700 hover:bg-gray-100"
											}`}
										>
											{item.icon}
											<span className="font-medium">{item.label}</span>
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>

					{/* Logout */}
					<div className="p-6 border-t border-gray-200">
						<button
							onClick={handleLogout}
							className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
						>
							<FaSignOutAlt className="text-lg" />
							<span className="font-medium">Logout</span>
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
