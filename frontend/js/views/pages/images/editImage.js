import Component from '../../component';

import Images from '../../../models/images';

class EditImage extends Component {
	constructor() {
	    super();
		
        this.model = new Images();
    }

    render() {
        return new Promise(resolve => {
			this.model.getImageId(this.request.id).then(image => {
				this.images = image;

				resolve(`${this.getStyleHTML()}`);
			});
		});
    }

    afterRender() {
        const data = localStorage.getItem('data'),
            calendarBtn = document.querySelector('.calendar.pink');

        if (data !== null) {
            calendarBtn.innerHTML = JSON.parse(data);
        }

        const category = localStorage.getItem('category'),
            categoryBtn = document.querySelector('.event.pink');

        if (category !== null) {
            categoryBtn.innerHTML = JSON.parse(category);
        }

        const headerTitle = document.querySelector('.header-title'),
            headerLogin = document.querySelector('.header-login');

        headerTitle.onclick = () => {
            localStorage.removeItem('data');
            localStorage.removeItem('category');
        };

        headerLogin.onclick = () => {
            localStorage.removeItem('data');
            localStorage.removeItem('category');
        };

        this.setActions(calendarBtn, categoryBtn);
	}

    getStyleHTML() {    
		const content = document.getElementsByClassName('content-container')[0];
				
		content.innerHTML = `<div class="block-image">${this.images.styleImage}</div>`;

		const blockImage = document.getElementsByClassName('block-image')[0],
            item = blockImage.getElementsByTagName('img'),
            wardrobe = JSON.parse(localStorage.getItem('wardrobe'));

		for (let i = 0; i < item.length; i++) {
			item[i].style.zIndex = '-1';
            item[i].style.left = `${item[i].offsetLeft - wardrobe + 280}px`;
		}

        content.insertAdjacentHTML('afterbegin', `<div class="block-button"><button class="back green">Назад</button><div><button class="calendar pink">${this.images.data}</button>
<div class="block-calendar"></div></div><div class = "category"><button class="event pink">${this.images.category}</button></div><button class="delete-image">Удалить</button></div>`);
        
        return content.innerHTML;
    }

    setActions(calendarBtn, categoryBtn) {
        const blockButton = document.querySelector('.block-button'),
            styleImage = document.querySelector('.block-image');

        blockButton.addEventListener('click', event => {
            const target = event.target,
                targetClassList = target.classList;

            if (targetClassList.value === 'back green') {
                this.editImage(styleImage, calendarBtn, categoryBtn);
            }
        
            if (targetClassList.value === 'calendar pink') {
                this.openCalendar('calendar', new Date().getFullYear(), new Date().getMonth());
            }
        
            if (targetClassList.value === 'event pink') {
                this.selectCategory(categoryBtn);
            }
    
            if (targetClassList.value === 'delete-image') {
                this.deleteImage(this.request.id);
            }
        });
    }

    openCalendar(id, year, month) {
		const Dlast = new Date(year, month + 1,0).getDate(),
			D = new Date(year, month, Dlast),
			DNlast = new Date(D.getFullYear(), D.getMonth(), Dlast).getDay(),
			DNfirst = new Date(D.getFullYear(), D.getMonth(), 1).getDay(),
			months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			divCalendar = document.getElementsByClassName('block-calendar')[0];

		let calendar = '<tr>';

		divCalendar.innerHTML = '<div class="div"><table id="calendar" border="0" cellspacing="0" cellpadding="1"><thead><tr><td><b>‹</b><td colspan="5"><td><b>›</b><tr><td>Пн<td>Вт<td>Ср<td>Чт<td>Пт<td>Сб<td>Вс</thead><tbody></tbody></table></div>';

		if (DNfirst !== 0) {
		    for (let i = 1; i < DNfirst; i++) {
                calendar += '<td>';
			}
		} else {
			for (let i = 0; i < 6; i++) {
				calendar += '<td>';
			}
        }

		for (let i = 1; i <= Dlast; i++) {
			if (i === new Date().getDate() && D.getFullYear() === new Date().getFullYear() && D.getMonth() === new Date().getMonth()) {
				calendar += `<td class="today"> ${i}`;
			} else {
				calendar += `<td> ${i}`;
			}

			if (new Date(D.getFullYear(),D.getMonth(),i).getDay() === 0) {
				calendar += '<tr>';
			}
		}

		for (let i = DNlast; i < 7; i++) {
			calendar += '<td>';
		}

		document.querySelector('#'+id+' tbody').innerHTML = calendar;
		document.querySelector('#'+id+' thead td:nth-child(2)').innerHTML = months[D.getMonth()] +' '+ D.getFullYear();
		document.querySelector('#'+id+' thead td:nth-child(2)').dataset.month = `${D.getMonth()}`;
		document.querySelector('#'+id+' thead td:nth-child(2)').dataset.year = `${D.getFullYear()}`;

		if (document.querySelectorAll('#'+id+' tbody tr').length < 6) {  // чтобы при перелистывании месяцев не "подпрыгивала" вся страница, добавляется ряд пустых клеток. Итог: всегда 6 строк для цифр
			document.querySelector('#'+id+' tbody').innerHTML += '<tr><td> <td> <td> <td> <td> <td> <td> ';
		}

		let data = `0${document.querySelector('#'+id+' thead td:nth-child(2)').dataset.month}.${document.querySelector('#'+id+' thead td:nth-child(2)').dataset.year}`;

		this.setCalendar(data);
	}

	setCalendar(data) {
		const previousMonth = document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(1)'),
			nextMonth = document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(3)'),
			tbody = document.querySelector('#calendar tbody');

		tbody.onclick = event => {
			const target = event.target,
				tdTbody = tbody.getElementsByTagName('td');

			for (let td of tdTbody) {
				if (td.className && target.innerHTML !=='' && target.innerHTML !== '&nbsp;') {
					td.className = '';
				}
			}

			if (target.innerHTML !== '' && target.innerHTML !== '&nbsp;') {
                target.className = 'today day';

                const calendarBtn = document.querySelector('.calendar.pink'),
                    saveData = `${target.innerHTML}.${data}`;

                calendarBtn.innerHTML = `${saveData}`;
                localStorage.setItem('data', JSON.stringify(`${saveData}`));
			}
		};

		const content = document.getElementsByClassName('content-container')[0],
			divCalendar = document.getElementsByClassName('div')[0];

		if (!!divCalendar.innerHTML) {
			content.addEventListener('click', event => this.closeCalendar(event, divCalendar));
		}

        const td = document.querySelector('#calendar thead td:nth-child(2)');

        previousMonth.addEventListener('click', () => {
            this.openCalendar('calendar', td.dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month)-1);
        });

        nextMonth.addEventListener('click', () =>
            this.openCalendar('calendar', td.dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month)+1)
        );
	}

	closeCalendar(event, divCalendar) {
		const target = event.target;

		if (target.tagName !== 'BUTTON' && target.tagName !== 'TD' && target.tagName !== 'B' && !!divCalendar.innerHTML) {
			divCalendar.remove();
		}
	}


	selectCategory(categoryBtn) {
		const category = document.getElementsByClassName('category')[0];

		if (category.lastChild.nodeName !== 'DIV') {
			category.insertAdjacentHTML('beforeend', '<div>Работа</div><div>Прогулка</div><div>Вечеринка</div><div>Свидание</div><div>Путешествие</div><div>Спорт</div>');
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

                categoryBtn.innerHTML = `${target.textContent}`;
                localStorage.setItem('category', JSON.stringify(`${target.textContent}`));
			}

			document.body.addEventListener('click', (event) => this.closeCategory(event, category, listDiv));
		};
	}

	closeCategory(event, category, listDiv) {
		const target = event.target;

		if (target.tagName !== 'BUTTON' && target.className !== 'event-category' && !!category.innerHTML) {
			for (let i = listDiv.length; i--; ) {
				listDiv[i].remove();
			}
		}
	}

    redirectToShowImages() {
        location.hash = '#/images';
    }
    
    editImage(styleImage, calendarBtn, categoryBtn) {
        this.model.editImage({styleImage: `${styleImage.innerHTML}`, data: `${calendarBtn.innerHTML}`, category: `${categoryBtn.innerHTML}`}, this.request.id).then(() => this.redirectToShowImages());
    }   

    deleteImage(id) {
        this.model.deleteImage(id).then(() => this.redirectToShowImages());
    }
}

export default EditImage;