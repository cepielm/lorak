var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const {Connection, Request} = require("tedious");

const executeSQL = (sql, callback) => {
  let connection = new Connection({
    "authentication": {
      "options": {
        "userName": "admin",
        "password": "AQQaqq123"
      },
      "type": "default"
    },
    "server": "10.20.10.2",
    "options": {
      "validateBulkLoadParameters": false,
      "rowCollectionOnRequestCompletion": true,
      "database": "Lorak",
      "encrypt": true
    }
  });

  connection.connect((err) => {
    if (err)
      return callback(err, null);

    const request = new Request(sql, (err, rowCount, rows) => {
      connection.close();

      if (err)
        return callback(err, null);

      callback(null, {rowCount, rows});
    });

    connection.execSql(request);
  });
};

executeSQL("SELECT * FROM api", (err, data) => {
  if (err)
    console.error(err);

  console.log(data.rowCount);
});

app.use(express.urlencoded({
    extended: true}))
app.use(bodyParser.urlencoded({
        extended: true
      }));


app.get('/', function(request, response) {
    console.log(executeSQL())
	//response.send(executeStatement())
});

app.post('/dupa', function(request, response) {
    console.log(request)
    response.send(200);
});

app.listen(8081);
console.log(`Running on http://0.0.0.0:8080`);
