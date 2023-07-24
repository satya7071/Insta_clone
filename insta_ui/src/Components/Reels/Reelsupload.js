import React, { useState, useContext } from "react";
import { Upload, Button, Input, message, Layout } from "antd";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import NotLoggedin from "../Notloggedin";

const { TextArea } = Input;

const ReelForm = () => {
	const { user, token, apiurl } = useContext(UserContext);
	const navigate = useNavigate();
	const [video, setVideo] = useState(null);
	const [caption, setCaption] = useState("");
	const [previewVideo, setPreviewVideo] = useState(null);
	const [loading, setLoading] = useState(false);
	const username = user;

	const handleReelUpload = (file) => {
		setVideo(file);
		setPreviewVideo(URL.createObjectURL(file));
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
							accept="video/*"
						>
							{previewVideo ? (
								<video width="100%" controls>
									<source src={previewVideo} type="video/mp4" />
									Your browser does not support the video tag.
								</video>
							) : (
								<Button>Select Video</Button>
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
