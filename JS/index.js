const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());
app.use(cors());

const Lance = mongoose.model("Lance", mongoose.Schema({
  nome: { type: String },
  valor_lance: { type: Number }
}))

const usuarioSchema = mongoose.Schema({
  login: { type: String, required: true, unique: true },
  email: {type: String, required: true, unique: true},
  senha: { type: String, required: true, unique: true }
})

usuarioSchema.plugin(uniqueValidator);
const Usuario = mongoose.model("Usuario", usuarioSchema);

async function conectarMongoDB() {
  await mongoose.connect(`mongodb+srv://leocaloni:1234@cluster0.9luxuel.mongodb.net/?retryWrites=true&w=majority`);
}

app.get("/lances", async (req, res) => {
  const lances = await Lance.find();
  res.json(lances);
})

app.post("/lances", async (req, res) => {
  try {
    const nome = req.body.login; 
    const valor_lance = req.body.valor_lance;

    const lance = new Lance({ nome: nome, valor_lance: valor_lance });

    await lance.save()

    const lances = await Lance.find();
    res.json(lances);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno do servidor.");
  }
})

app.post("/signup", async (req, res) => {
  try {
    const login = req.body.login;
    const email = req.body.email;
    const senha = req.body.senha;
    const criptografada = await bcrypt.hash(senha, 10);
    const usuario = new Usuario({ login: login, email: email, senha: criptografada });
    const respMongo = await usuario.save();
    console.log(respMongo);
    res.status(201).end();
  } catch (e) {
    console.log(e);
    res.status(409).end();
  }
});


  app.post("/verificar-usuario", async (req, res) => {
    try {
      const login = req.body.login;
      const email = req.body.email;

      
      const usuarioExistente = await Usuario.exists({ $or: [{ login }, { email }] });

      res.json({ usuarioExistente });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro interno do servidor.");
    }
  });





app.listen(3000, () => {
  try {
    conectarMongoDB();
    console.log("up and running")
  } catch (e) {
    console.log("erro: ", e);
  }
});
