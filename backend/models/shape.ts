interface BoardObject {
    id: string;

    creatorId: string;

    type: string;

    x: number;
    y: number;
    radius: number;

    width: number;
    height: number;

    fill: string;
    stroke: string;

    createdAt: number;
    updatedAt: number;
}

interface Rectangle extends BoardObject {
    type: "rectangle";
    // ...
}

interface Circle extends BoardObject {
    type: "circle";
    // ...
}

export type Shape = Rectangle | Circle;