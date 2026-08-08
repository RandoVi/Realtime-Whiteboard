import type { Tool } from "../types/Tool";

type Props = {
    onSelectShape: (tool: Tool) => void;
};

export function ShapeMenu({ onSelectShape }: Props) {
    return (
        <div className="shape-menu">
            <button
                className="tool-button"
                onClick={() => {
                    onSelectShape("rectangle");
                    // setShowShapeMenu(false);
                    // setShowShapeSettings(true);
                }}
            >
                Rectangle
            </button>

            <button
                className="tool-button"
                onClick={() => {
                    onSelectShape("triangle");
                    // setShowShapeMenu(false);
                    // setShowShapeSettings(true);
                }}
            >
                Triangle
            </button>

            <button
                className="tool-button"
                onClick={() => {
                    onSelectShape("circle");
                    // setShowShapeMenu(false);
                    // setShowShapeSettings(true);
                }}
            >
                Circle
            </button>

            <button
                className="tool-button"
                onClick={() => {
                    onSelectShape("laser");
                }}
            >
                Laser
            </button>
        </div>
    );
}