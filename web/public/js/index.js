let isIE = /*@cc_on!@*/false || !!document.documentMode;
let isEdge = !isIE && !!window.StyleMedia;

if (isIE || isEdge) {
    $(document).ready(() => {
        $("#main").html("<h4 style='margin-top: 1em;'>Internet Explorer or Edge Detected. Please Open Appleseed In Chrome.</h4>");
    });

    throw new Error();
}

let comms = require("./controllers/comms");
let skController = require("./Controller")();
let alerts = skController.GetAlerts();

window.Emitter = comms();
window.Emitter.AttachHandler("/page/load", skController.SetPage);
window.Emitter.AttachHandler("/alert", alerts.add_alert);

let pages = require("./views");
let aw = require("./AdvancedWidgets")();
let bw = require("./BasicWidgets");

$(document).ready(() => {    
    $("#mainHeading").append([   
        aw.SkNavbar({title:'Appleseed Starter Kit',links: pages.links})
    ]);    

    pages.links.forEach((link) => $(`#${link}Page`).append([pages[link].render({})]));
});
