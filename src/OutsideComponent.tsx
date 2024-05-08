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
}

const Image = ({ index, active = false, className, ...props }: ImageProps) => {
  return (
    <img
      src={`0001/0001_ovr/0001_screenshots_ovr_3840x2160/snap_${formatIndex(index + 1)}.png`}
      {...props}
      className={clsx(
        styles.image,
        // active ? styles.activeImage : styles.hiddenImage,
        className
      )}
      onDragStart={(e) => e.preventDefault()}
    />
  )
}

const setActiveIndex = (a: number) => {}

type MouseSpinHandlerProps = {
  spin: (delta: number) => void
}

type MouseSpinHandlerStuff = {
  isDragging: boolean
  lastX: number
  lastTime: number
  spinPolarity: number
}

const InitialMouseSpinHandlerStuff: MouseSpinHandlerStuff = {
  isDragging: false,
  lastX: 0,
  lastTime: 0,
  spinPolarity: 1,
}

const MouseSpinHandler = ({ spin }: MouseSpinHandlerProps) => {
  const stateRef = useRef(InitialMouseSpinHandlerStuff)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (event: any) => {
    const s = stateRef.current
    s.isDragging = true
    s.lastX = event.layerX
    s.lastTime = Number(new Date())

    if (containerRef.current) {
      const h = containerRef.current.clientHeight
      const y = event.layerY

      s.spinPolarity = y < h / 4 ? 1 : -1
    }
  }

  const handleMouseMove = (event: any) => {
    const s = stateRef.current
    if (!s.isDragging || !containerRef.current) return

    // scale speed of rotation to size of element
    const xscale = containerRef.current.clientWidth / 72

    // console.log("x, last", event.layerX, s.lastX)
    let dx = Math.round((event.layerX - s.lastX) / xscale)
    const time = Number(new Date())

    let minTime = 0
    if (!FEAT_LOADFIRST) {
      const maxFps = 10
      minTime = (1 / maxFps) * 1000
    }

    if (Math.abs(dx) > 0 && time - s.lastTime >= minTime) {
      s.lastX = event.layerX
      s.lastTime = time

      if (!FEAT_LOADFIRST && Math.abs(dx) > 2) {
        dx = (Math.abs(dx) / dx) * 2
      }
      spin(s.spinPolarity * dx)
    }
  }

  const handleMouseUp = (event: MouseEvent) => {
    const s = stateRef.current
    s.isDragging = false
  }

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
      onKeyDown={handleKeyDown}
      ref={containerRef}
      className={styles.spinHandler}
    ></div>
  )
}

export function OutsideComponent() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(0)

  const handleLoad = (index: number) => {
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
