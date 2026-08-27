import type { Tool } from '../types/Tool';
import './ToolShortcuts.css'

type ToolShortcutsProps = {
    editor: {
        undo: () => void;
        redo: () => void;
        canUndo: () => boolean;
        canRedo: () => boolean;
    };
    tool: Tool;
};

export function ToolShortcuts({ editor, tool }: ToolShortcutsProps) {
    return (
        <div className="tool-shortcuts">
            <div className="history-buttons">
                <button
                    type="button"
                    className="history-button"
                    onClick={() => editor.undo()}
                    disabled={!editor.canUndo()}
                    title="Undo"
                >
                    ↶
                </button>

                <button
                    type="button"
                    className="history-button"
                    onClick={() => editor.redo()}
                    disabled={!editor.canRedo()}
                    title="Redo"
                >
                    ↷
                </button>
            </div>

            <div className="tool-shortcut">
                <div className="tool-shortcut-key">M</div>
                <div className="tool-shortcut-name">Board Info</div>
            </div>

            {tool === "stroke" && (
                <div className="tool-shortcut">
                    <div className="tool-shortcut-key">CTRL</div>
                    <div className="tool-shortcut-name">Straight Line</div>
                </div>
            )}

            {tool === "rectangle" && (
                <div className="tool-shortcut">
                    <div className="tool-shortcut-key">CTRL</div>
                    <div className="tool-shortcut-name">Fixed Size</div>
                </div>
            )}
        </div>
    );
}