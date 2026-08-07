export enum UserColor {
    GREEN = "green",
    RED = "red",
    BLUE = "blue",
    YELLOW = "yellow",
    PINK = "pink",
    PURPLE = "purple",
    ORANGE = "orange",
    CYAN = "cyan",
    BROWN = "brown",
    BLACK = "black",
}

export class ColorManager {
    private availableColors: UserColor[];
    private inUseColors: Set<UserColor>;
    private readonly validColors: UserColor[];

    constructor(initialColors: UserColor[]) {
        this.validColors = Object.values(initialColors);
        this.availableColors = [...initialColors];
        this.inUseColors = new Set();
    }

    takeColor(preferredColor?: UserColor):UserColor | null {
        if(this.availableColors.length === 0) {
            console.warn("No colors available! Pool exhausted!")
            return null;
        }
        let selectedIndex = 0;

        if(preferredColor) {
            selectedIndex = this.availableColors.indexOf(preferredColor);
            if(selectedIndex === -1) {
                console.warn(`Color ${preferredColor} is already in use or invalid.`)
                return null;
            }
        }

        const [color] = this.availableColors.splice(selectedIndex, 1)
        this.inUseColors = this.inUseColors.add(color!);
        return color!;
    }

    returnColor(color:UserColor): boolean {
        if(this.validColors.includes(color)) {
            console.warn(`Cannot return invalid color: ${color}`)
            return false;
        }

        if (!this.inUseColors.has(color)) {
            console.warn(`Color ${color} is not currently checked out`)
            return false;
        }

        this.inUseColors.delete(color);
        this.availableColors.push(color);
        return true;
    }

    getRemainingCount(): number {
        return this.availableColors.length;
    }

    getAvailable(): UserColor[] {
        return [...this.availableColors];
    }
}