import type { Tool } from '../../types/Tool';
import styles from './ToolShortcuts.module.css';

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
        <div className={styles.toolShortcuts}>
            <div className={styles.historyButtons}>
                <button
                    type="button"
                    className={styles.historyButton}
                    onClick={() => editor.undo()}
                    disabled={!editor.canUndo()}
                    title="Undo"
                >
                    ↶
                </button>

                <button
                    type="button"
                    className={styles.historyButton}
                    onClick={() => editor.redo()}
                    disabled={!editor.canRedo()}
                    title="Redo"
                >
                    ↷
                </button>
            </div>

            <div className={styles.toolShortcut}>
                <div className={styles.toolShortcutKey}>M</div>
                <div className={styles.toolShortcutName}>Board Info</div>
            </div>

            {tool === "stroke" && (
                <div className={styles.toolShortcut}>
                    <div className={styles.toolShortcutKey}>CTRL</div>
                    <div className={styles.toolShortcutName}>
                        Straight Line
                    </div>
                </div>
            )}

            {tool === "rectangle" && (
                <div className={styles.toolShortcut}>
                    <div className={styles.toolShortcutKey}>CTRL</div>
                    <div className={styles.toolShortcutName}>
                        Fixed Size
                    </div>
                </div>
            )}
        </div>
    );
}