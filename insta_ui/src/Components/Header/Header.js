import { Layout, Input, Button, Modal, Menu, Dropdown } from "antd";
import {
	SearchOutlined,
	CloseOutlined,
	UploadOutlined,
	SettingOutlined,
	VideoCameraOutlined,
} from "@ant-design/icons";
import "./Header.css";
import { UserContext } from "../UserContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../Upload/Upload";
import { Link } from "react-router-dom";
import ReelForm from "../Reels/Reelsupload";


const { Header } = Layout;

const HeaderComponent = () => {
	const { handleLogout } = useContext(UserContext);
	const navigate = useNavigate();
	const { user, apiurl, token } = useContext(UserContext);
	const [searchValue, setSearchValue] = useState("");
	const [expanded, setExpanded] = useState(false);
	const [uploadModalVisible, setUploadModalVisible] = useState(false);
	const [uploadReelModalVisible, setReelUploadModalVisible] = useState(false);

	const Logout = () => {
		handleLogout();
		navigate("/login");
	};

	const handleSearch = () => {
		navigate(`/profile/${searchValue}`);
		window.location.reload();
	};

	const ProfileNavigation = () => {
		navigate(`/profile/${user}`);
		window.location.reload();
	}

	const navReels = () => {
		navigate('/reels');
	}


	const handleInputChange = (e) => {
		setSearchValue(e.target.value);
	};

	const handleExpand = () => {
		setExpanded(!expanded);
	};

	const showUploadModal = () => {
		setUploadModalVisible(true);
	};

	const hideUploadModal = () => {
		setUploadModalVisible(false);
	};

	const showReelUploadModal = () => {
		setReelUploadModalVisible(true);
	};

	const hideReelUploadModal = () => {
		setReelUploadModalVisible(false);
	};



	if (token === null) {
		return null;
	}

	const menu = (
		<Menu>
			<Menu.Item onClick={ProfileNavigation}>Profile</Menu.Item>
			<Menu.Item onClick={Logout}>Logout</Menu.Item>
		</Menu>
	);

	const uploadmenu = (
		<Menu>
			<Menu.Item onClick={showUploadModal}>Upload Post</Menu.Item>
			<Menu.Item onClick={showReelUploadModal}>Upload Reel</Menu.Item>
		</Menu>
	);

	

	return (
		<Header className="Head">
			<div className="title">
				<Link to="/home">InstaDoppelganger</Link>
			</div>
			<div className="items">
				<Button
					className="reelbtn"
					onClick={navReels}
					type="text"
					style={{ fontSize: "18px", color: "white", marginRight: "10px" }}>
					<VideoCameraOutlined />
				</Button>
				{expanded ? (
					<>
						<div className="input-container">
							<Input
								value={searchValue}
								onChange={handleInputChange}
								className="input-search grey-bg"
							/>
							<Button
								type="primary"
								className="button-search"
								onClick={handleSearch}
								icon={<SearchOutlined />}
							/>
						</div>
						<CloseOutlined
							style={{ fontSize: "18px", color: "white" }}
							className="close-icon"
							onClick={handleExpand}
						/>
					</>
				) : (
					<SearchOutlined
						style={{
							fontSize: "18px",
							color: "white",
							marginTop: "5px",
							marginRight: "10px",
						}}
						className="search-icon"
						onClick={handleExpand}
					/>
				)}

				

				<Dropdown overlay={uploadmenu} trigger={["click"]}>
					<Button type="text" style={{ fontSize: "18px", color: "white" }}>
						<UploadOutlined />
					</Button>
				</Dropdown>

				<Dropdown overlay={menu} trigger={["click"]}>
					<Button type="text" style={{ fontSize: "18px", color: "white" }}>
						<SettingOutlined />
					</Button>
				</Dropdown>
			</div>

			<Modal
				title="Upload Image"
				open={uploadModalVisible}
				onOk={hideUploadModal}
				onCancel={hideUploadModal}
				footer={""}>
				<PostForm />
			</Modal>

			<Modal
				title="Upload Reel"
				open={uploadReelModalVisible}
				onOk={hideReelUploadModal}
				onCancel={hideReelUploadModal}
				footer={""}>
				<ReelForm />
			</Modal>
		</Header>
	);
};

export default HeaderComponent;
