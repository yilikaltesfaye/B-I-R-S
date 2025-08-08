import { Link, useLocation } from "react-router";
import { FaHome, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
	const location = useLocation();
	const { logout } = useAuth();

	const navItems = [
		{
			path: "/dashboard",
			label: "Dashboard",
			icon: <FaHome className="text-3xl" />,
		},
		{
			path: "/analytics",
			label: "Analytics",
			icon: <FaChartBar className="text-3xl" />,
		},
		{
			path: "/settings",
			label: "Settings",
			icon: <FaCog className="text-3xl" />,
		},
	];

	const handleLogout = () => {
		logout();
	};

	return (
		<nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-slate-50 border-t z-50 h-16 px-2 sm:px-4 shadow-sm">
			{navItems.map((item, index) => {
				const isActive = location.pathname === item.path;

				return (
					<Link
						key={index}
						to={item.path}
						className={`flex flex-col items-center justify-center text-md ${
							isActive ? "text-blue-600 font-semibold" : "text-slate-600"
						}`}
					>
						{item.icon}
						{item.label && (
							<span className="hidden sm:block mt-1 text-xs">{item.label}</span>
						)}
					</Link>
				);
			})}
			<button
				onClick={handleLogout}
				className="flex flex-col items-center justify-center text-md text-slate-600 hover:text-red-600"
			>
				<FaSignOutAlt className="text-3xl" />
				<span className="hidden sm:block mt-1 text-xs">Logout</span>
			</button>
		</nav>
	);
};

export default Navbar;
