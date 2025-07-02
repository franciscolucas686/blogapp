import { Router } from 'express';

const router = Router();

router.get('/registro', (req, res) => {
  res.render('usuarios/registro');
});

router.post('/registro', (req, res) => {
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
    res.render('usuarios/registro', { erros });
  } else {
    Usuario.findOne({ email: email }).then(usuario => {
      if (usuario) {
        req.flash('error_msg', 'Já existe uma conta com este email, tente outro.');
        res.redirect('/usuarios/registro');
      } else {
        const novoUsuario = new Usuario({ nome, email, senha });

        bcrypt.genSalt(10, (err, salt) => { 
          bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
            if (erro) {
              req.flash('erro_msg', 'Houve um erro ao registrar o usuário, tente novamente.');
              res.redirect('/');
            }
            novoUsuario.senha = hash;

            novoUsuario.save().then(() => {
              req.flash('success_msg', 'Usuário registrado com sucesso!');
              res.redirect('/');
            }).catch(err => {
              req.flash('error_msg', 'Houve um erro ao registrar o usuário, tente novamente.');
              res.redirect('/usuarios/registro');
            });
            
          });
        });
      }
    }).catch(err => {
      req.flash('error_msg', 'Houve um erro interno, tente novamente.');
      res.redirect('/usuarios/registro');
    });
  }
});

export default router;
