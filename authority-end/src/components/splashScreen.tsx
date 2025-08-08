import { Link } from "react-router";
// import splashScreenImg from "/images/splashScreen.png";

const SplashScreen = () => (
	// <div className="relative flex w-ful items-center  flex-col h-screen ">
	// 	<img
	// 		src={splashScreenImg}
	// 		alt="Splash"
	// 		className=" absolute inset-0 w-full h-full object-cover 2xl:object-contain"
	// 	/>
	// 	<div className="relative h-full z-10 mx-10  bg-[#5c5d742f] my-10 m-auto rounded-sm border-[#5c5d7473] border outline-none">
	// 		<div className="sm:px-20 py-28 px-5 ">
	// 			<h1 className="text-3xl text-white font-serif font-semibold ">
	// 				BIRS
	// 			</h1>
	// 			<p>Report and Make Your City Better than Before</p>
	// 		</div>
	// 		<Link to={"/login"}>Login</Link>
	// 	</div>
	// 	<div className="relative z-10  mt-auto p-3 bg-[#5c5d742f] w-full text-center ">
	// 		<p>&copy; 2017 Birhan Studio Ethiopia</p>
	// 		<p>Made using React</p>
	// 	</div>
	// </div>
	<>
		<div>
			<h1>BIRS</h1>
			<p>Report and Make Your City Better than Before</p>
		</div>
		<Link to={"/register"}>
			<button>Join Now</button>
		</Link>
		<p>
			already have an account? <Link to="/login">Log In</Link>
		</p>
	</>
);

export default SplashScreen;
