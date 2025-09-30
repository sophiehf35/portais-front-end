/* FUNÇÃO EXIBIR SUMÁRIO */
window.addEventListener("DOMContentLoaded", function (event) {
  //Get all headings only from the actual contents.
  var contentContainer = document.getElementById("artigo");
  var headings = contentContainer.querySelectorAll("h2,h3,h4,h5");

  var tocContainer = document.getElementById("toc");
  // create ul element and set the attributes.
  var ul = document.createElement("ul");

  ul.setAttribute("id", "tocList");
  ul.setAttribute("class", "sidenav");

  // Loop through the headings NodeList
  for (i = 0; i <= headings.length - 1; i++) {
    var id = headings[i].innerHTML
      .toLowerCase()
      .replace(",", "")
      .replace("!", "")
      .replace(".", "")
      .replace(/ /g, "-"); // Set the ID to the header text, all lower case with hyphens instead of spaces.
    var level = headings[i].localName.replace("h", ""); // Getting the header a level for hierarchy
    var title = headings[i].innerHTML; // Set the title to the text of the header

    headings[i].setAttribute("id", id); // Set header ID to its text in lower case text with hyphens instead of spaces.

    var li = document.createElement("li"); // create li element.
    li.setAttribute("class", "sidenav__item"); // Assign a class to the li

    var a = document.createElement("a"); // Create a link'
    a.setAttribute("href", "#" + id); // Set the href to the heading ID
    a.innerHTML =
      "<span style='justify-content: center; align-items: center; line-height: unset;' class='mx-1' data-icon='&#x39;'></span>" +
      title; // Set the link text to the heading text

    li.setAttribute("class", "sidenav__item");

    if (level == 2) {
      li.appendChild(a);
      ul.appendChild(li);
    } else if (level == 3) {
      li.setAttribute("style", "padding-left: 1rem;");
      li.appendChild(a);
      ul.appendChild(li);
    } else if (level == 4) {
      li.setAttribute("style", "padding-left: 2rem;");
      li.appendChild(a);
      ul.appendChild(li);
    } else if (level == 5) {
      li.setAttribute("style", "padding-left: 3rem;");
      li.appendChild(a);
      ul.appendChild(li);
    }
  }

  toc.appendChild(ul); // add list to the container

  // Add a class to the first list item to allow for toggling active state.
  var links = tocContainer.getElementsByClassName("sidenav__item");

  links[0].classList.add("current");

  // Loop through the links and add the active class to the current/clicked link
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("current");
      current[0].className = current[0].className.replace(" current", "");
      this.className += " current";
    });
  }
});
/* FUNÇÃO EXIBIR SUMÁRIO */

/* FUNÇÃO CLIQUE PARA RESPONDER COMENTÁRIOS */
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("responder")) {
        // Scroll
        var botaoEnviaComentario = document.querySelector(".botao_envia_comentario");
        if (botaoEnviaComentario) {
            var scrollTopValue = botaoEnviaComentario.offsetTop;
            window.scrollTo({
                top: scrollTopValue,
                behavior: "smooth"
            });
        }

        // Setar o valor do ID
        var id = event.target.getAttribute("id");
        var idInput = document.getElementById("id");
        if (idInput) {
            idInput.value = id;
        }

        // Dar foco no campo nome
        var nomeInput = document.getElementById("nome");
        if (nomeInput) {
            nomeInput.focus();
        }
    }
});
/* FUNÇÃO CLIQUE PARA RESPONDER COMENTÁRIOS */

/* FUNÇÃO PARA VALIDAR E ENVIAR FORMULÁRIO DE COMENTÁRIO */
const formComentario = document.querySelector("#formularioDeComentario");
const id_comentario = formComentario.querySelector("#id").value;
const id_artigo = document.querySelector("h1").dataset.id;

const inputNomeComentario = formComentario.querySelector("#nome");
const inputEmailComentario = formComentario.querySelector("#email");
const inputSexoComentario = formComentario.querySelector("#sexo");
const inputAvaliacaoComentario = formComentario.querySelector("#avaliacao");
const inputMensagemComentario = formComentario.querySelector("#mensagem");

const botaoEnviarComentario = document.querySelector("#envia_comentario");
const divNotificacaoComentario = document.querySelector("#div_notificacao_comentario");
const divBarraComentario = document.querySelector("#div_barra_comentario");

function validarFormularioComentario(config) {
    botaoEnviarComentario.addEventListener("click", function (event) {
      event.preventDefault();
      
      if (inputNomeComentario.value === "") {
        //CAMPO DO NOME VAZIO
        exibirNotificacao("erro", "Erro, preencha seu nome", inputNomeComentario, divNotificacaoComentario);
      } else if (inputEmailComentario.value === "") {
        //CAMPO DO EMAIL VAZIO
        exibirNotificacao("erro", "Erro, preencha seu email", inputEmailComentario, divNotificacaoComentario);
      } else if (validarEmail(inputEmailComentario.value) !== true) {
        //EMAIL INVÁLIDO
        exibirNotificacao("erro", "Erro, preencha com um email válido", inputEmailComentario, divNotificacaoComentario);
      } else if (inputSexoComentario.value === "") {
        //CAMPO DO DEPARTAMENTO VAZIO
        exibirNotificacao("erro", "Erro, selecione o seu sexo", inputSexoComentario, divNotificacaoComentario);
      } else if (inputAvaliacaoComentario.value === "") {
        //CAMPO DO DEPARTAMENTO VAZIO
        exibirNotificacao("erro", "Erro , selecione sua nota", inputAvaliacaoComentario, divNotificacaoComentario);
      } else if (inputMensagemComentario.value === "") {
        //CAMPO DE MENSAGEM VAZIA
        exibirNotificacao("erro", "Erro, preencha sua mensagem", inputMensagemComentario, divNotificacaoComentario);
      } else {
        //TODOS OS CAMPOS PREENCHIDOS
        divBarraComentario.innerHTML =
          '<div style="height: 1.5rem;" class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>';
    
        divBarraComentario.classList.remove("d-none");
        divBarraComentario.classList.add("d-block", "fade", "show");
        criaBarraProgresso(1350);
    
        const campos = {
          "id": id_comentario,
          "nome": inputNomeComentario.value,
          "email": inputEmailComentario.value,
          "sexo": inputSexoComentario.value,
          "avaliacao": inputAvaliacaoComentario.value,
          "mensagem": inputMensagemComentario.value
        };

        setTimeout(function () {
            enviaDados(
            config.endereco_funcao_php,
            'adicionarComentariosPaginaDeArtigos',
            config.id,
            id_artigo,
            campos,
            divNotificacaoComentario,
            divBarraComentario,
            formComentario
          );
        }, 600);

      }
    });
    
    inputNomeComentario.addEventListener("input", function () {
      ocultaNotificacao(verificaTipoAlerta(divNotificacaoComentario), inputNomeComentario, divNotificacaoComentario);
    });
    
    inputEmailComentario.addEventListener("input", function () {
      ocultaNotificacao(verificaTipoAlerta(divNotificacaoComentario), inputEmailComentario, divNotificacaoComentario);
    });
    
    inputSexoComentario.addEventListener("input", function () {
      ocultaNotificacao(verificaTipoAlerta(divNotificacaoComentario), inputSexoComentario, divNotificacaoComentario);
    });
    
    inputAvaliacaoComentario.addEventListener("input", function () {
      ocultaNotificacao(verificaTipoAlerta(divNotificacaoComentario), inputAvaliacaoComentario, divNotificacaoComentario);
    });
    
    inputMensagemComentario.addEventListener("input", function () {
      ocultaNotificacao(verificaTipoAlerta(divNotificacaoComentario), inputMensagemComentario, divNotificacaoComentario);
    });
    
    inputNomeComentario.addEventListener("input", function (event) {
      var valorCampo = this.value;
      var valorFiltrado = valorCampo.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""); // Permite apenas letras, incluindo letras acentuadas e espaços
      this.value = valorFiltrado;
    });
}
/* FUNÇÃO PARA VALIDAR E ENVIAR FORMULÁRIO DE COMENTÁRIO */


/* FUNÇÃO PARA CRIAR SECTION E CARREGAR OS ARTIGOS RELACIONADOS */
function carregaArtigosRelacionados(config, slugArtigo, categoria, subcategoria = null) {
    fetch('/configuracao/json/artigos-relacionados.json')
        .then(response => {
            if (!response.ok) throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            let relacionados = [];

            // 1. Encontrar a categoria principal
            const categoriaData = data[categoria];
            if (!categoriaData) {
                console.warn(`Categoria "${categoria}" não encontrada`);
                return;
            }

            // 2. Se existe subcategoria, buscar artigos dela
            if (subcategoria && categoriaData[subcategoria]) {
                relacionados = categoriaData[subcategoria]
                    .filter(a => a.slug && a.imagem_destaque && a.slug !== slugArtigo)
                    .map(artigo => ({ ...artigo, subcategoriaOrigem: subcategoria }));
            }

            // 3. Se não encontrou na subcategoria ou não tem subcategoria, 
            // buscar artigos diretos da categoria (chaves numéricas)
            if (relacionados.length === 0) {
                const artigosDiretos = Object.entries(categoriaData)
                    .filter(([key, item]) => 
                        !isNaN(key) && 
                        typeof item === 'object' && 
                        !Array.isArray(item) &&
                        item.slug && 
                        item.imagem_destaque
                    )
                    .map(([key, item]) => item)
                    .filter(a => a.slug !== slugArtigo)
                    .map(artigo => ({ ...artigo, subcategoriaOrigem: null }));
                
                relacionados = artigosDiretos;
            }

            // 4. Se ainda não houver resultados, buscar de outras subcategorias da mesma categoria
            if (relacionados.length === 0) {
                const artigosOutrasSubcategorias = Object.entries(categoriaData)
                    .filter(([key, item]) => Array.isArray(item) && key !== subcategoria)
                    .flatMap(([subcat, artigos]) => 
                        artigos
                            .filter(a => a.slug && a.imagem_destaque && a.slug !== slugArtigo)
                            .map(artigo => ({ ...artigo, subcategoriaOrigem: subcat }))
                    );
                
                relacionados = artigosOutrasSubcategorias;
            }

            // 5. Se ainda não houver, pega qualquer artigo (menos o atual)
            if (relacionados.length === 0) {
                const todosArtigos = Object.entries(data)
                    .flatMap(([cat, conteudoCategoria]) => {
                        if (Array.isArray(conteudoCategoria)) {
                            // Categorias sem subcategorias (como "estilo-de-vida", "negocios")
                            return conteudoCategoria
                                .filter(a => a.slug && a.imagem_destaque)
                                .map(artigo => ({ ...artigo, categoriaOrigem: cat, subcategoriaOrigem: null }));
                        } else {
                            // Categorias com subcategorias
                            return Object.entries(conteudoCategoria)
                                .flatMap(([key, item]) => {
                                    if (Array.isArray(item)) {
                                        // Subcategorias
                                        return item
                                            .filter(a => a.slug && a.imagem_destaque)
                                            .map(artigo => ({ ...artigo, categoriaOrigem: cat, subcategoriaOrigem: key }));
                                    } else if (typeof item === 'object' && !isNaN(key)) {
                                        // Artigos diretos na categoria
                                        return item.slug && item.imagem_destaque 
                                            ? [{ ...item, categoriaOrigem: cat, subcategoriaOrigem: null }]
                                            : [];
                                    }
                                    return [];
                                });
                        }
                    })
                    .filter(a => a.slug !== slugArtigo);

                relacionados = todosArtigos;
            }

            // 6. Embaralha e pega até 4
            relacionados.sort(() => Math.random() - 0.5);
            const artigosRelacionados = relacionados.slice(0, 4);

            if (artigosRelacionados.length === 0) return;

            // 7. Monta a seção com URLs corretas
            const secaoRelacionados = document.createElement('section');
            secaoRelacionados.innerHTML = `
                <div style="margin-bottom: 20px; padding:0px" class="reviews-container box_detail">
                    <div class="titulo_secao">
                        <h3 class="titulo">RELACIONADOS</h3>
                    </div>
                    <div style="padding: 20px 20px;" class="col-md-12">
                        <div class="row">
                            ${artigosRelacionados.map(relacionado => {
                                // Monta a URL correta baseada na origem do artigo
                                const categoriaUrl = relacionado.categoriaOrigem || categoria;
                                const subcategoriaUrl = relacionado.subcategoriaOrigem;
                                const baseUrl = config.diretorio_blog === "home" ? "" : `${config.diretorio_blog}/`;
                                const url = subcategoriaUrl 
                                    ? `/${baseUrl}${categoriaUrl}/${subcategoriaUrl}/${relacionado.slug}`
                                    : `/${baseUrl}${categoriaUrl}/${relacionado.slug}`;

                                return `
                                <div class="col-lg-6 col-sm-6 mb-3">
                                    <a href="${url}">
                                        <div class="card border-0 rounded-0 text-white overflow zoom position-relative mb-0">
                                            <div class="ratio_right-cover-2 image-wrapper">
                                                <img
                                                    src="data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                                                    data-src="${(config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img')}/usuarios/${relacionado.diretorio_autor}/artigos/thumb/${relacionado.imagem_destaque}"
                                                    data-srcset="${Array.from({ length: 15 }, (_, i) => 
                                                        `${(config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img')}/usuarios/${relacionado.diretorio_autor}/artigos/thumb/${relacionado.imagem_destaque}?tr=w-${250 + i * 50} ${250 + i * 50}w`
                                                    ).join(', ')}"
                                                    sizes="(max-width: 125px), (max-width: 150px), (max-width: 175px), (max-width: 200px), (max-width: 225px), (max-width: 250px), (max-width: 275px), (max-width: 300px), (max-width: 325px), (max-width: 350px), (max-width: 375px), (max-width: 400px), (max-width: 425px), (max-width: 450px), (max-width: 475px), (-webkit-min-device-pixel-ratio: 1.1) AND (-webkit-max-device-pixel-ratio: 1.5) 80.5vw, (-webkit-min-device-pixel-ratio: 1.6) AND (-webkit-max-device-pixel-ratio: 2) 57.5vw, (-webkit-min-device-pixel-ratio: 2.1) AND (-webkit-max-device-pixel-ratio: 2.5) 42.5vw, (-webkit-min-device-pixel-ratio: 2.6) AND (-webkit-max-device-pixel-ratio: 3) 39.5vw, (-webkit-min-device-pixel-ratio: 3.1) AND (-webkit-max-device-pixel-ratio: 3.5) 32.5vw, (-webkit-min-device-pixel-ratio: 3.6) AND (-webkit-max-device-pixel-ratio: 4) 28.5vw"
                                                    alt="${relacionado.alt_imagem_destaque}"
                                                    width="1200"
                                                    height="675"
                                                    class="img-fluid w-100"
                                                />
                                            </div>
                                            <div class="position-absolute p-2 p-lg-3 b-0 w-100 bg-shadow">
                                                <h3 class="h6 text-white my-1">${relacionado.titulo}</h3>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            const secaoArtigo = document.getElementById('artigo');
            secaoArtigo.insertAdjacentElement('afterend', secaoRelacionados);

            AdiarImagens();
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
}
/* FUNÇÃO PARA CRIAR SECTION E CARREGAR OS ARTIGOS RELACIONADOS */


/* FUNÇÃO PARA CRIAR SECTION E CARREGAR OS COMENTÁRIOS */
function carregaComentariosAvaliacoes(config) {

  const numeroComentarios = document.querySelector("h1").dataset.comentarios;
  if (numeroComentarios > 0) {

      fetch('/configuracao/json/comentarios.json')
          .then(response => {
              if (!response.ok) {
                  throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
              }
              return response.json();
          })
          .then(data => {
             
              const comentariosArtigo = data.filter(dados => parseInt(dados.id_artigo, 10) === parseInt(document.querySelector("h1").dataset.id, 10) && dados.id_comentario_pai === "0");
              const lista_comentarios = comentariosArtigo.map(dados => {
                const estrelas = Array.from({
                    length: 5
                }, (_, index) =>
                    index < dados.avaliacao ?
                    '<i class="icon_star voted"></i>' :
                    '<i class="icon_star"></i>'
                ).join('');
        
                const imagemAvatar = `${dados.sexo === '1' ? (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/feminino_comentario.webp' : (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/masculino_comentario.webp'}`;
                const tagAvatar = `<img width="80px" height="80px" src="data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="${imagemAvatar}" data-srcset="${imagemAvatar}">`;
                
                const options = {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                };
                const data_hora_criacao = new Date(dados.data_hora_criacao).toLocaleDateString('pt-BR', options);
        
                return `
                    <div class="review-box clearfix">
                        <figure class="rev-thumb">${tagAvatar}</figure>
                        <div class="rev-content">
                            <div class="rating_pequeno">${estrelas}</div>
                            <div class="rev-info">${dados.nome}</div>
                            <div class="botao_responder_comentario responder" id="${dados.id}">Responder<i style="margin-left:5px" class="fa fa-reply"></i></div>
                            <div class="rev-info">${data_hora_criacao}</div>
                            <div class="rev-text">
                                <p>${dados.comentario.charAt(0).toUpperCase() + dados.comentario.slice(1)}</p>
                            </div>
                        </div>
                    </div>
                    ${ListarComentariosDeRespostas(data, dados.id, 30)}
                `;
              }).join('');
              
              const secaoEnviaComentarios = document.getElementById('envia_comentarios');
              secaoEnviaComentarios.insertAdjacentHTML(
                  "beforebegin",
                  '<section id="comentarios"><div style="margin-bottom: 20px; padding:0px" class="reviews-container box_detail"><div class="titulo_secao"><h3 class="titulo">COMENTÁRIOS</h3></div><div style="padding: 20px 20px 15px 20px;">' +
                  lista_comentarios +
                  "</div></div></section>"
              );

              AdiarImagens();

              function ListarComentariosDeRespostas(comentarios, id_comentario_pai, marginleft = 0) {
                  const comentariosRespostas = comentarios.filter(comentario => comentario.id_comentario_pai === id_comentario_pai);
                  const output = comentariosRespostas.map(comentario => {

                      const estrelas = Array.from({
                              length: 5
                          }, (_, index) =>
                          index < comentario.avaliacao ?
                          '<i class="icon_star voted"></i>' :
                          '<i class="icon_star"></i>'
                      ).join('');

                      const imagemAvatar = `${dados.sexo === '1' ? (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/feminino_comentario.webp' : (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/masculino_comentario.webp'}`;
                      const tagAvatar = `<img width="80px" height="80px" src="data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="${imagemAvatar}" data-srcset="${imagemAvatar}">`;
                      
                      const options = {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                      };

                      return `
                      <div style="margin-left:${marginleft}px" class="review-box clearfix">
                          <figure class="rev-thumb">${tagAvatar}</figure>
                          <div class="rev-content">
                              <div class="rating_pequeno">${estrelas}</div>
                              <div class="rev-info">${comentario.nome}</div>
                              <div class="botao_responder_comentario responder" id="${comentario.id}">Responder<i style="margin-left:5px" class="fa fa-reply"></i></div>
                              <div class="rev-info">${new Date(comentario.data_hora_criacao).toLocaleDateString('pt-BR', options)}</div>
                              <div class="rev-text">
                                  <p>${comentario.comentario.charAt(0).toUpperCase() + comentario.comentario.slice(1)}</p>
                              </div>
                          </div>
                      </div>
                      ${ListarComentariosDeRespostas(comentarios, comentario.id, marginleft + 30)}
                  `;
                  }).join('');

                  return output;
              }

          })
          .catch(error => {
              console.error('Erro ao buscar dados:', error);
          });

  }
}
/* FUNÇÃO PARA CRIAR SECTION E CARREGAR OS COMENTÁRIOS */

/* FUNÇÃO PARA CRIAR SECTION E CARREGAR O CONTEÚDO EM DESTAQUE */
function carregaConteudoDestaque(config) {

    fetch('/configuracao/json/conteudo-destaque.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            
            if (data.length > 0 && config.conteudo_destaque_pagina_artigo === 1) {
                let link = '';

                data.forEach(conteudo => {
                    const imagem = (conteudo.tipo === 'artigos' ? `/usuarios/${conteudo.diretorio_autor}/artigos/thumb/${conteudo.imagem_destaque}` : `/ferramentas/${conteudo.imagem_destaque}`);
                    let slugConteudo = '';
                    if (conteudo.slug_subcategoria !== null) {
                        slugConteudo = `${config.diretorio_blog === "home" ? "" : `${config.diretorio_blog}/`}${conteudo.tipo === 'artigos' ? `${conteudo.slug_categoria}/${conteudo.slug_subcategoria}/${conteudo.slug}` : `ferramentas/${conteudo.slug}`}`;
                    } else {
                        slugConteudo = `${config.diretorio_blog === "home" ? "" : `${config.diretorio_blog}/`}${conteudo.tipo === 'artigos' ? `${conteudo.slug_categoria}/${conteudo.slug}` : `ferramentas/${conteudo.slug}`}`;
                    }
                    const categoria = (conteudo.tipo === 'artigos' ? conteudo.categoria.toUpperCase() : conteudo.tipo.toUpperCase());
            
                    link += `
                        <li>
                            <div class="alignleft shadow-sm">
                                <a href="/${slugConteudo}">
                                    <figure>
                                        <img width="95px" height="53px" src="data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="${(config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img")}${imagem}" data-srcset="${(config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img")}${imagem}?tr=w-150" class="img-fluid" alt="${conteudo.alt_imagem_destaque}" title="${conteudo.titulo_imagem_destaque}" itemprop="image">
                                    </figure>
                                </a>
                            </div>
                            <h4 class="mt-0"><a href="/${slugConteudo}">${conteudo.titulo}</a></h4>
                        </li>
                    `;
                });
            
                const conteudosEmDestaque = `
                    <div id="destaqueWidget" class="box_detail widget">
                        <div class="titulo_secao">
                            <h3 class="titulo">DESTAQUE</h3>
                        </div>
                        <div class="secao_artigos_em_destaque conteudo_secao_sidebar">
                            <ul>
                                ${link}
                            </ul>
                        </div>
                    </div>
                `;
                
                const sumarioWidget = document.getElementById('sumarioWidget');
                sumarioWidget.insertAdjacentHTML("afterend", conteudosEmDestaque);
                
            }
            
            AdiarImagens();
        
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });

}
/* FUNÇÃO PARA CRIAR SECTION E CARREGAR O CONTEÚDO EM DESTAQUE */