import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.less';

export default class Header extends Component {
	render() {
		return (
			<header class={style.header}>
				<div class={style.date}>December 23rd, 2017</div>
				<div class={style.title}>KAT &amp; IAN</div>
				<div class={style.rsvp}>
					<button class={style.rsvpBtn}>RSVP</button>
				</div>
			</header>
		);
	}
}
