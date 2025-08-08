import { ReactNode } from "react";

interface EmptyStateProps {
	icon?: ReactNode;
	title: string;
	description: string;
	action?: ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
	return (
		<div className="text-center py-12">
			{icon && (
				<div className="flex justify-center mb-4">
					<div className="p-3 bg-gray-100 rounded-full">
						{icon}
					</div>
				</div>
			)}
			<h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
			<p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
			{action && action}
		</div>
	);
};

export default EmptyState;
