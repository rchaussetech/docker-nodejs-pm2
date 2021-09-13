// IMPORTAÇÃO DOS MODULOS DO NPM
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

// CONFIGURAÇÃO DO MONGODB
const { MONGODB_URL } = process.env

// EVENTOS DO MONGOOSE
mongoose.connection.on('connected', () => console.log('Mongoose is connected'))
mongoose.connection.on('error', err => console.error(err))
mongoose.connect(MONGODB_URL)

// MONGOOSE MODEL
const Person = mongoose.model('People', new mongoose.Schema({
  name: String,
  age: Number
}))

// CRIAÇÃO DO EXPRESS APP
const app = express()

// MIDDLEWARE QUE PODE SER USADO PARA HABILITAR CORS COM VÁRIAS OPÇÕES
app.use(cors())

// NODE.JS BODY PARSING MIDDLEWARE
app.use(bodyParser.json())

// DEFINIÇÃO DA ROTA BASE
app.get('/', (req, res) => res.send('Olá Mundo!'))

// DEFINIÇÃO DAS ROTAS DE PESSOA
app.route('/person')
  .post(createPerson)
  .get(readPerson)
  .put(updatePerson)
  .delete(deletePerson)

// CRIAÇÃO DO SERVIDOR HTTP
const server = http.createServer(app)

// FAZ O SERVIDOR RESPONDER NA PORTA 3000
server.listen(3000, () => console.log('Servidor rodando na porta %s.', 3000))

async function createPerson (req, res) {
  const person = new Person({
    name: req.body.name,
    age: req.body.age
  })
  
  await person.save()
  
  res.json('ok')
}

async function readPerson (req, res) {
  res.json(await Person.find())
}

async function updatePerson (req, res) {
  const query = Person.where({ _id: req.body._id })

  const person = await query.findOne()

  person.name = req.body.name
  person.age = req.body.age

  await person.save()

  res.json('ok')
}

async function deletePerson (req, res) {
  const query = Person.where({ _id: req.body._id })

  await query.deleteOne()

  res.json('ok')
}
