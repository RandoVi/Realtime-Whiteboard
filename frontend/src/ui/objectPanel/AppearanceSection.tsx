import type { Object } from "../../types/Object";
import type { Editor } from "../../editor/Editor";
import { PropertyRow } from "./PropertyRow";
import { getObjectProperties } from "../../objects/getObjectProperties";

type Props = {
  object: Object;
  editor: Editor;
};

export function AppearanceSection({
  object,
  editor,
}: Props) {
  const properties = getObjectProperties(object);

  const appearanceProperties = properties.filter(
    property =>
      property.key === "fill" ||
      property.key === "stroke"
  );

  if (appearanceProperties.length === 0) {
    return null;
  }

  return (
    <section className="inspector-section">
      <h4>Appearance</h4>

      {appearanceProperties.map(property => (
        <PropertyRow
          key={String(property.key)}
          label={property.label}
        >
          <input
            type="color"
            value={String(
              (object as Record<string, unknown>)[property.key]
            )}
            onChange={editor.bindProperty(String(property.key))}
          />
        </PropertyRow>
      ))}
    </section>
  );
}