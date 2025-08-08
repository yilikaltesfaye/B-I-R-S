const ErrorPage = () => {
	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
				padding: "2rem",
			}}
		>
			<h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
				404 - Not Found
			</h1>
			<p>The page you're looking for doesn't exist or was moved.</p>
		</div>
	);
};

export default ErrorPage;
