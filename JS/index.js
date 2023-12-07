const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
app.use(cors());



const usuarioSchema = mongoose.Schema({
  login: { type: String, required: true, unique: true },
  email: {type: String, required: true, unique: true},
  senha: { type: String, required: true, unique: true }
})

usuarioSchema.plugin(uniqueValidator);
const Usuario = mongoose.model("Usuario", usuarioSchema);
//conexao com o banco
async function conectarMongoDB() {
  await mongoose.connect(`mongodb+srv://leocaloni:1234@cluster0.9luxuel.mongodb.net/?retryWrites=true&w=majority`);
}

//criar usuario de login para o bando de dados
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

//chamada pra login banco de dados
app.post("/login", async (req, res) => {
  try {
      console.log('Rota /login foi chamada');
      const email = req.body.email;
      const senha = req.body.senha;

      const usuario = await Usuario.findOne({ email: email });

      if (!usuario) {
          console.log('Credenciais inválidas. Usuário não encontrado.');
          res.status(401).send('Credenciais inválidas. Tente novamente.');
          return;
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (senhaCorreta) {
          console.log('Login bem-sucedido:', usuario);
          
          const token = jwt.sign({ email: usuario.email, nome: usuario.login }, 'chave-secreta', { expiresIn: '1h' });
          res.status(200).json({ token: token, nome: usuario.login });

      } else {
          console.log('Credenciais inválidas. Senha incorreta.');
          res.status(401).send('Credenciais inválidas. Tente novamente.');
      }
  } catch (error) {
      console.error('Erro ao realizar login:', error);
      res.status(500).send('Erro interno do servidor.');
  }
});


//deslogar a conta do site
app.post("/logout", (req, res) => {
  res.status(200).send("Logout realizado com sucesso.");
});

const LanceSchema = mongoose.Schema({
  nome: { type: String },
  valor_lance: { type: String }
});

const Lance = mongoose.model("Lance", LanceSchema);

//aba lances mongodb
app.get("/lances", async (req, res) => {
  const lances = await Lance.find();
  res.json(lances);
})

app.post("/lances", async (req, res) => {
  const nome = req.body.usuarioLogado;
  const valor_lance = req.body.valor_lance;

  const lance = new Lance({ nome: nome, valor_lance: valor_lance });
  await lance.save();

  const lances = await Lance.find();
  res.json(lances);
});



//mostrar que o start esta funcionando npm start
app.listen(3000, () => {
  try {
    conectarMongoDB();
    console.log("up and running")
  } catch (e) {
    console.log("erro: ", e);
  }
});

