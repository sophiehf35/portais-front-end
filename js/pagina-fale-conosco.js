document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', function (event) {
      if (event.target.id === 'enviar_contato') {
          document.getElementById('notificacao').style.display = 'none';

          fetch(pasta_funcoes + 'pagina_fale_conosco/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                  nome: document.getElementById('nome').value,
                  tipo_pessoa: document.getElementById('tipo_pessoa').value,
                  email_contato: document.getElementById('email_contato').value,
                  telefone: document.getElementById('telefone').value,
                  mensagem: document.getElementById('mensagem').value,
                  verifica_contato: document.getElementById('verifica_contato').value,
              }),
          })
              .then(response => response.json())
              .then(obj => {
                  if (obj.status === '1') {
                      document.getElementById('notificacao').innerHTML = obj.mensagem;
                      document.getElementById('notificacao').style.display = 'block';
                      document.getElementById('formulario_de_contato').reset();
                  } else {
                      document.getElementById('notificacao').innerHTML = obj.mensagem;
                      document.getElementById('notificacao').style.display = 'block';
                  }
              })
              .catch(error => console.error('Erro na requisição:', error));
      }
  });
});

/* CAMPO DE TELEFONE FIXO E CELULAR */
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
/* CAMPO DE TELEFONE FIXO E CELULAR */