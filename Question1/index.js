const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;
const BASE_URL = "http://20.244.56.144/evaluation-service";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjA2MjEzLCJpYXQiOjE3NDM2MDU5MTMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjIyNTg2NjVmLTQ4MzEtNGUzMy05MDg3LWNhYWY1NTY1M2FlNSIsInN1YiI6IjIyMDUyODk2QGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1Mjg5NkBraWl0LmFjLmluIiwibmFtZSI6ImJhbG11a3VuZCBrdW1hciIsInJvbGxObyI6IjIyMDUyODk2IiwiYWNjZXNzQ29kZSI6Im53cHdyWiIsImNsaWVudElEIjoiMjI1ODY2NWYtNDgzMS00ZTMzLTkwODctY2FhZjU1NjUzYWU1IiwiY2xpZW50U2VjcmV0IjoiUWtublJ2UXJiTkNoeXJnUSJ9.FOdbwSF9-mziz9bdJPwKk0ywJ-tRSmWY6pkpLEA8rbk"
    },
    timeout: 10000,
});

const dataCache = {
    users: null,
    posts: {},
    comments: {},
};

const fetchUsers = async () => {
    if (dataCache.users) return dataCache.users;
    const response = await apiClient.get("/users");
    dataCache.users = response.data.users;
    return dataCache.users;
};

const fetchUserPosts = async (userId) => {
    if (dataCache.posts[userId]) return dataCache.posts[userId];
    const response = await apiClient.get(`/users/${userId}/posts`);
    dataCache.posts[userId] = response.data.posts;
    return dataCache.posts[userId];
};

const fetchCommentCount = async (postId) => {
    if (postId in dataCache.comments) return dataCache.comments[postId];
    const response = await apiClient.get(`/posts/${postId}/comments`);
    dataCache.comments[postId] = response.data.comments.length;
    return dataCache.comments[postId];
};

app.get("/users", async (req, res) => {
    try {
        const users = await fetchUsers();
        const postCounts = {};

        await Promise.all(
            Object.keys(users).map(async (userId) => {
                const posts = await fetchUserPosts(userId);
                postCounts[userId] = posts.length;
            })
        );

        const topContributors = Object.entries(postCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([userId]) => ({
                id: userId,
                name: users[userId],
                postCount: postCounts[userId],
            }));

        res.json(topContributors);
    } catch (error) {
        console.error("Error fetching top users:", error);
        res.status(500).json({ error: "Failed to fetch top users" });
    }
});

app.get("/posts", async (req, res) => {
    try {
        const { type } = req.query;
        if (!type || (type !== "latest" && type !== "popular")) {
            return res.status(400).json({ error: "Invalid type parameter. Use 'latest' or 'popular'." });
        }

        const users = await fetchUsers();
        let postList = [];

        await Promise.all(
            Object.keys(users).map(async (userId) => {
                const posts = await fetchUserPosts(userId);
                postList = postList.concat(posts);
            })
        );

        if (type === "latest") {
            return res.json(postList.sort((a, b) => b.id - a.id).slice(0, 5));
        } else {
            await Promise.all(
                postList.map(async (post) => {
                    if (!(post.id in dataCache.comments)) {
                        dataCache.comments[post.id] = await fetchCommentCount(post.id);
                    }
                })
            );

            const maxComments = Math.max(...Object.values(dataCache.comments));
            const popularPosts = postList.filter(post => dataCache.comments[post.id] === maxComments);

            return res.json(popularPosts);
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
