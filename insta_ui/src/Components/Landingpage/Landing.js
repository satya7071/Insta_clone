import React, { useEffect } from "react";
import { Button } from "antd";
import { UserOutlined, LoginOutlined } from "@ant-design/icons";
import "./Landing.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
function Landing() {
    const navigate = useNavigate();
    const { user , token } = useContext(UserContext);
	useEffect(() => {
		if (token && user) {
			navigate("/home");
		}
	}, [token,user]);
    
	return (
		<div className="main-container">
			<div className="content">
				<h1 className="title">
					<span className="welcome">Welcome to</span>
					<br />
					<span className="insta">InstaDuppleganger</span>
				</h1>
				<p className="description">
					Join our vibrant community today and start capturing moments that
					matter! Share your photos, follow other users, and discover amazing
					content.
				</p>
				<div className="buttons">
					<Button
						className="btn btn-signin"
						type="primary"
						shape="round"
						icon={<UserOutlined />}>
						<Link to="/login">Sign In</Link>
					</Button>
					<Button
						className="btn btn-signup"
						type="primary"
						shape="round"
						icon={<LoginOutlined />}>
						<Link to="/login">Sign Up</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Landing;
