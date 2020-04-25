function col1(start, end){
  var tl = anime.timeline({
    easing: 'linear'
  })
  .add({
    targets: '.col-1',
    translateX: [start, end],
    duration: 200,
    complete: function(){
      if(end != '0'){
        $('.col-1').toggleClass('hidden');
      }
    }
  })
}

var countFotoForm = 0;
function fotoForm(){

  if(countFotoForm == 0){
    var tl = anime.timeline({
      easing: 'cubicBezier(0.600, -0.280, 0.735, 0.045)'
    })
    .add({
      targets: '#formProfile',
      opacity: ['1', '0'],
      scale: ['1', '0'],
      duration: 500,
      complete: function(){
        $('#formProfile').toggleClass('hidden');
        $('.fotoForm').toggleClass('hidden');
      }
    })
    .add({
      targets: '.fotoForm',
      opacity: ['0', '1'],
      scale: ['0', '1'],
      duration: 300,
      complete: function(){
        $('.changePhoto').text('Indietro');
        countFotoForm++;
      }
    })
  }
  else{
    var tl = anime.timeline({
      easing: 'cubicBezier(0.600, -0.280, 0.735, 0.045)'
    })
    .add({
      targets: '.fotoForm',
      opacity: ['1', '0'],
      scale: ['1', '0'],
      duration: 500,
      complete: function(){
        $('#formProfile').toggleClass('hidden');
        $('.fotoForm').toggleClass('hidden');
      }
    })
    .add({
      targets: '#formProfile',
      opacity: ['0', '1'],
      scale: ['0', '1'],
      duration: 300,
      complete: function(){
        $('.changePhoto').text('Cambia');
        countFotoForm = 0;
      }
    })
  }

}

var countChangePassword = 0;
function changePassword(){

  if(countChangePassword == 0){
    var tl = anime.timeline({
      easing: 'cubicBezier(0.600, -0.280, 0.735, 0.045)'
    })
    .add({
      targets: '#formProfile',
      opacity: ['1', '0'],
      scale: ['1', '0'],
      duration: 500,
      complete: function(){
        $('#formProfile').toggleClass('hidden');
        $('.changePassword').toggleClass('hidden');
      }
    })
    .add({
      targets: '.changePassword',
      opacity: ['0', '1'],
      scale: ['0', '1'],
      duration: 300,
      complete: function(){
        countChangePassword++;
      }
    })
  }
  else{
    var tl = anime.timeline({
      easing: 'cubicBezier(0.600, -0.280, 0.735, 0.045)'
    })
    .add({
      targets: '.changePassword',
      opacity: ['1', '0'],
      scale: ['1', '0'],
      duration: 500,
      complete: function(){
        $('#formProfile').toggleClass('hidden');
        $('.changePassword').toggleClass('hidden');
      }
    })
    .add({
      targets: '#formProfile',
      opacity: ['0', '1'],
      scale: ['0', '1'],
      duration: 300,
      complete: function(){
        countChangePassword--;
      }
    })
  }

}

function popupMyProfile(e){

  var from = 0, to = 1;

  if(e == 0){
    from = 1;
    to = 0;
  }
  else{
    $('.MyProfileContainer').toggleClass('hidden');
  }

  var tl = anime.timeline({
    easing: 'linear'
  })
  .add({
    targets: '.MyProfileContainer',
    opacity: [from, to],
    duration: 500
  })
  .add({
    targets: '.MyProfileContainer > div',
    opacity: [from, to],
    duration: 500,
    complete: function(){
      if(e == 0){
        $('.MyProfileContainer').toggleClass('hidden');
      }
    }
  }, -100)

  if(e == 1){
    tl.add({
      targets: '.divProfile .stagger',
      opacity: ['0', '1'],
      delay: anime.stagger(100)
    }, -100)
  }

}

function popupProfileOnline(e){

  var from = 0, to = 1;

  if(e == 0){
    from = 1;
    to = 0;
  }
  else{
    $('.profileOnlineContainer').toggleClass('hidden');
  }

  var tl = anime.timeline({
    easing: 'linear'
  })
  .add({
    targets: '.profileOnlineContainer',
    opacity: [from, to],
    duration: 500
  })
  .add({
    targets: '.profileOnlineContainer > div',
    opacity: [from, to],
    duration: 500,
    complete: function(){
      if(e == 0){
        $('.profileOnlineContainer').toggleClass('hidden');
      }
    }
  }, -100)

  if(e == 1){
    tl.add({
      targets: '.profileOnlineContainer .stagger',
      opacity: ['0', '1'],
      delay: anime.stagger(100)
    }, -100)
  }

}

function animeSubmit(){
  var tl = anime.timeline({
    easing: 'linear'
  })
  .add({
    easing: 'easeInExpo',
    targets: '.shapeshifter',
    translateX: '70%',
    translateY: '-70%',
    opacity: 0,
    duration: 400,
  })
  .add({
    easing: 'easeOutQuad',
    targets: '.shapeshifter',
    translateX: ['-70%', 0],
    translateY: ['70%', 0],
    opacity: 1,
    duration: 400,
    delay: 300
  })
}

function animePass(res){
  var tl = anime.timeline({
    easing: 'linear'
  })
  .add({
    targets: '.changePassword > form',
    opacity: ['1', '0'],
    duration: 200,
    complete: function(){
      $('.changePassword > form').addClass('hidden');
      $('.changePassword > div').removeClass('hidden');
      if(res == 'ok'){
        $('.changePassword > div > .ok').removeClass('hidden');
      }
      else{
        $('.changePassword > div > .no').removeClass('hidden');
      }
    }
  })
  .add({
    targets: '.changePassword > div',
    opacity: ['0', '1'],
    duration: 200
  })
  .add({
    targets: '.changePassword > div',
    opacity: ['1', '0'],
    duration: 200,
    complete: function(){
      $('.changePassword > div').addClass('hidden');
      $('.changePassword > div > .ok').addClass('hidden');
      $('.changePassword > div > .no').addClass('hidden');
      $('.changePassword > form').removeClass('hidden');
    }
  }, 3000)
  .add({
    targets: '.changePassword > form',
    opacity: ['0', '1'],
    duration: 200,
    complete: function(){
      $('.indieto').text('Indietro');
      $('.modPassword').text('Conferma');
    }
  })
}

function new_message(){
  var max = 16;
  var tl = anime.timeline({
    easing: "linear",
    loop: true
  })
  .add({
    targets: '.new-message',
    duration: 1000,
    translateY: [{value: max * -1},{value: max},{value: max/2 * -1},{value: max/2},{value: max * 0}],
  })
  .add({

  },3000)
}

//Animazione per tornare alla home o alle Stanze
function animationNavbar(trigger){
  var tl = anime.timeline({
    easing: 'linear'
  })
  if(trigger == 'open'){
    tl.add({
      targets: '.text-nav',
      duration: 400,
      opacity: ['1', '0'],
      complete: function(){
        $('.text-nav').addClass('hidden');
        $('.menu-nav').removeClass('hidden');
      }
    })
    tl.add({
      targets: '.menu-nav > div',
      opacity: ['0', '1'],
      translateY: ['-50%', '0'],
      delay: anime.stagger(200),
      duration: 200
    })
  } else{
    tl.add({
      targets: '.menu-nav > div',
      opacity: ['1', '0'],
      translateY: ['0', '-50%'],
      delay: anime.stagger(200),
      duration: 200,
      complete: function(){
        $('.text-nav').removeClass('hidden');
        $('.menu-nav').addClass('hidden');
      }
    })
    tl.add({
      targets: '.text-nav',
      duration: 300,
      opacity: ['0', '1'],
    })
  }

}
