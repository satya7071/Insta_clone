import React, { useState } from "react";
import { Button, Input } from "antd";
import { UserContext } from "../UserContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { Card, Form } from "antd";
import image from "../userauth/loginlogo.svg";
import { EyeOutlined } from "@ant-design/icons";

const ChangePasswordForm = () => {
	const [form] = Form.useForm();
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	
	const [successPrompt, setSuccessPrompt] = useState("");
	const [errorPrompt, setErrorPrompt] = useState("");
	const { user, handleLogout , apiurl } = useContext(UserContext);
	const username = user ? user.email : null;

	const handleSubmit = (values) => {
		const currentPassword = values.currentPassword;
		const newPassword = values.newPassword;
		const confirmPassword = values.confirmPassword;
		setSuccessPrompt("");
		setErrorPrompt("");

		fetch(`${apiurl}/changepassword/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				currentPassword,
				newPassword,
				confirmPassword,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					setSuccessPrompt("Password changed successfully.");
					form.resetFields();
					// handleLogout();
				} else {
					setErrorPrompt(data.message);
				}
				// console.log(data);
			})
			.catch((error) => {
				setErrorPrompt("An error occurred while changing the password.");
			});
	};

	return (
		<div>
			{!user && (
				<div>
					<p>
						Please Login and try again <Link to="/login">Login Here!</Link>
					</p>
				</div>
			)}
			{user && (
				<>
					<>
						<div className="bgg">
							<Card className="cont bg">
								<Card className="innercard">
									<div className="grid-2">
										<div className="mt-40">
											<img
												src={image}
												alt="logo"
												className="img-fluid img-animated"></img>
										</div>

										<div className="centerdflex">
											<center>
												<h1>Reset Password</h1>
											</center>

											<Form
												form={form}
												className="mt-50"
												layout="vertical"
												wrapperCol={{
													span: 16,
												}}
												style={{
													maxWidth: 600,
												}}
												initialValues={{
													remember: true,
												}}
												onFinish={handleSubmit}
												autoComplete="off">
												<Form.Item
													label="Current Password"
													name="currentPassword"
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

												<Form.Item
													label="New Password"
													name="newPassword"
													style={{ marginTop: "-37px" }}
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
												<Form.Item
													label="Confirm New Password"
													name="confirmPassword"
													style={{ marginTop: "-37px" }}
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

												<div className="error" style={{ marginTop: "-50px" }}>
													{successPrompt && (
														<div className="success-prompt">
															<p>{successPrompt}</p>
															<p>
																Click <Link to="/login">Here </Link> to go back
																to login
															</p>
														</div>
													)}
													{errorPrompt && (
														<div className="error-prompt">
															<p>{errorPrompt}</p>
														</div>
													)}
												</div>

												<Form.Item
													wrapperCol={{
														offset: 8,
														span: 16,
													}}>
													<Button
														type="primary"
														htmlType="submit"
														className="lb">
														Submit
													</Button>
												</Form.Item>
											</Form>
										</div>
									</div>
								</Card>
							</Card>
						</div>
					</>
				</>
			)}
		</div>
	);
};

export default ChangePasswordForm;
