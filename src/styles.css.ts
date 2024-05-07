import { style } from "@vanilla-extract/css"

export const container = style({
  width: "100%",
  position: "relative",
  aspectRatio: "16/9",
})

export const image = style({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "auto",
})

export const activeImage = style({
  zIndex: 10,
})

export const hiddenImage = style({
  zIndex: 1,
})

export const spinHandler = style({
  position: "absolute",
  zIndex: 30,
  width: "100%",
  height: "100%",
  top: 0,
})

export const loadTxt = style({
  padding: "1rem",
  position: "absolute",
  top: 0,
  left: 0,
  color: "#ffffff",
  zIndex: 20,
})
