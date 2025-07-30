import SplashScreen from "./components/splashScreen";

function App() {
	let isAuthenticated = false;

	if (!isAuthenticated) {
		return <SplashScreen />;
	}
	return <>hello</>;
}

export default App;
