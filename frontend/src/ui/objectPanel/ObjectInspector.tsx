import type { Editor } from "../../editor/Editor";
import type { Object } from "../../types/Object";
import "./ObjectInspector.css";
import { ActionsSection } from "./ActionsSection";
import { PropertySection } from "./PropertySection";

type Props = {
  object?: Object;
  editor: Editor;
};

export function ObjectInspector({
  object,
  editor,
}: Props) {
  if (!object) {
    return null;
  }

  return (
    <aside className="object-inspector">

      <header className="inspector-header">
        <div>
          <h3>Object</h3>
          <span>{object.type}</span>
        </div>
      </header>

      <PropertySection
        title="Transform"
        section="transform"
        object={object}
        editor={editor}
      />

      <PropertySection
        title="Appearance"
        section="appearance"
        object={object}
        editor={editor}
      />

      <ActionsSection editor={editor} />

    </aside>
  );
}