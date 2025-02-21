function carregaMenu(config) {
    fetch('/configuracao/json/menu-superior-principal.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
            }
            return response.json();
        })
        .then(menu => {
            var menuHTML = '<div class="offcanvas offcanvas-start text-bg-dark menu-mobile" tabindex="-1" id="menu" aria-labelledby="menuLabel">';
            menuHTML += '<div class="offcanvas-header">';
            menuHTML += '<h5 class="offcanvas-title text-white" id="menuLabel">MENU</h5>';
            menuHTML += '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>';
            menuHTML += '</div>';
            menuHTML += '<div class="offcanvas-body p-0 menu-mobile-body">';
            menuHTML += '<ul class="navbar-nav justify-content-end flex-grow-1">';
            
            for (var chave in menu) {
                if (menu.hasOwnProperty(chave)) {
                    var itemMenu = menu[chave];
                    menuHTML += '<li class="nav-item">';

                    if (itemMenu['megaMenu']) {
                        // Mega menu
                        menuHTML += '<li class="nav-item dropdown dropdown-mega position-static">';
                        menuHTML += '<a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">';
                        menuHTML += itemMenu['nome'];
                        menuHTML += '</a>';
                        menuHTML += '<ul class="row dropdown-menu shadow mx-auto container-md mt-0 px-md-3" style="right: 0px;">';
                        
                        // Construir os itens do mega menu
                        if (itemMenu['submenu'] && Array.isArray(itemMenu['submenu'])) {
                            itemMenu['submenu'].forEach(subItem => {
                                menuHTML += '<li class="col-12 col-sm-6 col-md-3 px-0 px-md-2 py-md-2">';
                                menuHTML += '<a class="dropdown-item" href="' + subItem['slug'] + '">' + subItem['nome'] + '</a>';
                                menuHTML += '</li>';
                            });
                        }

                        menuHTML += '</ul>';
                        menuHTML += '</li>';
                    } else if (itemMenu['submenu'] && Array.isArray(itemMenu['submenu'])) {
                        // Dropdown normal
                        menuHTML += '<li class="nav-item dropdown">';
                        menuHTML += '<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">';
                        menuHTML += itemMenu['nome'];
                        menuHTML += '</a>';
                        menuHTML += '<ul class="dropdown-menu collapse" data-bs-parent=".offcanvas-body">';
                        
                        // Construir os itens do submenu
                        for (var subChave in itemMenu['submenu']) {
                            if (itemMenu['submenu'].hasOwnProperty(subChave)) {
                                var subItemMenu = itemMenu['submenu'][subChave];
                                menuHTML += '<li><a class="dropdown-item" href="' + subItemMenu['slug'] + '">' + subItemMenu['nome'] + '</a></li>';
                            }
                        }

                        menuHTML += '</ul>';
                        menuHTML += '</li>';
                    } else {
                        // Menu simples sem submenu
                        menuHTML += '<a class="nav-link" href="' + itemMenu['slug'] + '">' + itemMenu['nome'] + '</a>';
                    }

                    menuHTML += '</li>';
                }
            }

            menuHTML += '</ul>';

            if (config.botao_superior_direito === 1) {
                menuHTML += '<ul id="top_menu"><li><a href="' + config.link_botao_superior_direito + '" class="btn_add fe-pulse">' + config.texto_botao_superior_direito + '</a></li></ul>';
            }

            menuHTML += '</div>';
            menuHTML += '</div>';

            document.querySelector('nav > div').insertAdjacentHTML('beforeend', menuHTML);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}