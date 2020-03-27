function formOut(){
  var tl = anime.timeline({
    easing: 'linear'
  })
  .add({
    targets: '.title-container',
    duration: 300,
    translateY: '-100vh',
  })
  .add({
    targets: 'form',
    duration: 300,
    scale: ['1', '0'],
    opacity: ['1', '0'],
    complete: function(){
      $(".title-container").addClass('hidden');
      $("#form-login-admin > form").addClass('hidden');
      $(".success-login").removeClass('hidden');
    }
  }, -50)
  .add({
    targets: '.success-login',
    duration: 300,
    opacity: ['0', '1'],
    scale: ['0', '1']
  }, 50)
}

function formShakeError(){
  var max = 16;
  var tl = anime.timeline({
    easing: "linear"
  })
  .add({
    targets: 'form',
    duration: 300,
    translateX: [{value: max * -1},{value: max},{value: max/2 * -1},{value: max/2},{value: max * 0}],
    complete: function(){
      $('.error-login').removeClass('hidden');
    }
  })
  .add({
    targets: '.error-login',
    opacity: ['0', '1'],
    duration: 300,
    complete: function(){
      $("input[name=submit]").attr("disabled", false);
      $("input[name=submit]").val("Accedi!");
    }
  }, -50)
}

function formShakeNotCorrect(){
  formShakeError();
  $('.error-login > .desc').text("Username o password errata, riprova!");
  $('.error-login > .desc').addClass("text-red-700");
  $('.error-login').removeClass('loggato');
  $('.error-login .log').addClass('hidden');
}

function formShakeEmpty(){
  formShakeError();
  $('.error-login > .desc').text("Devi riempire tutti i campi!");
  $('.error-login > .desc').addClass("text-red-700");
  $('.error-login').removeClass('loggato');
  $('.error-login .log').addClass('hidden');
}

function formErrorDb(){
  formShakeError();
  $('.error-login > .desc').text("Erorre di connessione, riprova dopo");
  $('.error-login > .desc').addClass("text-red-700 text-center");
  $('.error-login').removeClass('loggato');
  $('.error-login .log').addClass('hidden');
}

function formLoggato(){
  formShakeError();
  $('.error-login > .desc').text("Sei già loggato su un altro dispositivo");
  $('.error-login > .desc').addClass("text-red-700 text-center");
  $('.error-login').addClass("loggato");
  $('.error-login .log').removeClass('hidden');
}

function loginAnimation(){
  var tl = anime.timeline({
    easing: 'easeInCubic'
  })
  .add({
    targets: '.full-container',
    opacity: ['1', '0'],
    scale: ['1', '0'],
    complete: function(){
      $('.full-container').toggleClass('hidden');
      $('.login-container').toggleClass('hidden');
    }
  })
  .add({
    targets: '.login-container',
    opacity: ['0', '1'],
    scale: ['0', '1'],
  })
}
