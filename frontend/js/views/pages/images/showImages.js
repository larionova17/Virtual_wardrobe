import Component from '../../component.js';

import Images from '../../../models/images.js';

class ShowImages extends Component {
    constructor() {
        super();

        this.model = new Images();
    }

    render() {
        return new Promise(resolve => {
			this.model.getItems().then(images => { 
				let login = document.querySelector('.icon.icon-user').textContent;
				login = (login === 'Войти') ? 'guest' : login;
					
				for (let image in images) {
                    if (image === login && images.hasOwnProperty(image)) {
                        this.images = images[image];
                    }
                }

				resolve(`${this.getStyleHTML()}`);
			});
		});
	}

	afterRender() {
		this.setActions();
    }
	
	setActions() {
		const listImages = document.getElementsByClassName('block-images')[0];

		listImages.addEventListener('click', (event) => this.findImage(event));
	}

    getStyleHTML() {    
		const content = document.getElementsByClassName('content-container')[0];

		content.innerHTML = '<div class="block-images"></div>';
		
		const blockImages = document.getElementsByClassName('block-images')[0];

		if (!!this.images) {
			for (let i = 0; i < this.images.length; i++) {
				blockImages.innerHTML += `<a class = "block-items" data-id="${this.images[i].id}">${this.images[i].styleImage}</a>`;

                const blockItems = document.getElementsByClassName('block-items')[i],
                    lisItems = blockItems.getElementsByTagName('img'),
                    wardrobe = JSON.parse(localStorage.getItem('wardrobe')),
                    arrItem = [];

                for (let item of lisItems) {
                    arrItem.push(item);
                }

                arrItem.sort((a,b) => {
                    if (a.offsetLeft > b.offsetLeft) {
                        return 1;
                    }

                    return -1;
                });

                arrItem.forEach(item => item.style.left = `${(item.offsetLeft - wardrobe +200)}px`);
			}
		}

		return content.innerHTML;
	}

	findImage(event) {
		const target = event.target;

		this.redirectToEditImage(target.dataset.id);
	}

    redirectToEditImage(id) {
        location.hash = `#/images/${id}`;
    }
}

export default ShowImages;