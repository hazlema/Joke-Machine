import axios from "axios";
import chalk from "chalk";
import { Debug } from "./debug.js";

var Jokes = class {
    constructor() {
        this.debug = new Debug();
    }

    /**
     * Preform a query on the API
     * @param {string} args Arguments for the query
     * @returns object
     */
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

    /**
     * Tests if this is a category
     * @param {string} category The category name to test
     * @returns {bool}
     */
    isCategory = (category) => {
        this.debug.log(`Fetching list of categories`);

        return new Promise((resolve, reject) => {
            this.query("categories")
                .then((data) => {
                    const categories = data.categories;
                    this.debug.log(`Categories: ` + categories.join(", "));

                    for (let test of categories) {
                        this.debug.log(
                            `Compare ${category.toLowerCase()} and ${test.toLowerCase()}`
                        );
                        if (category.toLowerCase() === test.toLowerCase()) {
                            resolve(true);
                            return;
                        }
                    }
                    resolve(false);
                })
                .catch((error) => reject(error));
        });
    };

    /**
     * Get a joke from the API
     * @param {string} category, The category that should be used
     * @param {bool} skipCheck, If we should skip the category check
     * @returns {bool}
     */
    get = async (category, skipCheck = false) => {
        let isValid = skipCheck ? true : await this.isCategory(category);

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

        return true;
    };

    /**
     * List the categories
     */
    list = async () => {
        this.debug.log(`Fetching list of categories`);
        let data = await this.query("categories");

        console.log(data.categories.join(", "));
    };

    /**
     * Get a random category then query the data source
     */
    rand = async () => {
        this.debug.log(`Fetching list of categories`);
        let data = await this.query("categories");
        const categories = data.categories.slice(1);

        this.debug.log(`Categories: ${categories.join(", ")}`);

        let category =
            categories[Math.floor(Math.random() * categories.length)];
        this.get(category, true); // Skip category check, we know this is valid
    };
};

export { Jokes };
