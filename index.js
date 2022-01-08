const express = require('express')
const app = express()
const port = 3000

const moongoose = require('mongoose')
moongoose.connect('mongodb+srv://sally:1029sorrY@boiler.zmq8e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser:true, useUnifiedTopology:true
}).then(()=>{console.log('MongoDB Succcess...')}).catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})