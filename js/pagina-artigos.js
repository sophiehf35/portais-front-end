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
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let relacionados = [];

            // Preferência para subcategoria se existir
            if (subcategoria && data.hasOwnProperty(subcategoria)) {
                relacionados = data[subcategoria];
            } 
            // Senão, usa a categoria
            else if (data.hasOwnProperty(categoria)) {
                relacionados = data[categoria];
            }

            // Se relacionados não for array, transforma em array
            if (!Array.isArray(relacionados)) {
                relacionados = Object.values(relacionados);
            }

            // Filtra removendo o artigo atual
            relacionados = relacionados.filter(artigo => artigo.slug !== slugArtigo);

            if (relacionados.length > 0) {
                // Embaralha
                relacionados.sort(() => Math.random() - 0.5);

                // Limita em 4
                const artigosRelacionados = relacionados.slice(0, 4);

                // Monta a seção
                const secaoRelacionados = document.createElement('section');
                secaoRelacionados.innerHTML = `
                    <div style="margin-bottom: 20px; padding:0px" class="reviews-container box_detail">
                        <div class="titulo_secao">
                            <h3 class="titulo">RELACIONADOS</h3>
                        </div>
                        <div style="padding: 20px 20px;" class="col-md-12">
                            <div class="row">
                                ${artigosRelacionados.map(relacionado => `
                                    <div class="col-lg-6 col-sm-6 mb-3">
                                        <a href="/${(config.diretorio_blog === "home" ? "" : `${config.diretorio_blog}/`)}${relacionado.slug_categoria || categoria}/${relacionado.slug}">
                                            <div class="card border-0 rounded-0 text-white overflow zoom position-relative mb-0">
                                                <div class="ratio_right-cover-2 image-wrapper">
                                                    <img
                                                        src="data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                                                        data-src="${(config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img')}/usuarios/${relacionado.diretorio_autor}/artigos/thumb/${relacionado.imagem_destaque}"
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
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;

                const secaoArtigo = document.getElementById('artigo');
                secaoArtigo.insertAdjacentElement('afterend', secaoRelacionados);
            }

            AdiarImagens();
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
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