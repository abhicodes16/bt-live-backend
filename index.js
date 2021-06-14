const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const mongoURL = require("./util/mongodbURL")

const app = express();

//socket io
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.json());
app.use(cors());

const config = require("./config");

//live view model
const LiveView = require("./server/liveView/liveView.model");

//model routes
const AdminRoute = require("./server/admin/admin.route");
app.use("/admin", AdminRoute);

//user routes
const UserRoute = require("./server/user/user.route");
app.use("/user", UserRoute);

//country routes
const CountryRoute = require("./server/country/country.route");
app.use("/country", CountryRoute);

//chat route
const ChatRoute = require("./server/chat/chat.route");
app.use("/chat", ChatRoute);

//chat topic route
const ChatTopicRoute = require("./server/chatTopic/chatTopic.route");
app.use("/chatTopic", ChatTopicRoute);

//sticker route
const StickerRoute = require("./server/sticker/sticker.route");
app.use("/sticker", StickerRoute);

//emoji route
const EmojiRoute = require("./server/emoji/emoji.route");
app.use("/emoji", EmojiRoute);

//image route
const ImageRoute = require("./server/image/image.route");
app.use("/image", ImageRoute);

//random route
const RandomRoute = require("./server/random/random.route");
app.use("/", RandomRoute);

//live comment route
const LiveCommentRoute = require("./server/liveComment/liveComment.route");
app.use("/livecomment", LiveCommentRoute);

//live view route
const LiveViewRoute = require("./server/liveView/liveView.route");
app.use("/liveview", LiveViewRoute);

//category route
const CategoryRoute = require("./server/category/category.route");
app.use("/category", CategoryRoute);

//gift route
const GiftRoute = require("./server/gift/gift.route");
app.use("/gift", GiftRoute);

//feedback route
const FeedbackRoute = require("./server/feedback/feedback.route");
app.use("/feedback", FeedbackRoute);

//follower route
const FollowerRoute = require("./server/follower/follower.route");
app.use("/", FollowerRoute);

//favorite route
const FavouriteRoute = require("./server/favourite/favourite.route");
app.use("/", FavouriteRoute);

//plan route
const PlanRoute = require("./server/plan/plan.route");
app.use("/plan", PlanRoute);

//history route
const HistoryRoute = require("./server/history/history.route");
app.use("/history", HistoryRoute);

//notification route
const NotificationRoute = require("./server/notification/notification.route");
app.use("/", NotificationRoute);

//dashboard route
const DashboardRoute = require("./server/dashboard/dashboard.route");
app.use("/dashboard", DashboardRoute);

//setting route
const SettingRoute = require("./server/setting/setting.route");
app.use("/setting", SettingRoute);

//redeem User
const RedeemRoute = require("./server/redeem/redeem.route");
app.use("/redeem", RedeemRoute);

app.use(express.static(path.join(__dirname, "public")));
app.use("/storage", express.static(path.join(__dirname, "storage")));


app.use(express.static(path.join(__dirname, "public")));
app.use("/uploadFiles", express.static(path.join(__dirname, "uploadFiles")));

app.get("/*", function (req, res) {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("MONGO: successfully connected to db");
});

//socket io
io.on("connect", (socket) => {
  //The moment one of your client connected to socket.io server it will obtain socket id
  //Let's print this out.
  console.log(`Connection : SocketId = ${socket.id}`);

  const { room } = socket.handshake.query;
  const { chatroom } = socket.handshake.query;

  console.log("room " + room);
  console.log("chat room " + chatroom);

  socket.join(room);
  socket.join(chatroom);

  socket.on("msg", (data) => {
    console.log("comment" + data);
    io.in(room).emit("msg", data);
  });

  socket.on("filter", (data) => {
    console.log("filter" + data);
    io.in(room).emit("filter", data);
  });

  socket.on("gif", (data) => {
    console.log("gif" + data);
    io.in(room).emit("gif", data);
  });

  socket.on("sticker", (data) => {
    console.log("sticker" + data);
    io.in(room).emit("sticker", data);
  });

  socket.on("emoji", (data) => {
    console.log("emoji" + data);
    io.in(room).emit("emoji", data);
  });

  socket.on("gift", (data) => {
    console.log("gift" + data);
    io.in(room).emit("gift", data);
  });

  socket.on("chat", async (data) => {
    console.log("chat" + data);
    io.in(chatroom).emit("chat", data);
  });

  socket.on("viewadd", async (data) => {
    console.log("add view" + data);

    const isUserExist = await LiveView.exists({ user_id: data.user_id });

    if (!isUserExist) {
      const view = new LiveView();

      view.user_id = data.user_id;
      view.name = data.name;
      view.image = data.image;
      view.token = data.token;

      await view.save();
    }

    const count = await LiveView.find({ token: data.token }).countDocuments();
    console.log(count);
    io.in(room).emit("view", count);
  });

  socket.on("viewless", async (data) => {
    console.log("less view" + data);

    const view = await LiveView.findOne({
      $and: [{ user_id: data.user_id }, { token: data.token }],
    });

    if (view) {
      await view.deleteOne();
    }

    const count = await LiveView.find({ token: data.token }).countDocuments();
    console.log(count);
    io.in(room).emit("view", count);
  });

  socket.on("ended", (data) => {
    console.log("ended" + data);
    io.in(room).emit("ended", data);
  });

  socket.on("refresh", (data) => {
    console.log("refresh" + data);
    io.in(room).emit("refresh", data);
  });

  socket.on("disconnect", function () {
    console.log("One of sockets disconnected from our server.");
  });
});

//start the server
server.listen(config.PORT, () => {
  console.log("Magic happens on port " + config.PORT);
});
