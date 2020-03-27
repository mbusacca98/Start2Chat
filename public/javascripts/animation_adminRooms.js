function shake(){
  var max = 16;
  var tl = anime.timeline({
    easing: "linear"
  })
  .add({
    targets: '.form-add',
    duration: 300,
    translateX: [{value: max * -1},{value: max},{value: max/2 * -1},{value: max/2},{value: max * 0}],
    complete: function(){
      $('.pop-up_add').removeClass('hidden');
    }
  })
  .add({
    targets: '.error-login',
    opacity: ['0', '1'],
    duration: 300,
    complete: function(){
      $(".add-user input[name=sub]").attr("disabled", false);
      $(".add-user input[name=sub]").val("Aggiungi");
    }
  }, -50)
}

function error(){
  shake();
  $('.pop-up_add').text("Errore, riprovare più tardi");
  $('.pop-up_add').addClass("text-red-700");
}

function presente(){
  shake();
  $('.pop-up_add').text("Utente già aggiunto alla stanza");
  $('.pop-up_add').addClass("text-red-700");
}

function notFound(){
  shake();
  $('.pop-up_add').text("Utente non trovato!");
  $('.pop-up_add').addClass("text-red-700");
}
