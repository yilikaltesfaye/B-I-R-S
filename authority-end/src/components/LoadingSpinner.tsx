interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg";
	color?: "blue" | "white" | "gray";
	text?: string;
}

const LoadingSpinner = ({ size = "md", color = "blue", text }: LoadingSpinnerProps) => {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-6 w-6",
		lg: "h-8 w-8",
	};

	const colorClasses = {
		blue: "border-blue-600",
		white: "border-white",
		gray: "border-gray-600",
	};

	return (
		<div className="flex flex-col items-center justify-center">
			<div 
				className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
			></div>
			{text && (
				<p className="mt-2 text-sm text-gray-600">{text}</p>
			)}
		</div>
	);
};

export default LoadingSpinner;
