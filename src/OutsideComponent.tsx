import { useState, useEffect, useRef } from "preact/hooks"
import * as styles from "./styles.css.ts"
import clsx from "clsx"
import { JSX } from "preact"

const FEAT_LOADFIRST = true

const formatIndex = (index: number) => {
  return index.toString().padStart(3, "0")
}

type ImageProps = Omit<JSX.HTMLAttributes<HTMLImageElement>, "src"> & {
  index: number
  active?: boolean
  snapPath: string
}

const Image = ({
  index,
  active = false,
  className,
  snapPath,
  ...props
}: ImageProps) => {
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

  const handleMove = (x: number) => {
    const s = stateRef.current
    if (!s.isDragging || !containerRef.current) return

    // scale speed of rotation to size of element
    const xscale = containerRef.current.clientWidth / 72 / 0.85

    let dx = Math.round((x - s.lastX) / xscale)
    const time = Number(new Date())

    let minTime = 0
    if (!FEAT_LOADFIRST) {
      const maxFps = 10
      minTime = (1 / maxFps) * 1000
    }

    if (Math.abs(dx) > 0 && time - s.lastTime >= minTime) {
      s.lastX = x
      s.lastTime = time

      if (!FEAT_LOADFIRST && Math.abs(dx) > 2) {
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
  const handleTouchMove = (event: TouchEvent) =>
    handleMove(event.touches[0].clientX)
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

  return (
    <div className={styles.container}>
      <MouseSpinHandler spin={handleSpin} />

      {FEAT_LOADFIRST && imagesLoaded < 72 && (
        <div className={styles.loadTxt}>
          Loading: {Math.round((imagesLoaded / 72) * 100)} %
        </div>
      )}

      {FEAT_LOADFIRST ||
        Array.from({ length: 72 }, (_, i) => (
          <Image
            key={i}
            index={i}
            // active={activeIndex === i}
            onLoad={() => handleLoad(i)}
            snapPath={snapPath}
            className={imageClass(activeIndex, i)}
          />
        ))}

      {FEAT_LOADFIRST &&
        Array.from(
          { length: 72 },
          (_, i) =>
            imagesLoaded + 12 >= Math.floor(i / 24) * 24 && (
              <Image
                key={i}
                index={i}
                // active={activeIndex === i}
                onLoad={() => handleLoad(i)}
                snapPath={snapPath}
                className={imageClass(activeIndex, i)}
              />
            )
        )}
    </div>
  )
}

const imageClass = (activeIndex: number, imageIndex: number) => {
  if (activeIndex === imageIndex) {
    return styles.activeImage
  } else if (FEAT_LOADFIRST) {
    return styles.stagingImage
  } else if (Math.abs(imageIndex - activeIndex) < 4) {
    return styles.stagingImage
  } else {
    return styles.hiddenImage
  }
}

export default OutsideComponent
