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
        // PÁGINA HOME
        slugDaPagina = 'home';
        if (config.tipo_home === "portal") {
            carregaConteudoHomePortal(config);

            // meta da home (se existir nas paginas_fixas, usa; senão passa vazio e a função usará o padrão)
            let metaDescHome = '';
            if (config.paginas_fixas && config.paginas_fixas['home'] && config.paginas_fixas['home'].meta_descricao) {
                metaDescHome = config.paginas_fixas['home'].meta_descricao;
            }
            setaMetaTags(
                config,
                slugDaPagina,
                slugParaTitulo(slugDaPagina),
                config.dominio,
                metaDescHome,
                (config.paginas_fixas && config.paginas_fixas.home && config.paginas_fixas.home.meta_titulo) ? config.paginas_fixas.home.meta_titulo : slugParaTitulo(slugDaPagina)
            );
        }

    } else if (config.paginas_categorias && config.paginas_categorias[slugDaPagina]) {
        // PÁGINA DE CATEGORIAS
        const categoria = config.paginas_categorias[slugDaPagina][0];
        document.querySelector('h1').textContent = categoria.meta_titulo;

        // passe a meta_descricao da categoria como 5º parâmetro
        const canonicalBaseCategoria = config.dominio + '/' + slugDaPagina + '/';
        if (parametrosURL.has('pagina')) {
            setaMetaTags(config, slugDaPagina, categoria.meta_titulo, canonicalBaseCategoria + '?pagina=' + parametrosURL.get('pagina'), categoria.meta_descricao);
        } else {
            setaMetaTags(config, slugDaPagina, categoria.meta_titulo, canonicalBaseCategoria, categoria.meta_descricao, categoria.meta_titulo);
        }

        carregaListaDeArtigos(config, slugDaPagina);
        carregaConteudoDestaque(config);
        setaJsCustomizado(config, 'paginas_categoria');

    } else if (config.paginas_subcategorias && Object.keys(config.paginas_subcategorias).some(categoria => config.paginas_subcategorias[categoria].some(sub => sub.slug === slugDaPagina))) {
        // PÁGINA DE SUBCATEGORIAS (corrigido para incluir categoria pai no canonical)
        let subcategoriaData = null;
        let categoriaPai = null;

        for (let categoria in config.paginas_subcategorias) {
            const encontrada = config.paginas_subcategorias[categoria].find(sub => sub.slug === slugDaPagina);
            if (encontrada) {
                subcategoriaData = encontrada;
                categoriaPai = categoria; // guarda o slug da categoria pai (ex: "emails")
                break;
            }
        }

        if (!subcategoriaData) {
            console.error('Subcategoria não encontrada apesar da checagem anterior:', slugDaPagina);
        } else {
            document.querySelector('h1').textContent = subcategoriaData.meta_titulo;

            // monta canonical incluindo a categoria pai quando disponível
            const canonicalBaseSub = (categoriaPai ? (config.dominio + '/' + categoriaPai + '/' + slugDaPagina + '/') : (config.dominio + '/' + slugDaPagina + '/'));

            // passe a meta_descricao da subcategoria como 5º parâmetro
            if (parametrosURL.has('pagina')) {
                setaMetaTags(config, slugDaPagina, subcategoriaData.meta_titulo, canonicalBaseSub + '?pagina=' + parametrosURL.get('pagina'), subcategoriaData.meta_descricao);
            } else {
                setaMetaTags(config, slugDaPagina, subcategoriaData.meta_titulo, canonicalBaseSub, subcategoriaData.meta_descricao, subcategoriaData.meta_titulo);
            }

            carregaListaDeArtigosSubcategoria(config, slugDaPagina);
            carregaConteudoDestaqueSubcategoria(config);
            setaJsCustomizado(config, 'paginas_subcategoria');
        }

    } else if (config.possui_ferramentas == 1 && slugDaPagina == 'ferramentas') {
        // PÁGINA DE FERRAMENTAS
        document.querySelector('h1').textContent = config.paginas_fixas['ferramentas'].meta_titulo;

        let metaDescFerramentas = '';
        if (config.paginas_fixas && config.paginas_fixas['ferramentas'] && config.paginas_fixas['ferramentas'].meta_descricao) {
            metaDescFerramentas = config.paginas_fixas['ferramentas'].meta_descricao;
        }

        const canonicalBaseFerr = config.dominio + '/' + slugDaPagina + '/';
        if (parametrosURL.has('pagina')) {
            setaMetaTags(config, slugDaPagina, slugParaTitulo(slugDaPagina), canonicalBaseFerr + '?pagina=' + parametrosURL.get('pagina'), metaDescFerramentas);
        } else {
            setaMetaTags(
                config,
                slugDaPagina,
                slugParaTitulo(slugDaPagina),
                canonicalBaseFerr,
                metaDescFerramentas,
                (config.paginas_fixas && config.paginas_fixas.ferramentas && config.paginas_fixas.ferramentas.meta_titulo) ? config.paginas_fixas.ferramentas.meta_titulo : slugParaTitulo(slugDaPagina)
            );
        }

        carregaListaDeFerramentas(config);
        carregaConteudoDestaque(config);

    } else if (caminho.includes('/profissionais/')) {
        // PÁGINAS DE PROFISSIONAIS
        if (config.profissionais && config.profissionais.tipos.some(tipo => tipo.slug_diretorio && caminho.includes(`/${tipo.slug_diretorio}/`)) && caminho.split('/').filter(Boolean).length > 3) {
            // PÁGINAS DE CADA PROFISSIONAL
            console.log('usuario');
            validarFormularioContatoProfissional(config);
            validarFormularioAvaliacaoProfissional(config);
        } else if (slugDaPagina == 'confirma-cadastro-de-profissional') {
            verificaEmailConfirmacaoDeProfissional(config);
        }

    } else if (config.permite_profissionais == 1 && slugDaPagina == 'cadastro-de-profissional') {
        // PÁGINA CADASTRO DE PROFISSIONAL
        validarFormularioCadastroProfissional(config);

    } else if (Object.keys(config.paginas_categorias).some(categoria => caminho.includes(`/${categoria}/`)) || (config.paginas_subcategorias && Object.keys(config.paginas_subcategorias).some(categoria => config.paginas_subcategorias[categoria].some(subcategoria => caminho.includes(`/${subcategoria.slug}/`))))) {
        // PÁGINA DE ARTIGOS (artigo individual)
        const h1 = document.querySelector("h1");
        const slugCategoria = h1.dataset.slugCategoria;
        const slugSubcategoria = h1.dataset.slugSubcategoria || null;
        const slug = h1.dataset.slug;

        carregaArtigosRelacionados(config, slug, slugCategoria, slugSubcategoria);
        carregaConteudoDestaque(config);
        carregaComentariosAvaliacoes(config);
        validarFormularioComentario(config);
        compartilhamentoDeImagens(config);
        setaJsCustomizado(config, 'paginas_artigo');

    } else if (config.paginas_fixas && config.paginas_fixas.slugs.includes(slugDaPagina) && slugDaPagina !== 'home') {
        // PÁGINAS FIXAS
        // passe a meta_descricao da pagina fixa (se existir)
        let metaDescFixa = '';
        if (config.paginas_fixas && config.paginas_fixas[slugDaPagina] && config.paginas_fixas[slugDaPagina].meta_descricao) {
            metaDescFixa = config.paginas_fixas[slugDaPagina].meta_descricao;
        }

        setaMetaTags(
            config,
            slugDaPagina,
            slugParaTitulo(slugDaPagina),
            '',
            metaDescFixa,
            (config.paginas_fixas && config.paginas_fixas[slugDaPagina] && config.paginas_fixas[slugDaPagina].meta_titulo) ? config.paginas_fixas[slugDaPagina].meta_titulo : slugParaTitulo(slugDaPagina)
        );

        if (slugDaPagina === 'fale-conosco') {
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


function setaMetaTags(config, slugDaPagina, nomeDaPagina, linkCanonical = '', metaDescricao = '', metaTituloEspecifico = '') {
    const paginasFixas = config.paginas_fixas || {};
    const paginaFixa = paginasFixas[slugDaPagina];

    const titleContent = (paginaFixa && paginaFixa.meta_titulo)
        ? paginaFixa.meta_titulo
        : ( metaTituloEspecifico
            ? metaTituloEspecifico
            : ( (nomeDaPagina || slugDaPagina) + (paginasFixas.meta_titulo_padrao ? ' ' + paginasFixas.meta_titulo_padrao : '') )
          );

    const descriptionContent = (paginaFixa && paginaFixa.meta_descricao)
        ? paginaFixa.meta_descricao
        : ( metaDescricao ? metaDescricao : ( (nomeDaPagina ? nomeDaPagina + ' ' : '') + (paginasFixas.meta_descricao_padrao || '') ) ).trim();

    // Set document.title
    document.title = titleContent;

    // Upsert meta[name="description"]
    let metaDescriptionEl = document.querySelector('meta[name="description"]');
    if (!metaDescriptionEl) {
        metaDescriptionEl = document.createElement('meta');
        metaDescriptionEl.setAttribute('name', 'description');
        document.head.appendChild(metaDescriptionEl);
    }
    metaDescriptionEl.setAttribute('content', descriptionContent);

    // Upsert meta[name="author"]
    let metaAuthor = document.querySelector('meta[name="author"]');
    if (!metaAuthor) {
        metaAuthor = document.createElement('meta');
        metaAuthor.setAttribute('name', 'author');
        document.head.appendChild(metaAuthor);
    }
    metaAuthor.setAttribute('content', config.autor_padrao || '');

    // Upsert link[rel="canonical"]
    let linkCanonicalEl = document.querySelector('link[rel="canonical"]');
    if (!linkCanonicalEl) {
        linkCanonicalEl = document.createElement('link');
        linkCanonicalEl.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonicalEl);
    }
    linkCanonicalEl.setAttribute('href', (linkCanonical === '' ? config.dominio + '/' + slugDaPagina : linkCanonical));

    // Helper para criar/atualizar meta tags (og / twitter)
    function upsertMeta(selectorAttr, attrName, content, isProperty = true) {
        const selector = isProperty ? `meta[property="${attrName}"]` : `meta[name="${attrName}"]`;
        let el = document.querySelector(selector);
        if (!el) {
            el = document.createElement('meta');
            if (isProperty) el.setAttribute('property', attrName);
            else el.setAttribute('name', attrName);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    }

    // Open Graph
    upsertMeta('property', 'og:title', titleContent, true);
    upsertMeta('property', 'og:description', descriptionContent, true);
    upsertMeta('property', 'og:url', (linkCanonical === '' ? config.dominio + '/' + slugDaPagina : linkCanonical), true);
    upsertMeta('property', 'og:site_name', config.nome_do_site || '', true);
    upsertMeta('property', 'og:image', config.dominio + '/img/' + slugDaPagina + '.webp', true);
    upsertMeta('property', 'og:image:alt', 'Imagem da pagina de ' + nomeDaPagina + ' do ' + (config.nome_do_site || ''), true);

    // Twitter cards (usar name)
    upsertMeta('name', 'twitter:title', titleContent, false);
    upsertMeta('name', 'twitter:description', descriptionContent, false);
    upsertMeta('name', 'twitter:image', config.dominio + '/img/' + slugDaPagina + '.webp', false);
    upsertMeta('name', 'twitter:image:alt', 'Imagem da pagina de ' + nomeDaPagina + ' do ' + (config.nome_do_site || ''), false);
}


function setaJsCustomizado(config, tipoPagina) {
    const paginasCustomizadas = config.js_customizado[tipoPagina];

    if (paginasCustomizadas && paginasCustomizadas.length > 0) {
        paginasCustomizadas.forEach(function(nomeDoAquivoJS) {
            const scriptCustomizado = document.createElement('script');
            scriptCustomizado.src = `/configuracao/js/${nomeDoAquivoJS}`;
            document.body.appendChild(scriptCustomizado);
        });
    }
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
    const baseDir = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img');

    if (getComputedStyle(document.documentElement).getPropertyValue('--cor-fundo-header') === '#FFFFFF') {
        img.dataset.src = `${baseDir}/${config.nome_do_logo}.webp`;
        img.dataset.srcset = `${baseDir}/${config.nome_do_logo}.webp?tr=w-50 200w,${baseDir}/${config.nome_do_logo}.webp?tr=w-100 400w,${baseDir}/${config.nome_do_logo}.webp?tr=w-150 500w,${baseDir}/${config.nome_do_logo}.webp?tr=w-600 800w`;
        img.srcset = `${baseDir}/${config.nome_do_logo}.webp?tr=w-50 200w,${baseDir}/${config.nome_do_logo}.webp?tr=w-100 400w,${baseDir}/${config.nome_do_logo}.webp?tr=w-150 500w,${baseDir}/${config.nome_do_logo}.webp?tr=w-600 800w`;
    } else {
        img.dataset.src = `${baseDir}/${config.nome_do_logo}-branco.webp`;
        img.dataset.srcset = `${baseDir}/${config.nome_do_logo}-branco.webp?tr=w-50 200w,${baseDir}/${config.nome_do_logo}-branco.webp?tr=w-100 400w,${baseDir}/${config.nome_do_logo}-branco.webp?tr=w-150 500w,${baseDir}/${config.nome_do_logo}-branco.webp?tr=w-600 800w`;
        img.srcset = `${baseDir}/${config.nome_do_logo}-branco.webp?tr=w-50 200w,${baseDir}/${config.nome_do_logo}-branco.webp?tr=w-100 400w,${baseDir}/${config.nome_do_logo}-branco.webp?tr=w-150 500w,${baseDir}/${config.nome_do_logo}-branco.webp?tr=w-600 800w`;
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

function inserirAnuncio(divId, key, height, width, src) {
    var div = document.getElementById(divId);
    var iframe = document.createElement('iframe');
    iframe.setAttribute('width', width);
    iframe.setAttribute('height', height);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    div.appendChild(iframe);

    var script1 = document.createElement('script');
    script1.textContent = `var atOptions = {'key' : '${key}','format' : 'iframe','height' : ${height},'width' : ${width},'params' : {}};`;
    iframe.contentDocument.head.appendChild(script1);

    var script2 = document.createElement('script');
    script2.src = src;
    iframe.contentDocument.head.appendChild(script2);
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
            if(divNotificacao !== null) {
                if (data.status == 1) {
                    exibirNotificacao("sucesso", data.mensagem, "", divNotificacao);
                } else if (data.status == 2) {
                    exibirNotificacao("erro", data.mensagem, "", divNotificacao);
                } else if (data.status == 3) {
                    exibirNotificacao("informacao", data.mensagem, "", divNotificacao);
                }
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

/* FUNÇÕES PARA COMPARTILHAR IMAGENS NOS ARTIGOS */
function compartilhamentoDeImagens(config) {
    AdiarImagens();
    const imagens = document.querySelectorAll("section#artigo.box_detail > figure >img");
  
    if (imagens.length > 0) {
  
      for (const imagem of imagens) {
          imagem.insertAdjacentHTML('afterend', '<div class="lista-redes-sociais"><span class="compartilha_imagem facebook"></span><span class="compartilha_imagem twitter"></span><span class="compartilha_imagem linkedin"></span><span class="compartilha_imagem whatsapp"></span><span class="compartilha_imagem link"></span><span class="compartilha_imagem download"></span></div>');
      }
  
      document.querySelector('.lista-redes-sociais').addEventListener('click', function(event) {
        var clickedElement = event.target;
  
        if (clickedElement.classList.contains('compartilha_imagem')) {
          //ENCONTRA TODAS AS CLASSES 
          var classes = clickedElement.classList;
          
          //ENCONTRA O SRC DA IMAGEM QUE ESTÁ PRÓXIMA DO BOTÃO CLICADO
          var imgElement = clickedElement.closest('figure').querySelector('img');
          var imgSrc = imgElement.getAttribute('src');
  
          //ENCONTRA A CLASSE APÓS COMPARTILHA_IMAGEM PARA SABER A AÇÃO
          var lastClassIndex = Array.from(classes).indexOf('compartilha_imagem') + 1;
          var acao = classes[lastClassIndex];
          
          //FORMATA SRC E PEGA O NOME DO ARQUIVO
          var srcFormatado = (config.cdn_imagens === 1 ? imgSrc.replace(config.diretorio_cdn_imagens + '/', window.location.protocol + '//' + window.location.host + '/img/') : imgSrc);
          var nomeArquivo = imgSrc.split('/').pop().split('.')[0];
          
          if(acao === 'facebook') {
            compartilhanoFacebook(srcFormatado);
          } else if(acao === 'twitter') {
            compartilhanoTwitter(srcFormatado);
          } else if(acao === 'linkedin') {
            compartilhanoLinkedin(srcFormatado);
          } else if(acao === 'whatsapp') {
            compartilhanoWhatsapp(srcFormatado);
          } else if(acao === 'link') {
            copiaLink(srcFormatado);
          } else if(acao === 'download') {
            downloadImagem(imgSrc, nomeArquivo + '.jpg');
          }
        }
      });
    }
  
  }
  
  
  function compartilhanoFacebook(url){
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank');
  }
  
  function compartilhanoTwitter(url) {
    window.open('https://twitter.com/intent/tweet?text=' + url, '_blank');
  }
  
  function compartilhanoLinkedin(url) {
    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url, '_blank');
  }
  
  function compartilhanoWhatsapp(url) {
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
          window.open('whatsapp://send?text=' + url, '_blank');
      } else {
          window.open('https://web.whatsapp.com/send?text=' + url, '_blank');
      }
  }
  
  const copiaLink = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
    
      Swal.fire({
          icon: "success",
          title: 'Link copiado',
          html: 'Agora é só colar o link onde deseja compartilhar a imagem.',
          allowEscapeKey: true,
          allowOutsideClick: true,
          timer: 5000,
          timerProgressBar: true
      })
  }
  
  function downloadImagem(url, name){
      fetch(url)
      .then(resp => resp.blob())
      .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
      })
      .catch(() => alert('An error sorry'));
  }
/* FUNÇÕES PARA COMPARTILHAR IMAGENS NOS ARTIGOS */