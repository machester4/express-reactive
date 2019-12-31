const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const libsv = require("./lib");

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

const queryA = {
  name: "string",
  age: "number",
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

const lib = new libsv(app, io);
lib.append("/user", queryA, mutatorA);
lib.append("/user", queryA, mutatorB);
lib.append("/user", queryA, mutatorC);

http.listen(3000, function() {
  console.log("listening on *:3000");
});
