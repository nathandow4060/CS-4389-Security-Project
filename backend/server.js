//Initialize server via express
//run "npm run devstart" to start local server. Each time project is saved, the server updates.
const express = require('express')
const app = express()
const port = 3000

//create example route
const helloworldRouter = require("./routes/helloworld")

app.use("/helloworld", helloworldRouter)   

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//npm i ejs; This is a view engine that can be used to render html