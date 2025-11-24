require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
let swaggerDocument = require("./swagger/swagger.json");
const path = require("path");

const app = express();

app.use(cors({
  origin: "https://torino-final.vercel.app",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Static images
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/static", express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 6501;

// START SERVER
const startServer = (port) => {
  const server = app.listen(port, async () => {
    console.log(`Server running on port ${port}`);

    swaggerDocument.servers = [
      {
        url: `http://localhost:${port}`,
        description: "Local server",
      },
    ];

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log(`Swagger API docs: http://localhost:${port}/api-docs`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is in use, trying ${+port + 1}...`);
      startServer(+port + 1);
    } else {
      console.error("Server error:", err);
    }
  });
};

startServer(PORT);

// Routes
app.use(require("./routes/dev"));
app.use("/auth", require("./routes/auth"));
app.use("/tour", require("./routes/tour"));
app.use("/basket", require("./routes/basket"));
app.use("/user", require("./routes/user"));
app.use("/order", require("./routes/order"));

app.get("/", (req, res) => {
  res.send("Welcome to the Tour and Travel Agency API!");
});
