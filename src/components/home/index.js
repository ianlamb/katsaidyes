import { h, Component } from 'preact';
import style from './style.less';

export default class Home extends Component {
    constructor() {
        super();

        this.state = {
        };
    }

    render() {
        return (
            <div className={style.home}>
                <section id='hero' className={style.section}>
                    <div className={style.content}>
                        <h1>It's happening!</h1>
                        <h3>Saturday December 23rd, 2017</h3>
                        <h3>Fernwood Hills &mdash; London, Canada</h3>
                    </div>
                </section>
                <section id='proposal' className={style.section}>
                    <div className={style.content}>
                        <h2>Proposal in Zion National Park</h2>
                        <video className={style.video} src="/assets/videos/proposal.mp4" controls />
                    </div>
                </section>
            </div>
        );
    }
}
