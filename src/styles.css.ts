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
  backgroundColor: "#d0d0d0",
  color: "#101010",
  fontSize: "1.5rem",
  zIndex: 20,
})

export const loaderContainer = style({
  display: "flex",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  backgroundColor: "#f0f0f0",
  zIndex: 30,
  gap: "1rem",
})

export const loaderText = style({
  fontSize: "1.5rem",
})

export const loaderBar = style({
  width: "50%",
  height: "1rem",
  backgroundColor: "#ddd",
  borderRadius: "0.5rem",
  overflow: "hidden",
})

export const loaderProgress = style({
  height: "100%",
  backgroundColor: "#303030",
  transition: "width 0.3s ease",
})

export const loadingScreenStyles = {
  loaderContainer,
  loaderText,
  loaderBar,
  loaderProgress,
}
