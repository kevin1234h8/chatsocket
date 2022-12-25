const io = require("socket.io")("chatsocket-gold.vercel.app", {
  cors: {
    origin: "https://kevin-chatweb.netlify.app",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //*when connect

  console.log("User connected");
  io.emit("welcome", "hello from the socket server");

  socket.on("addUser", (data) => {
    addUser(data, socket.id);
    io.emit("getUsers", users);
  });

  //*send and get message

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);

    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //*when disconnect

  socket.on("disconnect", () => {
    console.log("a user disconnect");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
