// Import json-server
const jsonServer = require("json-server");

// Create the server
const server = jsonServer.create();

// Use your db.json file
const router = jsonServer.router("db.json");

// Apply default middlewares (CORS, logging, etc.)
const middlewares = jsonServer.defaults();

// Choose port (Render gives PORT automatically)
const port = process.env.PORT || 8080;

// Use middlewares and routes
server.use(middlewares);
server.use(router);

// Start server
server.listen(port, () => {
  console.log(`🚀 Melodia Data Server running on port ${port}`);
});
