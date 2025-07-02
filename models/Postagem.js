import mongoose from 'mongoose';

const PostagemSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  conteudo: {
    type: String,
    required: true
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categoria',
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  }
});
// Está escrito postagen, porque o próprio mongoose vai pluralizar o nome do modelo para criar a coleção no MongoDB, que será "postagens"
// Se fosse 'postagem', a coleção seria 'postagems', o que não é correto. Por isso, usamos 'postagen' para que a coleção seja 'postagens'.
// O mongoose pluraliza automaticamente o nome do modelo para criar a coleção, então 'postagen' se torna 'postagens'.
const Postagem = mongoose.model('postagen', PostagemSchema);
export default Postagem;
