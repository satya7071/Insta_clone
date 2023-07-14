import React, { useState, useContext } from "react";
import { Upload, Button, Input, Modal, Layout } from "antd";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import "./Upload.css";

const { TextArea } = Input;

const PostForm = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [image, setImage] = useState(null);
	const [caption, setCaption] = useState("");
	const [previewImage, setPreviewImage] = useState(null);
	const [uploadSuccess, setUploadSuccess] = useState(false);
	const username = user;

	const handleImageUpload = (file) => {
		setImage(file);
		setPreviewImage(URL.createObjectURL(file));
	};

	const handleCaptionChange = (e) => {
		setCaption(e.target.value);
	};

	const handleSubmit = () => {
		if (!image) {
			// Display an error message or take appropriate action when no image is selected.
			return;
		}

		const formData = new FormData();
		formData.append("user", username);
		formData.append("image", image);
		formData.append("caption", caption);

		fetch("http://127.0.0.1:8000/api/post/", {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				setUploadSuccess(true);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleModalClose = () => {
		setUploadSuccess(false);
		setImage(null);
		setCaption("");
	};

	return (
		<Layout>
			<div className="main">
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
					<Button
						type="primary"
						onClick={handleSubmit}
						style={{ marginTop: 16 }}>
						Submit
					</Button>
					<Modal
						open={uploadSuccess}
						title="Upload Success"
						onCancel={handleModalClose}
						onOk={handleModalClose}>
						<p>Your photo has been uploaded successfully!</p>
					</Modal>
				</div>
			</div>
		</Layout>
	);
};

export default PostForm;
