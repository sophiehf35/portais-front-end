const url = new URL(window.location.href);
const caminho = url.pathname;
const caminhoSemBarras = caminho.replace(/^\/|\/$/g, "");
const partesDoCaminho = caminhoSemBarras.split("/").filter(Boolean);
const parametrosURL = new URLSearchParams(window.location.search);
let slugDaPagina = partesDoCaminho[partesDoCaminho.length - 1];
let configPromise;

function defineVariaveisUniversais(slugDaPagina) {
    if (!configPromise) {
        configPromise = fetch(url.protocol + '//' + url.hostname + '/configuracao/json/universal.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
                }
                return response.json();
            })
            .then(config => {
                return config;
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
                throw error;
            });
    }
    return configPromise;
}

defineVariaveisUniversais(slugDaPagina).then(config => {
    carregaMenu(config);
    carregaLogo(config, document.getElementById("logo"));

    if (url.protocol + '//' + url.hostname + url.pathname === config.dominio + '/') {
    //PÁGINA HOME
        slugDaPagina = 'home';
        if(config.tipo_home === "portal") {
            carregaConteudoHomePortal(config);
            setaMetaTags(config, slugDaPagina, slugParaTitulo(slugDaPagina), config.dominio);
        }

    } else if (config.paginas_categorias && config.paginas_categorias.slugs && config.paginas_categorias.slugs.includes(slugDaPagina)) {
    //PÁGINA DE CATEGORIAS
        document.querySelector('h1').textContent = config.paginas_fixas[slugDaPagina].meta_titulo;
        if (parametrosURL.has('pagina')) {
        //POSSUÍ PAGINAÇÃO
            setaMetaTags(config, slugDaPagina, slugParaTitulo(slugDaPagina), config.dominio + '/' + slugDaPagina + '/?pagina=' + parametrosURL.get('pagina'));
        } else {
            setaMetaTags(config, slugDaPagina, slugParaTitulo(slugDaPagina), config.dominio + '/' + slugDaPagina + '/');
        }
        carregaListaDeArtigos(config, slugDaPagina);
        carregaConteudoDestaque(config);

    } else if (config.possui_ferramentas == 1 && slugDaPagina == 'ferramentas') {
    //PÁGINA DE FERRAMENTAS
        document.querySelector('h1').textContent = config.paginas_fixas['ferramentas'].meta_titulo;
        if (parametrosURL.has('pagina')) {
        //POSSUÍ PAGINAÇÃO
            setaMetaTags(config, slugDaPagina, slugParaTitulo(slugDaPagina), config.dominio + '/' + slugDaPagina + '/?pagina=' + parametrosURL.get('pagina'));
        } else {
            setaMetaTags(config, slugDaPagina, slugParaTitulo(slugDaPagina), config.dominio + '/' + slugDaPagina + '/');
        }
        carregaListaDeFerramentas(config);
        carregaConteudoDestaque(config);

    } else if (caminho.includes('/profissionais/')) {
    //PÁGINAS DE PROFISSIONAIS
        if (config.profissionais && config.profissionais.tipos.some(tipo => tipo.slug_diretorio && caminho.includes(`/${tipo.slug_diretorio}/`))) {
            //PÁGINAS DO PROFISSIONAL
            //carregaAvaliacoesProfissional();
            validarFormularioContatoProfissional(config);
            validarFormularioAvaliacaoProfissional(config);
        } else if(slugDaPagina == 'confirma-cadastro-de-profissional') {
            verificaEmailConfirmacaoDeProfissional(config);
        }

    } else if (config.permite_profissionais == 1 && slugDaPagina == 'cadastro-de-profissional') {
        //PÁGINA CADASTRO DE PROFISSIONAL
        validarFormularioCadastroProfissional(config);
    
    } else if (config.paginas_categorias.slugs && config.paginas_categorias.slugs.some(categoria => caminho.includes(`/${categoria}/`))) {
    //PÁGINA DE ARTIGOS
       carregaArtigosRelacionados(config, document.querySelector("h1").dataset.slugCategoria, document.querySelector("h1").dataset.slug);
       carregaConteudoDestaque(config);
       carregaComentariosAvaliacoes();
       validarFormularioComentario(config);
       compartilhamentoDeImagens(config);

    } else if (config.paginas_fixas && config.paginas_fixas.slugs.includes(slugDaPagina) && slugDaPagina !== 'home') {
    //PÁGINAS FIXAS
        setaMetaTags(config, slugDaPagina, slugParaTitulo(slugDaPagina));

        if(slugDaPagina === 'fale-conosco') {
            carregaCardsDiferenciais();
            validarFormularioContato(config);
        } else if (slugDaPagina === 'quem-somos') {
            carregaLogoQuemSomos(config);
            carregaCardsDiferenciais();
        }
    
    }
    
    carregaRodape(config);
    setaGoogleAnalytics(config);
    setaGoogleAdsense(config);
    setaClarity(config);
                
}).catch(error => {
    console.error('Erro ao buscar dados:', error);
});


function setaMetaTags(config, slugDaPagina, nomeDaPagina, linkCanonical = '') {

    const titleTag = document.createElement('title');
    titleTag.innerText = config.paginas_fixas[slugDaPagina] && config.paginas_fixas[slugDaPagina].meta_titulo ? config.paginas_fixas[slugDaPagina].meta_titulo : nomeDaPagina + ' ' + config.paginas_fixas.meta_titulo_padrao;
    document.querySelector('meta[name="robots"]').parentNode.insertBefore(titleTag, document.querySelector('meta[name="robots"]').nextSibling);

    const metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.content = config.paginas_fixas[slugDaPagina] && config.paginas_fixas[slugDaPagina].meta_descricao ? config.paginas_fixas[slugDaPagina].meta_descricao : nomeDaPagina + ' ' + config.paginas_fixas.meta_descricao_padrao;
    document.querySelector('title').parentNode.insertBefore(metaDescription, document.querySelector('title').nextSibling);

    const metaAuthor = document.createElement('meta');
    metaAuthor.setAttribute('name', 'author');
    metaAuthor.content = config.autor_padrao;
    document.querySelector('meta[name="description"]').parentNode.insertBefore(metaAuthor, document.querySelector('meta[name="description"]').nextSibling);

    const tagCanonical = document.createElement('link');
    tagCanonical.setAttribute('real', 'canonical');
    tagCanonical.setAttribute('href', (linkCanonical === '' ? config.dominio + '/' + slugDaPagina : linkCanonical));
    document.querySelector('meta[name="author"]').parentNode.insertBefore(tagCanonical, document.querySelector('meta[name="author"]').nextSibling);

    const metaTitleTagOg = document.createElement('meta');
    metaTitleTagOg.setAttribute('property', 'og:title');
    metaTitleTagOg.setAttribute('content', config.paginas_fixas[slugDaPagina] && config.paginas_fixas[slugDaPagina].meta_titulo ? config.paginas_fixas[slugDaPagina].meta_titulo : nomeDaPagina + ' ' + config.paginas_fixas.meta_titulo_padrao);
    document.querySelector('meta[property="og:type"]').parentNode.insertBefore(metaTitleTagOg, document.querySelector('meta[property="og:type"]').nextSibling);

    const metaDescriptionOg = document.createElement('meta');
    metaDescriptionOg.setAttribute('property', 'og:description');
    metaDescriptionOg.setAttribute('content', config.paginas_fixas[slugDaPagina] && config.paginas_fixas[slugDaPagina].meta_descricao ? config.paginas_fixas[slugDaPagina].meta_descricao : nomeDaPagina + ' ' + config.paginas_fixas.meta_descricao_padrao);
    document.querySelector('meta[property="og:title"]').parentNode.insertBefore(metaDescriptionOg, document.querySelector('meta[property="og:title"]').nextSibling);

    const metaUrlOg = document.createElement('meta');
    metaUrlOg.setAttribute('property', 'og:url');
    metaUrlOg.setAttribute('content', (linkCanonical === '' ? config.dominio + '/' + slugDaPagina : linkCanonical));
    document.querySelector('meta[property="og:description"]').parentNode.insertBefore(metaUrlOg, document.querySelector('meta[property="og:description"]').nextSibling);

    const metaSitenameOg = document.createElement('meta');
    metaSitenameOg.setAttribute('property', 'og:site_name');
    metaSitenameOg.setAttribute('content', config.nome_do_site);
    document.querySelector('meta[property="og:url"]').parentNode.insertBefore(metaSitenameOg, document.querySelector('meta[property="og:url"]').nextSibling);

    const metaImageOg = document.createElement('meta');
    metaImageOg.setAttribute('property', 'og:image');
    metaImageOg.setAttribute('content', config.dominio + '/img/' + slugDaPagina + '.webp');
    document.querySelector('meta[property="og:site_name"]').parentNode.insertBefore(metaImageOg, document.querySelector('meta[property="og:site_name"]').nextSibling);

    const metaAltImageOg = document.createElement('meta');
    metaAltImageOg.setAttribute('property', 'og:image:alt');
    metaAltImageOg.setAttribute('content', 'Imagem da pagina de ' + nomeDaPagina + ' do ' + config.nome_do_site);
    document.querySelector('meta[property="og:image"]').parentNode.insertBefore(metaAltImageOg, document.querySelector('meta[property="og:image"]').nextSibling);

    const metaTitleTwitter = document.createElement('meta');
    metaTitleTwitter.setAttribute('name', 'twitter:title');
    metaTitleTwitter.setAttribute('content', config.paginas_fixas[slugDaPagina] && config.paginas_fixas[slugDaPagina].meta_titulo ? config.paginas_fixas[slugDaPagina].meta_titulo : nomeDaPagina + ' ' + config.paginas_fixas.meta_titulo_padrao);
    document.querySelector('meta[name="twitter:card"]').parentNode.insertBefore(metaTitleTwitter, document.querySelector('meta[name="twitter:card"]').nextSibling);

    const metaDescriptionTwitter = document.createElement('meta');
    metaDescriptionTwitter.setAttribute('name', 'twitter:description');
    metaDescriptionTwitter.setAttribute('content', config.paginas_fixas[slugDaPagina] && config.paginas_fixas[slugDaPagina].meta_descricao ? config.paginas_fixas[slugDaPagina].meta_descricao : nomeDaPagina + ' ' + config.paginas_fixas.meta_descricao_padrao);
    document.querySelector('meta[name="twitter:title"]').parentNode.insertBefore(metaDescriptionTwitter, document.querySelector('meta[name="twitter:title"]').nextSibling);

    const metaImageTwitter = document.createElement('meta');
    metaImageTwitter.setAttribute('name', 'twitter:image');
    metaImageTwitter.setAttribute('content', config.dominio + '/img/' + slugDaPagina + '.webp');
    document.querySelector('meta[name="twitter:description"]').parentNode.insertBefore(metaImageTwitter, document.querySelector('meta[name="twitter:description"]').nextSibling);
    
    const metaAltImageTwitter = document.createElement('meta');
    metaAltImageTwitter.setAttribute('name', 'twitter:image:alt');
    metaAltImageTwitter.setAttribute('content', 'Imagem da pagina de ' + nomeDaPagina + ' do ' + config.nome_do_site);
    document.querySelector('meta[name="twitter:image"]').parentNode.insertBefore(metaAltImageTwitter, document.querySelector('meta[name="twitter:image"]').nextSibling);

}

function setaGoogleAnalytics(config) {
    if (config.possui_google_analytics === 1) {
        const scriptAnalytics1 = document.createElement('script');
        scriptAnalytics1.src = `https://www.googletagmanager.com/gtag/js?id=${config.codigo_google_analytics}`;
        scriptAnalytics1.async = true;

        const scriptAnalytics2 = document.createElement('script');
        scriptAnalytics2.text = `window.dataLayer=window.dataLayer || []; function gtag(){dataLayer.push(arguments);}gtag("js", new Date()); gtag("config", "${config.codigo_google_analytics}");`;

        document.body.appendChild(scriptAnalytics1);
        document.body.appendChild(scriptAnalytics2);
    }
}

function setaGoogleAdsense(config) {
    if (config.possui_google_adsense === 1) {
        const scriptAdsense = document.createElement('script');
        scriptAdsense.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.codigo_google_adsense}`;
        scriptAdsense.async = true;
        scriptAdsense.crossorigin = 'anonymous';

        document.body.appendChild(scriptAdsense);
    }
}

function setaClarity(config) {
    if (config.possui_clarity === 1) {
        const scriptClarity = document.createElement('script');
        scriptClarity.text = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${config.codigo_clarity}");`;
    
        document.body.appendChild(scriptClarity);
    }
}

function carregaLogo(config, logoContainer) {

    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    if(config.header.fixo_em_todas_paginas === 1) {
        document.body.classList.add('header-fixo');
        header.classList.add('fixed-top');
    }            

    var link = document.createElement("a");
    link.href = "/";
    link.title = config.nome_do_site;

    var img = document.createElement("img");
    
    if (getComputedStyle(document.documentElement).getPropertyValue('--cor-fundo-header') === '#FFFFFF') {
        img.dataset.src = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') +  "/" + config.nome_do_logo + ".webp";
        img.dataset.srcset = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') +  "/" + config.nome_do_logo + ".webp?tr=w-50 200w," + config.diretorio_cdn_imagens + "/" + config.nome_do_logo + ".webp?tr=w-100 400w," + config.diretorio_cdn_imagens + "/" + config.nome_do_logo + ".webp?tr=w-150 600w," + config.diretorio_cdn_imagens + "/" + config.nome_do_logo + ".webp?tr=w-200 800w,";
        img.srcset = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + config.nome_do_logo + ".webp?tr=w-50 200w," + config.diretorio_cdn_imagens + "/" + config.nome_do_logo + ".webp?tr=w-100 400w," + config.diretorio_cdn_imagens + "/" + config.nome_do_logo + ".webp?tr=w-150 600w," + config.diretorio_cdn_imagens + "/" + config.nome_do_logo + ".webp?tr=w-200 800w,";
    } else {
        img.dataset.src = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') +  "/" + config.nome_do_logo + "-branco.webp";
        img.dataset.srcset = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') +  "/" + config.nome_do_logo + "-branco.webp?tr=w-50 200w," + config.diretorio_cdn_imagens + "/" + config.nome_do_logo + "-branco.webp?tr=w-100 400w," + config.diretorio_cdn_imagens + "/" + config.nome_do_logo + "-branco.webp?tr=w-150 600w," + config.diretorio_cdn_imagens + "/" + config.nome_do_logo + "-branco.webp?tr=w-200 800w,";
        img.srcset = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + config.nome_do_logo + "-branco.webp?tr=w-50 200w," + config.diretorio_cdn_imagens + "/" + config.nome_do_logo + "-branco.webp?tr=w-100 400w," + config.diretorio_cdn_imagens + "/" + config.nome_do_logo + "-branco.webp?tr=w-150 600w," + config.diretorio_cdn_imagens + "/" + config.nome_do_logo + "-branco.webp?tr=w-200 800w,";
        nav.classList.add('navbar-dark');
    }

    img.src = "data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    img.alt = "logo do " + config.nome_do_site;
    img.title = "logo do " + config.nome_do_site;
    img.classList.add("fade-in");
    img.width = "200";
    img.height = "45";

    link.appendChild(img);
    logoContainer.appendChild(link);

}


/* FUNÇÃO PARA ADIAR CARREGAMENTO DAS IMAGENS */
const config = {
    rootMargin: '50px 0px',
    threshold: 0.01
};

if ('IntersectionObserver' in window) {
    AdiarImagens();
} else {
    ExibeTodasImagens();
}

function AdiarImagens() {
    let observer;
    let images = document.querySelectorAll('img[data-src]');
    observer = new IntersectionObserver(onChange, config);
    images.forEach(img => observer.observe(img));
}

function ExibeTodasImagens() {
    images.forEach(image => loadImage(image));
}

const loadImage = image => {
    image.classList.add('fade-in');
    image.src = image.dataset.src;
    image.srcset = image.dataset.srcset;
}

function onChange(changes, observer) {
    changes.forEach(change => {
        if (change.intersectionRatio > 0) {
            // Stop watching and load the image
            loadImage(change.target);
            observer.unobserve(change.target);
        }

    });
}
/* FUNÇÃO PARA ADIAR CARREGAMENTO DAS IMAGENS */

/* FUNÇÃO PARA TRATAR E CALCULAR A DIFERENÇA DE DATA DOS ARTIGOS */
function calcularDiferencaTempo(dataPublicacao) {
  const agora = new Date();
  const dataPublicacaoFormatada = new Date(dataPublicacao);

  const diferencaEmMilissegundos = agora - dataPublicacaoFormatada;
  const diferencaEmMinutos = Math.floor(diferencaEmMilissegundos / (1000 * 60));
  const diferencaEmHoras = Math.floor(diferencaEmMinutos / 60);
  const diferencaEmDias = Math.floor(diferencaEmHoras / 24);

  if (diferencaEmMinutos < 60) {
    return `Publicado há ${diferencaEmMinutos} minutos atrás`;
  } else if (diferencaEmHoras < 24) {
    return `Publicado há ${diferencaEmHoras} horas atrás`;
  } else {
    return `Publicado há ${diferencaEmDias} dias atrás`;
  }
}
/* FUNÇÃO PARA TRATAR E CALCULAR A DIFERENÇA DE DATA DOS ARTIGOS */

/* FUNÇÃO PARA CRIAR E CARREGAR OS CARDS DIFERENCIAIS */
function carregaCardsDiferenciais() {
    fetch('/configuracao/json/cards-diferenciais.json').then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        if (Array.isArray(data)) {
            const cardsDiferenciais = data.map(conteudoCard => `
                <div class="col-lg-4 col-md-6">
                   <a class="box_topic">
                      <span><i class="${conteudoCard.icone}"></i></span>
                      <h3>${conteudoCard.titulo}</h3>
                      <p>${conteudoCard.descricao}</p>
                   </a>
                </div>
            `).join('');

            const divCardsDiferenciais = document.getElementById('cardsDiferenciais');
            divCardsDiferenciais.insertAdjacentHTML('afterbegin', cardsDiferenciais);
        } else {
            throw new Error('O conteúdo do arquivo não é um array');
        }
    }).catch(error => {
        console.error('Erro ao buscar dados:', error);
    });
}
/* FUNÇÃO PARA CRIAR E CARREGAR OS CARDS DIFERENCIAIS */

function slugParaTitulo(slug) {
    const primeiraLetraMaiuscula = slug.charAt(0).toUpperCase();
    const restanteDoTitulo = slug.slice(1).replace(/-/g, ' ');
    
    const titulo = `${primeiraLetraMaiuscula}${restanteDoTitulo}`;

    return titulo;
}

function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
}

function enviaDados(endereco_funcao, funcao, parametro1_da_funcao, parametro2_da_funcao, campos, divNotificacao, divBarra, form) {
    const data = new URLSearchParams();
    data.append("funcao", funcao);
    data.append("parametro1_da_funcao", parametro1_da_funcao);
    parametro2_da_funcao !== null ? data.append("parametro2_da_funcao", parametro2_da_funcao) : null;

    //ADICIONA CAMPOS AO OBJETO DATA
    for (const campo in campos) {
        if (campos.hasOwnProperty(campo)) {
            data.append(campo, campos[campo]);
        }
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data.toString(),
    };

    return fetch(endereco_funcao, options)
        .then((response) => {
            if (!response.ok) {
                console.error("Erro na solicitação: " + response.status);
                return;
            }
            return response.json();
        })
        .then((data) => {
            if (form !== null && divBarra !== null) {
                ocultaBarra(form, divBarra);
            }
            if (data.status == 1) {
                exibirNotificacao("sucesso", data.mensagem, "", divNotificacao);
            } else if (data.status == 2) {
                exibirNotificacao("erro", data.mensagem, "", divNotificacao);
            } else if (data.status == 3) {
                exibirNotificacao("informacao", data.mensagem, "", divNotificacao);
            }
            return data;
        })
        .catch((error) => {
            console.error("Ocorreu um erro durante a solicitação:", error);
        });
}

function exibirNotificacao(tipo, mensagem, campo, divNotificacao) {
    var classeMensagem = "";

    if (tipo == "erro") {
        classeMensagem = "danger";
        iconeMensagem = "#exclamation-triangle-fill";
        campo !== '' ?  campo.classList.add("is-invalid") : null;
    } else if (tipo == "sucesso") {
        classeMensagem = "success";
        iconeMensagem = "#check-circle-fill";
    } else if (tipo == "informacao") {
        classeMensagem = "primary";
        iconeMensagem = "#info-fill";
    }

    divNotificacao.innerHTML =
        '<div class="alert alert-' +
        classeMensagem +
        ' alert-dismissible d-flex align-items-center" style="margin-bottom:0px;" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="' +
        tipo +
        ':"><use xlink:href="/assets/svg/icones.svg' +
        iconeMensagem +
        '"></use></svg><div>' +
        mensagem +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div></div>';

    divNotificacao.classList.add("d-block", "fade", "show");
    divNotificacao.classList.remove("d-none");
    campo !== '' ?  verificaFechamentoNotificacao(campo, divNotificacao) : null;
}

function verificaTipoAlerta(divNotificacao) {
    if (divNotificacao) {
        var tipoAlerta = divNotificacao.querySelector('.alert');
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

function ocultaNotificacao(tipo, campo, divNotificacao) {

    if (tipo == "erro") {
        campo.classList.remove("is-invalid");
        divNotificacao.classList.remove("show");
        divNotificacao.classList.add("fade", "d-none");
        divNotificacao.innerHTML = "";
    } else if (tipo == "sucesso") {
        divNotificacao.classList.remove("show");
        divNotificacao.classList.add("fade", "d-none");
        divNotificacao.innerHTML = "";
    }

}

function verificaFechamentoNotificacao(campo, divNotificacao) {
    const alerta = divNotificacao.querySelector(".alert");
    alerta.addEventListener("closed.bs.alert", function() {
        ocultaNotificacao(verificaTipoAlerta(divNotificacao), campo, divNotificacao);
    });
}

function ocultaBarra(form, divBarra) {
    divBarra.innerHTML = "";
    form.reset();
    //inputNomeContatoProfissional.focus();
    //inputEmailContato.focus();
    //inputEmailContato.blur();
    divBarra.classList.remove("show");
    divBarra.classList.add("fade", "d-none");
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