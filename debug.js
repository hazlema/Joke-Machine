import chalk from 'chalk';

class Debug {
    constructor() {
        this.app = "Joke Machine"
        this.isDebug = false
    }

    log(message) {
        if (this.isDebug) {
            console.log(`${chalk.redBright(this.app)}: ${chalk.whiteBright(message)}`)
        }
    }
}

export { Debug }
