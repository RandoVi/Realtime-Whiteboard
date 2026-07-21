import type { Shape } from "../../types/Shape";
import type { Editor } from "../../editor/Editor";
import { PropertyRow } from "./PropertyRow";

type Props = {
  shape: Shape;
  editor: Editor;
};

export function AppearanceSection({
  shape,
  editor,
}: Props) {
  return (
    <section className="inspector-section">

      <h4>Appearance</h4>

      <PropertyRow label="Fill">
        <input
          type="color"
          value={shape.fill}
          onChange={editor.bind("fill")}
        />
      </PropertyRow>

      <PropertyRow label="Stroke">
        <input
          type="color"
          value={shape.stroke}
          onChange={editor.bind("stroke")}
        />
      </PropertyRow>

    </section>
  );
}
