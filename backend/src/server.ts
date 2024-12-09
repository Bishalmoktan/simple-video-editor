import app from "./app";

// Server Configuration
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Increase server timeout for large video processing
server.timeout = 0;
