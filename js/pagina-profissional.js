/* FUNÇÃO PARA VALIDAR E ENVIAR FORMULÁRIO DE CONTATO PARA PROFISSIONAL */
const formContatoProfissional = document.querySelector("#formulario_de_contato_profissional");

const inputNomeContatoProfissional = formContatoProfissional.querySelector("#nome_usuario");
const inputTelefoneContatoProfissional = formContatoProfissional.querySelector("#telefone_usuario");
const inputMensagemContatoProfissional = formContatoProfissional.querySelector("#mensagem_usuario");
const inputVerificaContatoProfissional = formContatoProfissional.querySelector("#anti_spam_contato_profissional");

const botaoEnviarContatoProfissional = document.querySelector("#enviar_contato_profissional");
const divNotificacaoContatoProfissional = document.querySelector("#div_notificacao_contato_profissional");
const divBarraContatoProfissional = document.querySelector("#div_notificacao_contato_profissional");
const divGeral = document.querySelector("#geral");
const divLegenda = document.querySelector("#legenda_formulario_contato_profissional");

function validarFormularioContatoProfissional(config) {
    botaoEnviarContatoProfissional.addEventListener("click", function (event) {
      event.preventDefault();
      
      if (inputNomeContatoProfissional.value === "") {
        //CAMPO DO NOME VAZIO
        exibirNotificacao("erro", "Erro, preencha seu nome", inputNomeContatoProfissional, divNotificacaoContatoProfissional);
      } else if (inputTelefoneContatoProfissional.value === "") {
        //CAMPO DO TELEFONE VAZIO
        exibirNotificacao("erro", "Erro , preencha seu telefone", inputTelefoneContatoProfissional, divNotificacaoContatoProfissional);
      } else if (inputMensagemContatoProfissional.value === "") {
        //CAMPO DE MENSAGEM VAZIA
        exibirNotificacao("erro", "Erro, preencha sua mensagem", inputMensagemContatoProfissional, divNotificacaoContatoProfissional);
      } else if (inputVerificaContatoProfissional.value === "") {
        //VERIFICAÇÃO ANTI SPAM VAZIO
        exibirNotificacao("erro", "Erro, preencha a verificação anti spam", inputVerificaContatoProfissional, divNotificacaoContatoProfissional);
      } else if (inputVerificaContatoProfissional.value !== "4") {
        //VERIFICAÇÃO ANTI SPAM VAZIO
        exibirNotificacao("erro", "Erro, verificação anti spam inválida", inputVerificaContatoProfissional, divNotificacaoContatoProfissional);
      } else {
        //TODOS OS CAMPOS PREENCHIDOS
        divBarraContatoProfissional.innerHTML =
          '<div style="height: 1.5rem;" class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>';
    
        divBarraContatoProfissional.classList.remove("d-none");
        divBarraContatoProfissional.classList.add("d-block", "fade", "show");
        
        criaBarraProgresso(1350);
    
        const campos = {
            "nome": inputNomeContatoProfissional.value,
            "telefone": inputTelefoneContatoProfissional.value,
            "mensagem": inputMensagemContatoProfissional.value,
            "verifica_contato": inputVerificaContatoProfissional.value
        };

        setTimeout(function () {
          enviaContato(
            config.endereco_funcao_php,
            'adicionarContatoProfissional',
            config.id,
            divGeral.dataset.id,
            campos,
            divNotificacaoContatoProfissional,
            divBarraContatoProfissional,
            formContatoProfissional
          );
        }, 600);
      }
    });
    
    inputNomeContatoProfissional.addEventListener("input", function () {
      ocultaNotificacao(verificaTipoAlerta(divNotificacaoContatoProfissional), inputNomeContatoProfissional, divNotificacaoContatoProfissional);
    });
    
    inputTelefoneContatoProfissional.addEventListener("input", function () {
      ocultaNotificacao(verificaTipoAlerta(divNotificacaoContatoProfissional), inputTelefoneContatoProfissional, divNotificacaoContatoProfissional);
    });
    
    inputMensagemContatoProfissional.addEventListener("input", function () {
      ocultaNotificacao(verificaTipoAlerta(divNotificacaoContatoProfissional), inputMensagemContatoProfissional, divNotificacaoContatoProfissional);
    });
  
    inputVerificaContatoProfissional.addEventListener("input", function () {
      ocultaNotificacao(verificaTipoAlerta(divNotificacaoContatoProfissional), inputVerificaContatoProfissional, divNotificacaoContatoProfissional);
    });
  
  }

/* FUNÇÃO PARA VALIDAR E ENVIAR FORMULÁRIO DE CONTATO */

/* FUNÇÃO DO CAMPO DE TELEFONE FIXO E CELULAR */
window.addEventListener("DOMContentLoaded", function () {
  var telefoneInput = document.getElementById("telefone_usuario");
  var placeholder = telefoneInput.placeholder;
  telefoneInput.addEventListener("focus", function () {
    if (this.value === "") {
      this.placeholder = "(__) ____-_____";
    }
  });
  telefoneInput.addEventListener("focusout", function () {
    if (this.value === "") {
      this.placeholder = placeholder;
    }
  });
  telefoneInput.addEventListener("input", function () {
    var phone = this.value.replace(/\D/g, "");
    var formattedPhone = "";

    if (phone.length > 0) {
      formattedPhone = "(" + phone.substring(0, 2);
    }

    if (phone.length > 2) {
      formattedPhone += ") " + phone.substring(2, 7);
    }

    if (phone.length > 7) {
      formattedPhone += "-" + phone.substring(7, 11);
    }

    this.value = formattedPhone;
  });
  telefoneInput.addEventListener("blur", function () {
    var phone = this.value.replace(/\D/g, "");

    if (phone.length === 10) {
      this.value =
        "(" +
        phone.substring(0, 2) +
        ") " +
        phone.substring(2, 6) +
        "-" +
        phone.substring(6, 10);
    } else if (phone.length !== 11) {
      this.value = "";
    }
  });
});
/* FUNÇÃO DO CAMPO DE TELEFONE FIXO E CELULAR */