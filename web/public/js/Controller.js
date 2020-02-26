
let aw = require("./AdvancedWidgets");
let alerts = require("./controllers/alerts")();


module.exports = () => {
    let self = {     

        GetAlerts: () => {return alerts;},
        /*
        id: 
        */
        DisplayProgressBar: (params) => {
            $(`#${params.id}`).show();
        },

        /*
        id:
        current:
        total:
        */
        UpdateProgressBar: (params) => {
            let bar = $(`#${params.id} .progress-bar`);
            let percent = Math.round((params.current / params.total) * 100);

            bar.text(percent + "%");
            bar.width(percent + "%");

            if (params.current == params.total)
                window.Emitter.Send("/progressBar/hide", params);
        },

        /*
        id:
        */
        HideProgressBar: (params) => {
            $(`#${params.id} .progress-bar`).width("0%");
            $(`#${params.id}`).hide();
        },

        SetPage: (path) => {
            let name = path.slice(1);
            $('.nav-item').removeClass('active'); 
            $(`#${name}Nav`).addClass('active');
            $('.sk-page').hide(); 
            $(`#${name}Page`).fadeIn('slow', () => {
                window.Emitter.Send(`/pages/${name}/fadeIn`, {});
            });       

            window.Emitter.Send(`/pages/${name}/fadingIn`);
        },

        /*
        title:
        text:
        cancel_text:
        cancel_callback:
        continue_text:
        continue_callback:
        */
        ConfigureYesNoModal: (params) => {
            let id = "yes-no-modal";

            $(`#${id} .modal-title`).text(params.title);
            $(`#${id} .modal-body a`).text(params.text);

            $(`#${id}Cancel`).text(params.cancel_text);
            $(`#${id}Cancel`).off("click");
            $(`#${id}Cancel`).on("click", params.cancel_callback);

            $(`#${id}Continue`).text(params.continue_text);
            $(`#${id}Continue`).off("click");
            $(`#${id}Continue`).on("click", params.continue_callback);
        },
    };

    return self;
};