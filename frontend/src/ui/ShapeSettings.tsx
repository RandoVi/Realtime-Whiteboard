type Props = {
    fill: string;
    stroke: string;
    setFill: (value: string) => void;
    setStroke: (value: string) => void;
};

export function ShapeSettings({
    fill,
    stroke,
    setFill,
    setStroke,
}: Props) {

    return (
        <div className="shape-settings">

            <label>
                Fill
                <input
                    type="color"
                    value={fill}
                    onChange={(e) => setFill(e.target.value)}
                />
            </label>


            <label>
                Stroke
                <input
                    type="color"
                    value={stroke}
                    onChange={(e) => setStroke(e.target.value)}
                />
            </label>

        </div>
    );
}