import { useEffect } from "react";
import { useNavigate } from "react-router";

const Activity = () => {
	const navigate = useNavigate();

	useEffect(() => {
		// Authority users should use Analytics instead of Activity
		navigate("/analytics", { replace: true });
	}, [navigate]);

	return null;
};

export default Activity;
