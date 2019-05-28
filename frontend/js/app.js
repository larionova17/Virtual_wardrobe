import './Jcrop/jquery.Jcrop';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;

import '../styles/app';

import Utils from './helpers/utils';

import Header from './views/partials/header';
import Footer from './views/partials/footer';

import Error404 from './views/pages/error404';
import CheckUser from './views/pages/checkUser';

import CreateImage from './views/pages/images/createImage';
import SaveImage from './views/pages/images/saveImage';
import ShowImages from './views/pages/images/ShowImages';
import EditImage from './views/pages/images/editImage';

const Routes = {
    '/': CreateImage,
    '/login': CheckUser,
    '/save': SaveImage,
    '/images': ShowImages,
    '/images/:id': EditImage
};

function router() {
    const headerContainer = document.getElementsByClassName('header-container')[0],
        contentContainer = document.getElementsByClassName('content-container')[0],
        footerContainer = document.getElementsByClassName('footer-container')[0],
        header = new Header(),
        footer = new Footer();

    header.render().then(html => {
        headerContainer.innerHTML = html;
        header.afterRender();
    });

    const request = Utils.parseRequestURL(),
        parsedURL = `/${request.resource || ''}${request.id ? '/:id' : ''}`,
        page = Routes[parsedURL] ? new Routes[parsedURL]() : new Error404();

    page.getData().then(data => {
        page.render(data).then(html => {
            contentContainer.innerHTML = html;
            page.afterRender();
        });
    });

    footer.render().then(html => {
        footerContainer.innerHTML = html;
        footer.afterRender();
    });
}

module.hot ? module.hot.accept(router()) : window.addEventListener('load', router);
window.addEventListener('hashchange', router);