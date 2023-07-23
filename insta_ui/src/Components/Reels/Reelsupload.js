import React, { useState, useContext } from "react";
import { Upload, Button, Input, message, Layout } from "antd";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import NotLoggedin from "../Notloggedin";

const { TextArea } = Input;

const ReelForm = () => {
	const { user, token, apiurl } = useContext(UserContext);
	const navigate = useNavigate();
	const [video, setVideo] = useState(null); // Change 'image' to 'video'
	const [caption, setCaption] = useState("");
	const [previewVideo, setPreviewVideo] = useState(null); // Change 'previewImage' to 'previewVideo'
	const [loading, setLoading] = useState(false);
	const username = user;

	const handleReelUpload = (file) => {
		setVideo(file); // Change 'setImage' to 'setVideo'
		setPreviewVideo(URL.createObjectURL(file)); // Change 'setPreviewImage' to 'setPreviewVideo'
	};

	const handleCaptionChange = (e) => {
		setCaption(e.target.value);
	};

	const handleSubmit = () => {
		setLoading(true);
		if (!video) {
			return;
		}

		const formData = new FormData();
		formData.append("user", username);
		formData.append("video", video);
		formData.append("caption", caption);

		fetch(`${apiurl}/api/reels/`, {
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
					
						<Upload
							customRequest={({ file }) => handleReelUpload(file)}
							showUploadList={false}
							accept="video/*" // Add this to restrict the upload to video files only
						>
							{previewVideo ? ( // Change 'previewImage' to 'previewVideo'
								<video width="100%" controls>
									<source src={previewVideo} type="video/mp4" />
									Your browser does not support the video tag.
								</video>
							) : (
								<Button>Select Video</Button> // Change 'Select Image' to 'Select Video'
							)}
						</Upload>
					
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

export default ReelForm;
