import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { FiShield, FiBell, FiUser, FiSettings, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router";

const Header = () => {
	const { authority, authorityOffice, logout } = useAuth();
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleLogout = () => {
		logout();
		setIsProfileMenuOpen(false);
	};

	return (
		<header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo and Title */}
					<div className="flex items-center space-x-3">
						<div className="bg-blue-600 p-2 rounded-lg">
							<FiShield className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-lg font-semibold text-gray-900">
								Authority Portal
							</h1>
							{authorityOffice && (
								<p className="text-xs text-gray-500">
									{authorityOffice.authorityOffice.officeName}
								</p>
							)}
						</div>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-6">
						<Link
							to="/dashboard"
							className="text-gray-700 hover:text-blue-600 transition-colors"
						>
							Dashboard
						</Link>
						<Link
							to="/reports"
							className="text-gray-700 hover:text-blue-600 transition-colors"
						>
							Reports
						</Link>
						<Link
							to="/analytics"
							className="text-gray-700 hover:text-blue-600 transition-colors"
						>
							Analytics
						</Link>
					</nav>

					{/* Right Side */}
					<div className="flex items-center space-x-4">
						{/* Notifications */}
						<button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
							<FiBell className="h-5 w-5" />
							<span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
						</button>

						{/* Profile Dropdown */}
						<div className="relative">
							<button
								onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
								className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
							>
								<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
									<FiUser className="h-4 w-4 text-white" />
								</div>
								<div className="hidden md:block text-left">
									<p className="text-sm font-medium text-gray-900">
										{authority?.name}
									</p>
									{authorityOffice && (
										<p className="text-xs text-gray-500">
											{authorityOffice.position}
										</p>
									)}
								</div>
							</button>

							{/* Profile Dropdown Menu */}
							{isProfileMenuOpen && (
								<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
									<Link
										to="/settings"
										className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										onClick={() => setIsProfileMenuOpen(false)}
									>
										<FiSettings className="h-4 w-4 mr-2" />
										Settings
									</Link>
									<button
										onClick={handleLogout}
										className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
									>
										<FiLogOut className="h-4 w-4 mr-2" />
										Logout
									</button>
								</div>
							)}
						</div>

						{/* Mobile Menu Button */}
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="md:hidden p-2 text-gray-400 hover:text-gray-600"
						>
							{isMobileMenuOpen ? (
								<FiX className="h-6 w-6" />
							) : (
								<FiMenu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMobileMenuOpen && (
					<div className="md:hidden border-t border-gray-200 py-4">
						<nav className="space-y-2">
							<Link
								to="/dashboard"
								className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Dashboard
							</Link>
							<Link
								to="/reports"
								className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Reports
							</Link>
							<Link
								to="/analytics"
								className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Analytics
							</Link>
							<Link
								to="/settings"
								className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Settings
							</Link>
						</nav>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
