import React, { useContext, useState, useEffect } from "react";
import { Card, Form, Input, Button, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

const Registration = () => {
	const navigate = useNavigate();
	const { apiurl } = useContext(UserContext);
	const [loading, setLoading] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();
	const [username, setUsername] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [existingUsernames, setExistingUsernames] = useState([]);
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [existingEmails, setExistingEmails] = useState([]);

	useEffect(() => {
		// Fetch existing user data from API
		fetch(`${apiurl}/api/users/`)
			.then((response) => response.json())
			.then((data) => {
				const usernames = data.map((user) => user.username);
				const emails = data.map((user) => user.email);
				setExistingUsernames(usernames);
				setExistingEmails(emails)

			})
			.catch((error) => {
				//console.error("Fetching user data error:", error);
			});
	}, [apiurl]);

	const handleRegistration = (values) => {
		setLoading(true);
		if (values.password === values.confirmpassword) {
			// Check if the username already exists
			if (existingUsernames.includes(values.username)) {
				setLoading(false);
				messageApi.open({
					type: "warning",
					content: "Username already exists",
				});
				return; // Don't submit the form
			}

			// Check if the email already exists
			if (existingEmails.includes(values.email)) {
				setLoading(false);
				messageApi.open({
					type: "warning",
					content: "Account with this Email already exists",
				});
				return; // Don't submit the form
			}

			fetch(`${apiurl}/api/users/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Registration failed");
					}
					return response.json();
				})
				.then((data) => {
					setLoading(false);
					navigate("/login");
				})
				.catch((error) => {
					//console.error("Registration error:", error);
				});
		} else {
			setLoading(false);
			messageApi.open({
				type: "warning",
				content: "Password and Confirm Password do not match",
			});
		}
	};


	const handleUsernameChange = (event) => {
		const newUsername = event.target.value;
		setUsername(newUsername);

		// Check if the username already exists
		if (newUsername && existingUsernames.includes(newUsername)) {
			setUsernameError("Username already exists");
		} else {
			
			setUsernameError("");
		}
	};

	const handleEmailChange = (event) => {
		const newEmail = event.target.value;
		setEmail(newEmail);

		// Check if the username already exists
		if (newEmail && existingEmails.includes(newEmail)) {
			setEmailError("Account with this Email already exists");
		} else {
			setEmailError("");
			
		}
	};

	return (
		<>
			{loading ? (
				<div className="loader">
					<Spin spinning={true} size="large" />
				</div>
			) : (
				<div className="bg">
					<Card className="innercard">
						<div className="grid">
							<div>
								<center>
									<h1>Account Registration</h1>
								</center>
								<Form
									className="form-cont"
									layout="vertical"
									onFinish={handleRegistration}
									autoComplete="off">
									<Form.Item
										label="User Name"
										name="username"
										rules={[
											{
												required: true,
												message: "Please enter your full name!",
											},
										]}
										validateStatus={usernameError ? "error" : ""}
										help={usernameError}>
										<Input
											className="inp"
											value={username}
											onChange={handleUsernameChange}
										/>
									</Form.Item>
									<Form.Item
										label="Email"
										name="email"
										rules={[
											{
												required: true,
												message: "Please enter your email!",
											},
										]}
										validateStatus={emailError ? "error" : ""}
										help={emailError}
										hasFeedback={true}>
										<Input
											className="inp"
											value={email}
											onChange={handleEmailChange}
											type="email"
										/>
									</Form.Item>

									<Form.Item
										label="Password"
										name="password"
										rules={[
											{
												required: true,
												message: "Please enter your phone number!",
											},
										]}>
										<Input type="password" className="inp" />
									</Form.Item>
									<Form.Item
										label="Confirm Password"
										name="confirmpassword"
										rules={[
											{
												required: true,
												message: "Please enter your phone number!",
											},
										]}>
										<Input className="inp" type="password" />
									</Form.Item>
									<div className="adjust">
										<label htmlFor="Login">Already have an account?</label>
										<Link id="Login" to="/login" className="a">
											Log in
										</Link>
									</div>
									<br></br>

									<Form.Item className="sub-btn">
										<Button type="primary" className="btn1" htmlType="submit">
											Sign Up
										</Button>
									</Form.Item>
								</Form>
							</div>
						</div>
					</Card>
				</div>
			)}
			{contextHolder}
		</>
	);
};

export default Registration;
