
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

//更新目前線上使用者
// socket.on('update_loginUsers', function (object) {
//   let text = `
//     <div class="row my-0 py-3" style="border-bottom: 1px solid #C0C0C0">
//       <h6>上線使用者 (${object.length})</h6>
//     </div>
//   `
//   for (let obj of object) {
//     text = text + `123
//     <div class="row my-0 py-3" style="border-bottom: 1px solid #C0C0C0">
//       <div class="d-flex mx-auto">
//         <a class="mx-2" href="/user/${obj.id}">
//           <img src="${obj.avatar}" alt="" style="height: 40px; width: 40px; border-radius: 50%;">
//         </a>
//         <h6 class="fw-bolder" style="margin:0;">${obj.name}$</h6>
//         <h6 style="margin:0; color:#A39480;">${obj.email}$</h6>
//       </div>
//       <h6 style="margin:0; color:#A39480;">${obj.logintimeAt}$</h6>
//     </div>
//     `
//   };
//   $('#global_loginuser').innerHTML = text
// });

//發送聊天訊息
$('#globalchat').submit(function (e) {
  
  e.preventDefault(); // prevents page reloading
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
    socket.emit('push_to_self', object);
    socket.emit('push_to_other', object);
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
  if (!object) return 
  if (object.body === "") return 
  msg = object.body
  time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  let message = document.getElementById('messages');
  const div = document.createElement('div')
  message.appendChild(div)

  if (($('#id').val() === object.fromId && $('#toId').val() === object.toId) || ($('#id').val() === object.toId && $('#toId').val() === object.fromId) || ($('#global_userId').val() === object.fromId && object.toId === "")) {
    // $('#messages').append($('<li>').text(msg));
    div.innerHTML = `
    <div class="d-flex justify-content-end">
      <li class="user mb-2 " style="list-style-type:none">
        <div class="comment">
          <div class="p-3 text-end" style="color:white; background-color:#FF6103; border-radius:8px">
            ${msg}
          </div>
        </div>
        <div class="time text-end small" style="color:#808A87">${time}</div>
      </li>
    </div>`;

    // $('#messages').append(`<div class="d-flex justify-content-end">　
    //         <li class="user mb-2 " style="list-style-type:none">
    //           <div class="comment">
    //             <div class="p-3 text-end" style="color:white; background-color:#FF6103; border-radius:8px">
    //               ${msg}</div>
    //           </div>
    //           <div class="time text-end" style="color:#808A87"></div>
    //         </li>
    //       </div>`);
  }
  if ($('#id').val() === object.toId && $('#toId').val() === object.fromId) {
    let toId_avatar = $('#toId_avatar').val();
    div.innerHTML = `<li class="nonUser mb-2" style="list-style-type:none">
            <div class="avatar-comment d-flex align-items-end">
              <img class="avatar me-2" src="${toId_avatar}" alt=""
                style="width: 50px; height:50px ; border-radius: 50%;background-color:#C4C4C4">

              <div class="p-3" style=" background-color:#f2f3f5; border-radius:8px">
                <span>${msg}</span>
              </div>
            </div>
            <div class="time ms-5 mt-0">
              <span class="ms-1 ps-2 mt-0 text-start small" style="color:#808A87">${time}</span>
            </div>
          </li>`;
  }
  if ($('#global_userId').val() !== object.fromId && object.toId === "") {
    div.innerHTML = `<li class="nonUser mb-2" style="list-style-type:none">
            <div class="avatar-comment d-flex align-items-end">
              <img class="avatar me-2" src="${object.avatar}" alt=""
                style="width: 50px; height:50px ; border-radius: 50%;background-color:#C4C4C4">

              <div class="p-3" style=" background-color:#f2f3f5; border-radius:8px">
                <span>${msg}</span>
              </div>
            </div>
            <div class="time ms-5 mt-0">
              <span class="ms-1 ps-2 mt-0 text-start small" style="color:#808A87">${time}</span>
            </div>
          </li>`;
  }
  message.appendChild(div)
  div.scrollIntoView(false)
});



socket.on('push_to_other', function (obj, toId_msgs, fromId_msgs) {

  if (Number(obj.toId) === Number($('#global_userId').val())) {
    $('#latestNew').empty().append($('#global_userId').val() + " " + obj.toId + " " + obj.fromId);
    let text = "";
    for (let msg of toId_msgs) {
      text = text + `
      <div class="d-flex mx-auto mb-2" style="border-bottom: 1px solid #C0C0C0">
        <a class="mx-2" href="/user/${msg.id_From_ToId}" style="display:contents">
          <img src="${msg.avatar_From_ToId}" alt="" style="height: 40px; width: 40px; border-radius: 50%;">
        </a>
        <a href="/privateChat/${msg.id_From_ToId}/with" class="nav-link" style="color:black;">
          <div class="row d-flex mx-0 px-0">
            <h6 class="fw-bolder mx-0 px-0" style="margin:0;">${msg.name_From_ToId}<span class="small" style="margin:0;color:#808A87">@${msg.account_From_ToId}</span></h6>
          </div>
          <div class="row mx-0 px-0">
            ${msg.body}
          </div>
        </a>
      </div>`;
    };
    $('#latestNew').empty().append(text);
    // $('#latestNew').append("激發新對話框")
  }
});

socket.on('push_to_self', function (obj, toId_msgs, fromId_msgs) {

  if (Number(obj.fromId) === Number($('#global_userId').val())) {
    $('#latestNew').empty().append($('#global_userId').val() + " " + obj.toId + " " + obj.fromId);
    let text = "";
    for (let msg of toId_msgs) {
      text = text + `
      <div class="d-flex mx-auto mb-2" style="border-bottom: 1px solid #C0C0C0">
        <a class="mx-2" href="/user/${msg.id_From_ToId}" style="display:contents">
          <img src="${msg.avatar_From_ToId}" alt="" style="height: 40px; width: 40px; border-radius: 50%;">
        </a>
        <a href="/privateChat/${msg.id_From_ToId}/with" class="nav-link" style="color:black;">
          <div class="row d-flex mx-0 px-0">
            <h6 class="fw-bolder mx-0 px-0" style="margin:0;">${msg.name_From_ToId}<span class="small" style="margin:0;color:#808A87">@${msg.account_From_ToId}</span></h6>
          </div>
          <div class="row mx-0 px-0">
            ${msg.body}
          </div>
        </a>
      </div>`;
    };
    $('#latestNew').empty().append(text);
    // $('#latestNew').append("激發新對話框")
  }
});

$(window).scroll(function () {
  last = $("body").height() - $(window).height()
  if ($(window).scrollTop() >= last) {
    $(".down").hide()
  }
}