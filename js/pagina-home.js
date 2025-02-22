function carregaConteudoHomePortal(config) {

    fetch('/configuracao/json/artigos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            const artigosDaPagina = data.slice(0, config.numero_artigos_pagina_home);

            const slideInicialDeArtigosContainer = document.getElementById('slideInicialDeArtigos');
            const imagemComArtigosContainer = document.getElementById('imagemComArtigos');
            const cardHorizontalDeArtigosContainer = document.getElementById('cardHorizontalDeArtigos');

            //SLIDE INICIAL DE ARTIGOS
            artigosDaPagina.slice(0, 4).forEach(item => {

                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');

                const link = document.createElement('a');
                link.href = (config.diretorio_blog === 'home' ? '/' : `/${config.diretorio_blog}/`) + item.slug_categoria + '/' + item.slug;

                const image = document.createElement('img');
                image.src = 'data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
                image.dataset.src = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque;
                image.dataset.srcset = (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque + '?tr=w-940';
                image.title = item.titulo_imagem_destaque;
                image.alt = item.alt_imagem_destaque;
                image.width = '932';
                image.height = '524';
                image.classList.add('img-fluid', 'w-100');

                const titleOverlay = document.createElement('div');
                titleOverlay.classList.add('position-absolute', 'p-2', 'p-lg-3', 'b-0', 'w-100', 'bg-shadow', 'text-start');

                let categoryBadge = null;

                if (config.exibe_categorias_de_artigos === 1) {
                    categoryBadge = document.createElement('a');
                    categoryBadge.href = (config.diretorio_blog === 'home' ? '/' : `/${config.diretorio_blog}/`) + item.slug_categoria + '/';
                    categoryBadge.classList.add('p-2', 'badge', 'badge-primary', 'rounded-0');
                    categoryBadge.textContent = item.categoria;
                }

                const titleLink = document.createElement('a');
                titleLink.href = (config.diretorio_blog === 'home' ? '/' : `/${config.diretorio_blog}/`) + item.slug_categoria + '/' + item.slug + '/';

                const title = document.createElement('h2');
                title.style.fontSize = '23px';
                title.classList.add('h5', 'text-white', 'my-1');
                title.textContent = item.titulo;

                titleLink.appendChild(title);
                config.exibe_categorias_de_artigos === 1 ? titleOverlay.appendChild(categoryBadge) : null;
                titleOverlay.appendChild(titleLink);
                link.appendChild(image);
                link.appendChild(titleOverlay);
                slide.appendChild(link);

                slideInicialDeArtigosContainer.querySelector('.swiper-wrapper').appendChild(slide);
            });

            //INICIALIZA SLIDES INICIAIS
            var swiper = new Swiper('.mySwiper', {
                loop: true,
                grid: {
                    rows: 1,
                },
                autoplay: {
                    delay: 5000,
                },
                breakpoints: {
                    240: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 15
                    }
                }
            });

            //SEÇAO DE IMAGEM COM ARTIGOS
            artigosDaPagina.slice(4, 10).forEach((item, index) => {

                const article = document.createElement('div');
                article.classList.add('col-xl-4', 'col-md-6', 'mb-3', 'px-0');

                const link = document.createElement('a');
                link.href = (config.diretorio_blog === 'home' ? '/' : `/${config.diretorio_blog}/`) + item.slug_categoria + '/' + item.slug;
                
                const card = document.createElement('div');
                card.classList.add('card', 'border-0', 'rounded-0', 'text-white', 'overflow', 'zoom', 'position-relative', 'mb-0');

                const imageWrapper = document.createElement('div');
                imageWrapper.classList.add('ratio_right-cover-2', 'image-wrapper');

                const image = document.createElement('img');
                image.src = 'data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
                image.setAttribute('data-src', (config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img') + '/usuarios/' + item.diretorio_autor + '/artigos/thumb/' + item.imagem_destaque);
                image.setAttribute('data-srcset',
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
                image.setAttribute('sizes', '(max-width: 125px), ' +
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
                image.title = item.titulo_imagem_destaque;
                image.alt = item.alt_imagem_destaque;
                image.width = '1200';
                image.height = '675';
                image.classList.add('img-fluid', 'w-100');

                link.appendChild(card);
                card.appendChild(imageWrapper);
                imageWrapper.appendChild(image);
                
               

                const titleOverlay = document.createElement('div');
                titleOverlay.classList.add('position-absolute', 'p-2', 'p-lg-3', 'b-0', 'w-100', 'bg-shadow');

                let categoryBadge = null;

                if (config.exibe_categorias_de_artigos === 1) {
                    categoryBadge = document.createElement('a');
                    categoryBadge.href = (config.diretorio_blog === 'home' ? '/' : `/${config.diretorio_blog}/`) + item.slug_categoria + '/';
                    categoryBadge.classList.add('p-2', 'badge', 'badge-primary', 'rounded-0');
                    categoryBadge.textContent = item.categoria;
                }

                const title = document.createElement('h2');
                title.classList.add('h6', 'text-white', 'my-1');
                title.textContent = item.titulo;

                titleOverlay.appendChild(title);
                config.exibe_categorias_de_artigos === 1 ? titleOverlay.appendChild(categoryBadge) : null;
                card.appendChild(titleOverlay);
                article.appendChild(link);

                //ADICIONA CLASSES ESPECIFICAS NAS IMAGENS
                if (index === 0) {
                    article.classList.add('pe-md-2', 'ps-xl-0', 'pe-xl-2');
                } else if (index === 1) {
                    article.classList.add('ps-md-2', 'px-xl-1');
                } else if (index === 2) {
                    article.classList.add('pe-md-2', 'ps-xl-2', 'pe-xl-0');
                } else if (index === 3) {
                    article.classList.add('ps-md-2', 'ps-xl-0', 'pe-xl-2');
                } else if (index === 4) {
                    article.classList.add('pe-md-2', 'px-xl-1');
                } else if (index === 5) {
                    article.classList.add('ps-md-2', 'ps-xl-2', 'pe-xl-0');
                }

                imagemComArtigosContainer.appendChild(article);
            });

            //SEÇÃO CARD HORIZONTAL DE ARTIGOS
            artigosDaPagina.slice(10).forEach((item) => {

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

                // Adiciona ao container
                cardHorizontalDeArtigosContainer.appendChild(article);

            });

            AdiarImagens();

        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}