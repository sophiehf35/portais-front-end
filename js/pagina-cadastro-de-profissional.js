

    function validarFormularioCadastroProfissional(config) {

    /* INICIO CRIA SELECT TIPO PROFISSIONAL */
    let tipo_de_profissional = new SlimSelect({
        select: '#tipo_de_profissional',
        settings: {
            showSearch: false,
            placeholderText: 'Tipo de Profissional *'
        },
        events: {
            beforeClose: () => {
                $('#select_tipo_de_profissional :first-child').removeClass("borda_erro");
                $("#tipo_de_profissional-error").remove();
            }
        },
    })
    /* FIM CRIA SELECT TIPO PROFISSIONAL */
    
    
    /* INICIO CRIA SELECT UF REGISTRO OAB */
    new SlimSelect({
        select: '#uf_registro_oab',
        settings: {
            placeholderText: 'UF OAB *',
            searchText: 'UF não encontrada',
            searchPlaceholder: 'Buscar',
        },
        events: {
            beforeClose: () => {
                $('#select_uf_registro_oab :first-child').removeClass("borda_erro");
                $("#uf_registro_oab-error").remove();
            }
        },
    })
    /* FIM CRIA SELECT UF REGISTRO OAB */


    /* INICIO CRIA SELECT ÁREAS DE ATUAÇÃO PRINCIPAL */
    let area_de_atuacao_principal = new SlimSelect({
        select: '#area_de_atuacao_principal',
        settings: {
            placeholderText: 'Aréa de atuação principal *',
            searchText: 'Aréa não encontrada',
            searchPlaceholder: 'Buscar',
        },
        events: {
            beforeClose: () => {
                $('#select_area_de_atuacao_principal :first-child').removeClass("borda_erro");
                $("#area_de_atuacao_principal-error").remove();
            }
        },
    })
    /* FIM CRIA SELECT ÁREA DE ATUAÇÃO PRINCIPAL */
    
    /* INICIO CRIA SELECT OUTRAS ÁREAS DE ATUAÇÃO */
    let area_de_atuacao_outras = new SlimSelect({
        select: '#area_de_atuacao_outras',
        settings: {
            placeholderText: 'Até 03 áreas adicionais',
            searchText: 'Aréa não encontrada',
            searchPlaceholder: 'Buscar',
            maxSelected: 3,
            closeOnSelect: false
        },
        events: {
            beforeClose: () => {
                $('#area_de_atuacao_outras :first-child').removeClass("borda_erro");
                $("#area_de_atuacao_outras-error").remove();
            }
        },
    })
    /* FIM CRIA SELECT OUTRAS ÁREAS DE ATUAÇÃO */


    /* INICIO CRIA SELECT SEXO */
    new SlimSelect({
        select: '#sexo',
        settings: {
            showSearch: false,
            placeholderText: 'Selecione o Sexo *'
        },
        events: {
            beforeClose: () => {
                $('#select_sexo :first-child').removeClass("borda_erro");
                $("#sexo-error").remove();
            }
        },
    })
    /* FIM CRIA SELECT SEXO */
    
    
    /* INÍCIO CONFIGURAÇÃO DA VALIDAÇÃO DO FORMULÁRIO */
    var form = $("#formulario_de_profissionais");
    $('#formulario_de_profissionais').removeData('validator');
    $.validator.addMethod("telefone", validacao_de_telefone_fixo, "Informe um telefone válido.");
    $.validator.addMethod("celular", validacao_de_telefone_celular, "Informe um telefone válido.");
    $.validator.addMethod("cnpj", validacao_de_cnpj, "Informe um CNPJ Válido.");
    $.validator.addMethod("cpf", validacao_de_cpf, "Informe um CPF válido");
    $.validator.addMethod("cep", validacao_de_cep);
    form.validate({
        ignore: [],
        cache: false,
        onfocusout: false,
        onkeyup: false,
        errorElement: 'span',
        errorPlacement: function(error, element) {
            if (element.attr("name") == "tipo_de_profissional") {
                $('#select_tipo_de_profissional').append(error);
                $('#select_tipo_de_profissional :first-child').addClass("borda_erro");

            } else if (element.attr("name") == "sexo") {
                $('#select_sexo').append(error);
                $('#select_sexo :first-child').addClass("borda_erro");

            } else if (element.attr("name") == "area_de_atuacao_principal") {
                $('#select_area_de_atuacao_principal').append(error);
                $('#select_area_de_atuacao_principal :first-child').addClass("borda_erro");

            } else if (element.attr("name") == "uf_registro_oab") {
                $('#select_uf_registro_oab').append(error);
                $('#select_uf_registro_oab :first-child').addClass("borda_erro");

            } else {
                error.insertAfter(element);
                $(element).closest(".form-control").addClass("has-error");
            }
        },
        errorClass: "help-block",
        highlight: function(element, errorClass, validClass) {
            $(element).closest(".form-control").addClass("has-error is-invalid");

        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).closest(".form-control").removeClass("has-error is-invalid");

        },
        rules: {
            tipo_de_profissional: {
                required: true,
            },
            cpf: {
                required: function(element) {
                    return $("#tipo_de_profissional").val() === 'advogado';
                },
                cpf: true,
                remote: {
                    url: config.endereco_funcao_php,
                    async: false,
                    cache: false,
                    type: "POST",
                    data: {
                        funcao: 'VerificaCpfCadastro',
                    },
                }
            },
            cnpj: {
                required: function(element) {
                    return $("#cpf").val().length === 0;
                },
                cnpj: true,
                remote: {
                    url: config.endereco_funcao_php,
                    async: false,
                    cache: false,
                    type: "POST",
                    data: {
                        funcao: 'VerificaCnpjCadastro',
                    },
                }
            },
            registro_oab: {
                required: function(element) {
                    return $("#tipo_de_profissional").val() === 'advogado';
                },
            },
            registro_oab_responsavel: {
                required: function(element) {
                    return $("#tipo_de_profissional").val() === 'escritorio';
                },
            },
            area_de_atuacao_principal: {
                required: true,
            },
            uf_registro_oab: {
                required: function(element) {
                    return $("#tipo_de_profissional").val() !== '';
                },
            },
            nome: {
                required: function(element) {
                    return $("#tipo_de_profissional").val() === 'advogado';
                },
            },
            sobrenome: {
                required: function(element) {
                    return $("#tipo_de_profissional").val() === 'advogado';
                },
            },
            nome_do_escritorio: {
                required: function(element) {
                    return $("#tipo_de_profissional").val() === 'escritorio';
                },
            },
            nome_do_responsavel: {
                required: function(element) {
                    return $("#tipo_de_profissional").val() === 'escritorio';
                },
            },
            sexo: {
                required: function(element) {
                    return $("#tipo_de_profissional").val() === 'advogado';
                },
            },
            email: {
                required: true,
                email: true,
                remote: {
                    url: config.endereco_funcao_php,
                    async: false,
                    cache: false,
                    type: "POST",
                    data: {
                        funcao: 'VerificaEmailCadastro',
                    },
                },
            },
            senha: {
                required: true,
                minlength: 5
            },
            confirme_a_senha: {
                required: true,
                minlength: 5,
                equalTo: "#senha"
            },
            telefone_fixo: {
                telefone: true,
            },
            telefone_celular: {
                celular: true,
            },
            cep: {
                required: true,
                cep: true,
                remote: {
                    url: config.endereco_funcao_php,
                    async: false,
                    cache: false,
                    type: "POST",
                    data: {
                        funcao: 'ConsultaCEP'
                    },
                    success: function(resposta) {

                        $("#cep").closest(".form-control").removeClass("has-error is-invalid");
                        $("#cep-error").remove();

                        $("#endereco").val(resposta.endereco);
                        $("#bairro_endereco").val(resposta.bairro);
                        $("#cidade_endereco").val(resposta.cidade);
                        $("#estado_endereco").val(resposta.estado);
                        $("#numero").focus();

                        if (resposta.endereco === null) {
                            $("#endereco").prop("disabled", false);
                        } else {
                            $("#endereco").prop("disabled", true);
                        }
                        if (resposta.bairro === null) {
                            $("#bairro_endereco").prop("disabled", false);
                        } else {
                            $("#bairro_endereco").prop("disabled", true);
                        }
                        if (resposta.cidade === null) {
                            $("#cidade_endereco").prop("disabled", false);
                        } else {
                            $("#cidade_endereco").prop("disabled", true);
                        }
                        if (resposta.estado === null) {
                            $("#estado_endereco").prop("disabled", false);
                        } else {
                            $("#estado_endereco").prop("disabled", true);
                        }

                    }
                },
            },
            endereco: {
                required: true,
            },
            bairro_endereco: {
                required: true,
            },
            cidade_endereco: {
                required: true,
            },
            estado_endereco: {
                required: true,
            },
            numero: {
                required: true,
            },
        },
        messages: {
            tipo_de_profissional: {
                required: "Selecione uma opção",
            },
            cpf: {
                required: "Insira o CPF",
                cpf: "CPF Inválido",
                remote: "CPF já está cadastrado",
            },
            cnpj: {
                required: "Insira o CNPJ",
                cnpj: "CNPJ Inválido",
                remote: "CNPJ já está cadastrado",
            },
            registro_oab: {
                required: "Insira sua OAB"
            },
            registro_oab_responsavel: {
                required: "OAB do responsável"
            },
            uf_registro_oab: {
                required: "Selecione o Estado"
            },
            area_de_atuacao_principal: {
                required: "Selecione uma área"
            },
            nome: {
                required: "Insira o Nome",
                minlength: "Mínimo de 2 Letras",
            },
            sobrenome: {
                required: "Insira o Sobrenome",
                minlength: "Mínimo de 2 Letras",
            },
            sexo: {
                required: "Selecione o sexo",
            },
            email: {
                required: "Insira o Email",
                email: "Insira um Email Válido",
                remote: "Este email já está em uso",
            },
            senha: {
                required: "Insira uma Senha",
                minlength: "Mínimo de 5 caracteres",
            },
            confirme_a_senha: {
                required: "Confirme a Senha",
                minlength: "Mínimo de 5 caracteres",
                equalTo: "Senha diferente",
            },
            telefone_fixo: {
                telefone: "Telefone Inválido",
            },
            telefone_celular: {
                celular: "Telefone Inválido",
            },
            cep: {
                required: "Insira seu CEP",
                cep: "Insira um CEP válido"
            },
            endereco: {
                required: "Insira seu Endereço",
            },
            bairro_endereco: {
                required: "Insira seu Bairro",
            },
            cidade_endereco: {
                required: "Insira sua Cidade",
            },
            estado_endereco: {
                required: "Insira a sigla do Estado",
            },
            numero: {
                required: "Insira o nº",
            },
            nome_do_escritorio: {
                required: "Insira o nome",
            },
            nome_do_responsavel: {
                required: "Insira o nome",
            },
        },
    });
    /* FIM CONFIGURAÇÃO DA VALIDAÇÃO DO FORMULÁRIO */


    /* INÍCIO TRIGGER DE VALIDAÇÃO DO FORMULÁRIO */
    $(document).on("click", '#cadastrar_profissional', function(event) {
        event.preventDefault();
        //REPETE DUAS VEZES PARA VALIDAR OS REMOTES
        if (form.valid() && form.valid()) {
            $.ajax({
                url: config.endereco_funcao_php,
                method: "POST",
                data: {
                    funcao: 'CadastraProfissional',
                    tipo_de_profissional: $('#tipo_de_profissional').val(),
                    cpf: $('#cpf').val(),
                    cnpj: $('#cnpj').val(),
                    registro_oab: $('#registro_oab').val(),
                    registro_oab_responsavel: $('#registro_oab_responsavel').val(),
                    uf_registro_oab: $('#uf_registro_oab').val(),
                    area_de_atuacao_principal: $('#area_de_atuacao_principal').val(),
                    area_de_atuacao_outras: JSON.stringify($('#area_de_atuacao_outras').val()),
                    nome_do_escritorio: $('#nome_do_escritorio').val(),
                    nome_do_responsavel: $('#nome_do_responsavel').val(),
                    nome: $('#nome').val(),
                    sobrenome: $('#sobrenome').val(),
                    email: $('#email').val(),
                    senha: $('#senha').val(),
                    sexo: $('#sexo').val(),
                    telefone_fixo: $('#telefone_fixo').val(),
                    telefone_celular: $('#telefone_celular').val(),
                    cep: $('#cep').val(),
                    endereco: $('#endereco').val(),
                    numero: $('#numero').val(),
                    bairro_endereco: $('#bairro_endereco').val(),
                    complemento: $('#complemento').val(),
                    cidade_endereco: $('#cidade_endereco').val(),
                    estado_endereco: $('#estado_endereco').val(),
                },
                type: 'post',
                success: function(data) {
                    resetaCampos();
                    Swal.fire({
                        title: "Enviando seu Cadastro",
                        icon: "info",
                        html: "Parabéns, falta pouco para seu cadastro se tornar ativo!",
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        timer: 5000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading()
                        }
                    }).then(function() {
                        Swal.fire({
                            icon: "success",
                            title: 'Verifique seu Email',
                            html: 'Foi enviado um email para que possamos confirmar seu cadastro (verifique o SPAM).',
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                        })
                    });
                }
            });

        }
    })
    
    $("#cep").focusout(function() {
        if (/^[0-9]{5}-[0-9]{3}$/.test($("#cep").val()) !== false) {
            $("#formulario_de_profissionais").validate().element("#cep");
        }
    });
    /* FIM TRIGGER DE VALIDAÇÃO DO FORMULÁRIO */
    
    
    /* INÍCIO FUNÇÃO PARA EXIBIÇÃO DOS CAMPOS */
    $(function() {
        $('#div_cnpj').hide();
        $('#div_nome_do_escritorio').hide();
        $('#div_nome_do_responsavel').hide();
        $('#div_registro_oab_responsavel').hide();
    
        $('#tipo_de_profissional').change(function() {
            if ($('#tipo_de_profissional').val() == 'escritorio') {
                $('#div_cpf').hide();
                $('#div_registro_oab').hide();
                $('#div_nome_sobrenome').hide();
                $('#select_sexo').hide();
    
                $('#div_cnpj').show();
                $('#div_nome_do_escritorio').show();
                $('#div_nome_do_responsavel').show();
                $('#div_registro_oab_responsavel').show();
            } else {
                $('#div_cnpj').hide();
                $('#div_nome_do_escritorio').hide();
                $('#div_nome_do_responsavel').hide();
                $('#div_registro_oab_responsavel').hide();
    
                $('#div_cpf').show();
                $('#div_registro_oab').show();
                $('#div_nome_sobrenome').show();
                $('#select_sexo').show();
            }
        });
    });
    /* FIM FUNÇÃO PARA EXIBIÇÃO DOS CAMPOS */
    
    
    /* INÍCIO FUNÇÃO REMOVER ERRO AO ACESSAR O CAMPO */
    $(".form-control").focusin(function() {
        $(this).closest(".form-control").removeClass("has-error is-invalid");
        $("#" + $(this).attr('name') + "-error").remove();
    });
    /* FIM FUNÇÃO REMOVER ERRO AO ACESSAR O CAMPO */
    
    
    /* INICIO FUNÇÕES PARA CARREGAR DADOS */
    function carrega_tipo_de_profissional() {
        
        let dados = config.profissionais.tipos.map((tipo) => {
            return {
                text: tipo.charAt(0).toUpperCase() + tipo.slice(1),
                value: tipo,
            };
        });
        
        // Inserindo a entrada com texto vazio e placeholder true
        dados.unshift({
            text: "",
            placeholder: true
        });

        tipo_de_profissional.setData(dados);

    };

    function carrega_atuacao() {
        fetch('/configuracao/json/profissionais-atuacao.json')
            .then(response => response.json())
            .then(dados => {
                if (dados) {

                    let areas_de_atuacao = dados.map((id, nome) => {
                        return {
                            text: nome,
                            value: id,
                        };
                    });
                    
                    // Inserindo a entrada com texto vazio e placeholder true
                    areas_de_atuacao.unshift({
                        text: "",
                        placeholder: true
                    });

                    area_de_atuacao_principal.setData(areas_de_atuacao);

                    $('#area_de_atuacao_principal').change(function() {
                        if ($('#area_de_atuacao_principal').val() != '') {
                            var id_area_de_atuacao_principal = $("#area_de_atuacao_principal").children("option").filter(":selected").val();
            
                            var outras_areas = areas_de_atuacao.filter(function(item) {
                                return item.value != id_area_de_atuacao_principal
                            });
            
                            area_de_atuacao_outras.setData(outras_areas);
                            area_de_atuacao_outras.enable();
                        } else {
                            area_de_atuacao_outras.disable();
                        }
                    });

                }
            })
            .catch(error => console.error('Erro ao carregar atuçoes:', error));
    };


    /*
    function carrega_tipo_de_profissional() {
        $.getJSON(pasta_funcoes + "profissionais/pagina_cadastro_de_profissional/?funcao=CarregaTipoDeProfissional", function(dados) {
            tipo_de_profissional.setData(dados);
        })
    };
    
    function carrega_atuacao() {
        $.getJSON(pasta_funcoes + "profissionais/pagina_cadastro_de_profissional/?funcao=CarregaAreaDeAtuacao", function(dados) {
            areas_de_atuacao = dados;
            area_de_atuacao_principal.setData(areas_de_atuacao);
        })

        $('#area_de_atuacao_principal').change(function() {
            if ($('#area_de_atuacao_principal').val() != '') {
                var id_area_de_atuacao_principal = $("#area_de_atuacao_principal").children("option").filter(":selected").val();

                var outras_areas = areas_de_atuacao.filter(function(item) {
                    return item.value != id_area_de_atuacao_principal
                });

                area_de_atuacao_outras.setData(outras_areas);
                area_de_atuacao_outras.enable();
            } else {
                area_de_atuacao_outras.disable();
            }
        });
        
    }
    */
    /* FIM FUNÇÕES PARA CARREGAR DADOS */
    
    
    /* INÍCIO CARREGA CAMPOS DE SELECT QUE BUSCAM DADOS DO DB - APÓS O CARREGAMENTO DA PÁGINA */
    window.addEventListener("load", function(event) {
        carrega_tipo_de_profissional();
        carrega_atuacao();
        area_de_atuacao_outras.disable();
    });
    /* FIM CARREGA CAMPOS DE SELECT QUE BUSCAM DADOS DO DB - APÓS O CARREGAMENTO DA PÁGINA */

    function resetaCampos() {
        
        $("#formulario_de_profissionais")[0].reset();
        $("#select_tipo_profissional").removeClass("borda_erro");
        $("#select_sexo").removeClass("borda_erro");

        $('#select_tipo_de_profissional > div:eq(0) > div:eq(0)').removeClass("borda_erro");
        $('#select_uf_registro_oab > div:eq(0) > div:eq(0)').removeClass("borda_erro");
        $('#select_area_de_atuacao_principal > div:eq(0) > div:eq(0)').removeClass("borda_erro");
        $('#select_sexo > div:eq(0) > div:eq(0)').removeClass("borda_erro");
        
        area_de_atuacao_outras.disable();
        carrega_tipo_de_profissional();
        carrega_atuacao();
    }

}

/* INÍCIO MÁSCARAS */

/* CAMPO DE TELEFONE CELULAR */
jQuery(function($) {
    $.mask.definitions['~'] = '[+-]';
    $("#telefone_celular").focusout(function() {
        var phone, element;
        element = $(this);
        element.unmask();
        phone = element.val().replace(/\D/g, '');
        element.mask("(99) 99999-9999");
    }).trigger('focusout');
});

/* CAMPO DE TELEFONE FIXO */
jQuery(function($) {
    $.mask.definitions['~'] = '[+-]';
    $("#telefone_fixo").focusout(function() {
        var phone, element;
        element = $(this);
        element.unmask();
        phone = element.val().replace(/\D/g, '');
        element.mask("(99) 9999-9999");
    }).trigger('focusout');
});

/* CAMPO DE CEP CPF E CNPJ */
jQuery(function($) {
    $('#cep').mask("99999-999");
    $('#cpf').mask("000.000.000-00");
    $('#cnpj').mask("00.000.000/0000-00");
});

/* FUNÇÃO PARA CAMPO CEP */
document.querySelector("input#cep").addEventListener("input", function() {
    const allowedCharacters = "0123456789";
    this.value = this.value.split('').filter(char => allowedCharacters.includes(char)).join('')
});

/* FUNÇÃO PARA CAMPO Nº */
document.querySelector("input#numero").addEventListener("input", function() {
    const allowedCharacters = "0123456789";
    this.value = this.value.split('').filter(char => allowedCharacters.includes(char)).join('')
});

/* FUNÇÃO PARA CAMPO REGISTRO OAB */
document.querySelector("input#registro_oab").addEventListener("input", function() {
    const allowedCharacters = "0123456789";
    this.value = this.value.split('').filter(char => allowedCharacters.includes(char)).join('')
});

/* FUNÇÃO PARA CAMPO NOME */
document.querySelector("input#nome").addEventListener("input", function() {
    const allowedCharacters = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBNzáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ";
    this.value = this.value.split('').filter(char => allowedCharacters.includes(char)).join('')
});

/* FUNÇÃO PARA CAMPO SOBRENOME */
document.querySelector("input#sobrenome").addEventListener("input", function() {
    const allowedCharacters = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBNzáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ";
    this.value = this.value.split('').filter(char => allowedCharacters.includes(char)).join('')
});

/* FUNÇÃO PARA CAMPO NOME DO ESCRITÓRIO */
document.querySelector("input#nome_do_escritorio").addEventListener("input", function() {
    const allowedCharacters = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBNzáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ";
    this.value = this.value.split('').filter(char => allowedCharacters.includes(char)).join('')
});

/* FUNÇÃO PARA CAMPO NOME DO RESPONSÁVEL */
document.querySelector("input#nome_do_responsavel").addEventListener("input", function() {
    const allowedCharacters = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBNzáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ";
    this.value = this.value.split('').filter(char => allowedCharacters.includes(char)).join('')
});

/* FUNÇÃO PARA CAMPO EMAIL */
document.querySelector("input#email").addEventListener("input", function() {
    const allowedCharacters = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789@._-";
    this.value = this.value.split('').filter(char => allowedCharacters.includes(char)).join('')
});

/* FIM MÁSCARAS */


/* INÍCIO FUNÇÕES AUXILIARES */

function validacao_de_cnpj(value, element) {

    var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
    if (value.length == 0) {
        check = false;
    }
    value = value.replace(/\D+/g, '');
    digitos_iguais = 1;

    for (i = 0; i < value.length - 1; i++)
        if (value.charAt(i) != value.charAt(i + 1)) {
            digitos_iguais = 0;
            break;
        }
    
    if (digitos_iguais)
        check = false;

    tamanho = value.length - 2;
    numeros = value.substring(0, tamanho);
    digitos = value.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) {
        check = false;
    }
    tamanho = tamanho + 1;
    numeros = value.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

    return (resultado == digitos.charAt(1));
    return this.optional(element) || check;
}

function validacao_de_cpf(value, element) {
    value = jQuery.trim(value);
    value = value.replace('.', '');
    value = value.replace('.', '');
    cpf = value.replace('-', '');
    while (cpf.length < 11) cpf = "0" + cpf;
    var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
    var a = [];
    var b = new Number;
    var c = 11;
    for (i = 0; i < 11; i++) {
        a[i] = cpf.charAt(i);
        if (i < 9) b += (a[i] * --c);
    }
    if ((x = b % 11) < 2) {
        a[9] = 0
    } else {
        a[9] = 11 - x
    }
    b = 0;
    c = 11;
    for (y = 0; y < 10; y++) b += (a[y] * c--);
    if ((x = b % 11) < 2) {
        a[10] = 0;
    } else {
        a[10] = 11 - x;
    }

    var retorno = true;
    if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) retorno = false;

    return this.optional(element) || retorno;

}

function validacao_de_telefone_celular(value, element) {
    value = value.replace(/\D/g, '');

    //Verifica se possui 11 digitos
    if (value.length != 11) {
        return (this.optional(element) || false);
    }

    //Verifica se começa com 9
    if (value.substring(2, 3) != 9) {
        return (this.optional(element) || false);
    }

    //Verifica se DDD é válido
    if ([11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 64, 63, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99].indexOf(parseInt(value.substring(2, 0))) == -1) {
        return (this.optional(element) || false);
    }

    return (this.optional(element) || true);
}

function validacao_de_telefone_fixo(value, element) {
    value = value.replace(/\D/g, '');

    //Verifica se possui 10 digitos
    if (value.length != 10) {
        return (this.optional(element) || false);
    }

    //Verifica se começa com 2,3,4,5
    if ([2, 3, 4, 5].indexOf(parseInt(value.substring(2, 3))) == -1) {
        return (this.optional(element) || false);
    }

    //Verifica se DDD é válido
    if ([11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 64, 63, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99].indexOf(parseInt(value.substring(2, 0))) == -1) {
        return (this.optional(element) || false);
    }

    return (this.optional(element) || true);
}

function validacao_de_cep(value, element) {

    if (value === '00000-000') {
        return (this.optional(element) || false);
    }
    return this.optional(element) || /^[0-9]{5}-[0-9]{3}$/.test(value);
}
/* FIM FUNÇÕES AUXILIARES */
