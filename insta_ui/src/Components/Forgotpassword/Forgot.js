import React, { useState } from "react";
import { Button, Input } from "antd";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import {
	Card,
	Spin,
	Form,
} from "antd";
import './file.css';

function ForgotPassword() {
	const [form] = Form.useForm();
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const { apiurl } = useContext(UserContext);
	const [loading, setLoading] = useState(false);



	const handleForgotPassword = async (values) => {
		setLoading(true)
		

		try {
			const response = await fetch(`${apiurl}/forgotpassword/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			const data = await response.json();
			if (response.ok) {
				setLoading(false);
				setSuccessMessage(data.success);
				form.resetFields();
				setErrorMessage("");
			} else {
				setLoading(false);
				setErrorMessage(data.error);
				setSuccessMessage("");
			}
		} catch (error) {
			setLoading(false);
			setErrorMessage("An error occurred. Please try again.");
			setSuccessMessage("");
		}
	};

	return (
		<>
			{loading ? (
				<div className="spinner-container">
					<Spin spinning={true} size="large" />
				</div>
			) : (
				<>
					<div className="bgg">
						<Card className="cont bg">
							<Card className="innercard">
								<div className="grid-2">
									<div className="mt-40">
										{/* <img
											src={image}
											alt="logo"
											className="img-fluid img-animated"></img> */}
									</div>

									<div className="centerdflex">
										<center>
											<h1>Reset Password</h1>
										</center>
										<div className="centerdflex">
											<Form
												form={form}
												className="mt-50"
												layout="vertical"
												labelCol={{
													span: 8,
												}}
												wrapperCol={{
													span: 16,
												}}
												style={{
													maxWidth: 600,
												}}
												initialValues={{
													remember: true,
												}}
												onFinish={handleForgotPassword}
												autoComplete="off">
												<Form.Item
													label="Email ID"
													name="email"
													rules={[
														{
															required: true,
															message: "Please input your username!",
														},
														{
															type:"email",
															message: "Please input your valid Email ID",
														},
													]}>
													<Input className="inp" />
												</Form.Item>
												<div className="error">
													{successMessage && <p>*{successMessage}</p>}
													{errorMessage && <p>*{errorMessage}</p>}
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
								</div>
							</Card>
						</Card>
					</div>
				</>
			)}
		</>
	);
}

export default ForgotPassword;
