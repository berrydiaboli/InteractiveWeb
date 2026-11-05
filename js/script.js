
// Hero Event that changes the number 4 to a character joke

const heroEvent = document.getElementById(`heroEvent`);

if (Math.floor(Math.random() * 10) >= 9) {
    heroEvent.innerHTML = `<img class='four' src='../images/four.webp'>`;
}
else {
    heroEvent.innerHTML = `<span style="color: #307ccf">4</span>`;
}

// Toggle NavButton that makes the nav go away

var buttonNav = document.getElementById(`behindNavButton`);

buttonNav.onclick = function() {
    document.getElementById(`bodyNav`).classList.toggle(`toggleNav`);
    buttonNav.classList.toggle(`buttontoggle`);
};

// The evil secret to check once a button is clicked if it takes to them to the website or the backrooms /j

function checkSecret() {
    if (Math.floor(Math.random() * 25) > 22) {
        window.location.href = `../SECRET.html`;
        return false;
    }
    else {
        return true;
    }
}

document.getElementById(`gallery`).onclick = function() {
    if (checkSecret()) {
        window.location.href = `../pages/gallery.html`;
    }
};

document.getElementById(`about`).onclick = function() {
    if (checkSecret()) {
        window.location.href = `../pages/about.html`;
    }
};

document.getElementById(`home`).onclick = function() {
    if (checkSecret()) {
        window.location.href = `../index.html`;
    } 
};

// A random fun fact about plants! Thanks ToxisBoxis and Adrian122 for some funny ideas

const randomFact = [
    `<br>butterworts are omnivorous plants they can feed on insects and plant matter`,
    `<br>The difference between prickles thorns and spikes is that prickles are extensions of the outer epidermal tissue, thorns are shoots grown from the axial node and spikes are heavily modified leaves`,
    `<br><span style="color: red; font-size:22px">4 Minutes remain<span>`,
    `<br><img class='lips' src='../images/lips.png'>`
];

document.getElementById(`randomFact`).innerHTML = `<span style="font-size: 22px">PLANT FACT!</span>` + randomFact[Math.floor(Math.random() * randomFact.length)];