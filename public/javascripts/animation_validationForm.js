function opacity_animation(target, target2, color){
  var tl = anime.timeline({
    easing:'linear'
  });
  if(target != ''){
    tl.add({
      targets: target,
      opacity: ['0', '1'],
      duration: 300,
      scale:['0', '1'],
      delay: 1000
    });
  }
  tl.add({
    targets: target2,
    duration: 300,
    borderColor: color,
    delay: 1000
  }, '-300');
}

function opacity_animation_border(target2, color){
  var tl = anime.timeline({
    easing:'linear'
  })
  .add({
    targets: target2,
    duration: 300,
    borderColor: color,
    delay: 1000
  })
}

function error_form_message(target, i){
  var tl = anime.timeline({
    easing:'linear',
  });

  if(i == 1){
    tl.add({
      targets: target,
      duration: 300,
      opacity: ['0', '1'],
    })
  } else {
    tl.add({
      targets: target,
      duration: 300,
      opacity: ['1', '0'],
      complete: function() {
        $(target).addClass("hidden");
      }
    })
  }
}
