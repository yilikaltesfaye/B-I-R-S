import { Link, useLocation } from "react-router";
import { FaHome, FaFileAlt, FaPlusCircle, FaBell, FaCog } from "react-icons/fa";

const Navbar = () => {
	const location = useLocation();

	const navItems = [
		{ path: "/feed", label: "Feed", icon: <FaHome className="text-3xl" /> },
		{
			path: "/reports",
			label: "Reports",
			icon: <FaFileAlt className="text-3xl" />,
		},
		{
			path: "/report/new",
			label: "",
			icon: <FaPlusCircle className="text-4xl text-slate-950" />,
		},
		{
			path: "/activity",
			label: "Activity",
			icon: <FaBell className="text-3xl" />,
		},
		{
			path: "/settings",
			label: "Settings",
			icon: <FaCog className="text-3xl" />,
		},
	];

	return (
		<nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-slate-50 border-t z-50 h-16 px-2 sm:px-4 shadow-sm">
			{navItems.map((item, index) => {
				const isActive = location.pathname === item.path;
				const isPlus = item.path === "/report/new";

				return (
					<Link
						key={index}
						to={item.path}
						className={`flex flex-col items-center justify-center text-md ${
							isActive ? "text-950-400 font-semibold" : "text-slate-600"
						} ${isPlus ? "relative -top-3" : ""}`}
					>
						{item.icon}
						{item.label && (
							<span className="hidden sm:block mt-1">{item.label}</span>
						)}
					</Link>
				);
			})}
		</nav>
	);
};

export default Navbar;
