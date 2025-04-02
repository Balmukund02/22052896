# Social Media Analytics Microservice

## Overview
This project is a microservice built using **Node.js** and **Express** that interacts with an external evaluation service API to fetch user and post data. It provides insights into social media activity, such as the most active users and the most popular posts.

## Features
- **Fetch top 5 contributors** based on post count.
- **Retrieve latest posts** sorted by ID.
- **Fetch most popular posts** based on comment count.

## Prerequisites
Ensure you have the following installed:
- Node.js (v14 or later)
- npm (Node Package Manager)

## Setup Instructions
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/social-media-analytics.git
   ```
2. Navigate to the project directory:
   ```sh
   cd social-media-analytics
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the server:
   ```sh
   node index.js
   ```
5. The server will run at `http://localhost:3000/`

## API Endpoints

Refer to images folder for image of api fetched.

### 1. Fetch Top Contributors
**Endpoint:**
```sh
GET /users
```
**Response:**
```json
[
  {
    "id": "1",
    "name": "John Doe",
    "postCount": 15
  },
  {
    "id": "2",
    "name": "Jane Smith",
    "postCount": 12
  }
]
```

---
### 2. Fetch Posts (Latest or Popular)
**Endpoint:**
```sh
GET /posts?type=latest
GET /posts?type=popular
```

**Example Response for Latest Posts:**
```json
[
  {
    "id": 101,
    "userId": "1",
    "title": "My New Blog Post",
    "content": "Hello World!"
  }
]
```

**Example Response for Popular Posts:**
```json
[
  {
    "id": 95,
    "userId": "3",
    "title": "Trending Topic!",
    "content": "This post went viral!"
  }
]
```

## Caching Strategy
To optimize API calls, the service uses an in-memory caching mechanism for:
- **Users**
- **Posts per user**
- **Comment count per post**

## Images for Reference
- Below is an API response example:
  ![API Response Screenshot](uploads/response-example.jpg)

- Server Logs Example:
  ![Server Logs](uploads/server-logs.jpg)

## Error Handling
If an API request fails, the server responds with:
```json
{
  "error": "Failed to fetch data"
}
```
Common error scenarios:
- Missing `type` parameter in `/posts`
- API timeout from the external evaluation service

## Conclusion
This project demonstrates how to build a social media analytics microservice efficiently using Express.js and caching techniques. It can be expanded further to support more analytics and additional features.

---


