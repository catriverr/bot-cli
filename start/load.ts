import { main } from "../src/main.js";

setTimeout(async () => {
    process.exit(await main(process.argv.slice(2)));
}, 250);
