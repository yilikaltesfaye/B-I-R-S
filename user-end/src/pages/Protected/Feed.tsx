import { useAuth } from "@/contexts/AuthContext";

const Feed = () => {
	const { logout } = useAuth();
	return (
		<div>
			hello login
			<button onClick={logout}>Logout</button>
		</div>
	);
};

export default Feed;
