import express from 'express';
import handlebars from 'express-handlebars';
import admin from './routes/admin.js';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import session from 'express-session';  
import flash from 'connect-flash';

const app = express();

// Configurações
  // Sessão e Flash
    app.use(session({
      secret: 'cursodenode',
      resave: true,
      saveUninitialized: true
    }));
    app.use(flash()); 
  // Middleware
    app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      next();
    });
  // Variaveis de caminho no ES Modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
  // Body Parser
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
  //Handlebars
    app.engine('hbs', handlebars.engine({
      defaultLayout: 'main',
      extname: '.hbs',
      layoutsDir: path.join(__dirname, 'views', 'layouts'),
    }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, 'views'));
  //Bootstrap e CSS
    app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
    app.use(express.static(path.join(__dirname, 'public')));
  // Mongoose com IIFE - Immediately Invoked Function Expression
    (async () => {
      try {
        await mongoose.connect('mongodb://localhost/blogapp');
        console.log('Conectado ao mongo');
      } catch (error) {
        console.error('Erro ao se conectar:', error);
      }
    }
    )();

app.use('/admin', admin);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
