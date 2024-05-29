import { useState, useEffect, useRef } from "preact/hooks"
import * as styles from "./styles.css.ts"
import clsx from "clsx"
import { JSX } from "preact"

const formatIndex = (index: number) => {
  return index.toString().padStart(3, "0")
}

type ImageProps = Omit<JSX.HTMLAttributes<HTMLImageElement>, "src"> & {
  index: number
  snapPath: string
}

const Image = ({ index, className, snapPath, ...props }: ImageProps) => {
  const formattedSnapPath = snapPath.endsWith("/")
    ? snapPath.slice(0, -1)
    : snapPath
  return (
    <img
      src={`${formattedSnapPath}/snap_${formatIndex(index + 1)}.png`}
      {...props}
      className={clsx(styles.image, className)}
      onDragStart={(e) => e.preventDefault()}
    />
  )
}

type MouseSpinHandlerProps = {
  spin: (delta: number) => void
}

type MouseSpinHandlerState = {
  isDragging: boolean
  lastX: number
  lastTime: number
  spinPolarity: number
}

const InitialMouseSpinHandlerStuff: MouseSpinHandlerState = {
  isDragging: false,
  lastX: 0,
  lastTime: 0,
  spinPolarity: -1,
}

const MouseSpinHandler = ({ spin }: MouseSpinHandlerProps) => {
  const stateRef = useRef(InitialMouseSpinHandlerStuff)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleStart = (x: number) => {
    const s = stateRef.current
    s.isDragging = true
    s.lastX = x
    s.lastTime = Number(new Date())
  }

  const handleMove = (x: number, speed: number = 1.0) => {
    const s = stateRef.current
    if (!s.isDragging || !containerRef.current) return

    // scale speed of rotation to size of element
    const xscale = containerRef.current.clientWidth / 72 / 0.85 / speed

    let dx = Math.round((x - s.lastX) / xscale)
    const time = Number(new Date())

    let minTime = 0

    if (Math.abs(dx) > 0 && time - s.lastTime >= minTime) {
      s.lastX = x
      s.lastTime = time

      if (Math.abs(dx) > 2) {
        dx = (Math.abs(dx) / dx) * 2
      }
      spin(s.spinPolarity * dx)
    }
  }

  const handleEnd = () => {
    const s = stateRef.current
    s.isDragging = false
  }

  const handleMouseDown = (event: MouseEvent) => handleStart(event.clientX)
  const handleMouseMove = (event: MouseEvent) => handleMove(event.clientX)
  const handleMouseUp = (_event: MouseEvent) => handleEnd()

  const handleTouchStart = (event: TouchEvent) =>
    handleStart(event.touches[0].clientX)
  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      // stop default panning effect when zoomed in on mobile -- only for single touch events
      event.preventDefault()
      handleMove(event.touches[0].clientX, 0.5)
    }
  }
  const handleTouchEnd = (_event: TouchEvent) => handleEnd()
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      spin(1)
    } else if (event.key === "ArrowRight") {
      spin(-1)
    }
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      ref={containerRef}
      className={styles.spinHandler}
    ></div>
  )
}
export function OutsideComponent({ snapPath = "" }: { snapPath?: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(0)

  const handleLoad = (_index: number) => {
    setImagesLoaded((loaded) => loaded + 1)
  }

  const handleSpin = (delta: number) => {
    setActiveIndex((index) => {
      return (index + delta + 72 * 4) % 72
    })
  }

  const loadingPercent = Math.round((imagesLoaded / 72) * 100)
  console.log("loadingPercent", loadingPercent)
  console.log("imagesLoaded", imagesLoaded)

  return (
    <div className={styles.container}>
      <MouseSpinHandler spin={handleSpin} />

      <LoadingScreen percentLoaded={loadingPercent} />

      {Array.from(
        { length: 72 },
        (_, i) =>
          imagesLoaded + 12 >= Math.floor(i / 24) * 24 && (
            <Image
              key={i}
              index={i}
              onLoad={() => handleLoad(i)}
              snapPath={snapPath}
              className={imageClass(activeIndex, i, loadingPercent < 100)}
            />
          )
      )}
    </div>
  )
}

const LoadingScreen = ({ percentLoaded }: { percentLoaded: number }) => {
  if (percentLoaded === 100) {
    return null
  }

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderText}>Loading: {percentLoaded}%</div>
      <div className={styles.loaderBar}>
        <div
          className={styles.loaderProgress}
          style={{ width: `${percentLoaded}%` }}
        ></div>
      </div>
    </div>
  )
}

const imageClass = (
  activeIndex: number,
  imageIndex: number,
  isLoading: boolean = false
) => {
  if (activeIndex === imageIndex) {
    return styles.activeImage
  } else if (isLoading) {
    // some browser will cause flash of white if they haven't been displayed, so display offscreen while loading
    return styles.stagingImage
  } else {
    // hiding images while rotating improves performance
    return styles.hiddenImage
  }
}

export default OutsideComponent
