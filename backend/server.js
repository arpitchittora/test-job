require("dotenv").config();
const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
//Routes
var swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT;

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'));
var publicDir = require('path').join(__dirname, '/uploads');
app.use(express.static(publicDir));


//DB Connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: true, //this is the code I added that solved it all
  keepAlive: true,
  poolSize: 10,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  console.log("connected to mongo");
})
  .catch((err) => {
    console.log("error: ", err);
  });

mongoose.connection.on("connected", () => {
  open = true;
  console.log("Mongoose Database is Connected.");
});
mongoose.connection.on("error", (err) => {
  console.log("Coudln't connect to database. Error: ", err);
});
mongoose.connection.on("disconnected", () => {
  open = false;

  console.log("Database has been disconnected.");
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/users", require("./routes/users"));

//Initalize Server
var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Ecommerce app listening at http://%s:%s", host, port)
})