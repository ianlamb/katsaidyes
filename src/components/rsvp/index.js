import { h, Component } from 'preact';
import style from './style.less';

export class RsvpModal extends Component {
	constructor() {
        super();

        this.state = {};

		this.onSubmit = this.onSubmit.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
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

    onFocus(event) {
        let stateProp = event.target.id + 'Filled';
        if (!this.state[stateProp]) {
            this.setState({
                [stateProp]: true
            });
        }
    }

    onBlur(event) {
        let stateProp = event.target.id + 'Filled';
        if (!this.state[event.target.id]) {
            this.setState({
                [stateProp]: false
            });
        }
    }

	render() {
		return (
			<div class={style.rsvpModal + ' ' + (this.props.show ? '' : style.hide)}>
				<h2>RSVP</h2>
				<form onSubmit={this.onSubmit} id='rsvpForm'>
					<div class={`${style.formGroup} ${style.text} ${this.state.secretFilled ? style.filled : ''}`}>
						<input type='text' name='secret' id='secret' class={style.textInput} value={this.state.secret} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onInputChange} />
						<label class={style.label} for='secret'><span class={style.labelContent}>What city did Ian and Kat move to last year?</span></label>
					</div>
					<div class={`${style.formGroup} ${style.text} ${this.state.firstNameFilled ? style.filled : ''}`}>
						<input type='text' name='firstName' id='firstName' class={style.textInput} value={this.state.firstName} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onInputChange} />
						<label class={style.label} for='firstName'><span class={style.labelContent}>First Name</span></label>
					</div>
					<div class={`${style.formGroup} ${style.text} ${this.state.lastNameFilled ? style.filled : ''}`}>
						<input type='text' name='lastName' id='lastName' class={style.textInput} value={this.state.lastName} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onInputChange} />
						<label class={style.label} for='lastName'><span class={style.labelContent}>Last Name</span></label>
					</div>
					<div class={style.formGroup}>
                        <label>Will you be attending?</label>
                        <br />
						<label>
							<input type='radio' class={style.optionInput + ' ' + style.radio} name='attending' value='yes' checked={this.state.attending === 'yes'} onChange={this.onInputChange} />
							Yes
						</label>
						<label>
							<input type='radio' class={style.optionInput + ' ' + style.radio} name='attending' value='no' checked={this.state.attending === 'no'} onChange={this.onInputChange} />
							No
						</label>
					</div>
					<div class={style.formGroup}>
						<label>
							<input type='checkbox' class={style.optionInput + ' ' + style.checkbox} name='extras' value='1' checked={this.state.extras} onChange={this.onInputChange} />
							Are you bringing a +1 that did not receive an invitation?
						</label>
					</div>
					<button type='button' class={style.button}>Confirm</button>
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
