import { h, Component } from 'preact';
import style from './style.less';
import 'react-photoswipe/lib/photoswipe.css';
import { PhotoSwipeGallery } from 'react-photoswipe';
import { RsvpMask, RsvpModal } from '../rsvp';
import throttle from 'lodash/throttle';
import url from 'url';
import photoData from './photos';

const imageDir = '../../assets/images';
const heroFadeInDelay = 250;
const assets = {
    videos: {
        proposal: require('../../assets/videos/proposal.mp4')
    }
}

export default class Home extends Component {
    constructor() {
        super();

        this.autoPlayStarted = false;

        this.photoswipeOptions = {

        };
        this.photos = photoData;

        this.state = {
            emailPrefill: '',
            loadHero: false,
            showRsvpMask: false,
            showRsvpModal: false,
            isPhotoswipeOpen: false
        }

        this.handlePhotoswipeClose = this.handlePhotoswipeClose.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onModalReset = this.onModalReset.bind(this);
    }

    componentWillMount() {
        const email = url.parse(window.location.href, true).query.e;
        if (email) {
            this.setState({
                emailPrefill: email,
                showRsvpMask: true,
                showRsvpModal: true
            })
        }
    }

    componentDidMount() {
        this.onScroll();
        window.addEventListener('scroll', throttle(this.onScroll, 50));

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

    onScroll() {
        const scrollTop = (document.body.scrollTop < window.innerHeight ? document.body.scrollTop : window.innerHeight) / 6;
        if (scrollTop != this.state.scrollTop) {
            this.setState({ scrollTop: scrollTop });
        }

        return; // disable autoplay for now
        const proposalSection = document.getElementById('proposal');
        const video = proposalSection.querySelector('video');
        if (document.body.scrollTop > proposalSection.offsetTop && video.paused && !this.autoPlayStarted) {
            this.autoPlayStarted = true;
            video.play();
            console.log('Start video');
        }
    }

    openModal() {
        this.setState({ showRsvpMask: true, showRsvpModal: true });
    }

    closeModal() {
        this.setState({ showRsvpMask: false, showRsvpModal: false });
    }

    onModalReset() {
        this.setState({
            emailPrefill: ''
        });
    }

    render() {
        return (
            <div className={style.home}>
                <section
                    id='hero'
                    className={`${style.section} ${style.hero} ${this.state.loadHero ? ' ' + style.showBackground : ''}`}
                    style={`transform:translateY(${this.state.scrollTop}px)`}
                    >
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
                <section id='details' className={`${style.section} ${style.patternBackground}`}>
                    <div className={style.content}>
                        <h2>Wedding Details</h2>
                        <h3 className={style.important}>Saturday December 23rd, 2017<br />London, ON, Canada</h3>
                        <p>We're getting married! We want our wedding to be light-hearted and stress-free, so don't expect any of <a href="https://www.youtube.com/watch?v=O5BeLinyfpg" target="_blank">this</a>. It's going to be a fun get-together with friends and family to celebrate love and life! Thank you so much to everyone who joins us, and if you are not able to you'll be with us in spirit :)</p>

                        <h3>Ceremony</h3>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11683.17951492581!2d-81.461053!3d42.940451!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xafe15d1b42c6651!2sFernwood+Hills!5e0!3m2!1sen!2sus!4v1499657140004"
                            frameborder="0" allowfullscreen></iframe>

                        <h4>Fernwood Hills @ 3:00PM - 4:00PM</h4>
                        <p>The ceremony will be short and the dress code will be smart casual. It's outside in December, so please wear appropriate clothes to stay warm! There will be coffee, hot chocolate and snacks. Feel free to arrive anytime after 2pm to hang out.</p>

                        <h5>Gifts</h5>
                        <p>Joining us is all we want, please don't bring gifts! Instead, please consider joining us for a Hawaii destination party after the wedding if you have the means to do so. Details for this will be sorted out on Facebook.</p>

                        <h5>Location &amp; Parking</h5>
                        <p>9533 Oxbow Dr, Middlesex Centre, ON N0L 1R0, Canada</p>
                        <p>There will be plenty of free on-site parking.</p>

                        <h3>Dinner</h3>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3461.9861734855726!2d-81.25318868434042!3d42.98760390323119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882ef20261fba639%3A0xbf4fc4817311727e!2sBlack+Trumpet+Restaurant!5e1!3m2!1sen!2sus!4v1499657370393"
                            frameborder="0" allowfullscreen></iframe>

                        <h4>Black Trumpet @ 5:00PM - 8:00PM</h4>
                        <p>The restaurant is downtown so please arrange for transportation from the venue and allow some time to find parking. Everyone will be able to choose their menu options at the restaurant. Alcohol will not be included with the dinner, but will be available for purchase.</p>

                        <h5>Location &amp; Parking</h5>
                        <p>523 Richmond St, London, ON N6A5N6, Canada</p>
                        <p>There are lots of options for parking downtown. Our suggestion is to park on the street or at one of the municipal lots on Kent St near Richmond or Queens St near Richmond. Metered parking is free after 6PM on Saturdays, so you should only have to pay for 1 hour.</p>

                        <h3>After Party</h3>
                        <p>After dinner everyone is free to take off or join us for some drinks and socializing at a nearby establishment (likely Milos' Craft Beer Emporium).</p>

                        <button class={style.button} onClick={this.openModal}>RSVP Now</button>
                    </div>
                </section>
                <section id='proposal' className={style.section}>
                    <div className={style.content}>
                        <h2>Proposal</h2>
                        <p>On November 25<sup>th</sup>, 2016 after riding our motorcycles through the desert to Zion National Park in Utah and climbing the precarious Angel's Landing trail the question was dropped. She didn't take long to answer ;)</p>
                        <video className={style.video} src={assets.videos.proposal} controls />
                    </div>
                </section>
                <section id='photos' className={`${style.section} ${style.patternBackground}`}>
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

                <section id='footer' className={style.section}>
                    <div className={style.content}>
                        <span class={style.heartIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 51.997 51.997" style="enable-background:new 0 0 51.997 51.997;">
                                <g>
                                    <path d="M51.911,16.242C51.152,7.888,45.239,1.827,37.839,1.827c-4.93,0-9.444,2.653-11.984,6.905   c-2.517-4.307-6.846-6.906-11.697-6.906c-7.399,0-13.313,6.061-14.071,14.415c-0.06,0.369-0.306,2.311,0.442,5.478   c1.078,4.568,3.568,8.723,7.199,12.013l18.115,16.439l18.426-16.438c3.631-3.291,6.121-7.445,7.199-12.014   C52.216,18.553,51.97,16.611,51.911,16.242z M49.521,21.261c-0.984,4.172-3.265,7.973-6.59,10.985L25.855,47.481L9.072,32.25   c-3.331-3.018-5.611-6.818-6.596-10.99c-0.708-2.997-0.417-4.69-0.416-4.701l0.015-0.101C2.725,9.139,7.806,3.826,14.158,3.826   c4.687,0,8.813,2.88,10.771,7.515l0.921,2.183l0.921-2.183c1.927-4.564,6.271-7.514,11.069-7.514   c6.351,0,11.433,5.313,12.096,12.727C49.938,16.57,50.229,18.264,49.521,21.261z"></path>
                                    <path d="M15.999,7.904c-5.514,0-10,4.486-10,10c0,0.553,0.447,1,1,1s1-0.447,1-1c0-4.411,3.589-8,8-8c0.553,0,1-0.447,1-1   S16.551,7.904,15.999,7.904z"></path>
                                </g>
                            </svg>
                        </span>
                        <div class={style.footerText}>
                            Made with love by the <a href="http://katherinehaldane.com">bride</a> and <a href="http://ianlamb.com">groom</a>
                        </div>
                    </div>
                </section>

                <RsvpMask show={this.state.showRsvpMask} closeModal={this.closeModal} />
                <RsvpModal show={this.state.showRsvpModal} email={this.state.emailPrefill} onReset={this.onModalReset} closeModal={this.closeModal} />
            </div>
        );
    }
}
