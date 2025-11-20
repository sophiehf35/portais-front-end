function carregaMenu(config) {
    fetch('/configuracao/json/menu-superior-principal.json')
        .then(response => {
            if (!response.ok) throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
            return response.json();
        })
        .then(menu => {
            let menuHTML = `
            <div class="offcanvas offcanvas-start text-bg-dark menu-mobile" tabindex="-1" id="menu" aria-labelledby="menuLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title text-white" id="menuLabel">MENU</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body p-0 menu-mobile-body">
                    <ul class="navbar-nav justify-content-end flex-grow-1">
            `;

            for (let chave in menu) {
                if (!menu.hasOwnProperty(chave)) continue;
                const itemMenu = menu[chave];
                menuHTML += '<li class="nav-item">';

                if (itemMenu['megaMenu']) {
                    // Mega menu
                    menuHTML += `
                    <li class="nav-item dropdown dropdown-mega position-static">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                            ${itemMenu['nome']}
                        </a>
                        <ul class="row dropdown-menu shadow mx-auto container-md mt-0 px-md-3" style="right: 0px;">
                    `;

                    if (itemMenu['submenu'] && Array.isArray(itemMenu['submenu'])) {
                        const colunas = 4; // col-md-3 → 4 colunas
                        const totalItens = itemMenu['submenu'].length;

                        itemMenu['submenu'].forEach(subItem => {
                            menuHTML += `
                            <li class="col-12 col-sm-6 col-md-3 px-0 px-md-2 py-md-2">
                                <a class="dropdown-item" href="${subItem['slug']}">${subItem['nome']}</a>
                            </li>
                            `;
                        });

                        // Adiciona placeholders vazios para fechar a última linha
                        const resto = totalItens % colunas;
                        if (resto !== 0) {
                            const placeholders = colunas - resto;
                            for (let i = 0; i < placeholders; i++) {
                                menuHTML += '<li class="col-12 col-sm-6 col-md-3 px-0 px-md-2 py-md-2"></li>';
                            }
                        }
                    }

                    menuHTML += '</ul></li>';
                } else if (itemMenu['submenu'] && Array.isArray(itemMenu['submenu'])) {
                    // Dropdown normal
                    menuHTML += `
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            ${itemMenu['nome']}
                        </a>
                        <ul class="dropdown-menu collapse" data-bs-parent=".offcanvas-body">
                    `;
                    itemMenu['submenu'].forEach(subItemMenu => {
                        menuHTML += `<li><a class="dropdown-item" href="${subItemMenu['slug']}">${subItemMenu['nome']}</a></li>`;
                    });
                    menuHTML += '</ul></li>';
                } else {
                    // Menu simples sem submenu
                    menuHTML += `<a class="nav-link" href="${itemMenu['slug']}">${itemMenu['nome']}</a>`;
                }

                menuHTML += '</li>';
            }

            menuHTML += '</ul>';

            if (config.botao_superior_direito === 1) {
                menuHTML += `<ul id="top_menu" class="list-unstyled"><li><a href="${config.link_botao_superior_direito}" class="btn_add fe-pulse">${config.texto_botao_superior_direito}</a></li></ul>`;
            }

            menuHTML += '</div></div>';

            document.querySelector('nav > div').insertAdjacentHTML('beforeend', menuHTML);
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
}