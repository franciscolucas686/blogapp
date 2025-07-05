import flash from 'connect-flash';
import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Postagem from './models/Postagem.js';
import admin from './routes/admin.js';
import usuario from './routes/usuario.js';
import passport from 'passport';
import configPassport from './config/auth.js';
import db from './config/db.js';
import adminRoutes from './routes/admin.js';


const app = express();

// Configurações
// Sessão
app.use(
  session({
    secret: 'cursodenode',
    resave: true,
    saveUninitialized: true
  })
);
// Passport e Flash
app.use(passport.initialize());
app.use(passport.session());
configPassport(passport);
app.use(flash());
// Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
// Variaveis de caminho no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Handlebars
app.engine(
  'hbs',
  handlebars.engine({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts')
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
//Bootstrap e CSS
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'public')));
// Mongoose com IIFE - Immediately Invoked Function Expression
(async () => {
  try {
    await mongoose.connect(db.mongoURI);
    console.log('Conectado ao mongo');
  } catch (error) {
    console.error('Erro ao se conectar:', error);
  }
})();

// Rotas
app.get('/', async (req, res) => {
  try {
    const postagens = await Postagem.find().populate('categoria').sort({ data: 'desc' }).lean();
    res.render('index', { postagens });
  } catch (err) {
    req.flash('error_msg', 'Houve um erro ao carregar as postagens');
    res.redirect('/404');
  }
});

app.get('/postagem/:slug', (req, res) => {
  res.redirect(`/admin/postagem/${req.params.slug}`);
});

app.get('/404', (req, res) => {
  res.send('Erro 404!');
})

app.use('/admin', admin);
app.use('/usuarios', usuario);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
