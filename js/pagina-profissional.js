/* FUNÇÃO PARA VALIDAR E ENVIAR FORMULÁRIO DE CONTATO PARA PROFISSIONAL */
let turnstileWidgetId = null;
let turnstileToken = "";
let turnstileResolve = null;

function onTurnstileSuccess(token) {
  turnstileToken = token;
  if (typeof turnstileResolve === "function") {
    turnstileResolve(token);
    turnstileResolve = null;
  }
}

function iniciarTurnstileCasoNecessario(siteKey) {
    try {
        const container = document.getElementById('cf-turnstile-container');
        if (typeof turnstile !== "undefined" && container) {
            if (turnstileWidgetId === null) {
                turnstileWidgetId = turnstile.render(container, {
                    sitekey: siteKey,
                    callback: onTurnstileSuccess,
                    execution: 'execute'
                });
            }
        } else {
            window.addEventListener('load', function() {
                try { iniciarTurnstileCasoNecessario(siteKey); } catch(e){ }
            });
        }
    } catch (e) {
        console.error("Erro initTurnstileIfNeeded:", e);
    }
}

window.addEventListener('DOMContentLoaded', function() {
    iniciarTurnstileCasoNecessario('0x4AAAAAACFv8G1Co2N1oY9l');
});

function getTurnstileToken(timeoutMs = 8000) {
  return new Promise(function (resolve, reject) {
    if (turnstileToken) {
      const t = turnstileToken;
      turnstileToken = "";
      try { turnstile.reset(turnstileWidgetId); } catch(e){}
      resolve(t);
      return;
    }

    if (typeof turnstile === "undefined" || turnstileWidgetId === null) {
      reject(new Error("Turnstile não inicializado"));
      return;
    }

    turnstileResolve = function (token) {
      turnstileResolve = null;
      turnstileToken = "";
      try { turnstile.reset(turnstileWidgetId); } catch(e){}
      resolve(token || "");
    };

    try {
      turnstile.execute(turnstileWidgetId);
    } catch (e) {
      turnstileResolve = null;
      reject(e);
      return;
    }

    setTimeout(function () {
      if (turnstileResolve) {
        turnstileResolve = null;
        try { turnstile.reset(turnstileWidgetId); } catch(e){}
        reject(new Error("Timeout ao obter token Turnstile"));
      }
    }, timeoutMs);
  });
}

const formContatoProfissional = document.querySelector("#formulario_de_contato_profissional");

const inputNomeContatoProfissional = formContatoProfissional.querySelector("#nome_usuario");
const inputTelefoneContatoProfissional = formContatoProfissional.querySelector("#telefone_usuario");
const inputMensagemContatoProfissional = formContatoProfissional.querySelector("#mensagem_usuario");

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
        exibirNotificacao("erro", "Erro, preencha seu telefone", inputTelefoneContatoProfissional, divNotificacaoContatoProfissional);
      } else if (inputMensagemContatoProfissional.value === "") {
        //CAMPO DE MENSAGEM VAZIA
        exibirNotificacao("erro", "Erro, preencha sua mensagem", inputMensagemContatoProfissional, divNotificacaoContatoProfissional);
      } else {
        // TODOS OS CAMPOS PREENCHIDOS
        divBarraContatoProfissional.innerHTML =
          '<div style="height: 1.5rem;" class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>';

        divBarraContatoProfissional.classList.remove("d-none");
        divBarraContatoProfissional.classList.add("d-block", "fade", "show");
        divLegenda.remove();
        criaBarraProgresso(1350);

        getTurnstileToken().then(function(token) {
            const campos = {
                "nome": inputNomeContatoProfissional.value,
                "telefone": inputTelefoneContatoProfissional.value,
                "mensagem": inputMensagemContatoProfissional.value,
                "cf_turnstile_response": token
            };

            setTimeout(function () {
                enviaDados(
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
        }).catch(function(e) {
            exibirNotificacao(
                "erro",
                "Falha na verificação de segurança. Tente novamente.",
                inputMensagemContatoProfissional,
                divNotificacaoContatoProfissional
            );
        });
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
  
  }
/* FUNÇÃO PARA VALIDAR E ENVIAR FORMULÁRIO DE CONTATO PARA PROFISSIONAL */

document.querySelector("input#nome_usuario").addEventListener("input", function() {
  const allowedCharacters = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBNzáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ";
  this.value = this.value.split('').filter(char => allowedCharacters.includes(char)).join('')
});

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