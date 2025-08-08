import { useEffect } from "react";
import { useNavigate } from "react-router";

const MyReportsPage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		// Authority users should use the Dashboard instead
		navigate("/dashboard", { replace: true });
	}, [navigate]);

	return null;
};

export default MyReportsPage;
