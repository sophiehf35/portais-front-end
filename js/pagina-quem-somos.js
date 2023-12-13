/* FUNÇÃO PARA CRIAR E CARREGAR TEXTO DO QUEM SOMOS */
fetch('/configuracao/json/conteudo-quem-somos.json')
.then(response => {
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
    }
    return response.json();
})
.then(conteuQuemSomos => {
    const divConteuQuemSomos = document.getElementById('conteuQuemSomos');
    divConteuQuemSomos.insertAdjacentElement('afterend', conteuQuemSomos);
})
.catch(error => {
    console.error('Erro ao buscar dados:', error);
});
/* FUNÇÃO PARA CRIAR E CARREGAR TEXTO DO QUEM SOMOS */

/* FUNÇÃO PARA CRIAR E CARREGAR LOGO DO QUEM SOMOS */
function carregaLogoQuemSomos(config) {

    const logoQuemSomos = document.createElement('img');

    img.src = `data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=`;
    img.setAttribute('data-src', `${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img"}/logo-${config.nome_do_logo}.webp`);
    img.setAttribute('data-srcset', `${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img"}/logo-${config.nome_do_logo}.webp?tr=w-300 300w, ${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img"}/logo-${config.nome_do_logo}.webp?tr=w-100 100w, ${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img"}/logo-${config.nome_do_logo}.webp?tr=w-700 700w, ${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img"}/logo-${config.nome_do_logo}.webp?tr=w-1060 1060w`);
    img.alt = config.nome_do_site;
    img.title = config.nome_do_site;
    img.className = "img-fluid";

    const divLogoQuemSomos = document.getElementById('logoQuemSomos');
    divLogoQuemSomos.insertAdjacentElement('afterend', logoQuemSomos);
  }
  /* FUNÇÃO PARA CRIAR E CARREGAR LOGO DO QUEM SOMOS */