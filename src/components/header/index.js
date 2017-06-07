import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { RsvpMask, RsvpModal } from '../rsvp';
import throttle from 'lodash/throttle';
import style from './style.less';

export default class Header extends Component {
    constructor() {
        super();

        this.state = {
            compact: false,
            showRsvpMask: false,
            showRsvpModal: false
        }

        this.checkScroll = this.checkScroll.bind(this);
        this.onRsvpBtnClick = this.onRsvpBtnClick.bind(this);
        this.onRsvpMaskClick = this.onRsvpMaskClick.bind(this);
    }

    componentDidMount() {
        this.checkScroll();
        window.addEventListener('scroll', throttle(this.checkScroll, 50));
    }

    checkScroll() {
        if (document.body.scrollTop > 0 && !this.state.compact) {
            this.setState({compact: true});
        } else if (document.body.scrollTop === 0 && this.state.compact) {
            this.setState({compact: false});
        }
    }

    onRsvpBtnClick() {
        this.setState({ showRsvpMask: true, showRsvpModal: true });
    }

    onRsvpMaskClick() {
        this.setState({ showRsvpMask: false, showRsvpModal: false });
    }

    render() {
        return (
            <header class={style.header + ' ' + (this.state.compact ? style.compact : '')}>
                <div class={style.date}>December 23rd, 2017</div>
                <div class={style.title}>KAT &amp; IAN</div>
                <div class={style.rsvp}>
                    <button class={style.rsvpBtn} onClick={this.onRsvpBtnClick}>RSVP</button>
                </div>
                <RsvpMask show={this.state.showRsvpMask} onClick={this.onRsvpMaskClick} />
                <RsvpModal show={this.state.showRsvpModal} />
            </header>
        );
    }
}
