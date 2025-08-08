import { useEffect } from "react";
import { useNavigate } from "react-router";

const CreateReportPage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		// Authority users don't create reports - they manage existing ones
		navigate("/dashboard", { replace: true });
	}, [navigate]);

	return null;
};

export default CreateReportPage;
