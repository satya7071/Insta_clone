import React from "react";
import { useState, useContext } from "react";
import { UserContext} from "../UserContext";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Checkbox,
	Form,
	Input,
	Card,
	Spin,
	message,
} from "antd";
import "./auth.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Login = () => {
	const [form] = Form.useForm();
	const {
		handleLogin,
		handlesetToken,
		handleSessionLogin,
		handlesetSessionToken,
		apiurl
	} = useContext(UserContext);
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [loading, setLoading] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	const handleAuthentication = async (value) => {
		setLoading(true);
		const response = await fetch(`${apiurl}/authenticate/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(value),
		});
		const data = await response.json();
		// console.log(data.message)
		
		if (response.ok && data !== null) {
			
		  	if (!rememberMe) { 
				handleSessionLogin(data.id , data.name);
				handlesetSessionToken(data.token);
			} else {
				handleLogin(data.id,data.name);
				handlesetToken(data.token);
			}
				setLoading(false);
				navigate("/home");
		}
		else{
			setLoading(false);
			messageApi.open({
				type: "warning",
				content: data.message,
			});	
		}
	};
	  

	
	const handleRememberMe = (e) => {
		setRememberMe(e.target.checked);
	};

	return (
		<>
			{loading ? (
				<div className="loader">
					<Spin size="large" />
				</div>
			) : (
				<>
					<div className="bg">
						<Card className="innercard">
							<div className="grid-2">
								<div className="centerdflex">
									<center>
										<h1>LOGIN</h1>
									</center>

									<Form
										form={form}
										className="form-cont"
										layout="vertical"
										initialValues={{
											remember: true,
										}}
										onFinish={handleAuthentication}
										autoComplete="off">
										<Form.Item
											label="Username"
											name="username"
											rules={[
												{
													required: true,
													message: "Please input your username!",
												},
											]}>
											<Input className="inp" />
										</Form.Item>

										<Form.Item
											label="Password"
											name="password"
											rules={[
												{
													required: true,
													message: "Please input your password!",
												},
											]}>
											<Input
												type={showPassword ? "text" : "password"}
												className="inp"
											/>
										</Form.Item>

										<Button
											type="text"
											className="showbt"
											icon={
												showPassword ? (
													<EyeOutlined />
												) : (
													<EyeInvisibleOutlined />
												)
											}
											onClick={togglePasswordVisibility}
										/>
										<div className="forgotpass">
											<Link to="/forgot">Forgot Password</Link>
										</div>

										<Form.Item className="remember">
											<Checkbox onChange={handleRememberMe}>
												Remember Me
											</Checkbox>
										</Form.Item>
										<div className="adjust">
											<label htmlFor="Login">Don't have an account?</label>
											<Link id="signup" to="/signup" className="a">
												Create One
											</Link>
										</div>
										<br></br>
										<Form.Item className="sub-btn">
											<Button type="primary" htmlType="submit">
												Submit
											</Button>
										</Form.Item>
									</Form>
								</div>
							</div>
						</Card>
					</div>
				</>
			)}
			{contextHolder}
		</>
	);
};

export default Login;