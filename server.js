require("dotenv").config();
const app = require("express")();
require("./startup/appStartup")(app);
require("./startup/dbStartup")();

const port = process.env.PORT || 3000;

app.listen(port, () => console.info(`Listening on port ${port} ...`));
