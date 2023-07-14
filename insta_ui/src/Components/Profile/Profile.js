import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Card, Layout ,Avatar,Result,Button,Modal,List } from "antd";
import { Image } from "antd";
import { Link } from "react-router-dom";
import "./Profile.css";
import { useParams } from "react-router-dom";
import FollowButton from "./Followbtn";
const { Content } = Layout;

const Profile = () => {
	const { user,apiurl } = useContext(UserContext);
	const { username } = useParams();
	const [userId, setUserId] = useState(null);
	const [profile, setProfile] = useState(null);
	const [posts, setPosts] = useState(null);
	const [followerCount, setFollowerCount] = useState(0);
	const [followingCount, setFollowingCount] = useState(0);
	const [followersList, setFollowersList] = useState([]);
	const [followingsList, setFollowingsList] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedTab, setSelectedTab] = useState("followers");
	const [isCurrentUser, setIsCurrentUser] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);

	useEffect(() => {
		fetchUserId();
	}, []);

	useEffect(() => {
		if (userId) {
			fetchProfileData();
			fetchPosts();
		}
	}, [userId]);

	useEffect(() => {
		fetchFollowData();
	}, [username]);

	const fetchFollowData = async () => {
		try {
			const response = await fetch(`${apiurl}/api/follow/`);
			const data = await response.json();
			const filteredFollowers = data.filter((item) => item.user === username);
			const filteredFollowings = data.filter(
				(item) => item.follower === username
			);

			setFollowerCount(filteredFollowers.length);
			setFollowingCount(filteredFollowings.length);
			setFollowersList(filteredFollowers);
			setFollowingsList(filteredFollowings);
		} catch (error) {
			console.error("Error fetching follow data:", error);
		}
	};

	const fetchUserId = async () => {
		try {
			const response = await fetch(`${apiurl}/api/users/`);
			if (response.ok) {
				const data = await response.json();
				const filtereduser = data.find((item) => item.username === username);
				console.log(filtereduser);
				if (filtereduser) {
					setUserId(filtereduser.id);
				} else {
					setProfile(null);
				}
			} else {
				console.error("Error fetching profile data:", response.status);
			}
		} catch (error) {
			console.error("Error fetching profile data:", error);
		}
	};

	const fetchProfileData = async () => {
		try {
			const response = await fetch(`${apiurl}/api/profile/`);
			if (response.ok) {
				const data = await response.json();
				const filteredProfile = data.find((item) => item.user === userId);
				console.log(filteredProfile);
				if (filteredProfile) {
					setProfile(filteredProfile);
				} else {
					setProfile(null);
				}
			} else {
				console.error("Error fetching profile data:", response.status);
			}
		} catch (error) {
			console.error("Error fetching profile data:", error);
		}
	};

	async function fetchPosts() {
		try {
			const postsResponse = await fetch(`${apiurl}/api/post/`);
			const postsData = await postsResponse.json();

			const filteredPosts = postsData.filter((post) => post.user === username);

			filteredPosts.sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
			);

			setPosts(filteredPosts);
		} catch (error) {
			console.error("Error fetching leave options:", error);
		}
	}

	useEffect(() => {
		const loggedInUser = user;
		setIsCurrentUser(username === loggedInUser);
	}, [username]);

	useEffect(() => {
		const loggedInUser = user;
		const isFollowingUser = followersList.some(
			(item) => item.follower === loggedInUser && item.user === username
		);
		setIsFollowing(isFollowingUser);
	}, [username, followersList]);

	
	

	

	const handleModalToggle = () => {
		setModalVisible(!modalVisible);
	};

	const handleTabChange = (tab) => {
		setSelectedTab(tab);
	};
	
	const handleFollow = async () => {
		try {
			const response = await fetch("http://127.0.0.1:8000/api/follow/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					follower: user,
					user: username,
				}),
			});

			if (response.ok) {
				setIsFollowing(true);
				setFollowerCount(followerCount + 1);
			} else {
				console.error("Error following the user");
			}
		} catch (error) {
			console.error("Error following the user:", error);
		}
	};
	

	const handleUnfollow = async () => {
		try {

			console.log(followingsList)
			
			const relationship = followersList.find(
				(item) => item.follower === user && item.user === username
			);
			console.log(relationship)

			if (!relationship) {
				console.error("Relationship not found. Unable to unfollow.");
				return;
			}

			const response = await fetch(
				`http://127.0.0.1:8000/api/follow/${relationship.id}/`,
				{
					method: "DELETE",
				}
			);

			if (response.ok) {
				setIsFollowing(false);
				setFollowerCount(followingCount - 1);
				setFollowersList(
					followersList.filter((item) => item.id !== relationship.id)
				);
			} else {
				console.error("Error unfollowing the user");
			}
		} catch (error) {
			console.error("Error unfollowing the user:", error);
		}
	};


	if (!profile) {
		return (
			<Result
				status="404"
				title="404"
				subTitle="Sorry, the profile you searched does not exist."
				extra={
					<Button type="primary">
						<Link to="/home">Back Home</Link>
					</Button>
				}
			/>
		);
	}


		
	

	return (
		<Layout>
			<Content className="main">
				<div className="innercont">
					<div>
						{profile && (
							<div className="pf">
								<Avatar
									className="logo"
									src={<Image src={profile.profileimg} alt="avatar" />}
								/>
								<div className="pfdes">
									<div className="username">{username}</div>
									<div
										className="bio"
										dangerouslySetInnerHTML={{
											__html: profile.bio.replace(/\n/g, "<br/>"),
										}}></div>

									<Button type="link" onClick={handleModalToggle}>
										{`${followerCount} Followers | ${followingCount} Following`}
									</Button>
									{!isCurrentUser && (
										<FollowButton
											isFollowing={isFollowing}
											onFollow={handleFollow}
											onUnfollow={handleUnfollow}
										/>
									)}
								</div>
							</div>
						)}
					</div>
					<div className="userposts">
						<Card title="Posts" className="postscont">
							<div className="innerpost-container">
								{posts &&
									posts.map((post) => (
										<Card
											className="innerpost"
											key={post.id}
											cover={<img src={post.image} alt="Cover" />}
										/>
									))}
							</div>
						</Card>
					</div>
				</div>
				<Modal open={modalVisible} onCancel={handleModalToggle} footer={null}>
					<div className="tab-buttons">
						<Button
							type={selectedTab === "followers" ? "primary" : "default"}
							onClick={() => handleTabChange("followers")}>
							Followers
						</Button>
						<Button
							type={selectedTab === "following" ? "primary" : "default"}
							onClick={() => handleTabChange("following")}>
							Following
						</Button>
					</div>

					<List
						dataSource={
							selectedTab === "followers" ? followersList : followingsList
						}
						renderItem={(item) => (
							<List.Item key={item.id}>
								{selectedTab === "followers" ? item.follower : item.user}
							</List.Item>
						)}
					/>
				</Modal>
			</Content>
		</Layout>
	);
};

export default Profile;
