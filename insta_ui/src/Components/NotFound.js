import { Button, Result } from "antd";
import { Link } from "react-router-dom";
const NotFound = () => {
	return (
		<Result
			status="404"
			title="404"
			subTitle="Sorry, No posts found please upload one or follow others to explore."
			
		/>
	);
};

export default NotFound;
