const newPass = document.getElementById('password');
const checkPass = document.getElementById('check-password');
const registerForm = document.getElementById('register');
const registerMail = document.getElementById('register-mail');
const registerError = document.getElementById('register-error');
const registerSubmit = document.getElementById('register-submit');
const loginForm = document.getElementById('login');
const loginMail = document.getElementById('login-mail');
const loginError = document.getElementById('login-error');
const loginSubmit = document.getElementById('login-submit');

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
//Register Sumbit
registerForm.addEventListener('submit', e => {
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
                    if (data.status === 500){
                        data.json().then(res => {
                            if (res.code === 11000){
                                registerError.innerText = 'Le nom d\'utilisateur ou l\'email est déjà utilisé.'
                            } else {
                                registerError.innerText = 'Une erreur s\'est produite lors de la création du compte.'
                            }
                        })
                    } else {
                        data.json().then(res => {
                            alert('Compte créé')//@todo autoconnect avec le token
                            // window.location.href = '/';
                        })
                    }

                })
                .catch(err => console.log(err))
        } else {
            registerError.innerText = 'Les mots de passe ne correspondent pas.'
        }
    } else {
        registerError.innerText = 'Tous les champs ne sont pas correctement remplis.'
    }
});
