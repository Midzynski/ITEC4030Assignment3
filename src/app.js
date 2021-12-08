"use strict"

global.__basedir = __dirname

// imports
const express = require('express')
const path = require('path')

// local imports
const util = require(__basedir + '/helpers/util')

// get cofig
const config = require(__basedir + '/config')
const {
  PORT: port,
} = config

// connect to the database
require(__basedir + '/helpers/mongoose')

// start express application
console.log(`starting application on port ${port}`)

// preparing express app
const app = express()

// Parse incoming json
app.use(express.json({ limit: '50mb' }))
// CORS
const cors = require('cors')
app.use(cors())

// Routers



/////////////////////////////////////////////////////////////edited by me/////////////////////////////////////////////////////////////

//////handlebars
const expressHandlebars = require('express-handlebars')
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', (__dirname +'/views'))


app.engine('hbs', expressHandlebars({
  
  defaultLayout: 'main',
  extname: '.hbs',
  //layoutsDir: '/views'
}))




const movieRouter = require(__basedir + '/routers/movie')
app.use(movieRouter)



app.get('/', async (req, res) => {
  let pageNum = req.query.pageNum || 1
  pageNum = Number(pageNum)

  res.redirect('/movies?page=1')
})



// 404 Page
app.get('*', (req, res) => {
  res.status(404).send({
    "err": "not found!",
  })
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send({
    err: "Something broke!"
  })
})

const server = app.listen(port, () => {
  console.log(`\nServer is up:\n\n\thttp://localhost:${port}\n\n`)
})









