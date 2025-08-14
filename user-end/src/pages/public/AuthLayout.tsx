import type React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router";

const AuthLayout = ({
	children,
	AuthPage,
}: {
	children: React.ReactNode;
	AuthPage: string;
}) => {
	return (
		// <div className="relative flex flex-col gap-16 h-screen justify-center text-slate-50">
		<div className="relative flex flex-col gap-16 h-screen justify-center">
			{/* <img
				src={"/images/splashScreen.png"}
				alt="Splash"
				className=" absolute bg-black inset-0 -z-40 w-full h-full object-cover 2xl:object-cover"
			/> */}
			<Link to="/" className="z-20 w-fit mt-5 ml-4 absolute top-0">
				<p className="flex flex-row gap-2 items-center  italic font-extrabold border-2 rounded-2xl py-1 px-3 hover:bg-slate-950 hover:text-slate-50 hover:border-slate-50 transition ease-in-out">
					<FaArrowLeft />
					<span className="hidden lg:block">Back to </span>Home
				</p>
			</Link>
			<div className="relative top-9 sm:top-0 sm:mt-0 flex flex-col justify-between items-center border-l-2 border-r-2 border-t-2  rounded-2xl w-full sm:w-fit self-center shadow-2xl px-6 sm:px-24 py-1 lg:py-5 xl:py-10 sm:h-fit">
				<h1 className="text-5xl mb-6">{AuthPage}</h1>
				{children}
				<p className="text-center italic font-extrabold justify-self-end mt-3 px-7 text-wrap">
					{AuthPage === "Login" ? (
						<>
							Don't have an account?{" "}
							<Link to="/register" className="hover:underline">
								Register
							</Link>
						</>
					) : (
						<>
							Already have an account?{" "}
							<Link to="/login" className="hover:underline">
								Log In
							</Link>
						</>
					)}
				</p>
			</div>
		</div>
	);
};

export default AuthLayout;
