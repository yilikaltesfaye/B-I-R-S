import { Link, Navigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (user) {
		return <Navigate to="/feed" />;
	}

	return (
		<main>
			<header>
				<h1>BIRS</h1>
				<p>Report and Make Your City Better than Before</p>
			</header>

			<section>
				<Link to="/register">
					<button>Report Now</button>
				</Link>
				<p>
					Already have an account? <Link to="/login">Log In</Link>
				</p>
			</section>
		</main>
	);
};

export default HomePage;
