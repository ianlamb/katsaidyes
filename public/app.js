var dividers = document.querySelectorAll('.timeline-nav-divider');

setTimeout(function() {
    dividers[0].classList.add('complete');
}, 500);
setTimeout(function() {
    dividers[1].classList.add('active');
}, 2000);


// reset hash on page refresh
window.location.hash = 'wedding';

function getHash(url) {
    var tokens = url.split('#');
    return tokens.length > 1 ? tokens[1] : null;
}

window.addEventListener('hashchange', function(e) {
    var oldHash = getHash(e.oldURL);
    var newHash = getHash(e.newURL);
    var oldContent = document.querySelector('.timeline-section.active');
    var newContent = document.getElementById(newHash);
    
    oldContent.classList.remove('active');
    newContent.classList.add('active');
});
