export type Circle = {
  id: string
  type: "circle"

  //center coordinates
  x: number 
  y: number

  radius: number

  rotation: number

  fill: string
  stroke: string
  strokeWidth: number
}