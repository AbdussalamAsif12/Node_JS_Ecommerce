import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import categoryRoutes from "./routes/category.routes.js"
import productRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import filterRoues from "./routes/filter.routes.js"
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true // this line
}))
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // this line
app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/filter", filterRoues);

export { app }