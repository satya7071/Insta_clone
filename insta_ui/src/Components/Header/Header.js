import { Layout, Input, Button, Modal, Menu, Dropdown } from "antd";
import {
	SearchOutlined,
	CloseOutlined,
	UploadOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import "./Header.css";
import { UserContext } from "../UserContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../Upload/Upload";
import { Link } from "react-router-dom";
const { Header } = Layout;

const HeaderComponent = () => {
	const { handleLogout } = useContext(UserContext);
	const navigate = useNavigate();
	const { user, apiurl, token } = useContext(UserContext);
	const [searchValue, setSearchValue] = useState("");
	const [expanded, setExpanded] = useState(false);
	const [uploadModalVisible, setUploadModalVisible] = useState(false);

	const Logout = () => {
		handleLogout();
		navigate("/login");
	};

	const handleSearch = () => {
		navigate(`/profile/${searchValue}`);
	};

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

	if (token === null) {
		return null;
	}

	const menu = (
		<Menu>
			<Menu.Item>
				<Link to={`/profile/${user}`}>Profile</Link>
			</Menu.Item>
			<Menu.Item onClick={Logout}>Logout</Menu.Item>
		</Menu>
	);

	return (
		<Header className="Head">
			<div className="title"><Link to="/home">InstaDoppelganger</Link></div>
			<div className="items">
				{expanded ? (
					<>
						<Input
							value={searchValue}
							onChange={handleInputChange}
							className="input-search grey-bg"
						/>
						<Button
							type="primary"
							className="input-search"
							onClick={handleSearch}>
							<SearchOutlined />
						</Button>
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

				<Button
					onClick={showUploadModal}
					type="text"
					style={{ fontSize: "18px", color: "white" }}>
					<UploadOutlined />
				</Button>

				<Dropdown overlay={menu} trigger={["click"]}>
					<Button
						type="text"
						style={{ fontSize: "18px", color: "white" }}>
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
		</Header>
	);
};

export default HeaderComponent;
