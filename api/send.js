import fs from "fs";

const FILE = "./data/messages.json";

function read() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE));
}

function write(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  const { roomKey, username, message } = req.body;

  const messages = read();

  if (!messages[roomKey]) messages[roomKey] = [];

  messages[roomKey].push({
    username,
    message,
    time: Date.now()
  });

  write(messages);

  res.json({ success: true });
}
