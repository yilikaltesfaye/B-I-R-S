import { type ReactNode } from "react";

interface EmptyStateProps {
	icon?: ReactNode;
	title: string;
	description?: string;
	action?: ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
	return (
		<div className="admin-card text-center py-12">
			{icon && (
				<div className="flex justify-center mb-4 text-gray-400">
					{icon}
				</div>
			)}
			<h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
			{description && (
				<p className="text-gray-500 text-sm mb-4">{description}</p>
			)}
			{action && action}
		</div>
	);
};

export default EmptyState;
