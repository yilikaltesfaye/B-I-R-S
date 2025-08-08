import { useEffect } from "react";
import { useNavigate } from "react-router";

const ReportPage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		// Authority users should use ReportDetail or Dashboard
		navigate("/dashboard", { replace: true });
	}, [navigate]);

	return null;
};

export default ReportPage;
