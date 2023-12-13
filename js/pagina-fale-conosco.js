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
      exibirNotificacaoContato("erro", "Erro, preencha seu nome", inputNomeContato);
    } else if (inputTipoPessoaContato.value === "") {
      //CAMPO DO TIPO DE PESSOA VAZIO
      exibirNotificacaoContato("erro", "Erro, escolha uma opção", inputTipoPessoaContato);
    } else if (inputTelefoneContato.value === "") {
      //CAMPO DO TELEFONE VAZIO
      exibirNotificacaoContato("erro", "Erro , preencha seu telefone", inputTelefoneContato);
    } else if (inputEmailContato.value === "") {
      //CAMPO DO EMAIL VAZIO
      exibirNotificacaoContato("erro", "Erro, preencha seu email", inputEmailContato);
    } else if (validarEmail(inputEmailContato.value) !== true) {
      //EMAIL INVÁLIDO
      exibirNotificacaoContato("erro", "Erro, preencha com um email válido", inputEmailContato);
    } else if (inputMensagemContato.value === "") {
      //CAMPO DE MENSAGEM VAZIA
      exibirNotificacaoContato("erro", "Erro, preencha sua mensagem", inputMensagemContato);
    } else if (inputVerificaContato.value === "") {
      //VERIFICAÇÃO ANTI SPAM VAZIO
      exibirNotificacaoContato("erro", "Erro, preencha a verificação anti spam", inputVerificaContato);
    } else {
      //TODOS OS CAMPOS PREENCHIDOS
      divBarraContato.innerHTML =
        '<div style="height: 1.5rem;" class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>';
  
      divBarraContato.classList.remove("d-none");
      divBarraContato.classList.add("d-block", "fade", "show");
      criaBarraProgresso(1350);
  
      setTimeout(function () {
        enviaContato(
          config.id,
          inputNomeContato.value,
          inputTipoPessoaContato.value,
          inputTelefoneContato.value,
          inputEmailContato.value,
          inputMensagemContato.value,
          inputVerificaContato.value
        );
      }, 600);
    }
  });
  
  inputNomeContato.addEventListener("focus", function () {
    ocultaNotificacaoContato(verificaTipoAlerta(), inputNomeContato);
  });
  
  inputTipoPessoaContato.addEventListener("focus", function () {
    ocultaNotificacaoContato(verificaTipoAlerta(), inputTipoPessoaContato);
  });
  
  inputTelefoneContato.addEventListener("focus", function () {
    ocultaNotificacaoContato(verificaTipoAlerta(), inputTelefoneContato);
  });
  
  inputEmailContato.addEventListener("focus", function () {
    ocultaNotificacaoContato(verificaTipoAlerta(), inputEmailContato);
  });
  
  inputMensagemContato.addEventListener("focus", function () {
    ocultaNotificacaoContato(verificaTipoAlerta(), inputMensagemContato);
  });

  inputVerificaContato.addEventListener("focus", function () {
    ocultaNotificacaoContato(verificaTipoAlerta(), inputVerificaContato);
  });

}

function enviaContato(id_site, nome, tipo_pessoa, telefone, email, mensagem, verifica_contato) {
  const data = new URLSearchParams();
  data.append("funcao", "enviaContatoFaleConosco");
  data.append("parametro1_da_funcao", id_site);
  data.append("nome", nome);
  data.append("tipo_pessoa", tipo_pessoa);
  data.append("telefone", telefone);
  data.append("email", email);
  data.append("mensagem", mensagem);
  data.append("verifica_contato", verifica_contato);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data.toString(),
  };

  fetch(config.endereco_funcao_php, options)
    .then((response) => {
      if (!response.ok) {
        console.error("Erro na solicitação: " + response.status);
        return;
      }
      return response.json();
    })
    .then((data) => {
      ocultaBarraContato();
      if (data.status == 1) {
        exibirNotificacaoContato(
          "sucesso",
          "Parabéns, contato enviado com sucesso, em breve será respondido."
        );
      } else {
        exibirNotificacaoContato("erro", data.mensagem, "");
      }
    })
    .catch((error) => {
      console.error("Ocorreu um erro durante a solicitação:", error);
    });
}

function exibirNotificacaoContato(tipo, mensagem, campo) {
  var classeMensagem = "";

  if (tipo == "erro") {
    classeMensagem = "danger";
    iconeMensagem = "#exclamation-triangle-fill";
    campo.classList.add("is-invalid");
  } else if (tipo == "sucesso") {
    classeMensagem = "success";
    iconeMensagem = "#check-circle-fill";
  }

  divNotificacaoContato.innerHTML =
    '<div class="alert alert-' +
    classeMensagem +
    ' alert-dismissible d-flex align-items-center" style="margin-bottom:0px;" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="' +
    tipo +
    ':"><use xlink:href="/assets/svg/icones.svg' +
    iconeMensagem +
    '"></use></svg><div>' +
    mensagem +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div></div>';

  divNotificacaoContato.classList.add("d-block", "fade", "show");
  divNotificacaoContato.classList.remove("d-none");
  verificaFechamentoNotificacao("contato", campo);
}

function ocultaNotificacaoContato(tipo, campo) {
  if (tipo == "erro") {
      campo.classList.remove("is-invalid");
      divNotificacaoContato.classList.remove("show");
      divNotificacaoContato.classList.add("fade", "d-none");
      divNotificacaoContato.innerHTML = "";
  } else if (tipo == "sucesso") {
      divNotificacaoContato.classList.remove("show");
      divNotificacaoContato.classList.add("fade", "d-none");
      divNotificacaoContato.innerHTML = "";
  }
}

function ocultaBarraContato() {
  divBarraContato.innerHTML = "";
  formContato.reset();
  inputNomeContato.focus();
  inputEmailContato.focus();
  inputEmailContato.blur();
  divBarraContato.classList.remove("show");
  divBarraContato.classList.add("fade", "d-none");
}

function verificaTipoAlerta() {
    if (divNotificacaoContato) {
        var tipoAlerta = divNotificacaoContato.querySelector('.alert');
        if (tipoAlerta) {
            if (tipoAlerta.classList.contains('alert-danger')) {
                return 'erro';
            } else if (tipoAlerta.classList.contains('alert-success')) {
                return 'sucesso';
            } 
        }
    }
    return 'nenhum';
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