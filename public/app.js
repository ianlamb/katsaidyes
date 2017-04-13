var dividers = document.querySelectorAll('.timeline-nav-divider');

setTimeout(function() {
    dividers[0].classList.add('complete');
}, 500);
setTimeout(function() {
    dividers[1].classList.add('active');
}, 2000);