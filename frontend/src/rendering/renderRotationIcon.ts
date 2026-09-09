import type { Point } from "@common/types"

export function renderRotationIcon(
    context: CanvasRenderingContext2D,
    point: Point,
    size = 8,
) {
    const radius = size * 0.55

    context.save()

    context.translate(point.x, point.y)

    context.beginPath()
    context.arc(
        0,
        0,
        radius,
        -Math.PI * 0.75,
        Math.PI * 0.75,
    )

    context.strokeStyle = "white"
    context.lineWidth = 1.5
    context.lineCap = "round"
    context.stroke()

    // Arrow head
    const angle = Math.PI * 0.75

    const tipX = Math.cos(angle) * radius
    const tipY = Math.sin(angle) * radius

    context.beginPath()
    context.moveTo(tipX, tipY)
    context.lineTo(
        tipX - Math.cos(angle - Math.PI / 4) * size * 0.45,
        tipY - Math.sin(angle - Math.PI / 4) * size * 0.45,
    )
    context.lineTo(
        tipX - Math.cos(angle + Math.PI / 4) * size * 0.45,
        tipY - Math.sin(angle + Math.PI / 4) * size * 0.45,
    )
    context.closePath()

    context.fillStyle = "white"
    context.fill()

    context.restore()
}