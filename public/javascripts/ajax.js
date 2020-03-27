function login(user, pass){
  $.ajax({
    method: 'POST',
    url: 'ajax/login',
    data: 'username='+user+'&password='+pass,
    success: function(response){
      if(response.output == 'logged-in'){
        loggedIn();
      }
      else if(response.output == 'error-login'){

        formShakeNotCorrect();
      }
      else if(response.output == 'campi-mancanti'){
        formShakeEmpty();
      }
      else if(response.output == 'error-db'){
        formErrorDb();
      }
    }
  })
}

function logged(url, matricola){
  $.ajax({
    url: url,
    method: 'POST',
    data: 'matricola='+matricola,
  })
}

function reg(data){
  //Mando i dati del form tramite Ajax
  $.ajax({
    method: 'POST',
    url: 'ajax/registrati',
    data: 'data='+JSON.stringify(data),
    success: function(e){
      if(e.output == 'insert-ok'){
        registrato();
      }
      else if(e.output == 'error-insert'){
        formShakeError();
      }
      else if(e.output == 'campi-mancanti'){
        formShakeEmpty();
      }
      else if(e.output == 'db-offline'){
        formErrorDb();
      }
      else if(e.output == 'esist-user'){
        esist_user();
      }
    }
  })
}

function loadAdCat(id_user){
  $.ajax({
    method: 'POST',
    url: 'ajax/loadAdCat',
    data: 'id='+id_user,
    success: function(res){
        $('.spinneradmin').addClass('hidden');
        for (var i=0 ; i<res.output.length ; i++){
          $('.rooms-div > div').append("<p data-id='"+res.output[i].id+"' class='max-w-full divCategory'><i class='far fa-dot-circle mr-5 lg:mr-2 text-2xl lg:text-xs' style='opacity:0.6'></i>"+res.output[i].nome+"</p>");
        }
    }
  })
}

function loadMyCat(id_user){
  $.ajax({
    method: 'POST',
    url: 'ajax/loadMyCat',
    data: 'id='+id_user,
    success: function(res){
        $('.spinnermy').addClass('hidden');
        $('.container-my_rooms').toggleClass('hidden');
        for (var i=0 ; i<res.output.length ; i++){
          $('.container-my_rooms > div').append("<p class='max-w-full divCategory' data-id='"+res.output[i].id+"'><i class='far fa-dot-circle mr-5 lg:mr-2 text-2xl lg:text-xs' style='opacity:0.6'></i>"+res.output[i].nome+"</p>");
        }
    }
  })
}

function addUser(username, id){
  $.ajax({
    url: "ajax/addUser",
    method: 'POST',
    data: 'username='+username+'&id_room='+id,
    beforeSend: function(){
      $(".add-user input[name=sub]").val("Attendere...");
      $(".add-user input[name=sub]").attr("disabled", true);
      $('.pop-up_add').addClass('hidden');
    },
    success: function(res){
      if(res.output == 'error'){
        error();
      }
      else if(res.output == 'userNotFound'){
        notFound();
      }
      else if(res.output == 'presente'){
        presente();
      }
      else{
        $('tbody').append("<tr><td class='overflow-x-scroll'><b>"+res.output.username+"</b></td><td class='mail overflow-x-scroll px-2'>"+res.output.mail+"</td><td class='w-1/4 lg:w-1/5 text-red-700 del'><button type='button' name='del-user' data-idroom='"+res.output.id+"' class='del-button'><b>Elimina</b></button> <button type='button' name='confirm' class='confirm hidden''><b>Conferma</b></button></td></tr>")

        $(".add-user input[name=sub]").val("Aggiunto!");
        setTimeout(function(){
          $(".add-user input[name=sub]").val("Aggiungi");
          $(".add-user input[name=sub]").attr("disabled", false);
        }, 3000)
      }
    }
  })
}

function loadUser(id_room, myId){
  $.ajax({
    url: 'ajax/loadUser',
    method: 'POST',
    data: 'roomID='+id_room,
    success: function(data){
      if (data.output == 'conn-err') {
        $('table').addClass('hidden');
        $('.err-db').toggleClass('hidden');
      }
      else if(data.output!='empty'){
        var i;
        for (i=0 ; i<data.output.length ; i++) {
          if (data.output[i].id_user != myId) {
            $('.empty').addClass('hidden');
            $('tbody').append("<tr><td class='overflow-x-scroll'><b>"+data.output[i].username+"</b></td><td class='mail overflow-x-scroll px-2'>"+data.output[i].mail+"</td><td class='w-1/4 lg:w-1/5 text-red-700 del'><button type='button' name='del-user' data-idroom='"+data.output[i].id_user+"' class='del-button'><b>Elimina</b></button> <button type='button' name='confirm' class='confirm hidden''><b>Conferma</b></button></td></tr>")
          }
        }
      }
    }
  })
}

function delUser(id_user, parent){
  $.ajax({
    url: 'ajax/delUser',
    method: 'POST',
    data: 'id='+id_user,
    success: function(res){
      if(res.output == 'ok'){
        $(parent).addClass('hidden');
      }
    }
  })
}

function modNameCat(name, id){
  $.ajax({
    url: 'ajax/modNameCat',
    method: 'POST',
    data: 'id='+id+'&name='+name,
    success: function(res){
      if(res.output == 'ok'){
        $('.config-rooms input[name=sub]').toggleClass('hidden');
        $('.config-rooms input[name=del]').toggleClass('hidden');
        $('.config-rooms .pop-up_config').toggleClass('hidden');
        $('.config-rooms input[name=name]').data('name', name);
        $('.config-rooms .pop-up_config').text('Nome modificato!');

        $('.config-rooms input[name=name]').val(name)
        window.history.replaceState({}, "", "/admin?name="+name+"&id="+id);

        setTimeout(function(){
          $('.config-rooms input[name=sub]').toggleClass('hidden');
          $('.config-rooms input[name=del]').toggleClass('hidden');
          $('.config-rooms .pop-up_config').toggleClass('hidden');
        },3000)
      }
    }
  })
}

function delRoom(id){
  $.ajax({
    url: 'ajax/delRoom',
    method: 'POST',
    data: 'id='+id,
    success: function(res){
      if(res.output == 'ok'){
        window.location.href = 'rooms';
      }
    }
  })
}

function loadMyProfile(id){
  $.ajax({
    url: '../ajax/loadMyProfile',
    method: 'POST',
    data: 'id='+id,
    success: function(res){
      $('.MyProfileContainer .myfoto > img').prop('src', res.output[0].photo);
      $('.MyProfileContainer input[name=nome]').val(res.output[0].nome);
      $('.MyProfileContainer input[name=cognome]').val(res.output[0].cognome);
      $('.MyProfileContainer input[name=mail]').val(res.output[0].mail);
      $('.MyProfileContainer input[name=city]').val(res.output[0].city);
      $('.MyProfileContainer input[name=instagram]').val(res.output[0].instagram);
      $('.MyProfileContainer input[name=facebook]').val(res.output[0].facebook);
      $('.MyProfileContainer input[name=linkedin]').val(res.output[0].linkedin);
      $('.MyProfileContainer input[name=username]').val(res.output[0].username);
    }
  })
}

function modProfile(data){

  $.ajax({
    url: '../ajax/modProfile',
    method: 'POST',
    beforeSend: function(){
      $('button[name=modifica]').text('Attendere...');
    },
    data: 'nome='+data[0]+'&cognome='+data[1]+'&mail='+data[2]+'&username='+data[3]+'&city='+data[4]+'&instagram='+data[5]+'&facebook='+data[6]+'&linkedin='+data[7],
    success: function(res){
      console.log(res);
      if(res.output == 'ok'){
        $('button[name=modifica]').text('Modificato!');
        setTimeout(function(){
          location.reload();
        },2000)
      }
    }
  })
}

function modPassword(id){
  var vecchia = $('input[name=vecchia]').val();
  var nuova = $('input[name=nuova]').val();

  $.ajax({
    url: '../ajax/modPassword',
    method: 'POST',
    data: 'vecchia='+vecchia+'&nuova='+nuova+'&id='+id,
    beforeSend: function(){
      $('.indieto, .modPassword').text('Attendere...');
    },
    success: function(data){
      if(data.output == 'ok'){
        animePass('ok');
      }
      else{
        animePass('no');
      }
    }
  })
}

function message(id_user, id_room, text_message){
  $.ajax({
    url: '../ajax/message',
    method: 'POST',
    data: 'message='+text_message+'&id_user='+id_user+'&id_room='+id_room,
    success: function(res){
      if(res.output == 'ok'){
        send(id_user, id_room, text_message);

        animeSubmit();
        $('.messageDiv').scrollTop(($('.messageDiv > div:last-child').position().top)-($('.messageDiv > div').position().top));
        $('textarea')[0].reset();
      }
    }
  })
}

function loadMessage(indice, room){
  $.ajax({
    url: '../ajax/loadMessage',
    method: 'POST',
    beforeSend: function(){
      $('.spinner-message').removeClass('hidden');
    },
    data: 'index='+indice+'&room='+room,
    success: function(data){
      $('.spinner-message').addClass('hidden');

      index += 10;
      var i = 0;
      var temp = client[0].scrollHeight;

      for(i=0 ; i<10 ; i++){
        var template = $('#template-message-user').html();
        var html = '';
        var user = '';

        $('.div-userOnline > div').each(function(){
          if($(this).data('iduser') == data.output[i].id_user){
            user = $(this).data('search');
            return false;
          }
        })

        html += template.replace(/{{message}}/g, data.output[i].text)
                        .replace(/{{nome}}/g, user)
                        .replace(/{{hour}}/g, );

        $('.messageDiv').prepend(html);

        //$('.messageDiv').scrollTop($('.messageDiv')[0].scrollHeight - temp);
      }

      $('.spinner-message').addClass('hidden');
    }
  })
}
