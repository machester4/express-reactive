const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const subscriber = require("./lib")(app, io);
const types = require("./lib/types");

app.use(express.json());

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

const queryA = {
  name: types.required.string,
  age: types.string,
  handler: query => Date.now()
};

const mutatorA = {
  method: "POST",
  handler: data => "mutator [POST]"
};
const mutatorB = {
  method: "PUT",
  handler: data => "mutator [PUT]"
};
const mutatorC = {
  method: "DELETE",
  handler: data => "mutator [DELETE]"
};

subscriber.append("/user", queryA, mutatorA);
subscriber.append("/user", queryA, mutatorB);
subscriber.append("/user", queryA, mutatorC);

http.listen(3000, function() {
  console.log("listening on *:3000");
});
