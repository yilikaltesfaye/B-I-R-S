import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function LogoutPage() {
	const { logout } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		logout().finally(() => {
			navigate("/", { replace: true });
		});
	}, []);

	return null;
}
