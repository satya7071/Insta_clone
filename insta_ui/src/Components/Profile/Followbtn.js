import React, { useState } from "react";
import { Button } from "antd";

const FollowButton = ({ isFollowing, onFollow, onUnfollow }) => {
	const [following, setFollowing] = useState(isFollowing);

	const handleFollow = () => {
		setFollowing(true);
		onFollow();
	};

	const handleUnfollow = () => {
		setFollowing(false);
		onUnfollow();
	};

	return (
		<Button onClick={following ? handleUnfollow : handleFollow}>
			{following ? "Unfollow" : "Follow"}
		</Button>
	);
};

export default FollowButton;
