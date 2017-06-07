import { h, Component } from 'preact';
import style from './style.less';

export class RsvpModal extends Component {
	constructor() {
        super();

        this.state = {};

		this.onSubmit = this.onSubmit.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
    }

	onSubmit(event) {
		event.preventDefault();

		const url = '/api/rsvp';
		let data = JSON.stringify(this.state);
		let http = new XMLHttpRequest();
		http.open('POST', url, true);

		http.setRequestHeader('Content-type', 'application/json');

		http.onreadystatechange = function() {
			if (http.readyState == 4) {
				console.log(http.responseText);
				switch(http.status) {
					case 200:
						console.log('OK');
						break;
					case 400:
						console.warn('Bad Request');
						break;
					case 403:
						console.warn('Forbidden');
						break;
					case 418:
						console.warn('I\'m a teapot')
						break;
					default:
						break;
				}
			}
		}
		http.send(data);
	}

	onInputChange(event) {
		let input = event.target;
		let name = input.name;
		let value = input.value;
		if (input.type === 'checkbox') {
			value = input.checked ? value : 0;
		}
		this.setState({ [name]: value });
	}

	render() {
		return (
			<div class={style.rsvpModal + ' ' + (this.props.show ? '' : style.hide)}>
				<h2>RSVP</h2>
				<form onSubmit={this.onSubmit} id='rsvpForm'>
					<div class={style.formGroup}>
						<label for='secret'>What city did Ian and Kat move to last year?</label>
						<input type='text' name='secret' id='secret' value={this.state.secret} onChange={this.onInputChange} />
					</div>
					<div class={style.formGroup}>
						<label for='firstName'>First Name</label>
						<input type='text' name='firstName' id='firstName' value={this.state.firstName} onChange={this.onInputChange} />
					</div>
					<div class={style.formGroup}>
						<label for='lastName'>Last Name</label>
						<input type='text' name='lastName' id='lastName' value={this.state.lastName} onChange={this.onInputChange} />
					</div>
					<div class={style.formGroup}>
						<label>Will you be attending?</label>
						<label>
							<input type='radio' name='attending' value='yes' checked={this.state.attending === 'yes'} onChange={this.onInputChange} />
							Attending
						</label>
						<label>
							<input type='radio' name='attending' value='no' checked={this.state.attending === 'no'} onChange={this.onInputChange} />
							Not attending
						</label>
					</div>
					<div class={style.formGroup}>
						<label>
							<input type='checkbox' name='extras' value='1' checked={this.state.extras} onChange={this.onInputChange} />
							Are you bringing a +1 that did not receive an invitation?
						</label>
					</div>
					<button>Confirm</button>
				</form>
			</div>
		);
	}
}

export class RsvpMask extends Component {
	render() {
		return (
			<div class={style.rsvpMask + ' ' + (this.props.show ? '' : style.hide)} onClick={this.props.onClick}></div>
		);
	}
}
