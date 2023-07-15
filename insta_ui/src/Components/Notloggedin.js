import {Button, Result } from "antd";
import { Link } from "react-router-dom";
const NotLoggedin = () => {
	


	return (
		<Result
				status="403"
				title="403"
				subTitle="Sorry, you are not authorized to access this page."
				extra={
					<Button type="primary">
						<Link to="/login">Login</Link>
					</Button>
				}
			/>
	);
};

export default NotLoggedin;
