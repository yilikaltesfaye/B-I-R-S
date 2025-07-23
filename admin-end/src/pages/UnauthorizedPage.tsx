import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export const UnauthorizedPage = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="text-center">
				<ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
				<h1 className="mt-4 text-3xl font-bold text-gray-900">Access Denied</h1>
				<p className="mt-2 text-gray-600">
					You don't have permission to access this page.
				</p>
				<div className="mt-6">
					<Link to="/">
						<Button>Go to Dashboard</Button>
					</Link>
				</div>
			</div>
		</div>
	);
};
