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
const form = document.querySelectorAll('.mode__form');
const privateForm = document.querySelector('.mode__form--private');
const privateCreateRoom = document.querySelector('.mode__createRoom');
const privateRoomResult = document.querySelector('.mode__result');
const privateSearchRoom = document.querySelector('.mode__searchRoom');
const privateInputRoom = document.querySelector('.mode__inputRoomId');
const privateInputName = document.querySelector('.mode__inputName');
const privateInputSection = document.querySelectorAll('.mode__input');
const publicForm = document.querySelector('.mode__form--public');

let isFlag = 0;
let isRoom = false;
let isEnter = { val: false };

const toggleValue = value => (value === 0 ? 1 : value === 1 ? 0 : value);

for (let i = 0; i < modeBox.length; i++) {
    modeBox[i].addEventListener('click', () => {
        if (isFlag == 0) {
            isFlag = i + 1;
            modeBox[i].classList.add('js-mode__box');
            exitBtn.classList.add('js-exitBtn__pos-' + i);
            setTimeout(() => {
                exitBtn.classList.add('js-exitBtn');
                form[i].classList.add('js-mode__form');
            }, 300);
        }
    });

    exitBtn.addEventListener('click', () => {
        if (isFlag == i + 1) {
            exitBtn.classList.remove('js-exitBtn');
            form[i].classList.remove('js-mode__form');

            setTimeout(() => {
                exitBtn.classList.remove('js-exitBtn__pos-' + i);
                modeBox[i].classList.remove('js-mode__box');
                isFlag = 0;
                privateCancelEvent();
            }, 200);
        }
    });

    let j = toggleValue(i);

    modeBox[j].addEventListener('click', () => {
        if (isFlag == i + 1) {
            exitBtn.classList.remove('js-exitBtn');
            form[i].classList.remove('js-mode__form');

            setTimeout(() => {
                exitBtn.classList.remove('js-exitBtn__pos-' + i);
                modeBox[i].classList.remove('js-mode__box');
                isFlag = 0;
                privateCancelEvent();
            }, 200);
        }
    });
}

privateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.submitter.value === "create") {
        privateCreateRoom.disabled = true;
        privateSearchRoom.disabled = true;
        privateInputRoom.disabled = true;
        privateInputName.setAttribute('readonly', 'true');
        socket.emit('privateCreateRoom');
        privateInputSection[1].classList.add('js-none');
        privateInputSection[2].classList.add('js-none');
    }
    if (e.submitter.value === "search") {
        socket.emit("privateSearchRoom", privateInputRoom.value);
    }
});

privateInputRoom.addEventListener('input', () => {
    privateCreateRoom.disabled = privateInputRoom.value.length > 0 ? true : false;
});

socket.on('roomIDforSession', (data) => {
    privateRoomResult.innerHTML = data.data;
    sessionStorage.setItem('roomID', data.data);
    isEnter.val = data.isEnter;
});

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
