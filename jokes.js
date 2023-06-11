import axios from "axios";
import chalk from "chalk";
import { Debug } from "./debug.js";

var Jokes = class {
    constructor() {
        this.debug = new Debug();
    }

    query = (args) => {
        this.debug.log(`Server Query: https://v2.jokeapi.dev/${args}`);

        return new Promise((response, reject) => {
            axios
                .get(`https://v2.jokeapi.dev/${args}`)

                .then((data) => {
                    this.debug.log(`Success!`);
                    response(data.data);
                })

                .catch((err) => {
                    this.debug.log(`Fail!`);
                    reject(new Error("A network error has occurred: ", err));
                });
        });
    };

    get = async (category) => {
        this.debug.log(`Fetching joke from: ${category}`);
        let data = await this.query(`joke/${category}`);

        if (data.joke) {
            console.log(chalk.blueBright(data.joke));
        } else {
            console.log(chalk.blueBright(data.setup));
            console.log(chalk.yellowBright(data.delivery));
        }
    };

    list = async () => {
        this.debug.log(`Fetching list of categories`);
        let data = await this.query("categories");

        console.log(data.categories.join(", "));
    };
};

export { Jokes };
