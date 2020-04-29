const a = document.getElementById('a');
const b = document.getElementById('b');
const c = document.getElementById('c');

const calcCv = (ch, co2) => {
    return Math.round((co2/45) + (ch/40)*1.6);
}

const updateResult = (el, value) => {
    el.innerText = value;
}

a.addEventListener('change', () => {
    updateResult(c, calcCv(a.value,b.value));
})
b.addEventListener('change', () => {
    updateResult(c, calcCv(a.value, b.value));
})