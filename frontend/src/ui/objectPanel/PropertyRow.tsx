import type { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

export function PropertyRow({
  label,
  children,
}: Props) {
  return (
    <div className="property-row">

      <label>{label}</label>

      <div className="property-control">
        {children}
      </div>

    </div>
  );
}