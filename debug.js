import chalk from "chalk-template";

class Debug {
    constructor() {
        this.app = "Joke Machine";
        this.isDebug = false;
    }

    log(message) {
        if (this.isDebug) {
            console.log(chalk`{red ${this.app}} {white ${message}}`);
        }
    }
}

export { Debug };
