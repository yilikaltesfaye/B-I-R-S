import { FaSearch } from "react-icons/fa";

const Header = () => {
	return (
		<header className="bg-white border-b border-gray-200 px-6 py-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="relative hidden sm:block">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<FaSearch className="h-4 w-4 text-gray-400" />
						</div>
						<input
							type="text"
							placeholder="Search..."
							className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						/>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
