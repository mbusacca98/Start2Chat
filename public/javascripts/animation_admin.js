function registrato(){
  var tl = anime.timeline({
    easing: 'linear'
  })
  .add({
    targets: '.title-container',
    duration: 300,
    translateY: '-100vh',
  })
  .add({
    targets: '#form-reg-admin',
    duration: 300,
    scale: ['1', '0'],
    opacity: ['1', '0']
  }, -50)
  .add({
    targets: '#form-login-admin',
    duration: 300,
    scale: ['1', '0'],
    opacity: ['1', '0'],
    complete: function(){
      $(".title-container").addClass('hidden');
      $("#form-reg-admin").addClass('hidden');
      $(".success-reg").removeClass('hidden');
    }
  }, -300)
  .add({
    targets: '.success-reg',
    duration: 300,
    opacity: ['0', '1'],
    scale: ['0', '1'],
    complete: function(){
      setTimeout(function(){
        window.location.href = '/login';
      },3000)
    }
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

function formShakeEmpty(){
  formShakeError();
  $('.error-login').text("Devi riempire tutti i campi!");
  $('.error-login').addClass("text-red-700");
}

function formErrorDb(){
  formShakeError();
  $('.error-login').text("Erorre nella connessione al Database o Server Offline, riprova più tardi");
  $('.error-login').addClass("text-red-700");
}

function esist_user(){
  formShakeError();
  $('.error-login').text("Sei già registrato con questa mail o nome utente!");
  $('.error-login').addClass("text-red-700");
}
