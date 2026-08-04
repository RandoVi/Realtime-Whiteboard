import type { Editor } from "../../editor/Editor";

type Props = {
  editor: Editor;
};

export function ActionsSection({
  editor,
}: Props) {
  return (
    <section className="inspector-section">

      <h4>Actions</h4>

      <button
        onClick={() =>
          editor.duplicateSelectedObject()
        }
      >
        Duplicate
      </button>

      <button
        onClick={() =>
          editor.deleteSelectedObject()
        }
      >
        Delete
      </button>

    </section>
  );
}