import { Command } from 'commander'
import { Jokes } from './jokes.js'
import chalk from 'chalk';

let command = new Command()
let jokes   = new Jokes()

async function main() {
	//console.log(await jokes.isCategory('pun'))

	if (options.list && !options.get && !options.rand) {
		jokes.list();
	
	} else if (!options.list && options.get && !options.rand){
		if (!await jokes.get(options.get)) {
			console.log(chalk.redBright("Invalid Category: ") + chalk.whiteBright(options.get))
		}
	} else if (!options.list && !options.get) {
		jokes.rand();
	
	} else {
		if ((options.list==true && (options.get || options.rand==true)) || (options.get && options.rand==true)) {
			console.log(chalk.redBright("Argument Error: ") + chalk.whiteBright("Can not Combine these Operations (joke-machine --help)"))
		}
	}
}
	
command
  .name('joke-machine')
  .description('Get a joke from http://jokeapi.dev')
  .version('1.0.0')
  .option('-d, --debug', 'extra debugging', false)
  .option('-l, --list', 'list categories', false)
  .option('-g, --get <category>', 'get a joke', false)
  .option('-r, --rand', 'get a random joke', false)
  .parse();

const options = command.opts();

if (options.debug) {
    jokes.debug.isDebug = true
}

main()
