//STEP BY STEP FORM
let step = 0;
const addAnnonceForm = document.getElementById('addAnnonce');
const form = document.getElementsByClassName('form-step')[0];
const formStep = form.getElementsByClassName('step');
const nextStep = document.getElementById('step-next');
const previousStep = document.getElementById('step-previous');
previousStep.style.display = 'none'; //INIT
const progressStep = document.getElementById('step-progress');
const nowStep = document.getElementById('now-step');
const totalStep = document.getElementById('total-step');
nowStep.innerText = ' ' + (step + 1).toString();
totalStep.innerText = formStep.length.toString();
const fields = [
    'car-brand',
    'car-model',
    'car-details-version',
    'car-details-doors',
    'car-details-places',
    'car-details-color',
    'car-details-energy',
    'car-details-transmission',
    'car-details-cv',
    'car-details-hp',
    'car-details-productionYear',
    'car-details-km',
    'car-images',
    'content',
    'price'
];

function checkFieldStep(step) {
    const stepsFields = {
        'step-0': ['car-brand', 'car-model'],
        'step-1': ['car-details-version'],
        'step-2': ['car-details-doors', 'car-details-places', 'car-details-color'],
        'step-3': [
            'car-details-energy',
            'car-details-transmission',
            'car-details-cv',
            'car-details-hp',
            'car-details-productionYear',
            'car-details-km'
        ],
        'step-4': ['car-images'],
        'step-5': [], //opt
        'step-6': ['price'],
        'step-7': [],
    };
    let emptyFields = [];
    stepsFields[step].forEach( function (field) {
        let fieldValue = document.getElementById(field).value;
        if (fieldValue === 'null' || fieldValue.length < 1){
            emptyFields.push(field);
        }
    });
    return emptyFields;
};

function translateDictionnary(id){
    const fieldIdDictionary = {
        'car-brand' : 'Marque',
        'car-model' : 'Modèle',
        'car-details-version' : 'Version',
        'car-details-doors' : 'Portes',
        'car-details-places' : 'Places',
        'car-details-color' : 'Couleur',
        'car-details-energy' : 'Energie',
        'car-details-transmission' : 'Transmission',
        'car-details-cv' : 'Puissance(CV)',
        'car-details-hp' : 'Puissance(CH)',
        'car-details-productionYear' : 'Année de production',
        'car-details-km' : 'Kilométrage',
        'car-images' : 'Photos du véhicule',
        'content' : 'Description de l\'annonce',
        'price' : 'Prix'
    }
    return fieldIdDictionary[id];
}


nextStep.addEventListener('click', () => {
    const fieldsError = checkFieldStep('step-'+step);
    document.getElementById('fields-error').innerHTML = '';
    if (fieldsError.length > 0){
        document.getElementById('step-error').style.display = 'block';
        fieldsError.forEach( function (field) {
            let error = document.createElement('li');
            error.innerText = translateDictionnary(field);
            document.getElementById('fields-error').appendChild(error);
        })
    } else{

        if (step === 6){
            renderPreview(fields);
        }

        document.getElementById('step-error').style.display = 'none';

        document.getElementById('step-' + step).style.display = 'none';
        step++;
        document.getElementById('step-' + step).style.display = 'block';
        let completionPercentage = (step / (formStep.length - 1)) * 100;
        progressStep.getElementsByClassName('progress-bar')[0].style.width = completionPercentage + '%';

        if (step !== 0) { //First step
            previousStep.style.display = 'block';
        }

        if (step === formStep.length - 1) { //Last step
            nextStep.style.display = 'none';
        }

        nowStep.innerText = ' ' + (step + 1).toString();
    }

});
previousStep.addEventListener('click', () => {
    if (step === formStep.length - 1) { //Last step
        nextStep.style.display = 'inline-block';
    }

    document.getElementById('step-error').style.display = 'none';

    document.getElementById('step-' + step).style.display = 'none';
    step--;
    document.getElementById('step-' + step).style.display = 'block';
    let completionPercentage = (step / (formStep.length - 1)) * 100;
    progressStep.getElementsByClassName('progress-bar')[0].style.width = completionPercentage + '%';

    if (step === 0) { //First step
        previousStep.style.display = 'none';
    }

    nowStep.innerText = ' ' + (step + 1).toString();
});




//IMAGE UPLOAD
document.getElementById('car-images').addEventListener('change', () => {
    const input = document.getElementById('car-images');
    const imgContainer = document.getElementById('file-img-preview');
    imgContainer.innerHTML = '';
    let files = input.files;
    for (let index = 0; index < files.length; index++) {
        let reader = new FileReader();
        reader.readAsDataURL(files[index]);
        reader.onload = function (e) {
            let fileData = e.target.result.toString();
            let image = new Image();
            image.src = fileData;
            imgContainer.appendChild(image);
        }
    }
});

//BRAND
const modelSelect = document.getElementById('car-model')
const modelSelectWarn = document.getElementById('car-model-warn')
document.getElementById('car-brand').addEventListener('change', (e) => {
    modelSelect.innerHTML = '<option value="null">Choisissez un modèle</option>';
    if (e.target.value === 'null'){
        modelSelect.setAttribute('disabled', '');
        modelSelectWarn.style.display = 'block';
    } else{
        fetch('/api/car?sortBy=model&brand=' + e.target.value)
            .then(function (result) {
                result.json()
                    .then(function (data) {
                        modelSelect.removeAttribute('disabled');
                        modelSelectWarn.style.display = 'none';
                        data.forEach(function(car){
                            let option = document.createElement('option')
                            option.setAttribute('value', car.model)
                            option.innerText = car.model;
                            modelSelect.appendChild(option);
                        });
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            })
            .catch(function (err) {
                console.log(err);
            })
    }

});


//Form data
function getFormData(fields) {
    let formData = {};
    const form = new FormData(document.getElementById('addAnnonce'));
    fields.forEach( function(field) {
        if (field === 'car-images'){
            const input = document.getElementById(field);
            formData[field] = input.files;
        } else{
            formData[field] = form.get(field);
        }
    });
    return formData;
}

function renderPreview(fields) {
    const formData = getFormData(fields);
    fields.forEach( function (field) {
        let previewField = document.getElementById('preview-' + field);
        if (field === 'car-images'){ //exc
            let reader = new FileReader();
            reader.readAsDataURL(formData[field][0]);
            reader.onload = function (e) {
                let fileData = e.target.result.toString();
                let image = new Image();
                image.src = fileData;
                document.getElementById('preview-' + field)
                    .innerHTML = '';
                document.getElementById('preview-' + field).appendChild(image);
                document.getElementById('preview-' + field)
                    .getElementsByTagName('img')[0]
                    .classList.add('img-fluid');
            }
        } else if (field === 'car-details-color'){ //exc
            previewField.style.background = formData[field];
        } else{
            previewField.innerText = formData[field];
        }
    });
}

//get array of base64 img
function getArrayOfBase64(){
    let formData = getFormData(fields);
    let imgArray = [];
    for (let i = 0; i < formData['car-images'].length; i++) {
        formData['car-images'].item(0).arrayBuffer()
            .then(imgArrayBuffer => {
                imgArray.push('data:image/jpeg;base64,' +
                    btoa(
                        new Uint8Array(imgArrayBuffer)
                            .reduce((data,byte) => data + String.fromCharCode(byte), '')
                    ))
            })
    }
    return imgArray;
}

addAnnonceForm.addEventListener('submit', event => {
    event.preventDefault();
    let formData = getFormData(fields);
    let imgs = getArrayOfBase64();
    let headers = new Headers();
    //@todo api kay
    headers.append('Content-Type', 'application/json');
    headers.append("x-api-key", 'd60efa2cf2c8a2fc2ab5508fa859d094')
    fetch('/api/annonce', {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({
            user: '5e66e43226bd4520ccf671ba', //@todo acutal user
            content : formData['content'],
            price: formData['price'],
            images: imgs,
            car: {
                brand: formData['car-brand'],
                model: formData['car-model'],
                details: {
                    version: formData['car-details-version'],
                    color: formData['car-details-color'],
                    places: formData['car-details-places'],
                    doors: formData['car-details-doors'],
                    km: formData['car-details-km'],
                    energy: formData['car-details-energy'],
                    productionYear: formData['car-details-productionYear'],
                    transmission: formData['car-details-transmission'],
                    hp: formData['car-details-hp'],
                    cf: formData['car-details-cv'],
                }
            }
        })
    })
        .then(r => {
            if (r.status !== 200 && r.status !== 201){
                alert(r.status + ' : ' + r.statusText)
            } else{
                alert('Annonce posté')
            }
            console.log(r);

        })
        .catch(err => console.log(err));
});

