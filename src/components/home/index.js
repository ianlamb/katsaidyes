import { h, Component } from 'preact';
import style from './style.less';

export default class Home extends Component {
	constructor() {
        super();

        this.timeline = {
			sections: [
				{
					id: 'first-date',
					title: 'The Couple',
					description: 'Bacon ipsum dolor amet fatback tail pancetta bresaola tenderloin pig. Pork loin andouille ham hock venison rump, spare ribs bresaola sausage shank ribeye tri-tip pastrami pork kielbasa.'
				},
				{
					id: 'proposal',
					title: 'The Proposal',
					description: 'Strip steak corned beef leberkas drumstick jerky tri-tip ham salami burgdoggen chuck. Kielbasa ham turkey bacon pork loin landjaeger t-bone.'
				},
				{
					id: 'wedding',
					title: 'The Wedding',
					description: 'Biltong chuck ground round, pastrami swine alcatra meatball. Cow sausage pork chop, sirloin bresaola leberkas swine picanha boudin pork t-bone.'
				},
				{
					id: 'after-party',
					title: 'The After Party',
					description: 'Pork loin andouille ham hock venison rump, spare ribs bresaola sausage shank ribeye tri-tip pastrami pork kielbasa.'
				}
			],
			navItems: [
				{
					href: '#first-date',
					title: 'History',
					date: 'July 2<sup>nd</sup>, 2014'
				},
				{
					href: '#proposal',
					title: 'Proposal',
					date: 'Nov 25<sup>th</sup>, 2016'
				},
				{
					href: '#wedding',
					title: 'Wedding',
					date: 'Dec 23<sup>rd</sup>, 2017'
				},
				{
					href: '#after-party',
					title: 'Party',
					date: 'Jan 31<sup>st</sup>, 2018'
				}
			]
		};
    }

	componentDidUpdate() {
		var dividers = document.querySelectorAll('.' + style.navDivider);

		setTimeout(function() {
			dividers[0].classList.add(style.complete);
		}, 500);
		setTimeout(function() {
			dividers[1].classList.add(style.active);
		}, 2000);


		// reset hash on page refresh
		window.location.hash = 'wedding';

		function getHash(url) {
			var tokens = url.split('#');
			return tokens.length > 1 ? tokens[1] : null;
		}

		window.addEventListener('hashchange', function(e) {
			var oldHash = getHash(e.oldURL);
			var newHash = getHash(e.newURL);
			var oldContent = document.querySelector('.' + style.section + '.' + style.active);
			var newContent = document.getElementById(newHash);
			
			oldContent.classList.remove(style.active);
			newContent.classList.add(style.active);
		});

	}

	render() {
		let sectionList = this.timeline.sections.map((section) => {
			return (
				<section class={style.section} id={section.id}>
					<div class={style.content}>
						<h2>{section.title}</h2>
						<p>{section.description}</p>
					</div>
				</section>
			)
		})

		let navItems = this.timeline.navItems.map((navItem) => {
			return (
				<div class={style.navItemWrapper}>
					<div class={style.navItem}>
						<a href={navItem.href} class={style.navLink}></a>
						<div class={style.navTitle}>{navItem.title}</div>
						<div class={style.navDate} dangerouslySetInnerHTML={{__html: navItem.date}} />
					</div>

					<div class={style.navDivider}></div>
				</div>
			)
		})

		return (
			<div class={style.timeline}>
				{sectionList}
				<nav class={style.nav}>
					{navItems}
				</nav>
			</div>
		);
	}
}