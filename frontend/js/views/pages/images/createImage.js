import Component from '../../component';

import Images from '../../../models/images';

import CreateImageTemplate from '../../../../templates/pages/images/createImage.hbs';

class CreateImage extends Component {
    constructor(canvas = null, prefsize = null, context = null, jcrop_api = null, crop_max_width = 200, crop_max_height = 250, shelfName, blob) {
        super();

        this.model = new Images();
        this._canvas = canvas;
        this._prefsize = prefsize;
        this._context = context;
        this._jcrop_api = jcrop_api;
        this._crop_max_height = crop_max_height;
        this._crop_max_width = crop_max_width;
        this._shelfName = shelfName;
        this._blob = blob;
    }

    render() {
        return new Promise(resolve => resolve(CreateImageTemplate()));
    }

    afterRender() {
        const itemsImage = document.getElementsByClassName('creation-image')[0],
            items = localStorage.getItem('items'),
            wardrobe = document.getElementsByClassName('wardrobe')[0];

        localStorage.setItem('wardrobe', JSON.stringify(`${wardrobe.offsetWidth}`));

        localStorage['wardrobe'] = `${wardrobe.offsetWidth}`;

        if (items !== '') {
            const images = JSON.parse(items);

            if (images !== null) {
                itemsImage.innerHTML += images;
                itemsImage.getElementsByClassName('photo clearfix')[1].remove();
                document.getElementsByClassName('trash')[1].remove();
            }
        }

        itemsImage.addEventListener('mousedown', event => {
            const target = event.target;

            if (target.tagName === 'IMG' && !document.querySelector('#form .button-edit') && target.className !=='icon') {
                this.findItem(event, itemsImage);
            }
        });

        const shelfs = JSON.parse(localStorage.getItem('shelf'));

        if (shelfs) {
            for (let shelf of shelfs) {
                this.openShelf(event = shelf, itemsImage, shelfs);
            }
        }

        document.getElementsByClassName('wardrobe')[0].addEventListener('click', event => this.openShelf(event, itemsImage));

        this.setActions(itemsImage);
    }

    setActions(itemsImage) {
        const blockButton = document.getElementsByClassName('button-image')[0];

        blockButton.addEventListener('click', event => {
            const target = event.target,
                targetClassList = target.classList;

            if (targetClassList.value === 'save-image green' && itemsImage.querySelector('.trash').nextElementSibling !== null) {
                this.saveImage(itemsImage);
            }

            if (targetClassList.value === 'my-images pink') {
                this.redirectToShowImages(itemsImage);
            }
        });

        document.getElementsByTagName('label')[0].onchange = () => this.addFile();
    }

    openShelf(event, itemsImage, shelfs) {
        let target = null;

        if (shelfs) {
            event = document.getElementsByClassName(`${event}`)[0];
            target = event;
        } else {
            target = event.target;
        }

        while (target.tagName !== 'DIV' || target.className === 'shelf-name') {
            target = target.parentNode;
        }

        const items = target.getElementsByClassName('shelf-items')[0],
            wardrobe = document.getElementsByClassName('wardrobe')[0],
            shelfList = [];

        if (target.dataset.status === 'close' && !items.children.length) {
            const targetClassList = target.className;

            this.model.getItemsList().then(image => {
                let login = document.querySelector('.icon.icon-user').textContent;
                login = (login === 'Войти') ? 'guest' : login;

                for (let img of image[login]) {
                    if (img.class === targetClassList) {
                        if (!img.src) {
                            const size = img.size;
                            const blob = new Blob([size], {type: `${img.type}`});
                            const url = URL.createObjectURL(blob);
                            const newimg = document.createElement('img');

                            newimg.onload = () => {
                                URL.revokeObjectURL(url);
                            };

                            newimg.src = url;
                            items.appendChild(newimg);
                        } else {
                            items.insertAdjacentHTML('beforeend', `<img src="${img.src}" alt="">`);
                        }
                    }
                }

                target.dataset.status = 'open';

                for (let shelf of wardrobe.children) {
                    if (shelf.dataset.status === 'open') {
                        shelfList.push(`${shelf.className}`);

                        localStorage.setItem('shelf', JSON.stringify(shelfList));
                    }
                }
            });

        } else if (target.dataset.status === 'open') {
            target.dataset.status = 'close';
            items.innerHTML = '';
            localStorage.removeItem('shelf');

            for (let shelf of wardrobe.children) {
                if (shelf.dataset.status === 'open') {
                    shelfList.push(`${shelf.className}`);

                    localStorage.setItem('shelf', JSON.stringify(shelfList));
                }
            }
        }

        itemsImage.getElementsByClassName('img');

        wardrobe.addEventListener('mousedown', event => {
            if (event.target.tagName === 'IMG' && !document.querySelector('#form .button-edit') && event.target.className !=='icon') {
                const target = event.target;

                this.findItem(target.cloneNode(), itemsImage);
            }
        });

        itemsImage.addEventListener('mousedown', event => {
            if (event.target.tagName === 'IMG' && !document.querySelector('#form .button-edit') && event.target.className !=='icon') {
                this.findItem(event, itemsImage);
            } else {
                this.openShelf(event, itemsImage);
            }
        });
    }

    findItem(event, itemsImage) {
        let target = event;

        if (target.tagName !== 'IMG') {
            target = event.target;
        }

        target.style.position = 'absolute'; // разместить на том же месте, но в абсолютных координатах
        moveAt(event);

        const icon = document.querySelector('.icon-trash'),
            container = document.getElementsByClassName('page-container')[0],
            wardrobe = document.getElementsByClassName('wardrobe')[0],
            content = document.getElementsByClassName('content-container')[0];

        function moveAt(event) {
            target.style.left = event.pageX - target.offsetWidth / 2 + 'px'; // передвинуть элемент под координаты курсора
            target.style.top = event.pageY - target.offsetHeight / 2 + 'px'; // и сдвинуть на половину ширины/высоты для центрирования
        }

        target.style.zIndex = '1000'; // показывать элемент над другими элементами

        document.onmousemove = event => { // перемещать по экрану
            moveAt(event);

            if (event.pageX >= icon.offsetLeft && event.pageX <= (icon.offsetLeft + icon.clientWidth) && event.pageY >= icon.offsetTop && event.pageY <= (icon.offsetTop + icon.clientHeight) && itemsImage.innerHTML !== '') {
                target.className = 'opacity';
            } else {
                target.className = '';
            }

            if (event.pageX <= (itemsImage.offsetLeft + itemsImage.clientWidth - 50) && event.pageX >= (wardrobe.offsetWidth + (container.offsetWidth - content.offsetWidth - container.offsetLeft * 2) + 20 + container.offsetLeft) &&
                event.pageY <= (itemsImage.offsetTop + itemsImage.clientHeight) - icon.offsetHeight / 1.5 && event.pageY >= 275) {
                itemsImage.appendChild(target); // переместим в блок, чтобы элемент был точно не внутри position:relative   
            } else {
                target.remove();
            }

            localStorage.setItem('items', JSON.stringify([`${itemsImage.innerHTML}`]));
        };

        target.onmouseup = () => { // отследить окончание переноса
            document.onmousemove = null;
            target.onmouseup = null;

            if (event.pageX >= icon.offsetLeft && event.pageX <= (icon.offsetLeft + icon.clientWidth) && event.pageY >= icon.offsetTop && event.pageY <= (icon.offsetTop + icon.clientHeight)) {
                target.remove();
                localStorage.removeItem('items');
            }
        };
    }

    saveImage(itemsImage) {
        let login = document.querySelector('.icon.icon-user').textContent;
        login = (login === 'Войти') ? 'guest' : login;

        itemsImage.getElementsByClassName('photo clearfix')[0].remove();
        document.getElementsByClassName('trash')[0].remove();

        this.model.saveImage({
            itemsImage: `${itemsImage.innerHTML}`,
            'login': `${login}`
        }).then(() => this.redirectToSaveImages());

        localStorage.removeItem('items');
        localStorage.removeItem('shelf');
    }

    addFile() {
        this.loadImage(document.getElementsByTagName('input')[0]);
    }


    loadImage(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            const self = this;

            reader.onload = function(e) {
                const image = new Image();
                image.onload = self.validateImage.bind(self, image);
                image.src = e.target.result;
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    validateImage(image) {
        if (this._canvas !== null) {
            image = new Image();
            image.onload = this.restartjcrop.bind(this, image);
            image.src = this._canvas.toDataURL('image\png');
        } else {
            this.restartjcrop(image);
        }
    }

    restartjcrop(image) {
        if (this._jcrop_api != null) {
            this._jcrop_api.destroy();
        }

        document.querySelector('.photo.clearfix').insertAdjacentHTML('afterend', '<canvas id="canvas">');
        this._canvas = document.getElementById('canvas');
        this._context = this._canvas.getContext('2d');
        this._canvas.width = image.width;
        this._canvas.height = image.height;
        this._context.drawImage(image, 0, 0);

        const form  =  document.querySelector('#form');

        if (form.firstChild.className !== 'button-edit') {
            form.insertAdjacentHTML('afterbegin', `<div class="button-edit"><button class="crop">Обрезать</button><button class="rotate">Повернуть</button>
<button class="further">Далее</button></div>`);
        }

        let jcrops_api;
        let self = this;

        $('#canvas').Jcrop({
            onSelect: this.selectcanvas.bind(this),
            onRelease: this.clearcanvas.bind(this),
            boxWidth: this._crop_max_width,
            boxHeight: this._crop_max_height
        }, function() {
            jcrops_api = this;
            self._jcrop_api = jcrops_api;
        });

        this.clearcanvas();

        this.setTasks(image);
    }

    setTasks(image) {
        const holder = document.querySelector('.jcrop-holder');

        document.querySelector('.trash').style.marginTop = `${494 - holder.offsetHeight}px`;
        holder.style.margin = '0 auto';
        holder.style.marginTop = '20px';
        holder.style.backgroundColor = 'white';

        const blockPhoto = document.querySelector('.photo.clearfix'),
            icon = document.querySelector('.icon.icon-trash');

        icon.addEventListener('click', () => this.deleteItem());

        blockPhoto.addEventListener('click', event => {
            event.preventDefault();

            const target = event.target,
                targetClassList = target.classList;

            switch (targetClassList.value) {
                case 'crop':
                    this.applyCrop(event, image);
                    break;
                case 'rotate':
                    this.applyRotate(event, image);
                    break;
                case 'further':
                    this.goFurther(event, image);
                    break;
                case 'shelf clearfix':
                    this.selectShelf(event, image);
            }

            if (targetClassList.value === 'save-file' && document.querySelector('.shelf.clearfix').innerHTML !== 'Полка') {
                this.saveFile(event);
            }
        });
    }

    clearcanvas() {
        this._prefsize = {
            x: 0,
            y: 0,
            w: this._canvas.width,
            h: this._canvas.height
        };
    }

    selectcanvas(coords) {
        this._prefsize = {
            x: Math.round(coords.x),
            y: Math.round(coords.y),
            w: Math.round(coords.w),
            h: Math.round(coords.h)
        };
    }

    dataURLtoBlob(dataURL) {
        const BASE64_MARKER = ';base64,';

        if (dataURL.indexOf(BASE64_MARKER) === -1) {
            const parts = dataURL.split(','),
                contentType = parts[0].split(':')[1],
                raw = decodeURIComponent(parts[1]);

            return new Blob([raw], {
                type: contentType
            });
        }

        const parts = dataURL.split(BASE64_MARKER),
            contentType = parts[0].split(':')[1],
            raw = window.atob(parts[1]),
            rawLength = raw.length,
            uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {
            type: contentType
        });
    }

    applyCrop(event, image) {
        event.preventDefault();


        this._canvas.width = this._prefsize.w;
        this._canvas.height = this._prefsize.h;
        this._context.drawImage(image, this._prefsize.x, this._prefsize.y, this._prefsize.w, this._prefsize.h, 0, 0, this._canvas.width, this._canvas.height);
        this.validateImage(image);
    }

    applyRotate(event, image) {
        event.preventDefault();

        this._canvas.width = image.height;
        this._canvas.height = image.width;
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.translate(image.height / 2, image.width / 2);
        this._context.rotate(Math.PI / 2);
        this._context.drawImage(image, -image.width / 2, -image.height / 2);
        this.validateImage(image);
    }

    goFurther(event) {
        event.preventDefault();

        const blob = this.dataURLtoBlob(this._canvas.toDataURL('image/png'));

        const newImg = document.createElement('img');
        const url = URL.createObjectURL(blob);

        newImg.onload = () => {
            URL.revokeObjectURL(url);
        };

        if (newImg.className !== 'new' && !!document.querySelector('.jcrop-holder')) {
            const paddingHeight = (250 - document.querySelector('.jcrop-holder').offsetHeight) / 2,
                paddingWidth = (200 - document.querySelector('.jcrop-holder').offsetWidth) / 2;

            newImg.src = url;
            newImg.style.height = '250px';
            newImg.style.width = '200px';
            newImg.style.paddingLeft = `${paddingWidth}px`;
            newImg.style.paddingRight = `${paddingWidth}px`;
            newImg.style.paddingTop = `${paddingHeight}px`;
            newImg.style.paddingBottom = `${paddingHeight}px`;
            newImg.className = 'new';

            document.querySelector('.jcrop-holder').remove();
            document.querySelector('.creation-image').insertBefore(newImg, document.querySelector('.trash'));
            document.querySelector('.trash').style.marginTop = '260px';
            document.querySelector('#form .button-edit').remove();

            document.querySelector('#form').insertAdjacentHTML('afterbegin', '<div class="button-edit"><div class="category-file"><button class="shelf clearfix">Полка</button></div><div><button class="save-file">Сохранить</button></div></div>');
        }

        this._blob = blob;

        return blob;
    }

    selectShelf(event) {
        event.preventDefault(event);

        const category = document.getElementsByClassName('category-file')[0];

        if (category.lastChild.tagName !== 'DIV') {
            category.insertAdjacentHTML('beforeend', '<div>Верхняя одежда</div><div>Кофты</div><div>Пиджаки</div><div>Рубашки</div><div>Блузы</div><div>Футболки</div><div>Брюки</div><div>Джинсы</div><div>Платья</div><div>Шорты</div><div>Юбки</div><div>Обувь</div><div>Сумки</div><div>Аксессуары</div>');
        }

        category.onclick = (event) => {
            const target = event.target,
                listDiv = category.getElementsByTagName('div');

            for (let div of listDiv) {
                if (div.className) {
                    div.className = '';
                }
            }

            if (target.tagName !== 'BUTTON') {
                target.className = 'event-category';

                const wardrobe = document.querySelector('.wardrobe'),
                    listA = wardrobe.getElementsByTagName('a');

                let name;

                for (let a of listA) {
                    if (a.textContent === target.textContent) {
                        name = a.parentNode.parentNode;
                    }
                }

                this._shelfName = name.className;

                document.querySelector('.shelf').innerHTML = `${target.textContent}`;
            }

            document.body.addEventListener('click', (event) => this.closeCategory(event, category, listDiv));
        };
    }

    closeCategory(event, category, listDiv) {
        const target = event.target;

        if (target.tagName !== 'BUTTON' && target.className !== 'event-category' && !!category.innerHTML) {
            for (let i = listDiv.length; i--;) {
                listDiv[i].remove();
            }
        }
    }

    saveFile(event) {
        event.preventDefault(event);

        localStorage.removeItem('itemsList');

        const data = {},
            form = new FormData();

        let login = document.querySelector('.icon.icon-user').textContent;

        login = (login === 'Войти') ? 'guest' : login;

        data.size = this._blob.size;
        data.type = this._blob.type;
        data.class = this._shelfName;
        data.login = login;

        form.append('FileSize', data.size);
        form.append('FileType', data.type);
        form.append('Classdata', data.class);
        form.append('Classdata', data.login);

        this.model.sendFile(data).then(() => this.deleteItem());
    }

    deleteItem() {
        const trash = document.querySelector('.trash'),
            itemsImage = document.querySelector('.creation-image');

        if (!!document.querySelector('.jcrop-holder')) {
            document.querySelector('.jcrop-holder').remove();
        }

        if (!!itemsImage.getElementsByTagName('img')[0]) {
            itemsImage.getElementsByTagName('img')[0].remove();
        }

        if (!!document.querySelector('#form .button-edit')) {
            document.querySelector('#form .button-edit').remove();
            trash.style.marginTop = '514px';
            window.location.reload();
        }
    }


    redirectToSaveImages() {
        location.hash = '#/save';
    }

    redirectToShowImages() {
        location.hash = '#/images';
    }
}

export default CreateImage;