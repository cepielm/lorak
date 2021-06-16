const sql = require('mssql')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

const sqlConfig = {
  user: 'admin',
  password: 'AQQaqq123',
  database: 'lorak',
  server: '10.20.10.2',
  trustServerCertificate: true
}

const poolPromise = sql.connect(sqlConfig)

app.get('/', (req, res)=>{
  poolPromise.then(() => sql.query(`select id_user,firstname_user,lastname_user,login_user from api`)
  ).then(result => res.send(result.recordset)
  )
})


app.post('/dupa', (req, res)=>{

  const {firstName, lastName, login, pass} = req.body
  console.log(req.body)
  poolPromise.then(() => sql.query(`INSERT INTO api(firstname_user,lastname_user,login_user,password_user) values('${firstName}','${lastName}','${login}', '${pass}')`)
  ).then(result => res.send('ok')
  ).catch((err)=>{
    if (err.text==="") res.send("mail juz istnieje")
  })
})

app.listen(8081);