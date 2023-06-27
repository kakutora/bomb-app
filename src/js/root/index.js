import "../../css/root/index.css";
import io from 'socket.io-client';

const socket = io('/');
const form = document.querySelectorAll('.form');
const privateForm = document.querySelector('.form--private');
const privateRoomResult = document.querySelector('.form__result');
const privateInputRoom = document.querySelector('.form__inputRoomId');
const privateInputName = document.querySelector('.form__inputName');
const localeBtn = document.querySelector('.localeBtn');
const publicForm = document.querySelector('.form--public');
const b = document.querySelector('.b');

let isEnter = { val: false };

privateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.submitter.value === "create") {
        socket.emit('privateCreateRoom');
    }
    if (e.submitter.value === "search") {
        socket.emit("privateSearchRoom", privateInputRoom.value);
    }
});
socket.on('roomIDforSession', (data) => {
    privateRoomResult.innerHTML = data.data;
    sessionStorage.setItem('roomID', data.data);
    isEnter.val = data.isEnter;
});
socket.on('sendBtn', () => {
    localeBtn.style.display = 'block';
});
localeBtn.addEventListener('click', () => {
    socket.emit('setupReady', sessionStorage.getItem('roomID'));
});
socket.on('sendSetupPage', () => {
    console.log('とびます');
    window.location.href = `${window.location.protocol}//${window.location.host}/setup`;
});



/* 抜ける処理
exitBtn.addEventListener('click', () => {
    if (isEnter.val) {
        socket.emit('leaveRoom', sessionStorage.getItem('roomID'));
        isEnter.val = false;
    }
});
modeBox[1].addEventListener('click', () => {
    if (isEnter.val) {
        socket.emit('leaveRoom', sessionStorage.getItem('roomID'));
        isEnter.val = false;
    }
});
*/




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
