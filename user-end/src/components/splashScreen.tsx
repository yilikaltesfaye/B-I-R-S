import splashScreenImg from "/images/splashScreen.png";

const SplashScreen = () => {
	return (
		<div className="relative flex w-ful items-center  flex-col h-screen ">
			<img
				src={splashScreenImg}
				alt="Splash"
				className="bg-[#18181B] absolute inset-0 w-full h-full object-cover 2xl:object-contain"
			/>
			<div className="absolute inset-0 bg-linear-to-b from-black to-transparent opacity-30" />
			<div className="relative z-10 text-white flex items-center justify-center px-20 py-28 "></div>
			<div className="relative z-10 text-white mt-auto p-3 bg-[#18181b7e] w-full text-center ">
				<p>&copy; 2018 B-I-R-S Ethiopia</p>
			</div>
		</div>
	);
};

export default SplashScreen;
