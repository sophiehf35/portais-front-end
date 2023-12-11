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

function validarFormulario(config) {
    botaoEnviarComentario.addEventListener("click", function (event) {
      event.preventDefault();
      
      if (inputNomeComentario.value === "") {
        //CAMPO DO NOME VAZIO
        exibirNotificacaoComentario("erro", "Erro, preencha seu nome", inputNomeComentario);
      } else if (inputEmailComentario.value === "") {
        //CAMPO DO EMAIL VAZIO
        exibirNotificacaoComentario("erro", "Erro, preencha seu email", inputEmailComentario);
      } else if (validarEmail(inputEmailComentario.value) !== true) {
        //EMAIL INVÁLIDO
        exibirNotificacaoComentario("erro", "Erro, preencha com um email válido", inputEmailComentario);
      } else if (inputSexoComentario.value === "") {
        //CAMPO DO DEPARTAMENTO VAZIO
        exibirNotificacaoComentario("erro", "Erro, selecione o seu sexo", inputSexoComentario);
      } else if (inputAvaliacaoComentario.value === "") {
        //CAMPO DO DEPARTAMENTO VAZIO
        exibirNotificacaoComentario("erro", "Erro , selecione sua nota", inputAvaliacaoComentario);
      } else if (inputMensagemComentario.value === "") {
        //CAMPO DE MENSAGEM VAZIA
        exibirNotificacaoComentario("erro", "Erro, preencha sua mensagem", inputMensagemComentario);
      } else {
        //TODOS OS CAMPOS PREENCHIDOS
        divBarraComentario.innerHTML =
          '<div style="height: 1.5rem;" class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>';
    
        divBarraComentario.classList.remove("d-none");
        divBarraComentario.classList.add("d-block", "fade", "show");
        criaBarraProgresso(1350);
    
        setTimeout(function () {
          enviaComentario(
            config.id,
            inputNomeComentario.value,
            inputEmailComentario.value,
            inputSexoComentario.value,
            inputAvaliacaoComentario.value,
            inputMensagemComentario.value
          );
        }, 600);
      }
    });
    
    inputNomeComentario.addEventListener("focus", function () {
      ocultaNotificacaoComentario(verificaTipoAlerta(), inputNomeComentario);
    });
    
    inputEmailComentario.addEventListener("focus", function () {
      ocultaNotificacaoComentario(verificaTipoAlerta(), inputEmailComentario);
    });
    
    inputSexoComentario.addEventListener("focus", function () {
      ocultaNotificacaoComentario(verificaTipoAlerta(), inputSexoComentario);
    });
    
    inputAvaliacaoComentario.addEventListener("focus", function () {
      ocultaNotificacaoComentario(verificaTipoAlerta(), inputAvaliacaoComentario);
    });
    
    inputMensagemComentario.addEventListener("focus", function () {
      ocultaNotificacaoComentario(verificaTipoAlerta(), inputMensagemComentario);
    });
    
    inputNomeComentario.addEventListener("input", function (event) {
      var valorCampo = this.value;
      var valorFiltrado = valorCampo.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""); // Permite apenas letras, incluindo letras acentuadas e espaços
      this.value = valorFiltrado;
    });
}

function enviaComentario(id_site, nome, email, sexo, avaliacao, mensagem) {
  const data = new URLSearchParams();
  data.append("funcao", "AdicionarComentariosPaginaDeArtigos");
  data.append("parametro1_da_funcao", id_site);
  data.append("parametro2_da_funcao", id_artigo);
  data.append("id", id_comentario);
  data.append("nome", nome);
  data.append("email", email);
  data.append("sexo", sexo);
  data.append("avaliacao", avaliacao);
  data.append("mensagem", mensagem);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data.toString(),
  };

  fetch("https://gerenciador.linkasites.com.br/configuracao/php/funcoes/recebe-dados/", options)
    .then((response) => {
      if (!response.ok) {
        console.error("Erro na solicitação: " + response.status);
        return;
      }
      return response.json();
    })
    .then((data) => {
      ocultaBarraComentario();
      if (data.status == 1) {
        exibirNotificacaoComentario(
          "sucesso",
          "Parabéns, comentário enviado com sucesso, em breve será revisado."
        );
      } else {
        exibirNotificacaoComentario("erro", data.mensagem, "");
      }
    })
    .catch((error) => {
      console.error("Ocorreu um erro durante a solicitação:", error);
    });
}

function exibirNotificacaoComentario(tipo, mensagem, campo) {
  var classeMensagem = "";

  if (tipo == "erro") {
    classeMensagem = "danger";
    iconeMensagem = "#exclamation-triangle-fill";
    campo.classList.add("is-invalid");
  } else if (tipo == "sucesso") {
    classeMensagem = "success";
    iconeMensagem = "#check-circle-fill";
  }

  divNotificacaoComentario.innerHTML =
    '<div class="alert alert-' +
    classeMensagem +
    ' alert-dismissible d-flex align-items-center" style="margin-bottom:0px;" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="' +
    tipo +
    ':"><use xlink:href="/configuracao/svg/icones.svg' +
    iconeMensagem +
    '"></use></svg><div>' +
    mensagem +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div></div>';

  divNotificacaoComentario.classList.add("d-block", "fade", "show");
  divNotificacaoComentario.classList.remove("d-none");
  verificaFechamentoNotificacao("comentario", campo);
}

function ocultaNotificacaoComentario(tipo, campo) {
  if (tipo == "erro") {
      campo.classList.remove("is-invalid");
      divNotificacaoComentario.classList.remove("show");
      divNotificacaoComentario.classList.add("fade", "d-none");
      divNotificacaoComentario.innerHTML = "";
  } else if (tipo == "sucesso") {
      divNotificacaoComentario.classList.remove("show");
      divNotificacaoComentario.classList.add("fade", "d-none");
      divNotificacaoComentario.innerHTML = "";
  }
}

function ocultaBarraComentario() {
  divBarraComentario.innerHTML = "";
  formComentario.reset();
  inputNomeComentario.focus();
  inputEmailComentario.focus();
  inputEmailComentario.blur();
  divBarraComentario.classList.remove("show");
  divBarraComentario.classList.add("fade", "d-none");
}

function verificaTipoAlerta() {
    if (divNotificacaoComentario) {
        var tipoAlerta = divNotificacaoComentario.querySelector('.alert');
        if (tipoAlerta) {
            if (tipoAlerta.classList.contains('alert-danger')) {
                return 'erro';
            } else if (tipoAlerta.classList.contains('alert-success')) {
                return 'sucesso';
            } 
        }
    }
    return 'nenhum';
}


function validarEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
}

function verificaFechamentoNotificacao(notificacao, campo) {
  const alerta = document.querySelector(
    "#div_notificacao_" + notificacao + " .alert"
  );
  alerta.addEventListener("closed.bs.alert", function () {
    if (notificacao === "comentario") {
      ocultaNotificacaoComentario(verificaTipoAlerta(), campo);
    }
  });
}

function criaBarraProgresso(duracao) {
  const progressBar = document.querySelector(".progress-bar");
  let width = 0;
  const interval = 10;

  const increment = (interval / duracao) * 100;

  const animation = setInterval(function () {
    width += increment;
    progressBar.style.width = width + "%";

    if (width >= 100) {
      clearInterval(animation);
    }
  }, interval);
}
/* FUNÇÃO PARA VALIDAR E ENVIAR FORMULÁRIO DE COMENTÁRIO */

/* FUNÇÃO PARA CRIAR SECTION E CARREGAR OS ARTIGOS RELACIONADOS */
function carregaArtigosRelacionados(config, categoria, slugArtigo) {

    fetch('/configuracao/json/artigos-relacionados.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            // Verifica se o JSON contém a chave da categoria
            if (data.hasOwnProperty(categoria)) {
                let relacionados = data[categoria];
        
                // Filtra os artigos relacionados excluindo o artigo atual
                relacionados = relacionados.filter(artigo => artigo.slug !== slugArtigo);

                // Verifica se há artigos relacionados
                if (relacionados.length > 0) {
                    
                    // Embaralha a ordem dos artigos relacionados
                    relacionados.sort(() => Math.random() - 0.5);

                    // Pega os primeiros 4 artigos relacionados
                    const artigosRelacionados = relacionados.slice(0, 4);
                    
                    // Cria a seção de artigos relacionados
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
                                            <a href="/${categoria}/${relacionado.slug}">
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
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `;

                    // Adiciona a seção de artigos relacionados ao DOM ou faz o que for necessário
                    const secaoArtigo = document.getElementById('artigo');
                    secaoArtigo.insertAdjacentElement('afterend', secaoRelacionados);
                }
            }
                
            AdiarImagens();

        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });

}
/* FUNÇÃO PARA CRIAR SECTION E CARREGAR OS ARTIGOS RELACIONADOS */

/* FUNÇÃO PARA CRIAR SECTION E CARREGAR OS COMENTÁRIOS */
function carregaComentariosAvaliacoes(idArtigo) {
    fetch('/configuracao/json/comentarios.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            const comentariosArtigo = data.filter(dados => dados.id_artigo === idArtigo);

            if (comentariosArtigo.length > 0) {

                const lista_comentarios = comentariosArtigo.map(dados => {
                    const estrelas = Array.from({
                            length: 5
                        }, (_, index) =>
                        index < dados.avaliacao ?
                        '<i class="icon_star voted"></i>' :
                        '<i class="icon_star"></i>'
                    ).join('');
                    const imagemAvatar = sexo === '1' ? '<img src="../img/feminino_comentario.webp">' : '<img src="../img/masculino_comentario.webp">';
                    const options = {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    };
                    data_hora_criacao = new Date(dados.data_hora_criacao).toLocaleDateString('pt-BR', options);

                    return `
                <div class="review-box clearfix">
                    <figure class="rev-thumb">${imagemAvatar}</figure>
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
                ${ListarComentariosDeRespostas(data, dados.id)}
            `;
                }).join('');

                const secaoEnviaComentarios = document.getElementById('envia_comentarios');
                secaoEnviaComentarios.insertAdjacentHTML(
                    "beforebegin",
                    '<section id="comentarios"><div style="margin-bottom: 20px; padding:0px" class="reviews-container box_detail"><div class="titulo_secao"><h3 class="titulo">COMENTÁRIOS</h3></div><div style="padding: 20px 20px 15px 20px;">' +
                    lista_comentarios +
                    "</div></div></section>"
                );

            }

            function ListarComentariosDeRespostas(comentarios, id_comentario_pai, marginleft = 0) {
                const comentariosRespostas = comentarios.filter(comentario => comentario.id_comentario_pai === id_comentario_pai);
                const output = comentariosRespostas.map(comentario => {

                    const divAvaliacao = getDivAvaliacao(comentario.avaliacao);
                    const divImagemAvatar = getDivImagemAvatar(comentario.sexo);

                    return `
                        <div style="margin-left:${marginleft}px" class="review-box clearfix">
                            <figure class="rev-thumb">${divImagemAvatar}</figure>
                            <div class="rev-content">
                                ${divAvaliacao}
                                <div class="rev-info">${comentario.nome}</div>
                                <div class="botao_responder_comentario responder" id="${comentario.id}">Responder<i style="margin-left:5px" class="fa fa-reply"></i></div>
                                <div class="rev-info">${formatarData(comentario.data_hora_criacao)}</div>
                                <div class="rev-text">
                                    <p>${ucFirst(comentario.comentario)}</p>
                                </div>
                            </div>
                        </div>
                        ${ListarComentariosDeRespostas(comentarios, comentario.id, marginleft + 48)}
                    `;
                }).join('');

                return output;
            }

        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
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
                    const imagem = (conteudo.tipo === 'artigos' ? `/usuarios/${conteudo.slug_tipo_autor}/${conteudo.slug_autor}/artigos/thumb/${conteudo.imagem_destaque}` : `/ferramentas/${conteudo.imagem_destaque}`);
                    const slugConteudo = (conteudo.tipo === 'artigos' ? conteudo.slug : `ferramenta/${conteudo.slug}`);
                    const categoria = (conteudo.tipo === 'artigos' ? conteudo.categoria.toUpperCase() : conteudo.tipo.toUpperCase());
            
                    link += `
                        <li>
                            <div class="alignleft shadow-sm">
                                <a href="/${slugConteudo}/">
                                    <figure>
                                        <img width="95px" height="53px" src="data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="${(config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img")}${imagem}" data-srcset="${(config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img")}${imagem}?tr=w-150" class="img-fluid" alt="${conteudo.alt_imagem_destaque}" title="${conteudo.titulo_imagem_destaque}" itemprop="image">
                                    </figure>
                                </a>
                            </div>
                            <small class="p-1 badge badge-primary rounded-0">${categoria}</small>
                            <h4><a href="/${slugConteudo}/">${conteudo.titulo_breadcumb}</a></h4>
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