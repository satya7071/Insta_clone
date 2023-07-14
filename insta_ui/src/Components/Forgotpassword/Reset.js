import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useContext } from "react";
import { Card, Form } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const ResetPasswordForm = () => {
	const [form] = Form.useForm();
	const { uidb64, token } = useParams();
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { apiurl } = useContext(UserContext);
	
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handleSubmit = async (values) => {
		

		if (values.password !== values.confirmPassword) {
			
			setError("Passwords do not match");
			return;
		}

		try {
			const password = values.password;
			
			const response = await fetch(
				`${apiurl}/resetpassword/${uidb64}/${token}/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ password }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				setError(errorData.message);
				return;	
			}
			setError("Reset Successful.! Redirecting you to login");
			form.resetFields();
			setTimeout(() => {
				navigate("/login");
			}, 1500);

			
		} catch (error) {
			
			console.error("Error:", error);
			setError("An error occurred while resetting the password");
		}
	};

	return (
			<>
				
					<>
						<div className="bgg">
							<Card className="cont bg">
								<Card className="innercard">
									<div className="grid-2">
										{/* <div className="mt-40">
											<img
												src={image}
												alt="logo"
												className="img-fluid img-animated"></img>
										</div> */}

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

												<Form.Item
													label="Confirm Password"
													name="confirmPassword"
													style={{marginTop:"-37px"}}
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

												<div className="error" style={{ marginTop:"-50px" }}>{error && <p>{error}</p>}</div>

												<Form.Item
													wrapperCol={{
														offset: 8,
														span: 16,
													}}>
													<Button type="primary" htmlType="submit" className="lb">
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
	);
};

export default ResetPasswordForm;
