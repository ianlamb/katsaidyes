import { h, Component } from 'preact';
import leftPad from 'left-pad';

export default class Countdown extends Component {
    constructor() {
        super();

        this.state = {
            timeString: ''
        };

        this.update = this.update.bind(this);
    }

    get defaultProps() {
        return {
            endDate: new Date()
        }
    }

    componentWillMount() {
        this.update();
    }

    update() {
        const time = this.getTimeRemaining(this.props.endDate);
        const newTimeString = `${leftPad(time.days, 2, '0')}:${leftPad(time.hours, 2, '0')}:${leftPad(time.minutes, 2, '0')}:${leftPad(time.seconds, 2, '0')}`;

        this.setState({
            timeString: newTimeString
        });

        window.requestAnimationFrame(this.update);
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
            <div className={this.props.className}>
                {this.state.timeString}
            </div>
        );
    }
}
