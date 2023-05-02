import { setupApp } from "./server.js";

const app = setupApp();
const port = 8080;

app.listen(port);
console.log(`Listening on http://0.0.0.0:${port}`)
