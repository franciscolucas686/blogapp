import { Router } from 'express';
import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import passport from 'passport';

const router = Router();

router.get('/registro', (req, res) => {
  res.render('usuarios/registro');
});

router.post('/registro', async (req, res) => {
  const { nome, email, senha, senha2 } = req.body;
  const erros = [];
  
  if (!nome || typeof nome === undefined || nome === null) {
    erros.push({ texto: 'Nome inválido' });
  }
  if (!email || typeof email === undefined || email === null) {
    erros.push({ texto: 'Email inválido' });
  }
  if (senha.length < 4) {
    erros.push({ texto: 'Senha muito curta' });
  }
  if (senha !== senha2) {
    erros.push({ texto: 'As senhas são diferentes, tente novamente!' });
  }

  if (erros.length > 0) {
    return res.render('usuarios/registro', { erros });
  }

  try {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      req.flash('error_msg', 'Já existe uma conta com este email, tente outro.');
      return res.redirect('/usuarios/registro');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senha, salt);

    const novoUsuario = new Usuario({ nome, email, senha: hash, eAdmin: 1 });
    await novoUsuario.save();

    req.flash('success_msg', 'Usuário registrado com sucesso!');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Houve um erro ao registrar o usuário, tente novamente.');
    res.redirect('/usuarios/registro');
  }
});

router.get('/login', (req, res) => {
  res.render('usuarios/login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin/postagens',
    failureRedirect: '/usuarios/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/');
    }
    req.flash('success_msg', 'Você saiu da sua conta.');
    res.redirect('/');
  });
});

export default router;
