// Переключение в полноэкранный режим и обратно
const fullscreenButton = document.querySelector('.fullscreen');

const fullscreenElement = document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement;

fullscreenButton.addEventListener("mousedown", function(e) {
    if (!fullscreenElement) {
        toggleFullScreen();
    }
}, false);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}