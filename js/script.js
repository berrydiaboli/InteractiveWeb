var buttonNav = document.getElementById(`behindNavButton`)

function checkSecret() {
    if (Math.floor(Math.random() * 25) > 22) {
        window.location.href = `../SECRET.html`
        return false
    }
    else {
        return true
    }
}

buttonNav.onclick = function() {
    document.getElementById(`bodyNav`).classList.toggle(`toggleNav`)
    buttonNav.classList.toggle(`buttontoggle`)
};

document.getElementById(`gallery`).onclick = function() {
    if (checkSecret()) {
        window.location.href = `../pages/gallery.html`
    }
};

document.getElementById(`home`).onclick = function() {
    if (checkSecret()) {
        window.location.href = `../index.html`
    } 
};

