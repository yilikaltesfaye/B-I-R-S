import { Link, useLocation } from "react-router";

const Navbar = () => {
	const location = useLocation();

	const navItems = [
		{ path: "/feed", label: "Feed" },
		{ path: "/reports", label: "Reports" },
		{ path: "/report/new", label: "➕" }, // Center FAB
		{ path: "/activity", label: "Activity" },
		{ path: "/settings", label: "Settings" },
	];

	return (
		<nav
			style={{
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
				display: "flex",
				justifyContent: "space-around",
				padding: "1rem 0",
				backgroundColor: "#f8f8f8",
				borderTop: "1px solid #ddd",
				zIndex: 10,
			}}
		>
			{navItems.map((item, index) => (
				<Link
					key={item.path || index}
					to={item.path}
					style={{
						textDecoration: "none",
						color: location.pathname === item.path ? "blue" : "black",
						fontWeight: item.label === "➕" ? "bold" : "normal",
						fontSize: item.label === "➕" ? "2rem" : "1rem",
						marginTop: item.label === "➕" ? "-1rem" : "0",
					}}
				>
					{item.label}
				</Link>
			))}
		</nav>
	);
};

export default Navbar;
