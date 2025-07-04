import { Router } from 'express';
import Categoria from '../models/Categoria.js';
import Postagem from '../models/Postagem.js';
import eAdmin from '../helpers/eAdmin.js';

const router = Router();

router.get('/categorias', eAdmin, async (req, res) => {
  try {
    const categorias = await Categoria.find().lean().sort({ data: 'desc' });
    res.render('admin/categorias', { categorias });
  } catch (err) {
    req.flash('error_msg', 'Houve um erro ao listar as categorias');
    res.redirect('/admin');
  }
});

router.get('/categorias/add', eAdmin, (req, res) => {
  res.render('admin/addcategorias');
});

router.post('/categorias/nova', eAdmin, async (req, res) => {
  const { nome, slug } = req.body;
  const erros = [];

  if (!nome || typeof nome === undefined || nome === null) {
    erros.push({ texto: 'Nome inválido' });
  }

  if (!slug || typeof slug === undefined || slug === null) {
    erros.push({ texto: 'Slug inválido' });
  }
  if (nome.length < 2) {
    erros.push({ texto: 'Nome muito pequeno' });
  }
  if (slug.length < 2) {
    erros.push({ texto: 'Slug muito pequeno' });
  }

  if (erros.length > 0) {
    res.render('admin/addcategorias', { erros: erros });
  } else {
    const novaCategoria = { nome, slug };
    try {
      await new Categoria(novaCategoria).save();
      req.flash('success_msg', 'Categoria criada com sucesso!');
      res.redirect('/admin/categorias');
    } catch (err) {
      req.flash('error_msg', 'Erro ao salvar categoria, tente novamente.');
      res.redirect('/admin');
    }
  }
});

router.get('/categorias/edit/:id', eAdmin, async (req, res) => {
  try {
    const categoria = await Categoria.findOne({ _id: req.params.id }).lean();
    res.render('admin/editcategorias', { categoria });
  } catch (err) {
    req.flash('error_msg', 'Esta categoria não existe');
    res.redirect('/admin/categorias');
  }
});

router.post('/categorias/edit', eAdmin, async (req, res) => {
  try {
    const { id, nome , slug } = req.body;
    const categoria = await Categoria.findOne({ _id: id });
    categoria.nome = nome;
    categoria.slug = slug;

    await categoria.save();
    req.flash('success_msg', 'Categoria editada com sucesso!');
    res.redirect('/admin/categorias');
  } catch (err) {
    req.flash('error_msg', 'Houve um erro ao salvar a edição da categoria');
    res.redirect('/admin/categorias');
  }
});

router.post('/categorias/deletar', eAdmin, async (req, res) => {
  try {
    await Categoria.deleteOne({ _id: req.body.id });
    req.flash('success_msg', 'Categoria deletada com sucesso!');
    res.redirect('/admin/categorias');
  } catch (err) {
    req.flash('error_msg', 'Houve um erro ao deletar a categoria');
    res.redirect('/admin/categorias');
  }
});

router.get('/postagens', eAdmin, async (req, res) => {
  try {
    const postagens = await Postagem.find().populate('categoria').sort({ data: 'desc' }).lean();
    res.render('admin/postagens', { postagens });
  } catch (err) {
    req.flash('error_msg', 'Houve um erro ao listar as postagens');
    res.redirect('/admin');
  }
});

router.get('/postagens/add', eAdmin, async (req, res) => {
  try {
    const categorias = await Categoria.find().lean();
    res.render('admin/addpostagem', { categorias });
  } catch (err) {
    req.flash('error_msg', 'Houve um erro ao carregar o formulario de postagem');
    res.redirect('/admin');
  }
});

router.post('/postagens/nova', eAdmin, async (req, res) => {
  const { titulo, slug, descricao, conteudo, categoria } = req.body;
  const erros = [];

  if (!titulo || typeof titulo === undefined || titulo === null) {
    erros.push({ texto: 'Título inválido' });
  }
  if (!slug || typeof slug === undefined || slug === null) {
    erros.push({ texto: 'Slug inválido' });
  }
  if (!descricao || typeof descricao === undefined || descricao === null) {
    erros.push({ texto: 'Descrição inválida' });
  }
  if (!conteudo || typeof conteudo === undefined || conteudo === null) {
    erros.push({ texto: 'Conteúdo inválido' });
  }
  if (categoria == '0') {
    erros.push({ texto: 'Categoria inválida, registre uma categoria' });
  }

  if (erros.length > 0) {
    return res.render('admin/addpostagem', {
      erros,
      titulo,
      slug,
      descricao,
      conteudo,
      categoria
    });
  }
    try {
      const novaPostagem = {
        titulo,
        slug,
        descricao,
        conteudo,
        categoria
      };

      await new Postagem(novaPostagem).save();
      req.flash('success_msg', 'Postagem criada com sucesso!');
      res.redirect('/admin/postagens');
    } catch (err) {
      req.flash('error_msg', 'Houve um erro ao salvar a postagem, tente novamente.');
      res.redirect('/admin/postagens');
    }
});
  
router.get('/postagens/edit/:id', eAdmin, async (req, res) => {
  try {
    const postagem = await Postagem.findOne({ _id: req.params.id }).lean();
    if(!postagem) {
      req.flash('Essa postagem não existe');
      return res.redirect('/admin/postagens');
    }
    const categorias = await Categoria.find().lean();
    res.render('admin/editpostagens', { postagem, categorias });
  } catch (err) {
    req.flash('error_msg', 'Houve um erro ao carregar o formulário de edição da postagem');
    res.redirect('/admin/postagens');
  }
});

router.post('/postagens/edit', eAdmin, async (req, res) => {
  const { id, titulo, slug, descricao, conteudo, categoria } = req.body;
  try {
    const postagem = await Postagem.findOne({ _id: id });
    if(!postagem) {
      req.flash('error_msg', 'Postagem não encontrada');
      return res.redirect('/admin/postagens');
    }
    postagem.titulo = titulo;
    postagem.slug = slug;
    postagem.descricao = descricao;
    postagem.conteudo = conteudo;
    postagem.categoria = categoria;
    await postagem.save();
    req.flash('success_msg', 'Postagem editada com sucesso!');
    res.redirect('/admin/postagens');
  } catch (err) {
    req.flash('error_msg', 'Houve um erro ao salvar a edição da postagem');
    res.redirect('/admin/postagens');
  }
});

router.post('/postagens/deletar', eAdmin, async (req, res) => {
  const { id } = req.body;
  try {
    await Postagem.deleteOne({ _id: id });
    req.flash('success_msg', 'Postagem deletada com sucesso!');
    res.redirect('/admin/postagens');
  } catch (err) {
    req.flash('error_msg', 'Houve um erro ao deletar a postagem');
    res.redirect('/admin/postagens');
  }
});

export default router;
