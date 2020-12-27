


var socket = io();
socket.emit('open', "update loginTime");

//更新目前線上使用者
socket.on('update_loginUsers', function (object) {
  $('#global_loginuser').append(`<div class="d-flex mx-auto mb-2" style="border-bottom: 1px solid #C0C0C0">
    <a class="mx-2" href="/user/${object.id}" style="display:contents">
      <img src="${object.avatar}" alt="" style="height: 40px; width: 40px; border-radius: 50%;">
        </a>
      <h6 class="fw-bolder" style="margin:0;">${object.name}</h6>
      <span class="small" style="margin:0;color:#808A87">@${object.account}</span>
      </div>`);
});

// socket.on('update_loginUsers', function (object) {
//   $('#update_loginUsers').append($(`
//   <div class="row my-0 py-3" style="border-bottom: 1px solid #C0C0C0">
//       <h6>上線使用者 (${object.length})</h6>
//     </div>
//   <div class="row my-0 py-3" style="border-bottom: 1px solid #C0C0C0">
//       <div class="d-flex mx-auto">
//         <a class="mx-2" href="/user/${obj.id}">
//           <img src="${obj.avatar}" alt="" style="height: 40px; width: 40px; border-radius: 50%;">
//         </a>
//         <h6 class="fw-bolder" style="margin:0;">${obj.name}$</h6>
//         <h6 style="margin:0; color:#A39480;">${obj.email}$</h6>
//       </div>
//       <h6 style="margin:0; color:#A39480;">${obj.logintimeAt}$</h6>
//     </div>
//   `));
// });

//發送聊天訊息
$('#globalchat').submit(function (e) {
  e.preventDefault(); // prevents page reloading
  const object = {
    type: $('#type').val(),
    body: {
      type: "txt",
      msg: $('#m').val()
    },
    fromId: $('#id').val(),
    toId: $('#toId').val(),
    name: $('#name').val(),
    avatar: $('#avatar').val(),
  }
  socket.emit('chat message', object);
  $('#m').val('');
  return false;
});
//保存訊息在頁面上
socket.on('chat message', function (object) {
  msg = object.body.msg

  // $('#messages').append($('<li>').text(msg));
  $('#messages').append(`<div class="d-flex justify-content-end">
        <li class="user mb-2 " style="list-style-type:none">
          <div class="comment">
            <div class="p-3 text-end" style="color:white; background-color:#FF6103; border-radius:8px">
              ${msg}</div>
          </div>
          <div class="time text-end" style="color:#808A87"></div>
        </li>
      </div>`);

  // $('#messages').append(`<li><img src="${object.avatar}" alt="" style="width: 50px; height:50px">${msg}</li>`);
});

$(document).ready
  (
    function () {
      $("#chat-message").scrollTop($(document).height() + 0);
    }
  );
