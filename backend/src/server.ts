import "./config/env.js";
import express from "express";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import aiStreamRoutes from "./routes/ai.stream.routes.js";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();
connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai/stream", aiStreamRoutes);


app.get("/", (_req, res) => {
  res.send("Backend running 🔥");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server running");
});
