const registerSubmit = document.getElementById('register-submit');
const newPass = document.getElementById('password');
const checkPass = document.getElementById('check-password');
const registerForm = document.getElementById('register');
const registerMail = document.getElementById('register-mail');
const registerError = document.getElementById('register-error');

const checkPassword = (first, second) => {
    return first === second;
};

const checkFormCompletion = (form) => {
    let inputNodeList = form.querySelectorAll('input');
    let inputArray = Array.prototype.slice.call(inputNodeList);
    return inputArray.every(field => field.value.length > 0)
};

const checkEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

//Password err
checkPass.addEventListener('change', (e) => {
    if (checkPassword(e.target.value, newPass.value)){ //if pass same
        e.target.style.border = '1px solid green';
        registerError.innerText = ''
    } else {
        e.target.style.border = '1px solid red';
    }
});

registerSubmit.addEventListener('click', e => {
    e.preventDefault();

    if (checkFormCompletion(registerForm) && checkEmail(registerMail.value)){
        registerError.innerText = '';

        if (checkPassword(checkPass.value, newPass.value)) { //if pass same
            let formData = new FormData(registerForm);
            let newUser = {};
            formData.forEach( (value, key) => {
                if (key !== 'password-check') {
                    newUser[key] = value;
                }
            });

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            fetch('/api/user', {
                headers: headers,
                method: 'POST',
                body: JSON.stringify(newUser)
            })
                .then(data => {
                    console.log(data);
                    window.location.href = '/';
                })
                .catch(err => console.log(err))
                .then(data => console.log(data))



        } else {
            registerError.innerText = 'Les mots de passe ne correspondent pas.'
        }

    } else {
        registerError.innerText = 'Tous les champs ne sont pas correctement remplis.'
    }


});