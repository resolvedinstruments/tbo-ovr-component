import { useState, useEffect, useRef } from "preact/hooks"
import * as styles from "./styles.css.ts"
import clsx from "clsx"
import { JSX } from "preact"

const formatIndex = (index: number) => {
  return index.toString().padStart(3, "0")
}

type ImageProps = Omit<JSX.HTMLAttributes<HTMLImageElement>, "src"> & {
  index: number
  active: boolean
}

const Image = ({ index, active = false, className, ...props }: ImageProps) => {
  return (
    <img
      src={`/0001/0001_ovr/0001_screenshots_ovr_3840x2160/snap_${formatIndex(index + 1)}.png`}
      {...props}
      className={clsx(
        styles.image,
        active ? styles.activeImage : styles.hiddenImage,
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
  spinPolarity: number
}

const InitialMouseSpinHandlerStuff: MouseSpinHandlerStuff = {
  isDragging: false,
  lastX: 0,
  spinPolarity: 1,
}

const MouseSpinHandler = ({ spin }: MouseSpinHandlerProps) => {
  const stateRef = useRef(InitialMouseSpinHandlerStuff)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (event: any) => {
    const s = stateRef.current
    s.isDragging = true
    s.lastX = event.layerX

    if (containerRef.current) {
      const h = containerRef.current.clientHeight
      const y = event.layerY

      s.spinPolarity = y < h / 4 ? 1 : -1
    }
  }

  const handleMouseMove = (event: any) => {
    const s = stateRef.current
    console.log("m")
    if (!s.isDragging || !containerRef.current) return

    // scale speed of rotation to size of element
    const xscale = containerRef.current.clientWidth / 72

    // console.log("x, last", event.layerX, s.lastX)
    const dx = Math.round((event.layerX - s.lastX) / xscale)

    if (Math.abs(dx) > 0) {
      s.lastX = event.layerX
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

      {imagesLoaded < 72 && (
        <div className={styles.loadTxt}>
          Loading: {Math.round((imagesLoaded / 72) * 100)} %
        </div>
      )}

      {Array.from({ length: 72 }, (_, i) => (
        <Image
          key={i}
          index={i}
          active={activeIndex === i}
          onLoad={() => handleLoad(i)}
        />
      ))}
    </div>
  )
}
