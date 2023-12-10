carregaMenu();
const url = new URL(window.location.href);
const pathSemDominio = window.location.href.replace(url.protocol + '//' + url.hostname, "");
const partesDoCaminho = pathSemDominio.split("/").filter(Boolean);
let nomeDaPagina = partesDoCaminho[partesDoCaminho.length - 1];
let configPromise;

console.log(url.protocol + '//' + url.hostname + url.pathname);

function defineVariaveisUniversais(nomeDaPagina) {
    if (!configPromise) {
        configPromise = fetch('../configuracao/json/universal.json')
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

defineVariaveisUniversais(nomeDaPagina).then(config => {

    carregaLogo(config, document.getElementById("logo"));

    //TEMPORÁRIO
    if (pathSemDominio === '/') {
    //PÁGINA HOME
        nomeDaPagina = 'home';
        setaMetaTags(config, nomeDaPagina);
        carregaConteudoHomePortal(config);
    } else if (pathSemDominio.endsWith("/") && nomeDaPagina !== 'home') {
    //PÁGINA DE CATEGORIAS
        document.querySelector('h1').textContent = config.paginas_fixas[nomeDaPagina].meta_titulo;
        document.querySelector('#titulo_breadcumb').textContent = config.paginas_fixas[nomeDaPagina].titulo_breadcumb;
        setaMetaTags(config, nomeDaPagina);
        carregaCardsModeloHorizontal(config);
        carregaConteudoDestaque(config);
    } else  if (partesDoCaminho.length === 2) {
    //PÁGINA DE ARTIGOS
       carregaArtigosRelacionados(config, document.querySelector("h1").dataset.slugCategoria, document.querySelector("h1").dataset.slug);
       carregaConteudoDestaque(config);
       carregaComentariosAvaliacoes(document.querySelector("h1").dataset.id);
       validarFormulario(config);
    }
    
    carregaRodape(config);
    setaGoogleAnalytics(config);
    setaGoogleAdsense(config);
    setaClarity(config);
                
}).catch(error => {
    console.error('Erro ao buscar dados:', error);
});


function setaMetaTags(config, nomeDaPagina) {

    const titleTag = document.createElement('title');
    titleTag.innerText = config.paginas_fixas[nomeDaPagina].meta_titulo;
    document.querySelector('meta[name="robots"]').parentNode.insertBefore(titleTag, document.querySelector('meta[name="robots"]').nextSibling);

    const metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.content = config.paginas_fixas[nomeDaPagina].meta_descricao;
    document.querySelector('title').parentNode.insertBefore(metaDescription, document.querySelector('title').nextSibling);

    const metaAuthor = document.createElement('meta');
    metaAuthor.setAttribute('name', 'author');
    metaAuthor.content = config.autor_padrao;
    document.querySelector('meta[name="description"]').parentNode.insertBefore(metaAuthor, document.querySelector('meta[name="description"]').nextSibling);

    const tagCanonical = document.createElement('link');
    tagCanonical.setAttribute('real', 'canonical');
    tagCanonical.setAttribute('href', (nomeDaPagina == 'home' ? config.dominio : config.dominio + '/' + nomeDaPagina));
    document.querySelector('meta[name="author"]').parentNode.insertBefore(tagCanonical, document.querySelector('meta[name="author"]').nextSibling);

    const metaTitleTagOg = document.createElement('meta');
    metaTitleTagOg.setAttribute('property', 'og:title');
    metaTitleTagOg.setAttribute('content', config.paginas_fixas[nomeDaPagina].meta_titulo);
    document.querySelector('meta[property="og:type"]').parentNode.insertBefore(metaTitleTagOg, document.querySelector('meta[property="og:type"]').nextSibling);

    const metaDescriptionOg = document.createElement('meta');
    metaDescriptionOg.setAttribute('property', 'og:description');
    metaDescriptionOg.setAttribute('content', config.paginas_fixas[nomeDaPagina].meta_descricao);
    document.querySelector('meta[property="og:title"]').parentNode.insertBefore(metaDescriptionOg, document.querySelector('meta[property="og:title"]').nextSibling);

    const metaUrlOg = document.createElement('meta');
    metaUrlOg.setAttribute('property', 'og:url');
    metaUrlOg.setAttribute('content', config.dominio);
    document.querySelector('meta[property="og:description"]').parentNode.insertBefore(metaUrlOg, document.querySelector('meta[property="og:description"]').nextSibling);

    const metaSitenameOg = document.createElement('meta');
    metaSitenameOg.setAttribute('property', 'og:site_name');
    metaSitenameOg.setAttribute('content', config.nome_do_site);
    document.querySelector('meta[property="og:url"]').parentNode.insertBefore(metaSitenameOg, document.querySelector('meta[property="og:url"]').nextSibling);

    const metaImageOg = document.createElement('meta');
    metaImageOg.setAttribute('property', 'og:image');
    metaImageOg.setAttribute('content', config.dominio + '/img/' + nomeDaPagina + '.webp');
    document.querySelector('meta[property="og:site_name"]').parentNode.insertBefore(metaImageOg, document.querySelector('meta[property="og:site_name"]').nextSibling);

    const metaAltImageOg = document.createElement('meta');
    metaAltImageOg.setAttribute('property', 'og:image:alt');
    metaAltImageOg.setAttribute('content', 'Imagem da pagina de ' + nomeDaPagina + ' do ' + config.nome_do_site);
    document.querySelector('meta[property="og:image"]').parentNode.insertBefore(metaAltImageOg, document.querySelector('meta[property="og:image"]').nextSibling);

    const metaTitleTwitter = document.createElement('meta');
    metaTitleTwitter.setAttribute('name', 'twitter:title');
    metaTitleTwitter.setAttribute('content', config.paginas_fixas[nomeDaPagina].meta_titulo);
    document.querySelector('meta[name="twitter:card"]').parentNode.insertBefore(metaTitleTwitter, document.querySelector('meta[name="twitter:card"]').nextSibling);

    const metaDescriptionTwitter = document.createElement('meta');
    metaDescriptionTwitter.setAttribute('name', 'twitter:description');
    metaDescriptionTwitter.setAttribute('content', config.paginas_fixas[nomeDaPagina].meta_descricao);
    document.querySelector('meta[name="twitter:title"]').parentNode.insertBefore(metaDescriptionTwitter, document.querySelector('meta[name="twitter:title"]').nextSibling);

    const metaImageTwitter = document.createElement('meta');
    metaImageTwitter.setAttribute('name', 'twitter:image');
    metaImageTwitter.setAttribute('content', config.dominio + '/img/' + nomeDaPagina + '.webp');
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
        img.dataset.src = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + config.nome_do_logo + ".webp";
        img.dataset.srcset = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + config.nome_do_logo + ".webp?tr=w-50 200w, https://ik.imagekit.io/crb/" + config.nome_do_logo + ".webp?tr=w-100 400w, https://ik.imagekit.io/crb/" + config.nome_do_logo + ".webp?tr=w-150 600w, https://ik.imagekit.io/crb/" + config.nome_do_logo + ".webp?tr=w-200 800w,";
        img.srcset = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + config.nome_do_logo + ".webp?tr=w-50 200w, https://ik.imagekit.io/crb/" + config.nome_do_logo + ".webp?tr=w-100 400w, https://ik.imagekit.io/crb/" + config.nome_do_logo + ".webp?tr=w-150 600w, https://ik.imagekit.io/crb/" + config.nome_do_logo + ".webp?tr=w-200 800w,";
    } else {
        img.dataset.src = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + config.nome_do_logo + "-branco.webp";
        img.dataset.srcset = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + config.nome_do_logo + "-branco.webp?tr=w-50 200w, https://ik.imagekit.io/crb/" + config.nome_do_logo + "-branco.webp?tr=w-100 400w, https://ik.imagekit.io/crb/" + config.nome_do_logo + "-branco.webp?tr=w-150 600w, https://ik.imagekit.io/crb/" + config.nome_do_logo + "-branco.webp?tr=w-200 800w,";
        img.srcset = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + config.nome_do_logo + "-branco.webp?tr=w-50 200w, https://ik.imagekit.io/crb/" + config.nome_do_logo + "-branco.webp?tr=w-100 400w, https://ik.imagekit.io/crb/" + config.nome_do_logo + "-branco.webp?tr=w-150 600w, https://ik.imagekit.io/crb/" + config.nome_do_logo + "-branco.webp?tr=w-200 800w,";
        nav.classList.add('navbar-dark');
    }

    img.src = "data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    img.alt = "logo do" + config.nome_do_site;
    img.title = "logo do" + config.nome_do_site;
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