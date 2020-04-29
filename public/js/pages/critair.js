const critair0 = {
    name: "CRIT'air 0",
    img: "/img/critair/stamp0.jpg"
}
const critair1 = {
    name: "CRIT'air 1",
    img: "/img/critair/stamp1.jpg"
}
const critair2 = {
    name: "CRIT'air 2",
    img: "/img/critair/stamp2.jpg"
}
const critair3 = {
    name: "CRIT'air 3",
    img: "/img/critair/stamp3.jpg"
}
const critair4 = {
    name: "CRIT'air 4",
    img: "/img/critair/stamp4.jpg"
}
const critair5 = {
    name: "CRIT'air 5",
    img: "/img/critair/stamp5.jpg"
}

const critairList = {
    voiture: {
        diesel: {
            euro1: null,
            euro2: critair5,
            euro3: critair4,
            euro4: critair3,
            euro5: critair2,
            euro6: critair2,
            aucune: null
        },
        essence: {
            euro1: null,
            euro2: critair3,
            euro3: critair3,
            euro4: critair2,
            euro5: critair1,
            euro6: critair1,
            aucune: null
        },
        gaz: {
            default: critair1
        },
        hybride: {
            default: critair1
        },
        electrique: {
            default: critair0
        }
    },
    utilitaire: {
        diesel: {
            euro1: null,
            euro2: critair5,
            euro3: critair4,
            euro4: critair3,
            euro5: critair2,
            euro6: critair2,
            aucune: null
        },
        essence: {
            euro1: null,
            euro2: critair3,
            euro3: critair3,
            euro4: critair2,
            euro5: critair1,
            euro6: critair1,
            aucune: null
        },
        gaz: {
            default: critair1
        },
        hybride: {
            default: critair1
        },
        electrique: {
            default: critair0
        }
    },
    poidLourd: {
        diesel: {
            euro1: null,
            euro2: null,
            euro3: critair5,
            euro4: critair4,
            euro5: critair3,
            euro6: critair2,
            aucune: null
        },
        essence: {
            euro1: null,
            euro2: null,
            euro3: critair3,
            euro4: critair3,
            euro5: critair2,
            euro6: critair1,
            aucune: null
        },
        gaz: {
            default: critair1
        },
        hybride: {
            default: critair1
        },
        electrique: {
            default: critair0
        }
    }
}

const form = document.getElementById('critair-form')
const type = document.getElementById('type');
const energie = document.getElementById('energie');
const norme = document.getElementById('norme');
const checkBtn = document.getElementById('check-btn');
const stamp = document.getElementById('stamp');
const resultInfo = document.getElementById('result-info');

const getCritair = (type, energie, norme) => {
    if (energie === 'electrique') return critairList[type].electrique.default;
    if (energie === 'gaz') return critairList[type].gaz.default;
    if (energie === 'hybride') return critairList[type].hybride.default;
    return critairList[type][energie][norme]
}

const updateStamp = (el, url) => {
    el.setAttribute('src', url)
}

const updateResultInfo = (el, text) => {
    el.innerText = text
}

energie.addEventListener('change', e => {
    let nrg = e.target.value;
    norme.style.display = '';
    if (nrg === 'electrique' || nrg === 'gaz' || nrg === 'hybride') norme.style.display = 'none';
});

checkBtn.addEventListener('click', e => {
    const formData = new FormData(form);
    let selectedType = formData.get('type');
    let selectedEnergie = formData.get('energie');
    let selectedNorme = formData.get('norme');

    let critair = getCritair(selectedType, selectedEnergie, selectedNorme);
    if (critair !== null) {
        updateStamp(stamp, critair.img);
        updateResultInfo(resultInfo, 'Vous êtes éligible à la vignette ' + critair.name)
    } else {
        updateStamp(stamp, '');
        updateResultInfo(resultInfo, 'Vous n\'êtes pas éligible à la vignette CRIT\'air.')
    }

})