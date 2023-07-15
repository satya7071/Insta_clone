import { Layout,Input,Button } from "antd";
import {
	SearchOutlined,
	LogoutOutlined,
	CloseOutlined,
} from "@ant-design/icons";
import "./Header.css";
import { UserContext } from "../UserContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
const { Header } = Layout;

const HeaderComponent = () => {
	const { handleLogout } = useContext(UserContext);
	const navigate = useNavigate();
	const { user , apiurl ,token } = useContext(UserContext);
	const [searchValue, setSearchValue] = useState("");
	const [expanded, setExpanded] = useState(false);
	
	const Logout = () => {
		handleLogout();
		navigate("/login");
	};

	if(!token){
		navigate("/login");
	}

	const handleSearch = () => {
		navigate(`profile/${searchValue}`);
	};

	const handleInputChange = (e) => {
		setSearchValue(e.target.value);
	};

	const handleExpand = () => {
		setExpanded(!expanded);
	};
	return (
		<Header className="Head">
			<div className="title">COUP</div>
			<div style={{ display: "flex", alignItems: "center" }}>
				{expanded ? (
					<>
						<Input
							value={searchValue}
							onChange={handleInputChange}
							className="expanded"
						/>
						<Button type="primary" onClick={handleSearch}>
							{" "}
							Search
						</Button>
						<CloseOutlined
							style={{ fontSize: "18px", color: "white" }}
							className="close-icon"
							onClick={handleExpand}
						/>
					</>
				) : (
					<SearchOutlined
						style={{ fontSize: "18px", color: "white",marginTop:"5px",marginRight:"10px" }}
						className="search-icon"
						onClick={handleExpand}
					/>
				)}

				<Button
					onClick={Logout}
					type="text"
					style={{ fontSize: "18px", marginRight: "30px", color: "white" }}>
					<LogoutOutlined />
				</Button>
			</div>
		</Header>
	);
};

export default HeaderComponent;
