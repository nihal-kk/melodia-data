// server.js
import jsonServer from "json-server";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json")); // mounts db.json resources
const middlewares = jsonServer.defaults({ static: "public" });

const PORT = process.env.PORT || 5000;

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

// --- Root info
server.get("/", (req, res) => {
  res.send("🎶 Melodia JSON Server is running (root routes enabled)");
});

/*
  -- Login/Register/Logout --
  (keeps the auth helpers you already use)
*/
server.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = router.db;
  const user = db.get("users").find({ email, password }).value();

  if (user) {
    db.get("users").find({ id: user.id }).assign({ loggedIn: true }).write();
    return res.status(200).json({ success: true, user });
  }
  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

server.post("/logout", (req, res) => {
  const { id } = req.body;
  const db = router.db;
  const user = db.get("users").find({ id }).value();

  if (user) {
    db.get("users").find({ id }).assign({ loggedIn: false }).write();
    return res.status(200).json({ success: true, message: "User logged out" });
  }
  return res.status(404).json({ success: false, message: "User not found" });
});

server.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const db = router.db;
  const existing = db.get("users").find({ email }).value();
  if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

  const newUser = { id: Date.now(), username: name, email, password, role: "user", plan: "free", loggedIn: false };
  db.get("users").push(newUser).write();
  return res.status(201).json({ success: true, user: newUser });
});

server.post("/history", (req, res) => {
  const { userId, song } = req.body;
  const db = router.db;
  const user = db.get("users").find({ id: userId }).value();
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  db.get("history").push(song).write();
  return res.status(200).json({ success: true, message: "Song added to history" });
});

/*
  --- Mount router AT ROOT ---
  This gives you endpoints like:
    GET  /trending
    GET  /liked
    GET  /mylist
    GET  /allSongs
    GET  /users
    POST /liked
    etc.
*/
server.use("/", router);

/*
  --- Helpful aliases so your frontend routes keep working if you used /user (singular) ---
  - GET /user     -> returns all users (same as /users)
  - GET /user/:id -> returns single user (same as /users/:id)
  - PUT /user/:id -> update user (same as /users/:id)
  - DELETE /user/:id -> delete (same as /users/:id)
*/
server.get("/user", (req, res) => {
  const db = router.db;
  const users = db.get("users").value();
  res.json(users);
});

server.get("/user/:id", (req, res) => {
  const db = router.db;
  const id = isNaN(Number(req.params.id)) ? req.params.id : Number(req.params.id);
  const user = db.get("users").find({ id }).value();
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

server.put("/user/:id", (req, res) => {
  const db = router.db;
  const id = isNaN(Number(req.params.id)) ? req.params.id : Number(req.params.id);
  const updates = req.body;
  const user = db.get("users").find({ id }).assign(updates).write();
  res.json(user);
});

server.delete("/user/:id", (req, res) => {
  const db = router.db;
  const id = isNaN(Number(req.params.id)) ? req.params.id : Number(req.params.id);
  db.get("users").remove({ id }).write();
  res.status(204).end();
});

/*
  If you want singular aliases for other collections (e.g., /liked)
  they already exist at root: GET /liked, POST /liked, etc.
  But if you used /like or different names, we can alias them similarly.
*/

// Start server
server.listen(PORT, () => {
  console.log(`✅ Melodia backend running at http://localhost:${PORT}/`);
});
