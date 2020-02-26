

let controller = require('../Controller')();
let bw = require('../BasicWidgets');
let aw = require('../AdvancedWidgets')();

let page = require('page');

page('/', () => {page.redirect("/home")})

var currentURL = window.location.href.split('/');
if(currentURL.length > 1){ page.redirect(`/${currentURL[currentURL.length -1]}`) } else { console.log('nada'); }

window.Emitter.AttachHandler("/page/redirect", (destination) => page.redirect(destination));

page();

$(document).ready(() => {
     // SET DATETIME PICKER DEFAULTS
     $.extend($.fn.datetimepicker.Constructor.Default, {
        stepping: 1,
        format: "MM/DD/YYYY HH:mm:ss",
        icons: {
            time: "fas fa-clock",
            date: "fas fa-calendar",
            previous: "fas fa-chevron-left",
            next: "fas fa-chevron-right",   
            up: "fas fa-arrow-up",
            down: "fas fa-arrow-down",
            today: "fas fa-calendar-check",
            clear: "fas fa-trash",
            close: "fas fa-times"             
        }
    });
})

module.exports = {

    links: ["home", "about", "upload", "results"],
    home: require("./pages/home")(controller, bw, aw, page),
    upload: require("./pages/upload")(controller, bw, aw, page),
    about: require("./pages/about")(controller, bw, aw, page),
    results: require('./pages/results')(controller, bw, aw, page)
}