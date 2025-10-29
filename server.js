// import jsonServer from "json-server";
// import cors from "cors";

// const server = jsonServer.create();
// const router = jsonServer.router("db.json"); // Your database file
// const middlewares = jsonServer.defaults();

// server.use(cors());
// server.use(middlewares);
// server.use(jsonServer.bodyParser);
// server.use(router);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🎶 Melodia JSON Server running on port ${PORT}`);
// });

// server.js
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json"); // <- your db.json file
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 5000;

server.use(middlewares);
server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
