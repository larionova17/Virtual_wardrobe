class Images {
	getItemsList() {
		let itemsList = localStorage.getItem('itemsList');

		return new Promise(resolve => {
			if (itemsList) {
				resolve(JSON.parse(itemsList));
			} else {
                const xhr = new XMLHttpRequest();

                xhr.open('GET', 'http://localhost:3000/api', true);

                xhr.onload = () => {
                    try {
                        resolve(JSON.parse(xhr.response));
                        localStorage.setItem('itemsList', xhr.response);
                    } catch (ex) {
                        alert('Извините, возникла ошибка, попробуйте ещё раз!');
                    }
                };

                xhr.send();
            }
		});	
	} 
    
	saveImage(itemsImage) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();
	
			xhr.open('POST', 'http://localhost:3000/api', true);
			xhr.setRequestHeader('Content-Type', 'application/json');
	
			xhr.onload = () => resolve();
		
			xhr.send(JSON.stringify(itemsImage));
		});
	}
	
	getImage() {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();
			
			xhr.open('GET', 'http://localhost:3000/api/save', true);

			xhr.onload = () => {
                try {
                    resolve(JSON.parse(xhr.response));
                } catch (ex) {
                    alert('Извините, возникла ошибка, попробуйте ещё раз!');
                }
            };

            xhr.send();
		});	
	} 
	
	addImage(itemsImage) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();
	
			xhr.open('PUT', 'http://localhost:3000/api/save', true);
			xhr.setRequestHeader('Content-Type', 'application/json');
	
			xhr.onload = () => resolve();
		
			xhr.send(JSON.stringify(itemsImage));
		});
	}

	getItems() {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();
			
			xhr.open('GET', 'http://localhost:3000/api/images', true);

            xhr.onload = () => {
                try {
                    resolve(JSON.parse(xhr.response));
                } catch (ex) {
                    alert('Извините, возникла ошибка, попробуйте ещё раз!');
                }
            };

			xhr.send();
		});		
	}

	getImageId(id) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();
	
			xhr.open('GET', `http://localhost:3000/api/images/${id}`, true);

            xhr.onload = () => {
                try {
                    resolve(JSON.parse(xhr.response));
                } catch (ex) {
                    alert('Извините, возникла ошибка, попробуйте ещё раз!');
                }
            };
		
			xhr.send();
		});
	}

	editImage(updatedImage, id) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();
	
			xhr.open('PUT', `http://localhost:3000/api/images/${id}`, true);
			xhr.setRequestHeader('Content-Type', 'application/json');
	
			xhr.onload = () => resolve();
			
			xhr.send(JSON.stringify(updatedImage));
		});
	}

	deleteImage(id) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();
				
			xhr.open('DELETE', `http://localhost:3000/api/images/${id}`, true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			
			xhr.onload = () => resolve();
				
			xhr.send();
		});
	}

	sendFile(data) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();
				
			xhr.open('PUT', 'http://localhost:3000/api', true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			
			xhr.onload = () => resolve();
				
			xhr.send(JSON.stringify(data));
		});
	}

	checkUser(userData) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();
				
			xhr.open('POST', 'http://localhost:3000/api/login', true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            xhr.onload = () => {
                try {
                    resolve(JSON.parse(xhr.response));
                } catch (ex) {
                    alert('Извините, возникла ошибка, попробуйте ещё раз!');
                }
            };
				
			xhr.send(userData);
		});
	}
}

export default Images;