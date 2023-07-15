import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button, Upload, message, Layout, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UserContext } from "../UserContext";
import './Settings.css';
import NotLoggedin from "../Notloggedin";
const { Content } = Layout;
const ProfileForm = () => {
	const { userId, apiurl,token,user } = useContext(UserContext);
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [profile, setProfile] = useState(null);
    const [image, setImage] = useState(null);
    const handleImageUpload = (file) => {
			setImage(file);
		};

	useEffect(() => {
		fetchProfileData();
	}, []);

	const fetchProfileData = async () => {
		try {
			const response = await fetch(`${apiurl}/api/profile/`);

			if (response.ok) {
				const data = await response.json();
				const filteredProfile = data.find(
					(item) => item.user === parseInt(userId)
				);
				// console.log(filteredProfile);
				if (filteredProfile) {
					setProfile(filteredProfile);
					if (form) {
						form.setFieldsValue(filteredProfile);
					}
				} else {
					if (form) {
						form.setFieldsValue({ bio: null });
					}
					setProfile(null);
				}
			} else {
				console.error("Error fetching profile data:", response.status);
			}
		} catch (error) {
			console.error("Error fetching profile data:", error);
		}
	};



	const onFinish = async (values) => {
		setLoading(true);
		const formData = new FormData();
		formData.append("bio", values.bio);
		if (image) {
			formData.append("profileimg", image);
		}
		formData.append("user", userId);

		try {
			let url = `${apiurl}/api/profile/`;
			let method = "POST";
			if (profile) {
				url += `${profile.id}/`;
				method = "PATCH";
			}
			const response = await fetch(url, {
				method: method,
				body: formData,
			});
			if (response.ok) {
				message.success("Profile updated successfully!");
				fetchProfileData();
			} else {
				message.error("Failed to update profile. Please try again.");
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			message.error("Failed to update profile. Please try again.");
		}

		setLoading(false);
	};

	if (!token && !user) {
		return <NotLoggedin />;
	}


	

	return (
		<Layout>
			<Content className="main">
				<div className="profilecont">
					<Form
                        style={{width:'100%'}}
						form={form}
						layout="vertical"
						onFinish={onFinish}
						initialValues={profile}>
						<Form.Item name="bio" label="Bio">
							<Input.TextArea rows={4} className="grey-bg"/>
						</Form.Item>
						{profile && <Image width={100} src={profile.profileimg}></Image>}
						<Form.Item name="profileimg" label="Change Profile Image">
							<Upload
								name="profileimg"
								action={handleImageUpload}
								maxCount={1}
								listType="picture">
								<Button icon={<UploadOutlined />}>Change</Button>
							</Upload>
						</Form.Item>

						<Form.Item>
							<Button type="primary" htmlType="submit" loading={loading}>
								{profile ? "Update Profile" : "Create Profile"}
							</Button>
						</Form.Item>
					</Form>
				</div>
			</Content>
		</Layout>
	);
};

export default ProfileForm;
