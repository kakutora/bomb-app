import io from 'socket.io-client';

/*
const init = io('/head');
init.on('reload', () => {
    location.reload();
});
*/

const socket = io('/');

const form = document.querySelector('#form');
form.addEventListener('submit', (e) => {
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