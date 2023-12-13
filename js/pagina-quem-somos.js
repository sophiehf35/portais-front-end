/* FUNÇÃO PARA CRIAR E CARREGAR TEXTO DO QUEM SOMOS */
fetch('/configuracao/json/conteudo-quem-somos.json')
.then(response => {
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
    }
    return response.json();
})
.then(conteudoQuemSomos => {
    const divConteudoQuemSomos = document.getElementById('conteudoQuemSomos');
    divConteudoQuemSomos.insertAdjacentHTML('afterend', conteudoQuemSomos);
})
.catch(error => {
    console.error('Erro ao buscar dados:', error);
});
/* FUNÇÃO PARA CRIAR E CARREGAR TEXTO DO QUEM SOMOS */

/* FUNÇÃO PARA CRIAR E CARREGAR LOGO DO QUEM SOMOS */
function carregaLogoQuemSomos(config) {

    const logoQuemSomos = document.createElement('img');

    logoQuemSomos.src = `data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=`;
    logoQuemSomos.setAttribute('data-src', `${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img"}/${config.nome_do_logo}.webp`);
    logoQuemSomos.setAttribute('data-srcset', `${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img"}/${config.nome_do_logo}.webp?tr=w-300 300w, ${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img"}/${config.nome_do_logo}.webp?tr=w-100 100w, ${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img"}/${config.nome_do_logo}.webp?tr=w-700 700w, ${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img"}/${config.nome_do_logo}.webp?tr=w-1060 1060w`);
    logoQuemSomos.alt = config.nome_do_site;
    logoQuemSomos.title = config.nome_do_site;
    logoQuemSomos.className = "img-fluid";

    const figureLogoQuemSomos = document.getElementById('logoQuemSomos');
    figureLogoQuemSomos.insertAdjacentElement('beforeend', logoQuemSomos);

    AdiarImagens();
}
/* FUNÇÃO PARA CRIAR E CARREGAR LOGO DO QUEM SOMOS */