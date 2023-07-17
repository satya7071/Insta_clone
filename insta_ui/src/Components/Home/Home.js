import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Card } from "antd";
import { Image, Spin } from "antd";
import "./Home.css";
import { Layout, Button, Modal } from "antd";
import { HeartFilled, HeartTwoTone } from "@ant-design/icons";
import NotLoggedin from "../Notloggedin";
import { Link } from "react-router-dom";

const { Content } = Layout;

const Home = () => {
	const { user, apiurl, userId, token } = useContext(UserContext);
	const [posts, setPosts] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPost, setSelectedPost] = useState(null); // Track the selected post
	const [modalVisible, setModalVisible] = useState(false);
	const [likedByUsernames, setLikedByUsernames] = useState([]); // Store fetched usernames

	const handleModalToggle = () => {
		setSelectedPost(null);
		setModalVisible(!modalVisible);
		
	};

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
			setIsLoading(false);
		} catch (error) {
			// console.error("Error fetching leave options:", error);
		}
	}

	const calculateRelativeTime = (createdAt) => {
		const now = new Date();
		const created = new Date(createdAt);
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
	useEffect(() => {
		if (modalVisible && selectedPost !== null) {
			const likedByUserIds = posts
				.find((post) => post.id === selectedPost)
				.liked_by.map((item) => item);

			fetchUserNames(likedByUserIds).then((userNames) => {
				setLikedByUsernames(userNames);
			});
		}
	}, [modalVisible, selectedPost, posts]);

	if (!token && !user) {
		return <NotLoggedin />;
	}

	const fetchUserName = async (id) => {
		try {
			const response = await fetch(`${apiurl}/api/users/${id}/`);
			if (response.ok) {
				const data = await response.json();
				console.log(data);
				return data.username;
			} else {
				// console.error("Error fetching profile data:", response.status);
				return null;
			}
		} catch (error) {
			// console.error("Error fetching profile data:", error);
			return null;
		}
	};

	async function fetchUserNames(userIds) {
		try {
			const userNames = await Promise.all(
				userIds.map((id) => fetchUserName(id))
			);
			return userNames;
		} catch (error) {
			// Handle error if necessary
			console.error("Error fetching user names:", error);
			return [];
		}
	}

	

	if (isLoading) {
		return (
			<div className="loader">
				<Spin size="large" />
			</div>
		);
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
										<span>
											<Link to={`/profile/${post.user}`}>{post.user}</Link>
										</span>
										<span style={{ color: "gray", fontSize: "13px" }}>
											{calculateRelativeTime(post.created_at)}
										</span>
									</div>
								}
								key={post.id}
								style={{
									margin: "16px 0",
									width: "100%",
									maxWidth: "400px",
								}}>
								<div>
									<Image className="post-image" alt="post" src={post.image} />
								</div>
								<div className="desc">
									<div>
										<div className="m-1">
											<b>{post.user}</b>: {post.caption}
										</div>
										<div className="grey-text">
											<Button
												type="text"
												onClick={() => {
													setSelectedPost(post.id); // Set the selected post
													handleModalToggle();
												}}
												style={{padding:0}}>
												<b>Likes:</b>
											</Button>
											{post.no_of_likes}
										</div>
										<Modal
											open={modalVisible && selectedPost === post.id} // Show the modal only for the selected post
											onCancel={handleModalToggle}
											footer={""}>
											<h3>Liked By:</h3>
											{likedByUsernames.map((item) => (
												<div key={item}>{item}</div>
											))}
										</Modal>
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
