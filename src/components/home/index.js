import { h, Component } from 'preact';
import style from './style.less';
import { RsvpMask, RsvpModal } from '../rsvp';
import throttle from 'lodash/throttle';

export default class Home extends Component {
    constructor() {
        super();

        this.autoPlayStarted = false;

        this.state = {
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
        const proposalSection = document.getElementById('proposal');
        const video = proposalSection.querySelector('video');
        if (document.body.scrollTop > proposalSection.offsetTop && video.paused && !this.autoPlayStarted) {
            this.autoPlayStarted = true;
            video.play();
            console.log('Start video');
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
            <div className={style.home}>
                <section id='hero' className={style.section}>
                    <div className={style.content}>
                        <h1>Kat &amp; Ian</h1>
                    </div>
                </section>
                <section id='details' className={style.section}>
                    <div className={style.content}>
                        <h2>Wedding Details</h2>
                        <h3 className={style.important}>Saturday December 23rd, 2017<br />London, ON, Canada</h3>
                        <h3>Ceremony</h3>
                        <h4>Fernwood Hills @ 2:00PM - 4:00PM</h4>
                        <h3>Dinner</h3>
                        <h4>Black Trumpet @ 5:00PM - 8:00PM</h4>
                        <h3>Gifts</h3>
                        <h4>Joining us is all the gift we want, please don't buy us anything!</h4>

                        <button class={style.button} onClick={this.onRsvpBtnClick}>RSVP Now</button>
                    </div>
                </section>
                <section id='proposal' className={style.section}>
                    <div className={style.content}>
                        <h2>Proposal in Zion National Park</h2>
                        <video className={style.video} src="/assets/videos/proposal.mp4" controls />
                    </div>
                </section>
                <section id='photos' className={style.section}>
                    <div className={style.content}>
                        <h2>Photos</h2>
                    </div>
                </section>
                <RsvpMask show={this.state.showRsvpMask} onClick={this.onRsvpMaskClick} />
                <RsvpModal show={this.state.showRsvpModal} />
            </div>
        );
    }
}
