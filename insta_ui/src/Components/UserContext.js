import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [userId, setUserId] = useState("");
	const [token,setToken] = useState(null);
	

	
	const apiurl = process.env.REACT_APP_API_URL;


	

	useEffect(() => {
		
		
		const storedUserId = localStorage.getItem("userId");
		if (storedUserId) {
			setUserId(storedUserId);
		}
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(storedUser);
		}

		

		const storedToken = localStorage.getItem("token");
		if (storedToken) {
			setToken(storedToken);
		}

		setIsLoading(false);
	}, []);

	useEffect(() => {
		const storedUserId = sessionStorage.getItem("userId");
		if (storedUserId) {
			setUserId(storedUserId);
		}
		

		const storedUser = sessionStorage.getItem("user");
		if (storedUser) {
			setUser(storedUser);
		}

		

		const storedToken = sessionStorage.getItem("token");
		if (storedToken) {
			setToken(storedToken);
		}

		setIsLoading(false);
	}, []);

	const handleSessionLogin = (id,user) => {
		
		setUserId(id);
		setUser(user);
		sessionStorage.setItem("userId", id);
		
		sessionStorage.setItem("user", user);
	};

	

	

	const handlesetSessionToken = (token) => {
		setToken(token);
		sessionStorage.setItem("token", token);
	}

	const handleLogin = (id,user) => {
		
		setUserId(id);
		setUser(user);
		localStorage.setItem("userId", id);
		localStorage.setItem("user", user);
	};

	

	
	const handleLogout = () => {
		setUserId("");
		setUser(null);
		setToken(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		localStorage.removeItem("userId");
		sessionStorage.removeItem("userId");
		sessionStorage.removeItem("user");
		sessionStorage.removeItem("token");
	};

	const handlesetToken = (token) => {
		setToken(token);
		localStorage.setItem("token", token);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<UserContext.Provider
			value={{
				user,
				handleLogin,
				handleLogout,
				handlesetToken,
				handleSessionLogin,
				handlesetSessionToken,
				token,
				apiurl,
				userId,
			}}>
			{children}
		</UserContext.Provider>
	);
};
