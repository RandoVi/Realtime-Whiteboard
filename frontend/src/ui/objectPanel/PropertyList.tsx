// import type { ObjectProperty } from "../../objects/properties/ObjectProperty";
// import { PropertyInput } from "./PropertyInput";
// import { PropertyRow } from "./PropertyRow";

// type Props = {
//     properties: ObjectProperty[];
//     values: Record<string, unknown>;
//     onChange: (key: string, value: unknown) => void;
// };

// export function PropertyList({
//     properties,
//     values,
//     onChange,
// }: Props) {
//     return (
//         <>
//             {properties.map((property) => (
//                 <PropertyRow
//                     key={property.key}
//                     label={property.label}
//                 >
//                     <PropertyInput
//                         property={property}
//                         value={values[property.key]}
//                         onChange={(value) =>
//                             onChange(property.key, value)
//                         }
//                     />
//                 </PropertyRow>
//             ))}
//         </>
//     );
// }