 let aw = require("../AdvancedWidgets");
 
 module.exports = () => {
    let self = {
        /*
        title:
        body:
        dismissible: [optional] true by default
        type: [optional] danger by default
        auto_dismiss: [optional] false by default
        */
        add_alert: (params) => {
            let defaults = {
                dissmissible: true,
                type: "danger",
                auto_dismiss: false
            };
            Object.keys(defaults).forEach(key => {
                if (params[key] == undefined)
                    params[key] = defaults[key];
            });

            let item = $(aw.SkAlert({
                title: params.title,
                body: params.body,
                dismissible: (params.auto_dismiss) ? false : params.dismissible,
                type: params.type
            }));

            $("#alerts-outer").append([item]);
            $("#alerts-modal").modal("show");

            // setup timeout to auto dismiss
            if (params.auto_dismiss) {
                setTimeout(() => {
                    item.remove();

                    if ($("#alerts-outer .alert").length == 0)
                        $("#alerts-modal").modal("hide");
                }, 3000);
            }
        },
        
        error_parser: (error) => {
            return {
                title: error.name,
                body: error.message,
                auto_dismiss: true,                
            };
        }
    };

    return self;
 };