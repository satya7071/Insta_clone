import { Layout, Menu } from "antd";

import { Link, useLocation } from "react-router-dom";
import "./sidenav.css";
import {
	HomeOutlined,
	AuditOutlined,
	FormOutlined,
	MedicineBoxOutlined,
	MoneyCollectOutlined,
	DeliveredProcedureOutlined,
	DollarOutlined,
	SolutionOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const { Sider } = Layout;

const SideNav = () => {
	const { user } = useContext(UserContext);
	const location = useLocation();

	const defaultSelectedKeys = () => {
		const pathname = location.pathname;
		const menuItems = [
			"/home",
			"/upload",
			`/profile/${user}`,
			"/settings",
		];

		const index = menuItems.findIndex((item) => pathname.includes(item));

		if (index !== -1) {
			return [String(index + 1)];
		}

		return ["1"];
	};

	return (
		<Sider
			theme="dark"
			trigger={null}
			className="Side"
			breakpoint="lg"
			collapsedWidth="0"
			onBreakpoint={(broken) => {
				console.log(broken);
			}}
			onCollapse={(collapsed, type) => {
				console.log(collapsed, type);
			}}>
			<div className="demo-logo-vertical" />
			<Menu
				theme="dark"
				mode="inline"
				defaultSelectedKeys={defaultSelectedKeys()}
				className="menu">
				<Menu.Item key="1" icon={<HomeOutlined />} label="Home">
					<Link to="/home">Home</Link>
				</Menu.Item>
				<Menu.Item key="2" icon={<SolutionOutlined />} label="Leaves">
					<Link to="/upload">Upload</Link>
				</Menu.Item>
				<Menu.Item key="3" icon={<UserOutlined />} label="Home">
					<Link to={`/profile/${user}`}>My Profile</Link>
				</Menu.Item>
				<Menu.Item key="4" icon={<FormOutlined />} label="Attendance">
					<Link to="/settings">Settings</Link>
				</Menu.Item>
			</Menu>
		</Sider>
	);
};

export default SideNav;
