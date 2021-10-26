const makeGETRequest = (url) => {
	return new Promise((resolve, reject) => {
		var xhr;

		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					resolve(xhr.responseText);
				}
				else {
					reject('Error');
				}
			}
		}

		xhr.open('GET', url, true);
		xhr.send();
	})
}


const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class GoodsItem {
	constructor(product_name, price) {
		this.title = product_name;
		this.price = price;
	}
	render() {
		return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
	}
}

class GoodsList {
	constructor() {
		this.goods = [];
	}

	fetchGoods() {
		return new Promise((resolve, reject) => {
			makeGETRequest(`${API_URL}/catalogData.json`)
				.then((goods) => {
					this.goods = JSON.parse(goods);
					resolve();
				})
				.catch(reject);
		});
	}

	render() {
		let listHtml = '';
		this.goods.forEach(good => {
			const goodItem = new GoodsItem(good.product_name, good.price);
			listHtml += goodItem.render();
		});
		document.querySelector('.goods-list').innerHTML = listHtml;
	}
}

const list = new GoodsList();
list.fetchGoods().then(() => list.render());


class Basket {
	constructor() {
		this.items = [];
	}
	fetchGoods() {
		makeGETRequest(`${API_URL}/getBasket.json`)
			.then((goods) => {

				JSON.parse(goods).contents.forEach((item) => {
					let goodsItem = new GoodsItem(item.product_name, item.price);
					let basketItem = new BasketItem(goodsItem, item.quantity);
					this.items.push(basketItem);
				})
			})
	}
	addItem(goodsItem, count) {
		const newItem = new BasketItem(goodsItem, count);
		this.items.push(newItem);
	}
	removeItem(goodsItem) {
		let index = this.items.indexOf(s => s.goodItem === goodsItem);
		if (index > 1) {
			this.items.slice(index, 1);
		}
	}

	getSummCost() {
		const result = 0;
		this.items.reduce((item, index, array) => {
			result += item.goodItem.price * item.count;
		})

		return result;
	}
}

class BasketItem {
	constructor(goodsItem, quantity) {
		this.googsItem = goodsItem;
		this.quantity = quantity;
	}

	addItem() {
		this.quantity++;
	}
	removeItem() {
		this.quantity--;
	}
}

const basket = new Basket();
basket.fetchGoods();
