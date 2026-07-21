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
          editor.duplicateSelectedShape()
        }
      >
        Duplicate
      </button>

      <button
        onClick={() =>
          editor.deleteSelectedShape()
        }
      >
        Delete
      </button>

    </section>
  );
}