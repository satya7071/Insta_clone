import "./App.css";
import ForgotPassword from "./Components/Forgotpassword/Forgot";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./Components/UserContext";
import ResetPasswordForm from "./Components/Forgotpassword/Reset";
import Login from "./Components/userauth/login";
import Home from "./Components/Home/Home";
import HeaderComponent from "./Components/Header/Header";
import Profile from "./Components/Profile/Profile";
import Registration from "./Components/userauth/signup.js";
import Landing from "./Components/Landingpage/Landing";
import ReelViewer from "./Components/Reels/Reelsview";

function App() {
	return (
		<UserProvider>
			<Router>
				<Routes className="dd">
					<Route path="" element={<Landing />} />
					<Route path="/forgot" element={<ForgotPassword />} />
					<Route path="/reset/:uidb64/:token" element={<ResetPasswordForm />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Registration />} />
					<Route
						path="/home"
						element={
							<>
								<HeaderComponent />

								<Home />
							</>
						}
					/>

					<Route
						path="/reels"
						element={
							<>
								<HeaderComponent />

								<ReelViewer />
							</>
						}
					/>

					
					<Route
						path="/profile/:username"
						element={
							<>
								<HeaderComponent />
								<Profile username={2} />
							</>
						}
					/>
				</Routes>
			</Router>
		</UserProvider>
	);
}

export default App;
