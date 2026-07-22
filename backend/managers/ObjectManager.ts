interface BoardObject {
    id: string;
    creatorId: string;
}

interface Rectangle extends BoardObject {
    type: "rectangle";
    // ...
}

interface Circle extends BoardObject {
    type: "circle";
    // ...
}

type Shape = Rectangle | Circle;