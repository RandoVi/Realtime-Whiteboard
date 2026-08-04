import type { Tool } from "../types/Tool";

type Props = {
    setTool: (tool: Tool) => void;
    setShowShapeMenu: (show: boolean) => void;
};

export function ShapeMenu({ setTool, setShowShapeMenu }: Props) {
    return (
        <div className="shape-menu">
            <button
                className="tool-button"
                onClick={() => {
                    setTool("rectangle");
                    setShowShapeMenu(false);
                }}
            >
                Rectangle
            </button>

            <button
                className="tool-button"
                onClick={() => {
                    setTool("triangle");
                    setShowShapeMenu(false);
                }}
            >
                Triangle
            </button>

            <button
                className="tool-button"
                onClick={() => {
                    setTool("circle");
                    setShowShapeMenu(false);
                }}
            >
                Circle
            </button>
        </div>
    );
}