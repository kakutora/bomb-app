import io from 'socket.io-client';

/*
const init = io('/head');
init.on('reload', () => {
    location.reload();
});
*/

const socket = io('/');
const modeBox = document.querySelectorAll('.mode__box');
const exitBtn = document.querySelector('.exitBtn');
const form = document.querySelectorAll('.form');
const privateForm = document.querySelector('.privateForm');
const privateCreateRoom = document.querySelector('.mode__createRoom');
const privateRoomResult = document.querySelector('.mode__result');
const privateSearchRoom = document.querySelector('.mode__searchRoom');
const privateInputRoom = document.querySelector('.mode__inputRoomId');
const publicForm = document.querySelector('.publicForm');

let isFlag = 0;

for (let i = 0; i < modeBox.length; i++) {
    modeBox[i].addEventListener('click', () => {
        if (isFlag == 0) {
            isFlag = i + 1;
            modeBox[i].classList.add('js-mode__box');
            exitBtn.classList.add('js-exitBtn__pos-' + i);
            setTimeout(() => {
                exitBtn.classList.add('js-exitBtn');
                form[i].classList.add('js-form');
            }, 300);
        }
    });

    exitBtn.addEventListener('click', () => {
        if (isFlag == i + 1) {
            exitBtn.classList.remove('js-exitBtn');
            form[i].classList.remove('js-form');

            setTimeout(() => {
                exitBtn.classList.remove('js-exitBtn__pos-' + i);
                modeBox[i].classList.remove('js-mode__box');
                isFlag = 0;
                privateCancelEvent();
            }, 300);
        }
    });
}

privateCreateRoom.addEventListener('click', () => {
    privateCreateRoom.disabled = true;
    privateSearchRoom.disabled = true;
    privateInputRoom.disabled = true;
    socket.emit('privateCreateRoom');
});

privateSearchRoom.addEventListener('click', () => {
    socket.emit("privateSearchRoom", privateInputRoom.value);
});

privateInputRoom.addEventListener('input', () => {
    privateCreateRoom.disabled = privateInputRoom.value.length > 0 ? true : false;
});

socket.on('roomID', (data) => {
    privateRoomResult.innerHTML = data;
});





publicForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let name = document.querySelector('#name').value;
    socket.emit('join', name);
});

socket.on('data', (data) => {
    console.log(data);
    console.log(socket.id);
});

socket.on('clientList', (data) => {
    console.log(`今接続してるプレイヤーは${data}人です。`);
});

const privateCancelEvent = () => {
    socket.emit('privateRemoveRoom');
    privateRoomResult.innerHTML = "";
    privateCreateRoom.disabled = false;
    privateSearchRoom.disabled = false;
    privateInputRoom.disabled = false;
};