$(document).ready(function () {
  $(document).on("click", "#enviar_contato", function () {
    $("#notificacao").slideUp();
    $.ajax({
      url: pasta_funcoes + "pagina_fale_conosco/",
      method: "POST",
      data: {
        nome: $("#nome").val(),
        tipo_pessoa: $("#tipo_pessoa").val(),
        email_contato: $("#email_contato").val(),
        telefone: $("#telefone").val(),
        mensagem: $("#mensagem").val(),
        verifica_contato: $("#verifica_contato").val(),
      },
      type: "POST",
      success: function (data) {
        var obj = JSON.parse(data);
        if (obj.status === "1") {
          $("#notificacao").html(obj.mensagem);
          $("#notificacao").slideDown();
          $("#formulario_de_contato")[0].reset();
        } else {
          $("#notificacao").html(obj.mensagem);
          $("#notificacao").slideDown();
        }
      },
    });
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
