import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import image from './loginlogo.svg';
import './auth.css'; 
import { Card } from "antd";

const UserAuthenticationForm = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { handleLogin ,handlesetToken ,apiurl } = useContext(UserContext);

	const handleUserAuthentication = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(`${apiurl}/api/authenticate/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
				}),
			});
			const data = await response.json();
			handleLogin(data.employee.employeeID, data.employee);
			handlesetToken(data.token);
			navigate("/dashboard");
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div className="container">
			<Card className="cont">
				<img alt="login" src={image} className="img-fluid img-animated"></img>
				<form onSubmit={handleUserAuthentication}>
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button type="submit">Authenticate</button>
				</form>
			</Card>
		</div>
	);
};

export default UserAuthenticationForm;
