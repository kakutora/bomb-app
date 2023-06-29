import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import "../../css/setup/index.css";
import io from 'socket.io-client';

const swiper = new Swiper(".swiper", {
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});
