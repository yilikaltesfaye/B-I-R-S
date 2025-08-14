interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="text-center">
					<div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
						<span className="text-white font-bold text-xl">A</span>
					</div>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Admin Panel
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Broken Infrastructure Reporting System
					</p>
				</div>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					{children}
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;
