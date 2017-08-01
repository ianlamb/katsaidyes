import { h, Component } from 'preact';
import style from './style.less';
import cloneDeep from 'lodash/cloneDeep';

export class RsvpModal extends Component {
	constructor() {
        super();

        this.state = {
            message: null, // { type, text }
            secretFilled: false,
            firstNameFilled: false,
            lastNameFilled: false,
            responded: false,
            sending: false,
            form: {
                secret: '',
                firstName: '',
                lastName: '',
                attending: '',
                extras: 0,
                comments: ''
            }
        };

		this.onSubmit = this.onSubmit.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
    }

	onSubmit(event) {
		event.preventDefault();

        let stateObject;

        // validate form
        const requiredFields = ['secret', 'firstName', 'lastName', 'attending'];
        const missingFields = requiredFields.find(fieldName => !this.state.form[fieldName]);
        if (missingFields) {
            stateObject = cloneDeep(this.state);
            stateObject.message = {
                type: 'error',
                text: 'Oops, looks like we\'re missing some information. Please fill out the entire form so we know who you are :)'
            }
            this.setState(stateObject);
            return;
        }

        this.setState({ sending: true });

        // send it off!
		const url = '/api/rsvp';
		let data = JSON.stringify(this.state.form);
		let http = new XMLHttpRequest();
		http.open('POST', url, true);

		http.setRequestHeader('Content-type', 'application/json');

		http.onreadystatechange = () => {
            stateObject = cloneDeep(this.state);

			if (http.readyState == 4) {
                stateObject.sending = false;
				switch(http.status) {
					case 200:
						console.log('OK');
                        stateObject.message = {
                            type: 'info',
                            text: 'Thanks for responding! <3'
                        }
                        stateObject.responded = true;
						break;
					case 400:
						console.warn('Bad Request');
                        stateObject.message = {
                            type: 'error',
                            text: 'Oops, looks like we\'re missing some information. Please fill out the entire form so we know who you are :)'
                        }
						break;
					case 403:
						console.warn('Forbidden');
                        stateObject.message = {
                            type: 'error',
                            text: 'It seems like the answer you provided to the first question was incorrect. Please make sure you type the full name of the state (no abbreviation). If you continue getting this message contact us at ianlamb32@gmail.com'
                        }
						break;
					case 418:
						console.warn('I\'m a teapot');
                        stateObject.message = {
                            type: 'error',
                            text: 'We could not find you on the guest list. Please make sure the details you entered above are correct and try again, or contact us at ianlamb32@gmail.com'
                        }
						break;
					default:
						break;
				}
                this.setState(stateObject);
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
        let stateObject = cloneDeep(this.state);
        stateObject.form[name] = value;
        if (name === 'extras') {
            stateObject.form.extras = (value ? 1 : 0);
        }

        console.log(stateObject);
		this.setState(stateObject);
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
        let userMessage;
        if (this.state.message) {
            userMessage = (
                <div class={`${style.message} ${this.state.message.type === 'error' ? style.error : style.info}`}>
                    { this.state.message.text }
                </div>
            );
        }

        let cta;
        if (this.state.responded) {
            cta = (
                <button type='button' class={style.button} disabled={this.state.sending} onClick={this.props.closeModal}>Done</button>
            );
        } else {
            cta = (
                <button type='submit' class={style.button} disabled={this.state.sending}>Confirm</button>
            );
        }

		return (
			<div class={style.rsvpModal + ' ' + (this.props.show ? '' : style.hide)}>
                <a href='javascript:void(0)' class={style.closeModal} onClick={this.props.closeModal}>&times;</a>
				<h2>RSVP</h2>
                <p class={style.infoParagraph}>Please make individual submissions for each person that received an invitation.</p>
				<form onSubmit={this.onSubmit} id='rsvpForm'>
					<div class={`${style.formGroup} ${style.text} ${this.state.secretFilled || this.state.form.secret ? style.filled : ''}`}>
						<input type='text' name='secret' id='secret' class={style.textInput} value={this.state.form.secret} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onInputChange} />
						<label class={style.label} for='secret'><span class={style.labelContent}>Which state did Ian and Kat move to last year?</span></label>
					</div>
					<div class={`${style.formGroup} ${style.twoColumn} ${style.text} ${this.state.firstNameFilled || this.state.form.firstName ? style.filled : ''}`}>
						<input type='text' name='firstName' id='firstName' class={style.textInput} value={this.state.form.firstName} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onInputChange} />
						<label class={style.label} for='firstName'><span class={style.labelContent}>First Name</span></label>
					</div>
					<div class={`${style.formGroup} ${style.twoColumn} ${style.text} ${this.state.lastNameFilled || this.state.form.lastName ? style.filled : ''}`}>
						<input type='text' name='lastName' id='lastName' class={style.textInput} value={this.state.form.lastName} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onInputChange} />
						<label class={style.label} for='lastName'><span class={style.labelContent}>Last Name</span></label>
					</div>
					<div class={style.formGroup}>
                        <label>Will you be attending?</label>
						<label>
							<input type='radio' class={style.optionInput + ' ' + style.radio} name='attending' value='yes' checked={this.state.form.attending === 'yes'} onChange={this.onInputChange} />
							Yes
						</label>
						<label>
							<input type='radio' class={style.optionInput + ' ' + style.radio} name='attending' value='no' checked={this.state.form.attending === 'no'} onChange={this.onInputChange} />
							No
						</label>
					</div>
					<div class={`${style.formGroup} ${this.state.form.attending !== 'yes' ? style.hideOption : ''}`}>
						<label>
							<input type='checkbox' class={style.optionInput + ' ' + style.checkbox} name='extras' value='1' checked={this.state.form.extras} onChange={this.onInputChange} />
							Are you bringing a +1 that did not receive an invitation?
						</label>
					</div>
					<div class={`${style.formGroup}`}>
						<label>Comments (optional)</label>
                        <textarea name='comments' value={this.state.form.comments} onChange={this.onInputChange}></textarea>
					</div>
					{ userMessage }
                    { cta }
				</form>
			</div>
		);
	}
}

export class RsvpMask extends Component {
	render() {
		return (
			<div class={style.rsvpMask + ' ' + (this.props.show ? '' : style.hide)} onClick={this.props.closeModal}></div>
		);
	}
}
