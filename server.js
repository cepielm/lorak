const sql = require('mssql')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var auth

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

app.get('/showusers', (req, res)=>{
  poolPromise.then(() => sql.query(`select id_user,firstname_user,lastname_user,login_user from api`)
  ).then(result => res.send(result.recordset)
  ).catch((err)=>{
    console.log(err)
  })
})

app.get('/showhierarchy_mapping', (req, res)=>{
  poolPromise.then(() => sql.query(`
  SELECT trum.UnitCode,CONCAT(a.firstname_user,'   ',a.lastname_user) as UserId
  FROM tb_ref_unit_mapping trum
  INNER JOIN Api a ON a.id_user=trum.UserId
  `)
  ).then(result => res.send(result.recordset)
  ).catch((err)=>{
    console.log(err)
  })
})
app.get('/showmasterunit', (req, res)=>{
  poolPromise.then(() => sql.query(`
  SELECT tru.UnitCode
	  ,tru.UnitName
	  ,tru.UnitDescription
	  ,tru.IncrPct FROM  tb_ref_unit tru`)
  ).then(result => res.send(result.recordset)
  ).catch((err)=>{
    console.log(err)
  })
})
app.get('/showprocess', (req, res)=>{
  poolPromise.then(() => sql.query(`
  SELECT idPayee
  ,UnitId
  ,UnitCode
  ,id_user_PPM
  ,PayPlanManagerFirstName
  ,PayPlanManagerLastName
  ,lastname
  ,FirstName
  ,BasePayFTE
  ,BasePayIncPct
  ,BasePayIncr FROM tb_Process`)
  ).then(result => res.send(result.recordset)
  ).catch((err)=>{
    console.log(err)
  })
})

 




app.post('/adduser', (req, res)=>{

  const {firstName, lastName, login, pass} = req.body
  console.log(req.body)
  poolPromise.then(() => sql.query(`INSERT INTO api(firstname_user,lastname_user,login_user,password_user) values('${firstName}','${lastName}','${login}', '${pass}')`)
  ).then(result => res.send('ok')
  ).catch((err)=>{
    console.log(err)
  })
})


app.post('/runProcess', (req, res)=>{

  const {incrpct, unitcode} = req.body
  console.log(req.body)
  poolPromise.then(() => sql.query(`UPDATE tb_ref_unit SET IncrPct =${incrpct} WHERE UnitCode = '${unitcode}' exec runprocess`)
  ).then(result => res.send('ok')
  ).catch((err)=>{
    console.log(err)
  })
})

app.post("/removeuser", (req, res) => {
  const selectedUsersIds = req.body.selectedUsersIds
  poolPromise.then(() => sql.query(`DELETE FROM api WHERE id_user IN (${selectedUsersIds})`)
  ).then(result => res.sendStatus(200)
  ).catch((err)=>{
    console.log(err)
  })
})


app.get('/showhierarchy', (req, res)=>{
  poolPromise.then(() => sql.query(`
  SELECT UnitMappingId
	  ,UnitCode
	  ,UserId	 FROM [tb_ref_unit_mapping]
  `)
  ).then(result => res.send(result.recordset)
  )
})

app.get('/showpayee', (req, res)=>{
  poolPromise.then(() => sql.query(`
  SELECT
  is_active
  ,lastname
  ,firstname
  ,email
  ,birth_date
  ,home_phone
  ,unit_code
   FROM  Payee
  `)
  ).then(result => res.send(result.recordset)
  )
})

app.get('/showunit', (req, res)=>{
  poolPromise.then(() => sql.query(`
  SELECT
  tru.UnitCode
 FROM  tb_ref_unit tru
  `)
  ).then(result => res.send(result.recordset)
  )
})

app.post('/login', (req, res)=>{
  const {login, pass} = req.body
  poolPromise.then(() => sql.query(`SELECT login_user,password_user FROM Api where login_user='${login}' and password_user='${pass}'`)
  ).then(result => {
    res.sendStatus(200)
    if(result.rowsAffected == 1 ){
      auth = 'true'
    }
    else{
      auth = 'false'
    }
  }
  )
})


app.post('/logout', (req, res)=>{
  res.sendStatus(200)
  auth = 'false'
})

app.get('/authenticate', (req, res)=>{
    res.send(auth)
})


app.listen(8081);

