
let cc = require("./network.json");
let details = require("./details.json");

module.exports = class Config {
    constructor() {
        this.url = `http://${cc.REST_HOST}:${cc.REST_PORT}/`;
        this.preview_table_size = 5;
        this.results_table_size = 10;
        this.tagline = details.tagline
        this.workflow_cards = details.workflow_cards
        this.about_us_cards = details.about_us_cards
    }
}