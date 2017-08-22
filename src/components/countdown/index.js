import { h, Component } from 'preact';
import leftPad from 'left-pad';

export default class Countdown extends Component {
    constructor() {
        super();

        this.state = {
            ready: false,
            timeString: ''
        };

        this.update = this.update.bind(this);
    }

    get defaultProps() {
        return {
            endDate: new Date(),
            callback: Function.prototype,
            endMessage: ''
        }
    }

    componentDidMount() {
        if (this.props.endDate.getTime() > new Date().getTime()) {
            this.setState({
                ready: true
            });
            this.update();
        }
    }

    update() {
        const time = this.getTimeRemaining(this.props.endDate);
        const newTimeString = `${leftPad(time.days, 2, '0')}:${leftPad(time.hours, 2, '0')}:${leftPad(time.minutes, 2, '0')}:${leftPad(time.seconds, 2, '0')}`;

        if (time.total > 0) {
            this.setState({
                timeString: newTimeString
            });
            window.requestAnimationFrame(this.update);
        } else {
            this.setState({
                timeString: this.props.endMessage
            });
            this.props.callback();
        }
    }

    getTimeRemaining(end) {
        const total = Date.parse(end) - new Date().getTime();
        const deciseconds = Math.floor( (total / 100) % 60 );
        const seconds = Math.floor( (total / 1000) % 60 );
        const minutes = Math.floor( (total / 1000 / 60) % 60 );
        const hours = Math.floor( (total / (1000 * 60 * 60)) % 24 );
        const days = Math.floor( total / (1000 * 60 * 60 * 24) );

        return {
            total,
            days,
            hours,
            minutes,
            seconds,
            deciseconds
        };
    }

    render() {
        return (
            <div className={this.props.className} style={this.state.ready ? '' : 'display:none'}>
                {this.state.timeString}
            </div>
        );
    }
}
