type Props = {
    shortcut: string;
};

export function ShortcutHint({ shortcut }: Props) {
    return (
        <span className="shortcut-hint">
            {shortcut}
        </span>
    );
}