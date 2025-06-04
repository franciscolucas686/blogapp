import mongoose from 'mongoose';

const CategoriaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: Date,
    default: Date.now
  }
});

const Categoria = mongoose.model('categoria', CategoriaSchema);
export default Categoria;