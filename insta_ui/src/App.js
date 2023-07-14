import "./App.css";
import ForgotPassword from "./Components/Forgotpassword/Forgot";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./Components/UserContext";
import ResetPasswordForm from "./Components/Forgotpassword/Reset";
import Login from "./Components/userauth/login";
import Home from "./Components/Home/Home";
import HeaderComponent from "./Components/Header/Header";
import SideNav from "./Components/sidenav/sidenav";
import PostForm from "./Components/Upload/Upload";
import ProfileForm from "./Components/Settings/Settings";
import Profile from "./Components/Profile/Profile";

function App() {
	return (
		<UserProvider>
			<Router>
				<Routes className="dd">
					<Route path="/forgot" element={<ForgotPassword />} />
					<Route path="/reset/:uidb64/:token" element={<ResetPasswordForm />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/home"
						element={
							<>
								<HeaderComponent />
								<SideNav />
								<Home />
							</>
						}
					/>
					<Route
						path="/upload"
						element={
							<>
								<HeaderComponent />
								<SideNav />
								<PostForm />
							</>
						}
					/>
					<Route
						path="/settings"
						element={
							<>
								<HeaderComponent />
								<SideNav />
								<ProfileForm />
							</>
						}
					/>
					<Route
									path="/profile/:username"
									element={<>
								<HeaderComponent /><Profile username={2} /><SideNav /></>} />
					
				</Routes>
			</Router>
		</UserProvider>
	);
}

export default App;
