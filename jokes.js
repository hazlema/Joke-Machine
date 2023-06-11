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

    isCategory = (isValid) => {
        this.debug.log(`Fetching list of categories`);

        return new Promise((resolve, reject) => {
            this.query("categories")
                .then((data) => {
                    const categories = data.categories;

                    this.debug.log(`Categories: ` + categories.join(", "));

                    for (let category of categories) {
                        this.debug.log(
                            `Compare ${isValid.toLowerCase()} and ${category.toLowerCase()}`
                        );
                        if (isValid.toLowerCase() === category.toLowerCase()) {
                            resolve(true);
                            return; // Exit the loop if a match is found
                        }
                    }
                    resolve(false); // Resolve with false if no match is found
                })
                .catch((error) => {
                    reject(error); // Reject the promise if there's an error
                });
        });
    };

    get = async (category, skipCheck = false) => {
        let isValid = false;

        if (skipCheck) {
            isValid = true;
        } else {
            isValid = await this.isCategory(category);
        }

        if (isValid) {
            this.debug.log(`Fetching joke, category: ${category}`);
            let data = await this.query(`joke/${category}`);

            if (data.joke) {
                console.log(chalk.blueBright(data.joke));
            } else {
                console.log(chalk.blueBright(data.setup));
                console.log(chalk.yellowBright(data.delivery));
            }
        } else {
            this.debug.log(`Invalid Category`);
            return false;
        }
    };

    list = async () => {
        this.debug.log(`Fetching list of categories`);
        let data = await this.query("categories");

        console.log(data.categories.join(", "));
    };

    rand = async () => {
        this.debug.log(`Fetching list of categories`);
        let data = await this.query("categories");
        const categories = data.categories.slice(1);

        this.debug.log(`Categories: ${categories.join(", ")}`);
        this.get(
            categories[Math.floor(Math.random() * categories.length)],
            true
        );
    };
};

export { Jokes };
