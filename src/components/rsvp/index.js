import { h, Component } from 'preact';
import style from './style.less';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';

const VERIFY_EMAIL_DEBOUNCE = 200;

export class RsvpModal extends Component {
	constructor() {
        super();

        this.defaultState = {
            message: null, // { type, text }
            emailVerified: false,
            emailFilled: false,
            responded: false,
            sending: false,
            form: {
                email: '',
                firstName: '',
                lastName: '',
                attending: '',
                extras: 0,
                comments: ''
            }
        };

        this.state = cloneDeep(this.defaultState);

		this.onSubmit = this.onSubmit.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.reset = this.reset.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.email) {
            // not react-like
            const emailInput = document.getElementById('email');
            emailInput.value = nextProps.email;
            let evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            emailInput.dispatchEvent(evt);

            // update state object
            let stateObject = cloneDeep(this.state);
            stateObject.form.email = nextProps.email;
            this.setState(stateObject);
        }
    }

	onSubmit(event) {
		event.preventDefault();

        let stateObject;

        // validate form
        const requiredFields = ['email', 'firstName', 'lastName', 'attending'];
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
                            text: 'Thanks for responding! Remember to make individual submissions for each person that received an invitation <3'
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
					case 404:
						console.warn('Not Found');
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
            stateObject.form.extras = parseInt(value, 10);
        }

        if (name === 'attending' && stateObject.form.attending === 'no') {
            // ensure extras is set to 0 if the user checks it then selects 'not attending'
            stateObject.form.extras = 0;
        }

        console.log(stateObject);
		this.setState(stateObject);

        if (name === 'email') {
		    this.checkEmail(value);
        }
	}

    checkEmail(email) {
        const url = '/api/guest';
        let data = JSON.stringify({ email });
        let http = new XMLHttpRequest();
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = () => {
            if (http.readyState == 4) {
                if (http.status == 200) {
                    let guest = JSON.parse(http.responseText);
                    let stateObject = cloneDeep(this.state);
                    stateObject.emailVerified = true;
                    stateObject.form.firstName = guest.firstName;
                    stateObject.form.lastName = guest.lastName;
                    this.setState(stateObject);
                } else {
                    let stateObject = cloneDeep(this.state);
                    stateObject.emailVerified = false;
                    stateObject.form.firstName = '';
                    stateObject.form.lastName = '';
                    this.setState(stateObject);
                }
			}
        }
        http.send(data);
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

    reset() {
        const stateObject = cloneDeep(this.defaultState);
        this.setState(stateObject);

        this.props.onReset();

        // not react-like
        document.getElementById('email').value = '';
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
                <div class={style.buttonGroup}>
                    <button type='button' class={style.button} onClick={this.props.closeModal}>Done</button>
                    <button type='button' class={`${style.button} ${style.secondary}`} onClick={this.reset}>Reset</button>
                </div>
            );
        } else {
            cta = (
                <div class={style.buttonGroup}>
                    <button type='submit' class={style.button} disabled={this.state.sending}>Confirm</button>
                </div>
            );
        }

		return (
			<div class={style.rsvpModal + ' ' + (this.props.show ? '' : style.hide)}>
                <div class={style.modalContent}>
                    <a href='javascript:void(0)' class={style.closeModal} onClick={this.props.closeModal}>&times;</a>
                    <h2>RSVP</h2>
                    <p class={`${style.infoParagraph} ${this.state.emailVerified ? style.hide : ''}`}>
                        Enter your email address so we can verify who you are.<br />
                        If you experience any issues with this, please contact us.
                    </p>
                    <form onSubmit={this.onSubmit} id='rsvpForm'>
                        <div class={`${style.formGroup} ${style.text} ${this.state.emailFilled || this.state.form.email ? style.filled : ''} ${this.state.emailVerified ? '' : style.unverified}`}>
                            <input
                                type='text' name='email' id='email' class={style.textInput}
                                onFocus={this.onFocus}
                                onBlur={this.onBlur}
                                onChange={debounce(this.onInputChange, VERIFY_EMAIL_DEBOUNCE)}
                                onInput={debounce(this.onInputChange, VERIFY_EMAIL_DEBOUNCE)}
                                onKeyUp={debounce(this.onInputChange, VERIFY_EMAIL_DEBOUNCE)} />
                            <label class={style.label} for='email'><span class={style.labelContent}>Email</span></label>
                        </div>
                        <div class={`${style.stepTwo} ${this.state.emailVerified ? '' : style.hidden}`}>
                            <div class={`${style.formGroup} ${style.text} ${this.state.form.firstName ? style.filled : ''}`}>
                                <input type='text' name='name' id='name' class={style.textInput} value={`${this.state.form.firstName} ${this.state.form.lastName}`} onFocus={this.onFocus} onBlur={this.onBlur} disabled />
                                <label class={style.label} for='name'><span class={style.labelContent}>Guest Name</span></label>
                            </div>
                            <div class={style.formGroup}>
                                <label>Will you be attending?</label>
                                <label class={style.optionLabel}>
                                    <input type='radio' class={style.optionInput + ' ' + style.radio} name='attending' value='yes' checked={this.state.form.attending === 'yes'} onChange={this.onInputChange} />
                                    Yes
                                </label>
                                <label class={style.optionLabel}>
                                    <input type='radio' class={style.optionInput + ' ' + style.radio} name='attending' value='no' checked={this.state.form.attending === 'no'} onChange={this.onInputChange} />
                                    No
                                </label>
                            </div>
                            <div class={`${style.formGroup} ${style.checkboxGroup} ${this.state.form.attending !== 'yes' ? style.hideOption : ''}`}>
                                <label class={style.optionLabel}>
                                    <input type='checkbox' class={style.optionInput} name='extras' value='1' checked={this.state.form.extras} onChange={this.onInputChange} />
                                    Are you bringing a +1 that did not receive an invitation?
                                </label>
                            </div>
                            <div class={`${style.formGroup}`}>
                                <label>Comments (optional)</label>
                                <textarea name='comments' value={this.state.form.comments} onChange={this.onInputChange}></textarea>
                            </div>
                            { userMessage }
                            { cta }
                        </div>
                    </form>
                </div>
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
