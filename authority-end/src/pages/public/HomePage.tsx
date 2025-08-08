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
		<main className="relative flex flex-col gap-40 items-center justify-center h-screen text-slate-50 ">
			{/* <main className="relative flex flex-col gap-40 items-center justify-center h-screen"> */}
			<img
				src={"/images/splashScreen.png"}
				alt="Splash"
				className=" absolute bg-black inset-0 -z-40 w-full h-full object-cover 2xl:object-cover"
			/>
			<header className="flex flex-col items-center">
				<h1 className="text-6xl">BIRS</h1>
				<p className="p-10 text-center text-xl italic font-extrabold">
					Report and Make Your City Better than Before
				</p>
			</header>

			<section className="flex flex-col gap-5 items-center">
				<Link to="/register">
					<button className="btn text-2xl cursor-pointer">Report Now</button>
				</Link>
				<p className="text-center italic font-extrabold">
					Already have an account?{" "}
					<Link to="/login" className="hover:underline cursor-pointer">
						Log In
					</Link>
				</p>
			</section>
		</main>
	);
};

export default HomePage;
