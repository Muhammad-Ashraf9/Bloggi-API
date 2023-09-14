# Bloggi-API
- Bloggi is a RESTful API that provides full CRUD operations for blog posts and allows real-time post updates using websockets. Developers can easily integrate Bloggi into applications to enable creating, reading, updating, and deleting blog content.
## Features
- RESTful API endpoints enabling CRUD operations on blog posts
- JWT and bcrypt for authentication and security of API access
- Socket.IO for real-time communication between client and server
- Posts are instantly broadcasted to connected clients on create/update/delete
- Comprehensive POST, GET, PUT, DELETE routes for seamless blog post management
- Robust error handling and input validation for reliability and stability
## Packages
- bcrypt: ^5.1.1
- body-parser: ^1.20.2
- cors: ^2.8.5
- dotenv: ^16.3.1
- express: ^4.18.2
- express-validator: ^7.0.1
- jsonwebtoken: ^9.0.1
- mongoose: ^7.4.3
- multer: ^1.4.5-lts.1
- socket.io: ^4.7.2
