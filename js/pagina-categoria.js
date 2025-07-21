function carregaListaDeArtigos(config, slugDaPagina) {
    let paginaAtual = 1;
    const numeroArtigosPorPagina = config.numero_artigos_pagina_categoria;
    let data;

    fetch('/configuracao/json/artigos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
            }
            return response.json();
        })
        .then(responseData => {
            data = responseData;

            // Verifica se há um parâmetro 'pagina' na URL e atualiza a página
            const urlParams = new URLSearchParams(window.location.search);
            const pageParam = urlParams.get('pagina');
            if (pageParam && !isNaN(pageParam)) {
                paginaAtual = parseInt(pageParam, 10);
            }

            // Exibe os artigos na página atual e a paginação
            exibirArtigosNaPagina(paginaAtual, slugDaPagina);
            exibirPaginacao();

            // Carrega tabela de artigos na sidebar
            carregarTabelaArtigos(config, data, slugDaPagina);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });

    function exibirArtigosNaPagina(pagina, slugDaPagina) {
        const startIndex = (pagina - 1) * numeroArtigosPorPagina;
        const endIndex = startIndex + numeroArtigosPorPagina;
        const artigosDaPagina = data.filter(item => item.slug_categoria === slugDaPagina).slice(startIndex, endIndex);

        const cardHorizontalDeArtigosContainer = document.getElementById('cardHorizontalDeArtigos');
        cardHorizontalDeArtigosContainer.innerHTML = ''; // Limpa o conteúdo anterior

        //SEÇÃO CARD HORIZONTAL DE ARTIGOS
        artigosDaPagina.forEach(item => {

            const article = document.createElement('div');
            article.classList.add('card', 'mb-3', 'card-noticias');

            const row = document.createElement('div');
            row.classList.add('row', 'g-0');

            // Imagem
            const colImagem = document.createElement('div');
            colImagem.classList.add('col-xl-6', 'col-xxl-6');
            const linkImagem = document.createElement('a');
            linkImagem.href = (config.diretorio_blog === 'home' ? '/' : `/${config.diretorio_blog}/`) + item.slug_categoria + '/' + item.slug;
            const hoverContainer = document.createElement('div');
            hoverContainer.classList.add('hover', 'hover-3', 'text-white', 'secao-imagem');
            const imagem = document.createElement('img');
            imagem.src = 'data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
            imagem.setAttribute('data-src', (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque);
            imagem.setAttribute('data-srcset',
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-250 250w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-300 300w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-350 350w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-400 400w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-450 450w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-500 500w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-550 550w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-600 600w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-650 650w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-700 700w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-750 750w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-800 800w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-850 850w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-900 900w, ' +
                (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque +
                '?tr=w-950 950w'
            );
            imagem.setAttribute('sizes', '(max-width: 125px), ' +
                '(max-width: 150px), ' +
                '(max-width: 175px), ' +
                '(max-width: 200px), ' +
                '(max-width: 225px), ' +
                '(max-width: 250px), ' +
                '(max-width: 275px), ' +
                '(max-width: 300px), ' +
                '(max-width: 325px), ' +
                '(max-width: 350px), ' +
                '(max-width: 375px), ' +
                '(max-width: 400px), ' +
                '(max-width: 425px), ' +
                '(max-width: 450px), ' +
                '(max-width: 475px), ' +
                '(-webkit-min-device-pixel-ratio: 1.1) AND (-webkit-max-device-pixel-ratio: 1.5) 80.5vw, ' +
                '(-webkit-min-device-pixel-ratio: 1.6) AND (-webkit-max-device-pixel-ratio: 2) 75.5vw, ' +
                '(-webkit-min-device-pixel-ratio: 2.1) AND (-webkit-max-device-pixel-ratio: 2.5) 55.8vw, ' +
                '(-webkit-min-device-pixel-ratio: 2.6) AND (-webkit-max-device-pixel-ratio: 3) 51.86vw, ' +
                '(-webkit-min-device-pixel-ratio: 3.1) AND (-webkit-max-device-pixel-ratio: 3.5) 42.67vw, ' +
                '(-webkit-min-device-pixel-ratio: 3.6) AND (-webkit-max-device-pixel-ratio: 4) 37.42vw');
            imagem.title = item.titulo_imagem_destaque;
            imagem.alt = item.alt_imagem_destaque;
            imagem.width = '1200';
            const hoverOverlay = document.createElement('div');
            hoverOverlay.classList.add('hover-overlay');
            const hoverContent = document.createElement('div');
            hoverContent.classList.add('hover-3-content', 'px-5', 'py-4');
            const readMoreSpan = document.createElement('span');
            readMoreSpan.classList.add('hover-3-description', 'text-uppercase', 'mb-0', 'h3');
            readMoreSpan.textContent = 'LEIA MAIS';

            hoverContent.appendChild(readMoreSpan);
            hoverContainer.appendChild(imagem);
            hoverContainer.appendChild(hoverOverlay);
            hoverContainer.appendChild(hoverContent);
            colImagem.appendChild(linkImagem);
            linkImagem.appendChild(hoverContainer);

            // Texto
            const colTexto = document.createElement('div');
            colTexto.classList.add('col-xl-6', 'col-xxl-6');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'secao-texto', 'p-4');
            const conteudo = document.createElement('div');
            conteudo.classList.add('conteudo', 'mb-4', 'mb-lg-3', 'mb-xl-4');
            const tituloLink = document.createElement('a');
            tituloLink.href = (config.diretorio_blog === 'home' ? '/' : `/${config.diretorio_blog}/`) + item.slug_categoria + '/' + item.slug;
            const titulo = document.createElement('h2');
            titulo.classList.add('card-title', 'mb-3', 'h5');
            titulo.textContent = item.titulo;
            tituloLink.appendChild(titulo);
            conteudo.appendChild(tituloLink);
            const descricao = document.createElement('p');
            descricao.classList.add('card-text');
            descricao.textContent = item.descricao + ' [...]';

            // Rodapé
            const rodape = document.createElement('ul');
            rodape.classList.add('rodape', 'mb-0', 'pt-xl-1', 'pt-xxl-4');
            const liData = document.createElement('li');
            const dataPublicacao = document.createElement('small');
            dataPublicacao.textContent = calcularDiferencaTempo(item.data_hora_criacao);
            liData.appendChild(dataPublicacao);
            const liComentarios = document.createElement('li');
            liComentarios.innerHTML = '<i class="ti-comment"></i>' + item.total_comentarios;

            rodape.appendChild(liData);
            rodape.appendChild(liComentarios);

            // Monta a estrutura do card
            cardBody.appendChild(conteudo);
            cardBody.appendChild(descricao);
            cardBody.appendChild(rodape);
            colTexto.appendChild(cardBody);

            row.appendChild(colImagem);
            row.appendChild(colTexto);
            article.appendChild(row);

            cardHorizontalDeArtigosContainer.appendChild(article);

        });

        // Adia as imagens (se necessário)
        AdiarImagens();
    }

    function exibirPaginacao() {
        const artigosDaPagina = data.filter(item => item.slug_categoria === slugDaPagina);
        const totalPages = Math.ceil(artigosDaPagina.length / numeroArtigosPorPagina);
        const paginationContainer = document.querySelector('#divPaginacao');
        const maxButtons = 3;
    
        // Verifica se há mais de uma página
        if (totalPages > 1) {
            // Limpa a paginação antes de exibir as páginas
            paginationContainer.innerHTML = '';
    
            const paginationList = document.createElement('ul');
            paginationList.classList.add('pagination');
    
            // Adiciona o botão "Anterior" se houver uma página anterior
            if (paginaAtual > 1) {
                const prevPageItem = document.createElement('li');
                const prevPageLink = document.createElement('a');
                prevPageLink.classList.add('page-link');
                prevPageLink.style.fontSize = '20px';
                prevPageLink.href = paginaAtual === 2 ? `/${slugDaPagina}/` : `?pagina=${paginaAtual - 1}`;
                prevPageLink.title = 'página anterior';
                prevPageLink.textContent = '<';
    
                prevPageItem.appendChild(prevPageLink);
                paginationList.appendChild(prevPageItem);
            }
    
            // Calcula os botões de paginação a serem exibidos
            let startPage = Math.max(1, paginaAtual - Math.floor(maxButtons / 2));
            let endPage = Math.min(totalPages, paginaAtual + Math.floor(maxButtons / 2));
    
            if (paginaAtual <= Math.floor(maxButtons / 2)) {
                endPage = Math.min(totalPages, maxButtons);
            }
    
            if (totalPages - paginaAtual < Math.floor(maxButtons / 2)) {
                startPage = Math.max(1, totalPages - maxButtons + 1);
            }
    
            // Adiciona elipses antes dos botões, se necessário
            if (startPage > 1) {
                const firstPageItem = document.createElement('li');
                const firstPageLink = document.createElement('a');
                firstPageLink.classList.add('page-link');
                firstPageLink.href = `/${slugDaPagina}/`;
                firstPageLink.title = 'página 1';
                firstPageLink.textContent = '1';
                firstPageItem.appendChild(firstPageLink);
                paginationList.appendChild(firstPageItem);
    
                const ellipsisItem = document.createElement('li');
                const ellipsisItemContent = document.createElement('span');
                ellipsisItemContent.classList.add('page-link');
                ellipsisItemContent.textContent = '...';
    
                ellipsisItem.appendChild(ellipsisItemContent);
                paginationList.appendChild(ellipsisItem);
            }
    
            // Adiciona os links das páginas
            for (let i = startPage; i <= endPage; i++) {
                const paginationItem = document.createElement('li');
                if (i === paginaAtual) {
                    const activeLink = document.createElement('a');
                    activeLink.classList.add('active');
                    activeLink.href = i === 1 ? `${(config.diretorio_blog === 'home' ? '/' : `/${config.diretorio_blog}/`)}${slugDaPagina}/` : `?pagina=${i}`;
                    activeLink.title = `página ${i}`;
                    activeLink.textContent = i;
                    paginationItem.appendChild(activeLink);
                } else {
                    const pageLink = document.createElement('a');
                    pageLink.classList.add('page-link');
                    pageLink.href = i === 1 ? `${(config.diretorio_blog === 'home' ? '/' : `/${config.diretorio_blog}/`)}${slugDaPagina}/` : `?pagina=${i}`;
                    pageLink.title = `página ${i}`;
                    pageLink.textContent = i;
                    paginationItem.appendChild(pageLink);
                }
                paginationList.appendChild(paginationItem);
            }
    
            // Adiciona elipses após os botões, se necessário
            if (endPage < totalPages) {
                const ellipsisItem = document.createElement('li');
                const ellipsisItemContent = document.createElement('span');
                ellipsisItemContent.classList.add('page-link');
                ellipsisItemContent.textContent = '...';
    
                ellipsisItem.appendChild(ellipsisItemContent);
                paginationList.appendChild(ellipsisItem);
    
                const lastPageItem = document.createElement('li');
                const lastPageLink = document.createElement('a');
                lastPageLink.classList.add('page-link');
                lastPageLink.href = `?pagina=${totalPages}`;
                lastPageLink.title = `página ${totalPages}`;
                lastPageLink.textContent = totalPages;
                lastPageItem.appendChild(lastPageLink);
                paginationList.appendChild(lastPageItem);
            }
    
            // Adiciona o botão "Próxima página" se houver uma próxima página
            if (paginaAtual < totalPages) {
                const nextPageItem = document.createElement('li');
                const nextPageLink = document.createElement('a');
                nextPageLink.classList.add('page-link');
                nextPageLink.style.fontSize = '20px';
                nextPageLink.href = `?pagina=${paginaAtual + 1}`;
                nextPageLink.title = 'próxima página';
                nextPageLink.textContent = '>';
    
                nextPageItem.appendChild(nextPageLink);
                paginationList.appendChild(nextPageItem);
            }
    
            // Adiciona o wrapper ao contêiner de paginação
            paginationContainer.appendChild(paginationList);
        }
    }
    

    function updateURL() {
        const params = new URLSearchParams(window.location.search);
        params.set('pagina', paginaAtual);
        window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    }
}

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
            
            if (data.length > 0 && config.conteudo_destaque_pagina_categoria === 1) {
                let link = '';
            
                data.forEach(conteudo => {
                    const imagem = (conteudo.tipo === 'artigos' ? `/usuarios/${conteudo.diretorio_autor}/${conteudo.tipo}/thumb/${conteudo.imagem_destaque}` : `/ferramentas/${conteudo.imagem_destaque}`);
                    const slugConteudo = `${config.diretorio_blog === "home" ? "" : `${config.diretorio_blog}/`}${conteudo.tipo === 'artigos' ? `${conteudo.slug_categoria}/${conteudo.slug}` : `ferramentas/${conteudo.slug}`}`;
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
                            <small class="p-1 badge badge-primary rounded-0">${categoria}</small>
                            <h4><a href="/${slugConteudo}">${conteudo.titulo_breadcumb}</a></h4>
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
                
                const sidebar = document.querySelector('aside');
                sidebar.insertAdjacentHTML("beforeend", conteudosEmDestaque);
                
            }
            
            AdiarImagens();
        
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });

}
/* FUNÇÃO PARA CRIAR SECTION E CARREGAR O CONTEÚDO EM DESTAQUE */

/* FUNÇÃO PARA CARREGAR TABELA DE ARTIGOS NA SIDEBAR (SEM NOTÍCIAS) */
function carregarTabelaArtigos(config, artigos, slugDaPagina) {
    const artigosDaPagina = artigos.filter(item =>
        item.slug_categoria === slugDaPagina && item.tipo_conteudo_schema === "1"
    );
    if (!artigosDaPagina.length) return;

    const visualizacaoMobile = window.innerWidth < 600;

    // Cria o bloco com o mesmo padrão dos widgets
    const aside = document.querySelector('aside');
    if (!aside) return;

    const novoWidget = document.createElement('div');
    novoWidget.className = 'box_detail widget';

    const tituloSecao = document.createElement('div');
    tituloSecao.className = 'titulo_secao';

    const h3 = document.createElement('h3');
    h3.className = 'titulo';
    h3.textContent = 'ARTIGOS';

    tituloSecao.appendChild(h3);

    const divConteudo = document.createElement('div');
    divConteudo.className = 'conteudo_secao_sidebar';

    const divTabela = document.createElement('div');
    divTabela.id = 'divTabelaArtigosCategoria';

    // Adiciona a tabela dentro do conteúdo
    divConteudo.appendChild(divTabela);

    // Adiciona o título e o conteúdo ao widget
    novoWidget.appendChild(tituloSecao);
    novoWidget.appendChild(divConteudo);

    // Adiciona o widget ao final do <aside>
    aside.appendChild(novoWidget);

    // Renderiza a tabela
    new gridjs.Grid({
        columns: [
            { name: 'ID', hidden: visualizacaoMobile },
            { name: 'Titulo' }
        ],
        data: artigosDaPagina.map((artigo, index) => ({
            id: index + 1,
            titulo: gridjs.html(
                `<a href='${(config.diretorio_blog === 'home' ? '/' : `/${config.diretorio_blog}/`)}${artigo.slug_categoria}/${artigo.slug}'>${artigo.titulo_breadcumb}</a>`
            )
        })),
        className: {
            table: 'table table-striped'
        },
        style: {
            th: {
                background: '#fff',
                color: '#000',
                padding: '0.5rem'
            },
            td: {
                padding: '0.5rem'
            }
        },
        pagination: {
            limit: 10,
            summary: false,
            buttonsCount: 2
        },
        resizable: true,
        sort: true,
        search: true,
        language: {
            search: {
                placeholder: 'Pesquise um artigo'
            },
            pagination: {
                previous: visualizacaoMobile ? '<' : 'Anterior',
                next: visualizacaoMobile ? '>' : 'Próximo',
                showing: 'Exibindo',
                to: 'a',
                of: 'de',
                results: 'resultados'
            },
            noRecordsFound: 'Nenhum artigo encontrado para a busca'
        }
    }).render(divTabelaWrapper);
}
/* FUNÇÃO PARA CARREGAR TABELA DE ARTIGOS NA SIDEBAR (SEM NOTÍCIAS) */