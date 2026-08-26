import { appError, AppErrorCode } from "../lib/errors/app.exception";

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
        this.validColors = [...initialColors];
        this.availableColors = [...initialColors];
        this.inUseColors = new Set();
    }

    takeColor(preferredColor?: UserColor):UserColor | null {
        if(this.availableColors.length === 0) {
            throw appError(AppErrorCode.INVALID_STATE, {
                details: "No colors available, all are already taken",
            })
        }
        let selectedIndex = 0;

        if(preferredColor) {
            selectedIndex = this.availableColors.indexOf(preferredColor);
            if(selectedIndex === -1) {
                throw appError(AppErrorCode.INVALID_INPUT, {
                    details: `Color ${preferredColor} is already in use or invalid.`,
                    context: {
                        preferredColor: preferredColor
                    }
                })
            }
        }

        const [color] = this.availableColors.splice(selectedIndex, 1)
        this.inUseColors = this.inUseColors.add(color!);
        return color!;
    }

    returnColor(color:UserColor): boolean {
        if(!this.validColors.includes(color)) {
            throw appError(AppErrorCode.INVALID_INPUT, {
                details: `Invalid color`,
                context: {
                    color: color
                }
            })
        }

        if (!this.inUseColors.has(color)) {
            throw appError(AppErrorCode.INVALID_INPUT, {
                details: "Color is not in use, choose a valid color in that is being used",
                context: {
                    color: color
                }
            })
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

    static fromPersistence(data: UserColor[]): ColorManager {
        const manager = new ColorManager(data);

        return manager;
    }
}