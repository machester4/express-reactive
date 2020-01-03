const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const reactiveApp = require("./lib")(app, io);
const types = require("./lib/types");

app.use(express.json());

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

const query = {
  name: types.required.string,
  age: types.number,
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

reactiveApp.append("/user", query, mutatorA);
reactiveApp.append("/user", query, mutatorB);
reactiveApp.append("/user", query, mutatorC);

http.listen(3000, function() {
  console.log("listening on *:3000");
});
