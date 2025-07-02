import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  eAdmin: {
    type: Number,
    default: 0
  }
});

const Usuario = mongoose.model('usuario', UsuarioSchema);
export default Usuario;
