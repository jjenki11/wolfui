let controller = require("../../controllers/home")();
let c = require("../../models/config");
let config = new c();

module.exports = (skController, bw, aw, pg) => {

    pg('/home', (event) => window.Emitter.Send("/page/load", event.path))

    var self = {

        render: (params) => {
            return bw.Div({
                class: 'row d-flex justify-content-center',
            }).append([
                bw.Div({
                    class: 'col-6 mt-4',
                }).append([
                    bw.Div({
                        class: "row"
                    }).append([
                        bw.Div({
                            class: "col text-center"
                        }).append([
                            bw.Header({
                                class: "display-4 text-center",
                                order: "4",
                                text: "Appleseed Starter Kit"
                            }),
                            
                            bw.Paragraph({
                                class: "lead my-4",
                                text: config.tagline
                            })
                        ])                        
                    ]),

                    bw.Div({
                        class: "row mt-3 justify-content-around",
                        style: "width: 120%; margin-left:-10%;"
                    }).append([
                        ...config.workflow_cards.map(card => {
                            return aw.SkCard($.extend(card, {
                                callback: () => {
                                    window.Emitter.Send("/page/redirect", `/${card.name}`);
                                }
                            }));
                        })
                    ])                   
                ])
            ]);
        }
    };

    return self;

}