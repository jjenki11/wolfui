
module.exports = (skController, bw, aw, pg) => {

    pg('/about', (event) => window.Emitter.Send("/page/load", event.path));

    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

    const createElement = (params) => ({
        tab: bw.Anchor({
            class: `list-group-item list-group-item-action ${params.is_active ? ' active' : ''}`,
            id:`list-${params.name}-list`,
            'data-toggle':'list',
            href:`#list-${params.name}`,
            role:'tab',
            'aria-controls':`${params.name}`,
            text: capitalizeFirstLetter(params.name)
        }),
        content: bw.Div({
            class: `tab-pane fade ${params.is_active ? ' show active' : ''}`,
            id:`list-${params.name}`,
            role:'tabpanel',
            'aria-labelledby':`list-${params.name}-list`,
            text:   params.content
        })
    });

    let about_elements = [
        createElement({
            is_active: true,
            name: 'setup',
            content: 'First, asdf'
        }),
        createElement({
            is_active: false,
            name: 'clean',
            content: 'Second, asdf'
        }),
        createElement({
            is_active: false,
            name: 'enrich',
            content: 'Third, asdf'
        }),
        createElement({
            is_active: false,
            name: 'display',
            content: 'Fourth, asdf'
        })
    ];

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
                                text: "How did we do this?"
                            }),
                            
                            bw.Paragraph({
                                class: "lead my-4",
                                text: "Our approach to the project included several stages"
                            })
                        ])
                    ])
                ]),
                bw.Div({
                    class: 'row col-8 mt-4'
                }).append([
                    bw.Div({
                        class:'col-4'
                    }).append([
                        bw.Div({
                            class:'list-group',
                            id:'list-tab',
                            role:'tablist'
                        }).append([...about_elements.map(e => e.tab)])
                    ]),
                    bw.Div({
                        class:'col-8'
                    }).append([
                        bw.Div({
                            class:'tab-content',
                            id:'nav-tabContent'
                        }).append([...about_elements.map(e => e.content)])
                    ])
                ])
            ]);
        }
    };

    return self;

}