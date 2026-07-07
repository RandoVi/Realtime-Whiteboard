import type { Camera } from '../Types'
import type { Shape } from '../shapes/Shape'
import { renderRectangle } from './RenderRectangle'

export function renderShapes(context: CanvasRenderingContext2D, shapes: Shape[], camera: Camera, previewShape?: Shape | null, selectedShapeId?: string | null) {
    for (const shape of shapes) {
        renderShape(context, shape, camera, shape.id === selectedShapeId)
    }
    if (previewShape) {
        renderShape(context, previewShape, camera, false)
    }
}

function renderShape(context: CanvasRenderingContext2D, shape: Shape, camera: Camera, isSelected: boolean) {
    switch (shape.type) {
        case 'rectangle':
            renderRectangle(context, shape, camera, isSelected)
            break
        // Add cases for other shape types here
        default:
            console.warn(`Unknown shape type: ${shape.type}`)
    }

}