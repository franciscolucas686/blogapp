import localStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';

export default function configPassport(passport) {
  passport.use(
    new localStrategy({ usernameField: 'email', passwordField: 'senha' }, async (email, senha, done) => {
      try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
          return done(null, false, { message: 'Usuário não encontrado' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
          return done(null, false, { message: 'Senha incorreta' });
        }

        return done(null, usuario);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    })
  );

  passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const usuario = await Usuario.findById(id);
      done(null, usuario);
    } catch (err) {
      console.error(err);
      done(err, null);
    }
  });
}