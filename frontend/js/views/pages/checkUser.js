import Component from '../component';

import Images from '../../models/images';

import CheckUserTemplate from '../../../templates/pages/checkUser.hbs';

class CheckUser extends Component {
	constructor() {
	    super();
		
        this.model = new Images();
    }

    render() {
        return new Promise(resolve => resolve(CheckUserTemplate()));
    }

    afterRender() {
        const submit = document.querySelector('.button-submit'),
            login = document.querySelector('input[type=text]'),
            password = document.querySelector('input[type=password]');

        let icon = document.querySelector('.icon.icon-user').textContent,
            header = document.querySelector('h1');
	
        submit.addEventListener('click', event => {
            event.preventDefault();

            const userData = 'login=' + encodeURIComponent(`${login.value}`) + '&password=' + encodeURIComponent(`${password.value}`);

            submit.disabled = (!login.value && !login.value) ? 'disabled' : false;

            if (submit.disabled === false) {
                this.checkUser(userData);
            }

            if (submit.innerHTML === 'Выйти') {
                icon = 'Войти';
                localStorage.clear();
                this.redirectToCreateImage();
            }

            submit.disabled = false;
        });

		if (icon !== 'Войти') {
            login.remove();
            password.remove();
            submit.innerHTML = 'Выйти';
            header.innerHTML = 'Покинуть личный кабинет';
        }
    }

    checkUser(userData) {
        this.model.checkUser(userData).then(data => this.checkData(data));
    }

    checkData(data) {
        if (data) {
            const i = document.getElementsByClassName('icon icon-user')[0],
                login = document.querySelector('input[type=text]').value;
            
        i.textContent = login;
        localStorage.clear();
        localStorage.setItem('userName', `${login}`);
        this.redirectToCreateImage();
        } else {
            let header = document.querySelector('h1');
            
            header.innerHTML = 'Неверный логин или пароль';
            header.className = 'red';
        }
    }

    redirectToCreateImage() {
		location.hash = '#/';
	}
}

export default CheckUser;