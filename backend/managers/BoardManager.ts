import { ObjectManager } from "./ObjectManager";
import { UserManager } from "./UserManager";

export class BoardManager {

    readonly users = new UserManager();

    readonly objects = new ObjectManager();

    constructor(
        public readonly id: string,
        public name: string,
    ) {}

}