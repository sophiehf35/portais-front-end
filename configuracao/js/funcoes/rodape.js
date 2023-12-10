function carregaRodape(config) {
    
    fetch('/configuracao/json/rodape.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
            }
            return response.json();
        })
        .then(conteudoRodape => {
            let i = 1;
            let links = '';
            let rodape = '';
    
            conteudoRodape.forEach((itemRodape, key) => {
                links = '';
                if (key === 0) {
                    if (itemRodape.links && Array.isArray(itemRodape.links)) {
                        itemRodape.links.forEach(itemLink => {
                            links += `<li><a href="${itemLink.slug}">${itemLink.nome}</a></li>`;
                        });
                    }
    
                    rodape +=
                        `<div class="col-lg-${12 / conteudoRodape.length} col-md-6 col-sm-6">
                            ${itemRodape.titulo ? `<h3 data-bs-toggle="collapse" data-bs-target="#collapse_ft_${i}">${itemRodape.titulo}</h3>` : ''}
                            <div class="collapse dont-collapse-sm" id="collapse_ft_${i}">
                                <ul class="links">
                                    ${links}
                                </ul>
                                ${config.permite_logo_no_rodape === '1' ? `<figure><img src="data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img'}/logo-${nomeDoLogo}-branco-rodape.webp" data-srcset="${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img'}/logo-${nomeDoLogo}-branco-rodape.webp?tr=w-50 50w, ${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img'}/logo-${nomeDoLogo}-branco-rodape.webp?tr=w-100 100w, ${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img'}/logo-${nomeDoLogo}-branco-rodape.webp?tr=w-150 150w, ${config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : '/img'}/logo-${nomeDoLogo}-branco-rodape.webp?tr=w-200 200w," alt="logo branco ${config.nome_do_site}" title="logo branco ${config.nome_do_site}" class="logo_sticky" width="200px" height="45px"></figure>` : ''}
                            </div>
                        </div>`;
                } else {
                    if (itemRodape.links && Array.isArray(itemRodape.links)) {
                        itemRodape.links.forEach(itemLink => {
                            links += `<li><a href="${itemLink.slug}">${itemLink.nome}</a></li>`;
                        });
                    }
    
                    rodape +=
                        `<div class="col-lg-${12 / conteudoRodape.length} col-md-6 col-sm-6">
                            ${itemRodape.titulo ? `<h3 data-bs-toggle="collapse" data-bs-target="#collapse_ft_${i}">${itemRodape.titulo}</h3>` : ''}
                            <div class="collapse dont-collapse-sm" id="collapse_ft_${i}">
                                <ul class="links">
                                    ${links}
                                </ul>
                            </div>
                        </div>`;
                }
                i++;
            });
    
            // Adicionar a tag footer
            document.getElementById('page').insertAdjacentHTML('beforeend', `<footer class="plus_border"><div class="container margin_60_35"><div class="row">${rodape}</div><hr style="margin: 10px 0 10px 0; opacity:1;"><div class="row"><div class="col-lg-12"><div style="text-align:center; margin-top:10px;"><span style="color:#FFF">Copyright © Todos os Direitos Reservados | ${config.nome_do_site}.</span></div></div></div></div></footer>`);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}