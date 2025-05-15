import {Component} from "react"
import "./clockstyle.css"

export default class Clockwork extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: this.getTimeInZone(props.timeZone),
    }
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      this.setState({
        time: this.getTimeInZone(this.props.timeZone),
      })
    }, 1000)
  }

  UNSAFE_componentWillMount() {
    clearInterval(this.timerId)
  }

  getTimeInZone(timeZone) {
    const now = new Date()
    const locale = "en-US"
    const options = {
      timeZone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
    const parts = new Intl.DateTimeFormat(locale, options)
      .formatToParts(now)
      .reduce((acc, part) => ({...acc, [part.type]: part.value}), {})

      return new Date(
      `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`
    )
  }

  getBackgroundColor() {
    const hour =
      typeof this.props.hours === "number"
        ? this.props.hours
        : this.state?.time?.getHours() ?? new Date().getHours()

        return hour >= 6 && hour < 18 ? "#ffffff" : "#cccccc"
  }

  render() {
    const hour =
      typeof this.props.hours === "number"
        ? this.props.hours
        : this.state?.time?.getHours() ?? new Date().getHours()

    const minute =
      typeof this.props.minutes === "number"
        ? this.props.minutes
        : this.state?.time?.getMinutes() ?? new Date().getMinutes()

    const backgroundColor = this.getBackgroundColor()

    return (
      <div className="clock" style={{background: backgroundColor, transform: `translateY(15%)`}}>
        <div
          className="hour_hand"
          style={{
            transform: `translateX(-50%) rotateZ(${hour * 30 + minute * 0.5}deg)`,
          }}
        />
        <div
          className="min_hand"
          style={{
            transform: `translateX(-50%) rotateZ(${minute * 6}deg)`,
          }}
        />
      </div>
    )
  }
}
