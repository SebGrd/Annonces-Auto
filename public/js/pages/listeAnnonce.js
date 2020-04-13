//BRAND
const modelSelect = document.getElementById('model');
document.getElementById('brand').addEventListener('change', (e) => {
    modelSelect.innerHTML = '<option value="null">Choisissez un modèle</option>';
    if (e.target.value === 'null'){
        modelSelect.setAttribute('disabled', '');
    } else{
        fetch('/api/car?sortBy=model&brand=' + e.target.value)
            .then(function (result) {
                result.json()
                    .then(function (data) {
                        modelSelect.removeAttribute('disabled');
                        data.forEach(function(car){
                            let option = document.createElement('option');
                            option.setAttribute('value', car.model);
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

//Range value
document.getElementById('chevaux').addEventListener('input', (el) => {
    document.getElementById('chevaux-value').innerText = el.target.value;
});
document.getElementById('km').addEventListener('input', (el) => {
    document.getElementById('km-value').innerText = el.target.value;
});