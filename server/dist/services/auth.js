import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// Middleware for Express with GraphQL
export const authenticateToken = (req, _, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        // For GraphQL, throw an error instead of sending a response directly
        throw new Error("Unauthorized: No token provided");
    }
    const token = authHeader.split(" ")[1];
    const secretKey = process.env.JWT_SECRET_KEY || "";
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            throw new Error("Forbidden: Invalid or expired token");
        }
        req.user = user;
        next();
    });
};
// Function to sign a token
export const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY || "";
    return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};
