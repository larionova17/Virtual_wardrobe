import Component from '../../views/component';

import HeaderTemplate from '../../../templates/partials/header.hbs';

class Header extends Component {
    render() {
        return new Promise(resolve => resolve(HeaderTemplate()));
    }

    afterRender() {
        const login = localStorage.getItem('userName');
        const i = document.getElementsByClassName('icon icon-user')[0];

        if (!!login) {
            i.textContent = login;
        }
    }
}

export default Header;