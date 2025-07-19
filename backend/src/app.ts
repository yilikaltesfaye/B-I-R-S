import express from "express";
import cookieParser from "cookie-parser";
// import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import AuthRoutes from "./modules/auth/auth.routes";
import UserRoutes from "./modules/user/user.routes";
import AuthorityRoutes from "./modules/authority/authority.routes";
import ReportRoutes from "./modules/report/report.routes";
import CategoryRoutes from "./modules/category/category.routes";
import CommentRoutes from "./modules/comment/conmment.routes";

import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// app.use(cors({ origin: "https:localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", AuthRoutes);
app.use("/users", UserRoutes);
app.use("/authorities", AuthorityRoutes);
app.use("/reports", ReportRoutes);
app.use("/categories", CategoryRoutes);
app.use("/comments", CommentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
