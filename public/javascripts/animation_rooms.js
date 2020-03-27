function roomsAnimate(){
  var tl = anime.timeline({
    easing: 'linear'
  })
  .add({
    targets: '.column > div',
    opacity: ['0', '1'],
    duration: 300,
    delay: anime.stagger(100),
  })
}
