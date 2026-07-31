import type { Object } from "../../types/Object";
import type { Editor } from "../../editor/Editor";
import { PropertyRow } from "./PropertyRow";

type Props = {
  object: Object;
  editor: Editor;
};

export function AppearanceSection({
  object,
  editor,
}: Props) {
  return (
    <section className="inspector-section">

      <h4>Appearance</h4>

      <PropertyRow label="Fill">
        <input
          type="color"
          value={object.fill}
          onChange={editor.bind("fill")}
        />
      </PropertyRow>

      <PropertyRow label="Stroke">
        <input
          type="color"
          value={object.stroke}
          onChange={editor.bind("stroke")}
        />
      </PropertyRow>

    </section>
  );
}
