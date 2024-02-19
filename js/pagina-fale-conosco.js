/* FUNÇÃO PARA VALIDAR E ENVIAR FORMULÁRIO DE CONTATO */
const formContato = document.querySelector("#formulario_de_contato");

const inputNomeContato = formContato.querySelector("#nome");
const inputTipoPessoaContato = formContato.querySelector("#tipo_pessoa");
const inputTelefoneContato = formContato.querySelector("#telefone");
const inputEmailContato = formContato.querySelector("#email_contato");
const inputMensagemContato = formContato.querySelector("#mensagem");
const inputVerificaContato = formContato.querySelector("#verifica_contato");

const botaoEnviarContato = document.querySelector("#enviar_contato");
const divNotificacaoContato = document.querySelector("#div_notificacao_contato");
const divBarraContato = document.querySelector("#div_barra_contato");

function validarFormularioContato(config) {
  botaoEnviarContato.addEventListener("click", function (event) {
    event.preventDefault();
    
    if (inputNomeContato.value === "") {
      //CAMPO DO NOME VAZIO
      exibirNotificacao("erro", "Erro, preencha seu nome", inputNomeContato, divNotificacaoContato);
    } else if (inputTipoPessoaContato.value === "") {
      //CAMPO DO TIPO DE PESSOA VAZIO
      exibirNotificacao("erro", "Erro, escolha uma opção", inputTipoPessoaContato, divNotificacaoContato);
    } else if (inputTelefoneContato.value === "") {
      //CAMPO DO TELEFONE VAZIO
      exibirNotificacao("erro", "Erro , preencha seu telefone", inputTelefoneContato, divNotificacaoContato);
    } else if (inputEmailContato.value === "") {
      //CAMPO DO EMAIL VAZIO
      exibirNotificacao("erro", "Erro, preencha seu email", inputEmailContato, divNotificacaoContato);
    } else if (validarEmail(inputEmailContato.value) !== true) {
      //EMAIL INVÁLIDO
      exibirNotificacao("erro", "Erro, preencha com um email válido", inputEmailContato, divNotificacaoContato);
    } else if (inputMensagemContato.value === "") {
      //CAMPO DE MENSAGEM VAZIA
      exibirNotificacao("erro", "Erro, preencha sua mensagem", inputMensagemContato, divNotificacaoContato);
    } else if (inputVerificaContato.value === "") {
      //VERIFICAÇÃO ANTI SPAM VAZIO
      exibirNotificacao("erro", "Erro, preencha a verificação anti spam", inputVerificaContato, divNotificacaoContato);
    } else if (inputVerificaContato.value !== "4") {
      //VERIFICAÇÃO ANTI SPAM VAZIO
      exibirNotificacao("erro", "Erro, verificação anti spam inválida", inputVerificaContato, divNotificacaoContato);
    } else {
      //TODOS OS CAMPOS PREENCHIDOS
      divBarraContato.innerHTML =
        '<div style="height: 1.5rem;" class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>';
  
      divBarraContato.classList.remove("d-none");
      divBarraContato.classList.add("d-block", "fade", "show");
      criaBarraProgresso(1350);
  
      const campos = {
        "nome": inputNomeContato.value,
        "tipo": inputTipoPessoaContato.value,
        "telefone": inputTelefoneContato.value,
        "email": inputEmailContato.value,
        "mensagem": inputMensagemContato.value,
        "verifica_contato": inputVerificaContato.value
      };

      setTimeout(function () {
        enviaContato(
          config.endereco_funcao_php,
          'adicionarContatoFaleConosco',
          config.id,
          null,
          campos,
          divNotificacaoContato,
          divBarraContato,
          formContato
        );
      }, 600);

    }
  });
  
  inputNomeContato.addEventListener("input", function () {
    ocultaNotificacao(verificaTipoAlerta(divNotificacaoContato), inputNomeContato, divNotificacaoContato);
  });
  
  inputTipoPessoaContato.addEventListener("input", function () {
    ocultaNotificacao(verificaTipoAlerta(divNotificacaoContato), inputTipoPessoaContato, divNotificacaoContato);
  });
  
  inputTelefoneContato.addEventListener("input", function () {
    ocultaNotificacao(verificaTipoAlerta(divNotificacaoContato), inputTelefoneContato, divNotificacaoContato);
  });
  
  inputEmailContato.addEventListener("input", function () {
    ocultaNotificacao(verificaTipoAlerta(divNotificacaoContato), inputEmailContato, divNotificacaoContato);
  });
  
  inputMensagemContato.addEventListener("input", function () {
    ocultaNotificacao(verificaTipoAlerta(divNotificacaoContato), inputMensagemContato, divNotificacaoContato);
  });

  inputVerificaContato.addEventListener("input", function () {
    ocultaNotificacao(verificaTipoAlerta(divNotificacaoContato), inputVerificaContato, divNotificacaoContato);
  });

}
/* FUNÇÃO PARA VALIDAR E ENVIAR FORMULÁRIO DE CONTATO */

/* FUNÇÃO DO CAMPO DE TELEFONE FIXO E CELULAR */
window.addEventListener("DOMContentLoaded", function () {
  var telefoneInput = document.getElementById("telefone");
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