import { style } from "@vanilla-extract/css"

export const container = style({
  width: "100%",
  position: "relative",
  aspectRatio: "16/9",
  backgroundColor: "black",
  WebkitUserSelect: "none",
  KhtmlUserSelect: "none",
  MozUserSelect: "none",
  userSelect: "none",
  outline: 0,
  lineHeight: 1.4,
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

export const loadFont = style({
  fontFamily:
    'Helvetica, "Nimbus Sans L", "Liberation Sans", Arial, sans-serif',
})

export const loadBox = style({
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "12.5rem", // 200px to rem
  height: "9.375rem", // 150px to rem
  margin: "-4.6875rem 0 0 -6.25rem", // -75px 0 0 -100px to rem
  backgroundColor: "rgba(0,0,0,0.7)",
  borderRadius: "3px", // 3px to rem
  textAlign: "center",
  fontSize: "1.25rem", // 20px to rem
  color: "#fff",
  zIndex: 20,
})

export const loadBoxText = style({
  margin: "1.25rem 0",
})

export const loadBar = style({
  width: "9.375rem", // 150px to rem
  margin: "0 auto",
  border: "1px solid #fff",
  height: "0.375rem", // 6px to rem
})

export const loadBarFill = style({
  background: "#fff",
  height: "100%",
  width: "0",
  transition: "width 0.3s ease",
})

export const loadMessage = style({
  fontSize: "0.75rem", // 12px to rem
})
