import React, { useState, useContext } from "react";
import { Upload, Button, Input, message, Layout } from "antd";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import "./Upload.css";
import NotLoggedin from "../Notloggedin";

const { TextArea } = Input;

const PostForm = () => {
	const { user,token ,apiurl} = useContext(UserContext);
	const navigate = useNavigate();
	const [image, setImage] = useState(null);
	const [caption, setCaption] = useState("");
	const [previewImage, setPreviewImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const username = user;

	const handleImageUpload = (file) => {
		setImage(file);
		setPreviewImage(URL.createObjectURL(file));
	};

	const handleCaptionChange = (e) => {
		setCaption(e.target.value);
	};

	const handleSubmit = () => {
		setLoading(true);
		if (!image) {
			return;
		}

		const formData = new FormData();
		formData.append("user", username);
		formData.append("image", image);
		formData.append("caption", caption);

		fetch(`${apiurl}/api/post/`, {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				message.success("Uploaded successfully!");
				setLoading(false);
				window.location.reload();
			})
			.catch((error) => {
				//console.error(error);
			});
			
	};

	

	if (!token && !user) {
		return <NotLoggedin />;
	}

	return (
		<>
			<div className="upload-main">
				<div className="uploadcont">
					<ImgCrop aspect={1}>
						<Upload
							customRequest={({ file }) => handleImageUpload(file)}
							showUploadList={false}>
							{previewImage ? (
								<img width="100%" src={previewImage} alt="Preview" />
							) : (
								<Button>Select Image</Button>
							)}
						</Upload>
					</ImgCrop>
					<TextArea
						className="lg-inp"
						rows={4}
						placeholder="Caption"
						value={caption}
						onChange={handleCaptionChange}
						style={{ marginTop: 16 }}
					/>
					<span>
						<Button
							type="primary"
							onClick={handleSubmit}
							style={{ marginTop: 16 }}
							loading={loading}>
							Submit
						</Button>
					</span>
				</div>
			</div>
		</>
	);
};

export default PostForm;
