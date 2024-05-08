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

export const stagingImage = style({
  zIndex: 1,
})

export const hiddenImage = style({
  display: "none",
})

export const spinHandler = style({
  position: "absolute",
  zIndex: 30,
  width: "100%",
  height: "100%",
  top: 0,
})

export const loadTxt = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#a0a0a0",
  color: "#101010",
  fontSize: "1.5rem",
  zIndex: 20,
})
