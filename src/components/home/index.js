import { h, Component } from 'preact';
import style from './style.less';
import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipeGallery } from 'react-photoswipe';
import { RsvpMask, RsvpModal } from '../rsvp';
import throttle from 'lodash/throttle';

const imageDir = '../../assets/images';
const heroFadeInDelay = 250;

export default class Home extends Component {
    constructor() {
        super();

        this.autoPlayStarted = false;

        this.photoswipeOptions = {

        };
        this.photos = [
            {
                src: `${imageDir}/19705449574_4b1c9404a9_o.jpg`,
                thumbnail: `${imageDir}/19705449574_4b1c9404a9_o.jpg`,
                w: 900,
                h: 900,
                title: 'Having some beers in Brussels, Belgium'
            },
            {
                src: `${imageDir}/16424735715_976a528d01_o.jpg`,
                thumbnail: `${imageDir}/16424735715_976a528d01_o.jpg`,
                w: 1200,
                h: 900,
                title: 'Snowboard/ski trip to Blue Mountain with some of the pals'
            },
            {
                src: `${imageDir}/20160702_195910.jpg`,
                thumbnail: `${imageDir}/20160702_195910.jpg`,
                w: 1200,
                h: 900,
                title: 'Anime Expo 2016 after she bought a giant Totoro plushie'
            },
            {
                src: `${imageDir}/2016-05-20 19.22.19 HDR.jpg`,
                thumbnail: `${imageDir}/2016-05-20 19.22.19 HDR.jpg`,
                w: 1200,
                h: 900,
                title: 'Huntington Beach just before eating at Watertable for our second anniversary'
            }
        ];

        this.state = {
            loadHero: false,
            showRsvpMask: false,
            showRsvpModal: false,
            isPhotoswipeOpen: false
        }

        this.handlePhotoswipeClose = this.handlePhotoswipeClose.bind(this);
        this.checkScroll = this.checkScroll.bind(this);
        this.onRsvpBtnClick = this.onRsvpBtnClick.bind(this);
        this.onRsvpMaskClick = this.onRsvpMaskClick.bind(this);
    }

    componentDidMount() {
        this.checkScroll();
        window.addEventListener('scroll', throttle(this.checkScroll, 50));

        setTimeout(() => {
            this.setState({ loadHero: true });
        }, heroFadeInDelay);
    }

    handlePhotoswipeClose() {
        this.setState({ isPhotoswipeOpen: false });
    }

    getThumbnailContent(item) {
        return (
            <img src={item.thumbnail} />
        );
    }

    checkScroll() {
        return; // disable this for now

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
                <section id='hero' className={`${style.section} ${style.hero} ${this.state.loadHero ? ' ' + style.showBackground : ''}`}>
                    <div className={style.content}>
                        <h1>
                            Kat
                            <span class={style.engagementIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 496 496" style="enable-background:new 0 0 496 496;">
                                    <g>
                                        <g>
                                            <g>
                                                <path d="M248,227.312l69.376-69.376c6.848-6.848,10.624-15.96,10.624-25.656C328,112.272,311.728,96,291.72,96     c-9.696,0-18.8,3.776-25.656,10.624L248,124.688l-18.064-18.064C223.088,99.776,213.976,96,204.28,96     C184.272,96,168,112.272,168,132.28c0,9.696,3.776,18.808,10.624,25.656L248,227.312z M204.28,112     c5.424,0,10.512,2.112,14.344,5.936L248,147.312l29.376-29.376c3.824-3.824,8.92-5.936,14.344-5.936     c11.176,0,20.28,9.104,20.28,20.28c0,5.424-2.112,10.512-5.936,14.344L248,204.688l-58.064-58.064     c-3.824-3.824-5.936-8.92-5.936-14.344C184,121.104,193.104,112,204.28,112z"></path>
                                                <path d="M176,256c-57.344,0-104,46.656-104,104s46.656,104,104,104s104-46.656,104-104S233.344,256,176,256z M176,448     c-48.52,0-88-39.48-88-88c0-48.52,39.48-88,88-88c12.36,0,24.128,2.592,34.808,7.208C193.496,302.568,184,330.864,184,360     s9.496,57.432,26.808,80.792C200.128,445.408,188.36,448,176,448z M225.048,433.024C208.912,412.08,200,386.44,200,360     s8.912-52.08,25.048-73.024c4.432,2.984,8.544,6.384,12.352,10.104C223.592,315.176,216,337.224,216,360s7.592,44.824,21.4,62.92     C233.592,426.64,229.472,430.04,225.048,433.024z M248.04,410.392C237.672,395.632,232,378.088,232,360     s5.672-35.632,16.04-50.392C258.064,323.904,264,341.256,264,360C264,378.744,258.064,396.096,248.04,410.392z"></path>
                                                <path d="M320,224c-25.68,0-50.456,7.232-72.072,20.792C227.032,231.696,202.424,224,176,224c-74.992,0-136,61.008-136,136     s61.008,136,136,136c26.424,0,51.032-7.696,71.928-20.792C269.544,488.768,294.32,496,320,496c74.992,0,136-61.008,136-136     S394.992,224,320,224z M176,480c-66.176,0-120-53.832-120-120s53.824-120,120-120c66.168,0,120,53.832,120,120     S242.168,480,176,480z M285.224,279.312C296.2,274.576,308.032,272,320,272c48.52,0,88,39.48,88,88c0,48.52-39.48,88-88,88     c-11.968,0-23.8-2.576-34.776-7.312C301.968,418.08,312,390.224,312,360S301.968,301.92,285.224,279.312z M320,480     c-20.392,0-40.144-5.16-57.792-14.904c4.424-3.64,8.536-7.624,12.472-11.784C288.8,460.192,304.288,464,320,464     c57.344,0,104-46.656,104-104s-46.656-104-104-104c-15.712,0-31.2,3.808-45.328,10.688c-3.936-4.16-8.04-8.144-12.472-11.784     C279.856,245.16,299.608,240,320,240c66.168,0,120,53.832,120,120S386.168,480,320,480z"></path>
                                                <rect x="376" y="48" width="16" height="16"></rect>
                                                <rect x="200" y="64" width="16" height="16"></rect>
                                                <rect x="88" y="192" width="16" height="16"></rect>
                                                <rect x="328" width="16" height="16"></rect>
                                                <rect x="328" y="32" width="16" height="16"></rect>
                                                <rect x="344" y="16" width="16" height="16"></rect>
                                                <rect x="312" y="16" width="16" height="16"></rect>
                                                <rect x="56" width="16" height="32"></rect>
                                                <rect x="14.059" y="22.056" transform="matrix(0.7071 0.7071 -0.7071 0.7071 30.0569 -12.4516)" width="32" height="16"></rect>
                                                <rect y="56" width="32" height="16"></rect>
                                                <rect x="14.055" y="89.948" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -60.4567 49.9399)" width="32" height="16"></rect>
                                                <rect x="56" y="96" width="16" height="32"></rect>
                                                <rect x="89.94" y="81.938" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -40.5668 97.9394)" width="16" height="32"></rect>
                                                <rect x="96" y="56" width="32" height="16"></rect>
                                                <rect x="89.937" y="14.058" transform="matrix(0.7071 0.7071 -0.7071 0.7071 49.9393 -60.4479)" width="16" height="32"></rect>
                                                <rect x="424" y="96" width="16" height="32"></rect>
                                                <rect x="390.073" y="110.061" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 768.6919 -66.281)" width="16" height="32"></rect>
                                                <rect x="368" y="152" width="32" height="16"></rect>
                                                <rect x="390.036" y="177.896" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 542.3849 612.454)" width="16" height="32"></rect>
                                                <rect x="424" y="192" width="16" height="32"></rect>
                                                <rect x="449.911" y="185.909" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 658.2447 660.4715)" width="32" height="16"></rect>
                                                <rect x="464" y="152" width="32" height="16"></rect>
                                                <rect x="457.924" y="110.074" transform="matrix(0.7071 0.7071 -0.7071 0.7071 225.6138 -292.5316)" width="16" height="32"></rect>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </span>
                            Ian
                        </h1>
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
                        <h4>Joining us is all we want, please don't bring gifts! (Seriously)</h4>

                        <button class={style.button} onClick={this.onRsvpBtnClick}>RSVP Now</button>
                    </div>
                </section>
                <section id='proposal' className={style.section}>
                    <div className={style.content}>
                        <h2>Proposal</h2>
                        <p>On November 25<sup>th</sup>, 2016 after riding our motorcycles through the desert to Zion National Park in Utah and climbing the precarious Angel's Landing trail the question was dropped. She didn't take long to answer ;)</p>
                        <video className={style.video} src="/assets/videos/proposal.mp4" controls />
                    </div>
                </section>
                <section id='photos' className={style.section}>
                    <div className={style.content}>
                        <h2>Photos</h2>
                        <p>We think our adventures speak to our companionship better than anything, so instead of traditional engagement photos here are some of our favourite in-the-moment shots (quality may vary).</p>
                        <PhotoSwipeGallery
                            items={this.photos}
                            options={this.photoswipeOptions}
                            thumbnailContent={this.getThumbnailContent}
                            onClose={this.handlePhotoswipeClose}
                            isOpen={this.state.isPhotoswipeOpen}
                        />
                    </div>
                </section>
                <RsvpMask show={this.state.showRsvpMask} onClick={this.onRsvpMaskClick} />
                <RsvpModal show={this.state.showRsvpModal} />
            </div>
        );
    }
}
