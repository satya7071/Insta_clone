import React, { useContext, useEffect, useState } from "react";
import { Card, Layout, Spin, Button } from "antd";
import { useSwipeable } from "react-swipeable";
import "./reels.css";
import { UserContext } from "../UserContext";
import { HeartFilled, HeartTwoTone } from "@ant-design/icons";
import NotLoggedin from "../Notloggedin";
import NotFound from "../NotFound";

const { Content } = Layout;

const ReelsComponent = () => {
	const { user, apiurl, userId, token } = useContext(UserContext);
	const [reels, setReels] = useState([]);
	const [currentReelIndex, setCurrentReelIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [hasReels, setHasReels] = useState(true);

	useEffect(() => {
		fetchReels();
	}, []);

	const fetchReels = async () => {
		try {
			setLoading(true);
			const followersResponse = await fetch(`${apiurl}/api/follow/`);
			const followersData = await followersResponse.json();

			const followedUsers = followersData
				.filter((follower) => follower.follower === user)
				.map((follower) => follower.user);

			const response = await fetch(`${apiurl}/api/reels/`);
			const data = await response.json();
			const filteredPosts = data.filter(
				(post) => followedUsers.includes(post.user) || post.user === user
			);

			filteredPosts.sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
			);

			if (filteredPosts.length === 0) {
				setHasReels(false);
			} else {
				setHasReels(true);
				setReels(filteredPosts);
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	async function likePost(id) {
		const values = {
			id: id,
			user: user,
		};
		const response = await fetch(`${apiurl}/api/like/reel`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		if (response.ok) {
			fetchReels();
		}
	}

	async function unlikePost(id) {
		const values = {
			id: id,
			user: user,
		};
		const response = await fetch(`${apiurl}/api/unlike/reel`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		if (response.ok) {
			fetchReels();
		}
	}

	const handlePrevious = () => {
		setCurrentReelIndex(
			(prevIndex) => (prevIndex - 1 + reels.length) % reels.length
		);
	};

	const handleNext = () => {
		setCurrentReelIndex((prevIndex) => (prevIndex + 1) % reels.length);
	};

	const swipeHandlers = useSwipeable({
		onSwipedLeft: handleNext,
		onSwipedRight: handlePrevious,
	});

	if (!token && !user) {
		return <NotLoggedin />;
	}

	return (
		<Layout>
			<Content className="main">
				{!hasReels ? (
					<NotFound />
				) : (
					<div className="reels-container" {...swipeHandlers}>
						{loading ? (
							<div className="loader">
								<Spin size="large" />
							</div>
						) : (
							<div className="videocont">
								<Card
									className="reelcard"
									key={reels[currentReelIndex].id}
									title={reels[currentReelIndex].user}
									cover={
										<video src={reels[currentReelIndex].video} autoPlay loop />
									}
									actions={[
										<span>
											{reels[currentReelIndex].liked_by.includes(
												parseInt(userId)
											) ? (
												<Button
													className="likebtn"
													type="text"
													style={{ color: "#eb2f96", marginTop: "-6%" }}
													onClick={() =>
														unlikePost(reels[currentReelIndex].id)
													}>
													<HeartFilled />
												</Button>
											) : (
												<Button
													type="text"
													className="likebtn"
													style={{ color: "#eb2f96", marginTop: "-6%" }}
													onClick={() => likePost(reels[currentReelIndex].id)}>
													<HeartTwoTone twoToneColor="#eb2f96" />
												</Button>
											)}
										</span>,
										<span key="previous" onClick={handlePrevious}>
											Previous
										</span>,
										<span key="next" onClick={handleNext}>
											Next
										</span>,
									]}>
									<Card.Meta
										description={
											<div className="flex-display">
												<div>{reels[currentReelIndex].caption}</div>{" "}
												<div>{reels[currentReelIndex].no_of_likes} Likes</div>
											</div>
										}
									/>
								</Card>
							</div>
						)}
					</div>
				)}
			</Content>
		</Layout>
	);
};

export default ReelsComponent;
