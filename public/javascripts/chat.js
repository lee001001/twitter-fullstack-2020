var socket = io();   //Notice that I’m not specifying any URL when I call io(), since it defaults to trying to connect to the host that serves the page.
// socket.emit('open', "update loginTime");
socket.emit('open', "update loginTime");

//更新目前線上使用者
socket.on('update_loginUsers', function (object) {
  let text = "";
  for (let obj of object) {
    text = text + `
    <div class="onelineUser d-flex mx-auto p-2 align-items-center" style="border-bottom: 1px solid #C0C0C0">
      <a href="/user/${obj.id}" style="display:contents">
        <img src="${obj.avatar}" alt="" class="me-2 "style="height: 40px; width: 40px; border-radius: 50%;">
      </a>
      <h6 class="fw-bolder me-2" style="margin:0;">${obj.name}</h6>
      <span class="small" style="margin:0;color:#808A87">@${obj.account}</span>
    </div>`;
  }
  $('#global_loginuser').empty().append(text);
  $('#onlineUsers').empty().append(`<h5>上線使用者 (${object.length})</h5>`);
});


//監聽到資料send 並把資料傳到後端
$('#globalchat').submit(function (e) {
  e.preventDefault(); // prevents page reloading
  if ($('#m').val() !== '') {
    const object = {
      type: $('#type').val(),
      body: $('#m').val(),
      fromId: $('#id').val(),
      toId: $('#toId').val(),
      name: $('#name').val(),
      avatar: $('#avatar').val()
    }
    socket.emit('chat message', object);

    $('#m').val('');

    $(document).ready(function () {
      $('.message').scrollTop($('#scroll_div')[0].scrollHeight);
    });


    if (object.toId !== "") {
      socket.emit('push_to_other', object);
    }
    return false;
  }
});

//保存訊息在頁面上
// socket.on('chat message', function (object) {
//   console.log(object)
//   msg = object.body.msg
//   if (($('#id').val() === object.fromId && $('#toId').val() === object.toId) || ($('#id').val() === object.toId && $('#toId').val() === object.fromId) || object.toId === "") {
//     $('#messages').append(`<li><img src="${object.avatar}" alt="" style="width: 50px; height:50px">${msg}</li>`);
//   }
// });

//保存訊息在頁面上
socket.on('chat message', function (object) {
  if ($('#m').val() !== undefined) {
    msg = object.body
    time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    if (($('#id').val() === object.fromId && $('#toId').val() === object.toId) || ($('#id').val() === object.toId && $('#toId').val() === object.fromId) || object.toId === "") {
      let message = document.getElementById('messages');
      const div = document.createElement('div')
      div.innerHTML = `<div class="d-flex justify-content-end">
            <li class="user mb-2 " style="list-style-type:none">
              <div class="comment">
                <div class="p-3 text-end" style="color:white; background-color:#FF6103; border-radius:8px">
                  ${msg}</div>
              </div>
              <div class="time text-end small" style="color:#808A87">${time}</div>
            </li>
          </div>`
      message.appendChild(div)
      div.scrollIntoView(false)
    }
  }
});



socket.on('push_to_other', function (obj, messages) {
  if (obj.toId === $('#global_userId').val()) {
    let text = "";
    for (let msg of messages) {
      text = text + `
      <div class="d-flex mx-auto mb-2" style="border-bottom: 1px solid #C0C0C0">
        <a class="mx-2" href="/user/${this.id_From_ToId}" style="display:contents">
          <img src="${this.avatar_From_ToId}" alt="" style="height: 40px; width: 40px; border-radius: 50%;">
        </a>
        <a href="/privateChat/${this.id_From_ToId}" class="nav-link" style="color:black;">
          <div class="row d-flex mx-0 px-0">
            <h6 class="fw-bolder mx-0 px-0" style="margin:0;">
              ${this.name_From_ToId}
              <span class="small" style="margin:0;color:#808A87">@${this.account_From_ToId}</span>
            </h6>
          </div>
          <div class="row mx-0 px-0">
            ${this.dataValues.body}
          </div>
        </a>
      </div>`;
    }
    $('#latestNew').empty().append(text);
    // $('#latestNew').append("激發新對話框")
  }
});

$(window).scroll(function () {
  last = $("body").height() - $(window).height()
  if ($(window).scrollTop() >= last) {
    $(".down").hide()
  }
})

//私聊
$('#privateRoom').submit(function (e) {
  e.preventDefault(); // prevents page reloading
  if ($('#m').val() !== '') {
    const object = {
      type: $('#type').val(),
      body: $('#m').val(),
      fromId: $('#id').val(),
      toId: $('#toId').val(),
      name: $('#name').val(),
      avatar: $('#avatar').val()
    }
    socket.emit('private message', object);

    $('#m').val('');

    return false;
  }
});

//接到後端傳來的資料
socket.on('private message', function (obj) {
  if ($('#m').val() !== undefined) {
    msg = object.body
    time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    // if (($('#id').val() === object.fromId && $('#toId').val() === object.toId) || ($('#id').val() === object.toId && $('#toId').val() === object.fromId) || object.toId === "") {
    let privateMessages = document.getElementById('privateMessages');
    const div = document.createElement('div')
    privateMessages.appendChild(div)
    div.innerHTML = `<div class="d-flex justify-content-end">
            <li class="user mb-2 " style="list-style-type:none">
              <div class="comment">
                <div class="p-3 text-end" style="color:white; background-color:#FF6103; border-radius:8px">
                  ${msg}</div>
              </div>
              <div class="time text-end small" style="color:#808A87">${time}</div>
            </li>
          </div>`
    privateMessages.appendChild(div)
    div.scrollIntoView(false)
    // }
  }


})



