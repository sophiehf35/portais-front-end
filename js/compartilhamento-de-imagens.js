function compartilhamentoDeImagens(config) {
  AdiarImagens();
  const imagens = document.querySelectorAll("section#artigo.box_detail > figure >img");

  if (imagens.length > 0) {

    for (const imagem of imagens) {
        imagem.insertAdjacentHTML('afterend', '<div class="lista-redes-sociais"><span class="compartilha_imagem facebook"></span><span class="compartilha_imagem twitter"></span><span class="compartilha_imagem linkedin"></span><span class="compartilha_imagem whatsapp"></span><span class="compartilha_imagem link"></span><span class="compartilha_imagem download"></span></div>');
    }

    document.querySelector('.lista-redes-sociais').addEventListener('click', function(event) {
      var clickedElement = event.target;

      if (clickedElement.classList.contains('compartilha_imagem')) {
        //ENCONTRA TODAS AS CLASSES 
        var classes = clickedElement.classList;
        
        //ENCONTRA O SRC DA IMAGEM QUE ESTÁ PRÓXIMA DO BOTÃO CLICADO
        var imgElement = clickedElement.closest('figure').querySelector('img');
        var imgSrc = imgElement.getAttribute('src');

        //ENCONTRA A CLASSE APÓS COMPARTILHA_IMAGEM PARA SABER A AÇÃO
        var lastClassIndex = Array.from(classes).indexOf('compartilha_imagem') + 1;
        var acao = classes[lastClassIndex];
        
        //FORMATA SRC E PEGA O NOME DO ARQUIVO
        var srcFormatado = (config.cdn_imagens === 1 ? imgSrc.replace(config.diretorio_cdn_imagens + '/', window.location.protocol + '//' + window.location.host + '/img/') : imgSrc);
        var nomeArquivo = imgSrc.split('/').pop().split('.')[0];
        
        if(acao === 'facebook') {
          compartilhanoFacebook(srcFormatado);
        } else if(acao === 'twitter') {
          compartilhanoTwitter(srcFormatado);
        } else if(acao === 'linkedin') {
          compartilhanoLinkedin(srcFormatado);
        } else if(acao === 'whatsapp') {
          compartilhanoWhatsapp(srcFormatado);
        } else if(acao === 'link') {
          copiaLink(srcFormatado);
        } else if(acao === 'download') {
          downloadImagem(imgSrc, nomeArquivo + '.jpg');
        }
      }
    });
  }

}


function compartilhanoFacebook(url){
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank');
}

function compartilhanoTwitter(url) {
  window.open('https://twitter.com/intent/tweet?text=' + url, '_blank');
}

function compartilhanoLinkedin(url) {
  window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url, '_blank');
}

function compartilhanoWhatsapp(url) {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        window.open('whatsapp://send?text=' + url, '_blank');
    } else {
        window.open('https://web.whatsapp.com/send?text=' + url, '_blank');
    }
}

const copiaLink = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
  
    Swal.fire({
        icon: "success",
        title: 'Link copiado',
        html: 'Agora é só colar o link onde deseja compartilhar a imagem.',
        allowEscapeKey: true,
        allowOutsideClick: true,
        timer: 5000,
        timerProgressBar: true
    })
}

function downloadImagem(url, name){
    fetch(url)
    .then(resp => resp.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(() => alert('An error sorry'));
}