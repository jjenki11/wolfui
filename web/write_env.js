let fs = require("fs");

fs.writeFileSync("./public/js/models/network.json", JSON.stringify({
  REST_HOST: process.env.REST_HOST || "localhost",
  REST_PORT: process.env.REST_PORT_EXTERNAL || 8008
}));
