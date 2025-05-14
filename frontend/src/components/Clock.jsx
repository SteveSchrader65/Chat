import {useEffect, useState} from "react"
import AnalogClock from "analog-clock-react"
// import Clockwork from "./clockCodeRip/clockwork.jsx"

function getRoundedTime(timeZone) {
  const now = new Date()
  const localeString = now.toLocaleString("en-US", {timeZone})
  const date = new Date(localeString)

  let minutes = date.getMinutes()

  minutes = Math.round(minutes / 5) * 5

  if (minutes === 60) {
    minutes = 0
    date.setHours(date.getHours() + 1)
  }

  return {
    hours: date.getHours(),
    minutes: minutes,
    seconds: 0,
  }
}

const Clock = ({timeZone, label}) => {
  const [clockTime, setClockTime] = useState(getRoundedTime(timeZone))

  useEffect(() => {
    const now = new Date()
    const msToNext =
      (5 - (now.getMinutes() % 5)) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds()
    const timer = setTimeout(() => {
      setClockTime(getRoundedTime(timeZone))
      setInterval(() => setClockTime(getRoundedTime(timeZone)), 5 * 60 * 1000)
    }, msToNext)
    return () => clearTimeout(timer)
  }, [timeZone])

  const options = {
    width: "3rem",
    border: true,
    borderColor: "#333",
    baseColor: "#fff",
    centerColor: "#333",
    centerBorderColor: "#333",
    handColors: {
      hour: "#333",
      minute: "#333",
      second: "transparent",
    },
    useCustomTime: true,
    hours: clockTime.hours,
    minutes: clockTime.minutes,
    seconds: 0,
  }

  return (
    <div className="flex flex-col items-center mx-1">
      <AnalogClock {...options} />
      {/* <Clockwork {...options} /> */}
      <span className="text-xs mt-1">{label}</span>
    </div>
  )
}

export default Clock
