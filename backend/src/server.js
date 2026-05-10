require("dotenv").config();

const app = require("./app");
const { verifyDbConnection } = require("./config/db");

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is required in environment variables.");
    }

    await verifyDbConnection();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
