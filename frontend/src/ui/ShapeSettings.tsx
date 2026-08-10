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
    <label className="shape-color">
        <span className="shape-color-label">Fill</span>

        <span
            className="shape-color-preview"
            style={{ backgroundColor: fill }}
        />

        <span className="shape-color-value">
            {fill.toUpperCase()}
        </span>

        <input
            type="color"
            value={fill}
            onChange={(e) => setFill(e.target.value)}
        />
    </label>

    <label className="shape-color">
        <span className="shape-color-label">Stroke</span>

        <span
            className="shape-color-preview"
            style={{ backgroundColor: stroke }}
        />

        <span className="shape-color-value">
            {stroke.toUpperCase()}
        </span>

        <input
            type="color"
            value={stroke}
            onChange={(e) => setStroke(e.target.value)}
        />
    </label>
</div>
    );
}