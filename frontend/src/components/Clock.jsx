import {useState, useEffect, useRef} from "react"

const clockCSS = `
.clock {
  position: relative;
  width: 3rem;
  height: 3rem;
  border: 2px solid #333;
  border-radius: 50%;
  background: #fff;
  margin: 0 auto;
}

.hour_hand, .min_hand {
  position: absolute;
  left: 50%;
  bottom: 50%;
  background: #333;
  transform-origin: bottom;
  border-radius: 2px;
  colour: black;
}

.hour_hand {
  width: 0.25rem;
  height: 1rem;
  z-index: 2;
}

.min_hand {
  width: 0.2rem;
  height: 1.4rem;
  z-index: 1;
}
`
const ClockStyle = () => {
  useEffect(() => {
    if (!document.querySelector("#clock-inline-style")) {
      const style = document.createElement("style")

      style.id = "clock-inline-style"
      style.innerHTML = clockCSS
      document.head.appendChild(style)
    }
  }, [])
  return null
}

const getRoundedTime = (timeZone) => {
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

const Clockwork = ({hours, minutes}) => {
  const backgroundColor = hours >= 6 && hours < 18 ? "#fff" : "#ccc"

  return (
    <div className="clock" style={{background: backgroundColor, transform: `translateY(15%)`}}>
      <div
        className="hour_hand"
        style={{
          transform: `translateX(-50%) rotateZ(${hours * 30 + minutes * 0.5}deg)`,
        }}
      />
      <div
        className="min_hand"
        style={{
          transform: `translateX(-50%) rotateZ(${minutes * 6}deg)`,
        }}
      />
    </div>
  )
}

export const Clock = ({timeZone, label}) => {
  const [clockTime, setClockTime] = useState(getRoundedTime(timeZone))
  const intervalRef = useRef(null)

  useEffect(() => {
    const now = new Date()
    const msToNext =
      (5 - (now.getMinutes() % 5)) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds()

    const timeoutID = setTimeout(() => {
      setClockTime(getRoundedTime(timeZone))

      intervalRef.current = setInterval(() => setClockTime(getRoundedTime(timeZone)), 5 * 60 * 1000)
    }, msToNext)

    return () => {
      clearInterval(timeoutID)

      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [timeZone])

  return (
    <>
      <ClockStyle />
      <div className="flex flex-col items-center mx-1">
        <Clockwork hours={clockTime.hours} minutes={clockTime.minutes} />
        <span className="text-xs mt-1.5">{label}</span>
      </div>
    </>
  )
}
