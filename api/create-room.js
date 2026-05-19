
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const FILE = "./data/rooms.json";

function read() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE));
}

function write(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  const { username, password } = req.body;

  const rooms = read();

  for (const key in rooms) {
    if (rooms[key].users.find(u => u.username === username)) {
      return res.status(400).json({ error: "Username exists" });
    }
  }

  const roomKey = uuidv4();
  const hash = await bcrypt.hash(password, 10);

  rooms[roomKey] = {
    users: [{ username, password: hash }]
  };

  write(rooms);

  res.json({ roomKey });
}
