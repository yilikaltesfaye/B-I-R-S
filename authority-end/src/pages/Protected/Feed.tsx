import { useEffect } from "react";
import { useNavigate } from "react-router";

const Feed = () => {
	const navigate = useNavigate();

	useEffect(() => {
		// Authority users should use the Dashboard instead of Feed
		navigate("/dashboard", { replace: true });
	}, [navigate]);

	return null;
};

export default Feed;
