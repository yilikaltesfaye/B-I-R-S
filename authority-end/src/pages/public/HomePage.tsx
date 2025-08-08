import { Link } from "react-router";
import { FiShield, FiUsers, FiSettings, FiBarChart } from "react-icons/fi";

const HomePage = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<header className="pt-8 pb-12">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<FiShield className="h-8 w-8 text-blue-600" />
							<h1 className="text-2xl font-bold text-gray-900">
								Authority Portal
							</h1>
						</div>
						<div className="space-x-4">
							<Link
								to="/login"
								className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
							>
								Login
							</Link>
							<Link
								to="/register"
								className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
							>
								Register
							</Link>
						</div>
					</div>
				</header>

				{/* Hero Section */}
				<div className="text-center py-16">
					<h2 className="text-4xl font-bold text-gray-900 mb-6">
						Infrastructure Management System
					</h2>
					<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
						Efficiently manage and resolve infrastructure reports in your
						jurisdiction. Track progress, update statuses, and ensure timely
						resolution of community issues.
					</p>
					<Link
						to="/login"
						className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
					>
						<FiShield className="h-5 w-5" />
						<span>Access Authority Portal</span>
					</Link>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
						<div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
							<FiBarChart className="h-6 w-6 text-blue-600" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Real-time Analytics
						</h3>
						<p className="text-gray-600">
							Monitor report statistics and track resolution performance across
							your office.
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
						<div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
							<FiSettings className="h-6 w-6 text-green-600" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Status Management
						</h3>
						<p className="text-gray-600">
							Update report statuses from pending to in-progress to fixed with
							ease.
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
						<div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
							<FiUsers className="h-6 w-6 text-purple-600" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Team Collaboration
						</h3>
						<p className="text-gray-600">
							Work with your team to efficiently handle infrastructure reports.
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
						<div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
							<FiShield className="h-6 w-6 text-orange-600" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Secure Access
						</h3>
						<p className="text-gray-600">
							Role-based access control ensures only authorized personnel can
							manage reports.
						</p>
					</div>
				</div>

				{/* Footer */}
				<footer className="py-8 border-t border-gray-200">
					<div className="text-center text-gray-600">
						<p>
							&copy; 2024 Infrastructure Management System. All rights reserved.
						</p>
					</div>
				</footer>
			</div>
		</div>
	);
};

export default HomePage;
