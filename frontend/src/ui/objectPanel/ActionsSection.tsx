import type { Editor } from "../../editor/Editor";

type Props = {
  editor: Editor;
};

export function ActionsSection({
  editor,
}: Props) {
  return (
    <section className="inspector-section inspector-actions">

      <h4>Actions</h4>

      <div className="action-buttons">

        <button
          className="inspector-action"
          onClick={() => editor.duplicateSelectedObject()}
        >
          Duplicate
        </button>

        <button
          className="inspector-action inspector-action-danger"
          onClick={() => editor.deleteSelectedObject()}
        >
          Delete
        </button>

      </div>

    </section>
  );
}