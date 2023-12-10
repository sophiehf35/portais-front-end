$(document).ready(function() {
    
	$("#BotaoRastrear").click(function(e) {
	    
		const formRastreamento = document.querySelector("#rastrear_objeto");
		
		if ($("#objeto").val() === "") {
			$("#notificacao")
				.append(
					'<div id="mensagem_erro" class="alert alert-danger">Digite o código de rastreio. <a id="duvidas" href="#">Dúvidas? Clique Aqui</a></div>'
				)
				.hide()
				.fadeIn();
			$("#objeto").css({
				border: "1px solid #f5c6cb",
				background: "#f8d7da",
			});
			$("#BotaoRastrear").attr("disabled", true);
		} else if ($("#objeto").val().length != 13) {
			$("#notificacao")
				.append(
					'<div id="mensagem_erro" class="alert alert-danger fade show" role="alert">Código inválido. <a id="duvidas" href="#">Dúvidas? Clique Aqui</a></div>'
				)
				.hide()
				.fadeIn();

			$("#objeto").css({
				border: "1px solid #f5c6cb",
				background: "#f8d7da",
			});
			$("#BotaoRastrear").attr("disabled", true);
		} else {
			if ($("#alerta").val() === "sem_alerta") {
				$("#notificacao")
					.append(
						'<div style="height: 1.5rem;" class="progress"><div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>'
					)
					.hide()
					.fadeIn();
				$(".progress-bar").animate({
						width: "100%",
					},
					700
				);
				setTimeout(() => {
				    formRastreamento.action = "https://www.avantitecnologiati.com.br/resultado-rastreamento/";
					formRastreamento.submit();
				}, 400);
				setTimeout(() => {
					$("#notificacao").hide();
				}, 1500);
			} else {
				$.magnificPopup.open({
					items: {
						src: "#popup-cadastro-de-alerta",
					},
					type: "inline",
					fixedContentPos: true,
					fixedBgPos: true,
					overflowY: "auto",
					closeBtnInside: true,
					preloader: false,
					midClick: true,
					removalDelay: 300,
					closeMarkup: '<button title="%title%" type="button" class="mfp-close"></button>',
					mainClass: "my-mfp-zoom-in",
					closeOnBgClick: false,
				});

				$(
					'<input type="hidden" name="objeto" value="' +
					$("#objeto").val() +
					'"><input type="hidden" name="alerta" value="' +
					$("#alerta").val() +
					'">'
				).insertAfter($("#notificacao_alerta"));
			}
		}
	});

	$("#objeto").on("focus", function(e) {
		$("#mensagem_erro").fadeOut("slow", function() {
			$("#mensagem_erro").remove();
		});
		$("#objeto").css({
			border: "",
			background: "",
		});
		$("#BotaoRastrear").attr("disabled", false);
	});

	window.addEventListener("pageshow", function(event) {
		var historyTraversal =
			event.persisted ||
			(typeof window.performance != "undefined" &&
				window.performance.getEntriesByType("navigation")[0].type ===
				"back_forward");
		if (historyTraversal) {
			window.location.reload();
		}
	});

	document
		.getElementById("objeto")
		.addEventListener("keypress", function(event) {
			if (event.key === "Enter") {
				document.getElementById("BotaoRastrear").click();
			}
		});

	document.querySelector("input#objeto").addEventListener("input", function() {
		const allowedCharacters =
			"0123456789azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN";
		let newValue = "";
		this.value.split("").forEach(function(char) {
			if (in_array(char, allowedCharacters.split(""))) newValue += char;
		});
		this.value = newValue;
	});

	function in_array(elem, array) {
		let isIn = false;
		for (var i = 0; i < array.length; i++) {
			if (elem == array[i]) isIn = true;
		}
		return isIn;
	}

	$(document).on("click", "#duvidas", function() {
		$.magnificPopup.open({
			items: {
				src: "#popup-duvidas-rastreamento",
			},
			type: "inline",
			fixedContentPos: true,
			fixedBgPos: true,
			overflowY: "auto",
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			closeMarkup: '<button title="%title%" type="button" class="mfp-close"></button>',
			mainClass: "my-mfp-zoom-in",
		});
	});

	function setCaretToPos(input, pos) {
		setSelectionRange(input, pos, pos);
	}

	function setSelectionRange(input, selectionStart, selectionEnd) {
		if (input.setSelectionRange) {
			input.focus();
			input.setSelectionRange(selectionStart, selectionEnd);
		} else if (input.createTextRange) {
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd("character", selectionEnd);
			range.moveStart("character", selectionStart);
			range.select();
		}
	}

	$("#celular_rastreio").on("focus click", function() {
		if ($("#celular_rastreio").val() == "(__) _____-____") {
			setCaretToPos($(this)[0], 1);
		}
	});
});

$(document).on("click", "#rastrear_com_alerta", function() {

	const formRastreamentoAlerta = document.querySelector("#rastrear_objeto_alerta");

	if ($("#nome_rastreio").val() === "") {
		$("#notificacao_alerta")
			.append(
				'<div id="mensagem_erro_alerta" style="margin-bottom:0px" class="alert alert-danger fade show" role="alert">Insira seu Nome.</div>'
			)
			.hide()
			.fadeIn();
		$("#rastrear_com_alerta").attr("disabled", true);
	} else if ($("#email_rastreio").val() === "") {
		$("#notificacao_alerta")
			.append(
				'<div id="mensagem_erro_alerta" style="margin-bottom:0px" class="alert alert-danger fade show" role="alert">Insira seu Email</div>'
			)
			.hide()
			.fadeIn();
		$("#rastrear_com_alerta").attr("disabled", true);
	} else if (valida_email($("#email_rastreio").val()) === false) {
		$("#notificacao_alerta")
			.append(
				'<div id="mensagem_erro_alerta" style="margin-bottom:0px" class="alert alert-danger fade show" role="alert">Email inválido.</div>'
			)
			.hide()
			.fadeIn();
		$("#rastrear_com_alerta").attr("disabled", true);
	} else if ($("#celular_rastreio").val() === "") {
		$("#notificacao_alerta")
			.append(
				'<div id="mensagem_erro_alerta" style="margin-bottom:0px" class="alert alert-danger fade show" role="alert">Insira seu Celular.</div>'
			)
			.hide()
			.fadeIn();
		$("#rastrear_com_alerta").attr("disabled", true);
	} else {
		$("#notificacao_alerta")
			.append(
				'<div style="height: 1.5rem;" class="progress"><div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>'
			)
			.hide()
			.fadeIn();
		$(".progress-bar").animate({
				width: "100%",
			},
			700
		);
		setTimeout(() => {
		    formRastreamentoAlerta.action = "https://www.avantitecnologiati.com.br/resultado-rastreamento/";
			formRastreamentoAlerta.submit();
		}, 400);
		setTimeout(() => {
			$("#notificacao_alerta").hide();
		}, 1500);


	}
});

const nomeRastreioInput = document.getElementById("nome_rastreio");
allowedCharacters = "azertyuiopqsdfghjklmwxcvbn ";

nomeRastreioInput.addEventListener("input", function() {
	const inputValue = this.value;
	const filteredValue = inputValue
		.split("")
		.filter((char) => allowedCharacters.includes(char))
		.join("");
	this.value = filteredValue;
});

$(".campo_cadastro_alerta").on("focus", function(e) {
	$("#mensagem_erro_alerta").fadeOut("slow", function() {
		$("#mensagem_erro_alerta").remove();
	});
	$("#rastrear_com_alerta").attr("disabled", false);
});

/* CAMPO DE TELEFONE FIXO E CELULAR */
window.addEventListener("DOMContentLoaded", function() {
	var telefoneInput = document.getElementById("celular_rastreio");
	var placeholder = telefoneInput.placeholder;
	telefoneInput.addEventListener("focus", function() {
		if (this.value === "") {
			this.placeholder = "(__) ____-_____";
		}
	});
	telefoneInput.addEventListener("focusout", function() {
		if (this.value === "") {
			this.placeholder = placeholder;
		}
	});
	telefoneInput.addEventListener("input", function() {
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
	telefoneInput.addEventListener("blur", function() {
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

function valida_email(emailInput) {
	//validate email
	var emailParts = emailInput.split("@");

	//at least one @, catches error
	if (
		emailParts[1] == null ||
		emailParts[1] == "" ||
		emailParts[1] == undefined
	) {
		return false;
	} else {
		//split domain, subdomain and tld if existent
		var emailDomainParts = emailParts[1].split(".");

		//at least one . (dot), catches error
		if (
			emailDomainParts[1] == null ||
			emailDomainParts[1] == "" ||
			emailDomainParts[1] == undefined
		) {
			return false;
		} else {
			//more than 2 . (dots) in emailParts[1]
			if (
				!emailDomainParts[3] == null ||
				!emailDomainParts[3] == "" ||
				!emailDomainParts[3] == undefined
			) {
				return false;
			} else {
				//email user
				if (/[^a-z0-9!#$%&'*+-/=?^_`{|}~]/i.test(emailParts[0])) {
					return false;
				} else {
					//double @
					if (
						!emailParts[2] == null ||
						!emailParts[2] == "" ||
						!emailParts[2] == undefined
					) {
						return false;
					} else {
						//domain
						if (/[^a-z0-9-]/i.test(emailDomainParts[0])) {
							return false;
						} else {
							//check for subdomain
							if (
								emailDomainParts[2] == null ||
								emailDomainParts[2] == "" ||
								emailDomainParts[2] == undefined
							) {
								//TLD
								if (/[^a-z]/i.test(emailDomainParts[1])) {
									return false;
								} else {
									return true;
								}
							} else {
								//subdomain
								if (/[^a-z0-9-]/i.test(emailDomainParts[1])) {
									return false;
								} else {
									//TLD
									if (/[^a-z]/i.test(emailDomainParts[2])) {
										return false;
									} else {
										return true;
									}
								}
							}
						}
					}
				}
			}
		}
	}
}