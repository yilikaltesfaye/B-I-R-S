import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-row gap-5">
			<Sidebar />

			<div className={`main-content lg:main-content-expanded w-full`}>
				{/* <Header /> */}

				<main className="p-6">{children}</main>
			</div>
		</div>
	);
};

export default Layout;
