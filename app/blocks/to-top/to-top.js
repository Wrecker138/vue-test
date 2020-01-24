$(function () {

	let  isTop = document.querySelector('.to-top'),
		footer = document.querySelector('.footer'),
		btnUp = document.querySelector('.to-top__btn');

	if (!!isTop) {
		window.addEventListener('scroll', () => {
			if(window.scrollY > 1200 && window.scrollY + window.innerHeight < footer.offsetTop) {
				isTop.classList.add('visible');
				btnUp.addEventListener('click',function() {
					goingUp();
				})
			}
			else {
				isTop.classList.remove('visible');
			}
		});

	}

	function goingUp () {
		$('html,body').stop().animate({scrollTop: 0},500);

	}
});

