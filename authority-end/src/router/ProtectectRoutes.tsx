import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import Header from "@/common/Header";
import Navbar from "@/common/Navbar";

const ProtectectRoutes = () => {
	const { authority, isLoading } = useAuth();
	const location = useLocation();
	const hasToasted = useRef(false);

	useEffect(() => {
		if (
			isLoading &&
			!authority &&
			location.state?.from !== "redirected" &&
			!hasToasted.current
		) {
			toast("You need to login first", {
				icon: "❌",
				style: {
					borderRadius: "10px",
					background: "#333",
					color: "#fff",
				},
			});
			hasToasted.current = true;
		}
	}, [authority, location]);

	if (!authority) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return (
		<>
			<Header />
			<div className="mb-16">
				<Outlet />
			</div>
			<Navbar />
		</>
	);
};

export default ProtectectRoutes;
