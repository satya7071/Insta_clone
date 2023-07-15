import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Card } from "antd";
import { Image } from "antd";
import "./Home.css";
import { Layout, Button } from "antd";
import {
	HeartFilled,
	HeartTwoTone,
} from "@ant-design/icons";
import NotLoggedin from "../Notloggedin";

const { Content } = Layout;

const Home = () => {
	const { user, apiurl ,userId,token } = useContext(UserContext);
	const [posts, setPosts] = useState(null);

	useEffect(() => {
		fetchPosts();
	}, []);

	async function fetchPosts() {
		try {
			const followersResponse = await fetch(`${apiurl}/api/follow/`);
			const followersData = await followersResponse.json();

			const followedUsers = followersData
				.filter((follower) => follower.follower === user)
				.map((follower) => follower.user);

			const postsResponse = await fetch(`${apiurl}/api/post/`);
			const postsData = await postsResponse.json();

			const filteredPosts = postsData.filter(
				(post) => followedUsers.includes(post.user) || post.user === user
			);

			filteredPosts.sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
			);

			setPosts(filteredPosts);
		} catch (error) {
			console.error("Error fetching leave options:", error);
		}
	}

	const calculateRelativeTime = (createdAt) => {
		const now = new Date();
		// console.log(now)
		const created = new Date(createdAt);
		// console.log(created)
		const diff = now - created;

		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const months = Math.floor(days / 30);
		const years = Math.floor(months / 12);

		if (years > 0) {
			return `${years} year${years > 1 ? "s" : ""} ago`;
		} else if (months > 0) {
			return `${months} month${months > 1 ? "s" : ""} ago`;
		} else if (days > 0) {
			return `${days} day${days > 1 ? "s" : ""} ago`;
		} else if (hours > 0) {
			return `${hours} hour${hours > 1 ? "s" : ""} ago`;
		} else if (minutes > 0) {
			return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
		} else {
			return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
		}
	};

	async function likePost(id) {
		// console.log(id);
		const values = {
			id: id,
			user: user,
		};
		const response = await fetch(`${apiurl}/api/like`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		if (response.ok) {
			fetchPosts();
		}
	}

	async function unlikePost(id) {
		// console.log(id);
		const values = {
			id: id,
			user: user,
		};
		const response = await fetch(`${apiurl}/api/unlike`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		if (response.ok) {
			fetchPosts();
		}
	}

	// console.log(userId)

	if(!token && !user){
		return(
			<NotLoggedin />
		)
	}

	return (
		<Layout>
			<Content className="main">
				<div className="postscontainer">
					{posts &&
						posts.map((post) => (
							<Card
								className="postcard"
								title={
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
										}}>
										<span>{post.user}</span>
										<span style={{ color: "gray", fontSize: "13px" }}>
											{calculateRelativeTime(post.created_at)}
										</span>
									</div>
								}
								key={post.id}
								style={{ margin: "16px 0", width: "100%", maxWidth: "400px" }}>
								<div>
									<Image className="post-image" alt="post" src={post.image} />
								</div>
								<div className="desc">
									<div>
										<div className="m-1"><b>{post.user}</b>: {post.caption}</div>
										<div className="grey-text">Likes: {post.no_of_likes}</div>
									</div>
									<div className="likebutton">
										{post.liked_by.includes(parseInt(userId)) ? (
											<Button
												className="likebtn"
												type="text"
												style={{ color: "#eb2f96" }}
												onClick={() => unlikePost(post.id)}>
												<HeartFilled />
											</Button>
										) : (
											<Button
												type="text"
												className="likebtn"
												onClick={() => likePost(post.id)}>
												<HeartTwoTone twoToneColor="#eb2f96" />
											</Button>
										)}
									</div>
								</div>
							</Card>
						))}
				</div>
			</Content>
		</Layout>
	);
};

export default Home;
