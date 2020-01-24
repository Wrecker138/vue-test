'use strict';

$(function() {
	stickyFooter();

	$(window).on('resize', stickyFooter);

});

// Функции
// Прижимаем подвал к низу экрана
function stickyFooter() {
	var $footer = $('.footer');
	$footer.siblings('.spacer').remove();
	var contentHeight = $('body').height(),
		windowHeight = $(window).height();
	if(contentHeight < windowHeight) {
		$footer.before('<div class="spacer" style="height: ' + (windowHeight - contentHeight) + 'px;"></div>');
	}
}

// Находим ширину скроллбара страницы
function findScrollWidth() {
	var div = document.createElement('div');
	div.style.overflowY = 'scroll';
	div.style.width =  '50px';
	div.style.height = '50px';
	div.style.visibility = 'hidden';
	document.body.appendChild(div);
	scrollWidth = div.offsetWidth - div.clientWidth;
	document.body.removeChild(div);
	return scrollWidth
}

// растянутость полей с текстом
autosize(document.querySelectorAll('textarea'))

let app = new Vue({
	el: '#app',
	data:{
		table:[],
		infoData:{

		}
	},
	mounted() {
		if (localStorage.getItem('table')) {
			try {
			  this.table = JSON.parse(localStorage.getItem('table'));
			} catch(e) {
			  localStorage.removeItem('table');
			}
		  }
	},
	methods:{
		addRow(submitEvent) {

			let self = this,
				formData = new FormData(submitEvent.target);

			this.table.push({
				name: self.validateElement(formData.get('name')),
				address: self.validateElement(formData.get('address')),
				ogrn: self.validateElement(formData.get('ogrn')),
				inn: self.validateElement(formData.get('inn')),
				date: self.validateElement(formData.get('date')),
			})

			this.saveOurTable();
			this.resetForm(submitEvent.target);

		},

		resetForm(form) {
			$(form).find('input').val('')
		},

		deleteRow(index) {
			this.table.splice(index, 1);
			this.saveOurTable();
		},
		validateElement(value) {
			if (value === '' || value === null || value === undefined) return '-'
			else return value
		},

		saveOurTable() {
			const parsedTable = JSON.stringify(this.table);
			localStorage.setItem('table', parsedTable);
		},
		loadInfo() {
			axios
				.post('https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party',{ "query": "7707083893" },{
					headers:{
						'Content-Type': 'application/json; charset=UTF-8',
						'Accept': 'application/json',
    					'Authorization': 'Token e42d709944d8cd9282bc1d2cddb28215aa00f865',
    					'X-Secret': '5c93019dc207a5832f05d93ae1c3cb6d2732423a'
					},
				})
				.then(response => {
					this.infoData = response.data.suggestions
					this.renderInfo();
					this.saveOurTable();
				})
				.catch(error => {
					console.log(error.response)
				})
		},

		renderInfo() {
			let self = this;
			for( let item in this.infoData) {
				self.table.push({
					name: self.validateElement(self.infoData[item].data.name.short),
					address: self.validateElement(self.infoData[item].data.address.value),
					ogrn: self.validateElement(self.infoData[item].data.ogrn),
					inn: self.validateElement(self.infoData[item].data.inn),
					date: self.validateElement(self.infoData[item].data.ogrn_date),
				})
			}
		}
	},
})