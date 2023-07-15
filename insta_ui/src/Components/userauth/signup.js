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

	useEffect(() => {
		// Fetch existing user data from API
		fetch(`${apiurl}/api/users/`)
			.then((response) => response.json())
			.then((data) => {
				const usernames = data.map((user) => user.username);
				setExistingUsernames(usernames);
			})
			.catch((error) => {
				console.error("Fetching user data error:", error);
			});
	}, [apiurl]);

	const handleRegistration = (values) => {
		setLoading(true);
		if (values.password === values.confirmpassword) {
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
					console.error("Registration error:", error);
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

	return (
		<>
			{loading ? (
				<div className="spinner-container">
					<Spin spinning={true} size="large" />
				</div>
			) : (
				<div className="bgg">
					<Card className="cont bg">
						<Card className="innercard">
							<div className="grid">
								<div>
									<center>
										<h1>Account Registration</h1>
									</center>
									<Form
										className="mt-50"
										layout="vertical"
										labelCol={{ span: 8 }}
										wrapperCol={{ span: 16 }}
										style={{ maxWidth: 900 }}
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
											]}>
											<Input className="inp" type="email" />
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

										<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
											<Button type="primary" className="btn1" htmlType="submit">
												Sign Up
											</Button>
										</Form.Item>
									</Form>
									<div className="adjust">
										<label htmlFor="Login">Already have an account?</label>
										<Link id="Login" to="/login" className="a">
											Log in
										</Link>
									</div>
								</div>
							</div>
						</Card>
					</Card>
				</div>
			)}
			{contextHolder}
		</>
	);
};

export default Registration;
