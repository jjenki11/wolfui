let u = require('./Utilities');
let Utilities = new u();
let c = require("./models/config");
let config = new c();

let bw = require("./BasicWidgets");

let drag_counter = 0


module.exports = () => {
    /*
    id: 
    data: 
    */
    let self = {
        SkTabulator: (params) => {
            let self = {
                clearTable: () => {
                    self.table.clearData();
                },

                /*
                id:
                data:
                */
                updateTable: (params) => {
                    self.table.replaceData(params.data);
                },

                getData: (params) => {
                    return self.table.getData(true);
                },

                redrawTable: (params) => {
                    self.table.redraw();
                },   

                setTableFilters: (params) => {
                    self.table.setFilter(params.filters);
                },

                setTableGroupBy: (params) => {
                    self.table.setGroupBy(params.groupby);
                },

                // tableData: startingData,
                table: new Tabulator(`#${params.id}`, {
                    data: params.data,
                    layout: "fitColumns",
                    addRowPost: "bottom",
                    tooltipsHeader: true,
                    tooltips: true,
                    pagination: "local",
                    paginationSize: config.results_table_size,
                    selectable: 1,
                    selectablePersistence: false,
                    selectableRollingSelection: true,

                    groupBy: "juid",
                    groupStartOpen: (value, count, data, group) => {
                        return self.table.getGroups().length == 1;   // only start open when there is one group
                    },
                    groupToggleElement: "header",
                    groupHeader: (value, count, data, group) => {     },

                    initialSort:[
                        {column: "timestamp", dir: "asc"}
                    ],

                    columns: [ //Define Table Columns
                        {
                            title: "",
                            field: "classification",
                            sorter: function(a, b, aRow, bRow, column, di, sorterParams) {
                                return config.classification_to_index[a] - config.classification_to_index[b];
                            },
                            headerTooltip: "Classification",
                            downloadTitle: "Classification"
                        },
                        {title: "Content", field: "text", sorter: "string", widthGrow: 4},
                        {title: "Username", field: "username", sorter: "string", widthGrow: 2},
                        {title: "Emotion", field: "emotion", sorter: "string"},                    
                        {
                            title:"Polarity", 
                            field:"polarity", 
                            align:"left", 
                            formatter:"progress", 
                            sorter:"number",
                            formatterParams:{color:["rgb(255,0,0)", "rgba(100, 100, 100, 0.1)", "#00dd00"], min: -1, max: 1},                      
                        },
                        {title: "Date/Time", field: "timestamp", sorter: "number",
                            formatter: (cell) => {
                                return new Date(cell.getValue() * 1000).toLocaleString();
                            },
                            accessorDownload: (value) =>{
                                return new Date(value * 1000).toLocaleString();
                            }
                        }                   
                    ], 
                    
                    rowSelectionChanged: (rows) => {
                        if (rows.length)
                            window.Emitter.Send("/table/rows/selected", rows);
                    },

                    dataFiltered: (filters, rows) => {
                        window.Emitter.Send("/table/rows/filtered", {filters: filters, rows: rows});
                    }
                })
            };

            return self;  
        },

        /*
        id:
        chart_type:
        labels:
        dataset_label:
        background_color:
        border_color:
        data:
        title
        */
        SkChart: (params) => {
            let ctxR = document.getElementById(params.id).getContext('2d');
            return new Chart(ctxR, {
                type: params.chart_type,
                data: {
                    labels: params.labels,
                    datasets: [{
                        label: params.dataset_label,
                        data: params.data,
                        backgroundColor: params.background_color,
                        borderColor: params.border_color,
                        borderWidth: 2
                    }]
                },
                options: $.extend(
                    {
                        title: {
                            display: true,
                            fontSize: 18,
                            text: params.title
                        }
                    }, 
                    (params.chart_type == "radar") ? 
                        {scale: {
                            ticks: {
                                beginAtZero: true,
                                min: 0,
                                max: 100
                            }
                        }} 
                    : 
                        {}
                ),            
            });
        },

        /*
        id:
        title: 
        datasets: [{
            label:
            color
        }]
        labels:
        */
        SkLineChart: (params) => {
            let ctxR = document.getElementById(params.id).getContext('2d');
            return new Chart(ctxR, {
                type: "line",
                data: {
                    labels: params.labels,
                    datasets: params.datasets.map(set => {
                        return {
                            label: set.label,
                            data: [],
                            backgroundColor: set.color,
                            borderColor: set.color
                        };  
                    })
                },
                options: {      
                    title: {
                        display: true,
                        fontSize: 18,
                        text: params.title             
                    },

                    onClick: (event, elements) => {
                        console.log([event, elements]);
                    }
                }         
            });
        },

        /*
        id:
        data: 
        labels:
        dataset_label:
        title:
        xAxes:
        */
        SkBarChart: (params) => {
            let ctxR = document.getElementById(params.id).getContext('2d');
            return new Chart(ctxR, {
                type: "bar",
                data: {
                    labels: params.labels,
                    datasets: [{
                        label: params.dataset_label,
                        data: [],
                        backgroundColor: params.color,
                        borderColor: params.color
                    }]
                },
                options: {   
                    title: {
                        display: true,
                        fontSize: 18,
                        text: params.title
                    },          
                    scales: {
                        xAxes: params.xAxes,
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                            }
                        }]
                    }                  
                }                            
            });
        },

        /*
        id:
        labels:
        datasets:
        title:
        */
        SkStackedBarChart: (params) => {
            let ctxR = document.getElementById(params.id).getContext('2d');
            return new Chart(ctxR, {
                type: "bar",
                data: {
                    labels: params.labels,
                    datasets: params.datasets
                },
                options: {
                    scales: {
                        yAxes: [{
                            stacked: true,
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            stacked: true,
                            display: false,
                            ticks: {
                                beginAtZero: true                            
                            }
                        }]            
                    },
                    title: {
                        display: true,
                        fontSize: 18,
                        text: params.title
                    }
                }
            });
        },

        /*
        id:
        datasets:
        min:
        title:
        max:
        */
        SkTimeSeriesChart: (params) => {
            params.datasets.forEach(dataset => {
                $.extend(dataset, {
                    borderWidth: 2,
                    cubicInterpolationMode: "monotone"
                })
            });

            let ctxR = document.getElementById(params.id).getContext('2d');
            return new Chart(ctxR, {
                type: "line",
                data: {
                    datasets: params.datasets
                },
                options: {    
                    tooltips: {
                        enabled: false
                    },   
                    title: {
                        display: true,
                        fontSize: 18,
                        text: params.title
                    },         
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                unit: 'month',
                                parser: "M/D/YYYY, hh:mm:ss A"
                            }
                        }],
                        
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                min: params.min,
                                max: params.max
                            } 
                        }]
                    }
                }
            });
        },

        /*
        id:
        dataset_label:
        title:
        */
        SkDoughnutChart: (params) => {
            let ctxR = document.getElementById(params.id).getContext('2d');
            return new Chart(ctxR, {
                type: "doughnut",
                data: {
                    labels: [],
                    datasets: [{
                        label: params.dataset_label,
                        data: [],
                        backgroundColor: [],
                        borderColor: [],
                        borderWidth: 2
                    }]
                },
                options: {
                    title: {
                        display: true,
                        fontSize: 18,
                        text: params.title
                    },

                    legend: {
                        display: false
                    },
                }            
            });
        },

        /*
        id:
        title:
        scale:
        colors:
        */
        SkPolarAreaChart: (params) => {
            let ctxR = document.getElementById(params.id).getContext('2d');
            return new Chart(ctxR, {
                type: "polarArea",
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: params.colors,
                        borderColor: params.colors ,
                        borderWidth: 2
                    }]
                },
                options: {
                    title: {
                        display: true,
                        fontSize: 18,
                        text: params.title
                    },

                    scale: params.scale
                }            
            });
        },

        SkNavbar: (params) => {

            const navItem = (name) => bw.ListItem({
                class:'nav-item',
                id:`${name}Nav`,
                onReady: () => {
                    $(`#${name}Nav`).on('click', () => {
                        window.Emitter.Send("/page/changed", `/${name}`);
                        $(".burger-button").click();                                                   
                    })
                }
            }).append([
                bw.Anchor({class:'nav-link waves-effect', href: `/${name}`, text:`${name.charAt(0).toUpperCase() + name.slice(1)} `})
            ]);

            return bw.Navbar({
                class:'navbar navbar-dark mdb-color darken-4 mb-12 text-white text-right'
            }).append([
                bw.Header({
                    order:'1',
                    class:'py-4',
                    id: "site-title",
                    text: params.title,
                    
                    onReady: () => {
                        $("#site-title").on("click", () => {
                            window.Emitter.Send("/page/redirect", "/");
                        })
                    }
                }),
                bw.Button({
                    class:'navbar-toggler burger-button', type:'button',
                    'data-toggle': 'collapse', 'data-target': '#navbarContent',
                    'aria-controls': 'navbarContent', 'aria-expanded': 'false',
                    'aria-label': 'Toggle Navigation',
                    onReady: () => $('.burger-button').on('click', function () {$('.animated-burger').toggleClass('open');})
                }).append([
                    bw.Div({class:'animated-burger'}).append([
                        bw.Span({}),bw.Span({}),bw.Span({})
                    ])
                ]),
                bw.Div({
                    class:'collapse navbar-collapse',
                    id:'navbarContent'
                }).append([
                    bw.UnorderedList({class:'navbar-nav mr-auto'}).append(params.links.map((l) => navItem(l)))
                ])
            ]);
        },

        /*
        Assumes first item is active
        items: the names of the pills
        links: the links for the pill bodies
        */
        SkNavPills: (params) => {
            return bw.UnorderedList({
                class: "nav nav-pills"
            }).append(params.items.map((item, index) => {
                return bw.ListItem({
                    class: "nav-item"
                }).append([
                    bw.Anchor({
                        class: "nav-link " + ((index == 0) ? "active" : ""),
                        href: `#${params.links[index]}`,
                        id: `${params.items[index]}-pill`,
                        "data-toggle": "tab",
                        text: item
                    })
                ]);
            }));
        },

        /*
        Create a SELECT element from the current classifications list. 
        id: the id of the select field
        on_change: a function that will be called whenever the select changes
        */
        SkClassificationSelect: (params) => {
            let def = config.default_classification

            return bw.Select({
                class: "form-control custom-select browser-default",
                id: params.id,
        
                onReady: () => {
                    $("#" + params.id).on("change", () => {
                        window.Emitter.Send("/classification/update");
                    });
                }
            }).append(config.classifications.map((value) => {
                if (value == def)
                    return bw.Option({text: value, selected: "selected"});
                else
                    return bw.Option({text: value});     
            }));
        },

        SkCalendar: (params) => {
            return bw.Div({
                class: "input-group date",
                id: params.i,
                "data-target-input": "nearest",

                onReady: () => {
                    $("#" + params.i).datetimepicker();
                }
            }).append([
                bw.Div({
                    class: "input-group-prepend",
                    "data-target": "#" + params.i,
                    "data-toggle": "datetimepicker"
                }).append([
                    bw.Div({
                        class: "input-group-text"
                    }).append([
                        bw.Icon({
                            class: "fas fa-calendar"
                        })
                    ])
                ]),

                bw.Input({
                    class: "form-control datetimepicker-input",
                    "data-target": "#" + params.i,
                    type: "text",
                    placeholder: "Timestamp"                              
                })                
            ]);
        },

        /*
        id: the id of the input field
        */
        SkUsernameEntry: (params) => {
            return bw.Div({
                class: "input-group"
            }).append([
                bw.Div({
                    class: "input-group-prepend"
                }).append([
                    bw.Span({class: "input-group-text", text: "@"})
                ]),

                bw.Input({
                    type: 'text',
                    id: params.id,
                    class: 'form-control',
                    placeholder: "Username"
                })
            ]);
        },

        /*
        id: the id of the file input
        on_change: a function to call whenever the file changes,
        label:
        */
        SkFileUpload: (params) => {
            return bw.Div({
                class: "custom-file mb-5"
            }).append([
                bw.Input({
                    type: 'file',
                    id: params.id,
                    class: 'custom-file-input',
                
                    onReady: () => {
                        $(`#${params.id}`).on("change", () => {
                            params.on_change();
                            return false;
                        });
                    }
                }),
                bw.Label({
                    class: "custom-file-label",
                    for: params.id,
                    text:  params.label
                })
            ])
        },

        /*
        id: the id for the outer part of the progress bar
        */
        SkProgressBar: (params) => {
            return bw.Div({
                class: "progress mb-5",
                id: params.id,
                style: "height: 30px;" + ((params["hide"] == undefined || params.hide) ? "display: none;" : "")
            }).append([
                bw.Div({
                    class: "progress-bar progress-bar-striped progress-bar-animated",
                    style: "width: 0%;",
                    text: "0%"
                })
            ])
        },

        SkClassificationBanner: (params) => {
            return bw.Div({
                class: "text-center pt-3 mdb-color darken-4",
            }).append([
                bw.Header({
                    class: "text-danger mb-0",
                    order: "4",
                    id: "class-banner",
                    text: config.default_classification
                }),                
            ])
        },

        /*
        text: the text for the banner
        */
        SkBanner: (params) => {
            return bw.Div({
                class:'jumbotron jumbotron-fluid unique-color-dark mt-5'
            }).append([
                bw.Div({
                    class:'container text-white'
                }).append([
                    bw.Header({
                        order:'2',
                        text: params.text
                    })
                ])
            ])
        },

        /*
        juid:
        expected_count:
        actual_count:
        timestamp:
        group:
        loaded: {juid1, ...}
        skController: 
        */
        SkJobModal: (params) => {
            return bw.Div({
                class: "row mb-3"
            }).append([
                bw.Div({
                    class: "col-5"
                }).append([
                    bw.Header({
                        order: "6",
                        text: params.group
                    })
                ]),

                bw.Div({
                    class: "col"
                }).append([
                    bw.Div({
                        class: "progress",
                        style: "height: 30px;"
                    }).append([
                        bw.Div({
                            class: "progress-bar progress-bar-striped " + ((params.actual_count != params.expected_count) ? "progress-bar-animated" : "bg-success"),
                            style: `width: ${params.actual_count/params.expected_count * 100}%`,
                            text: `${params.actual_count}/${params.expected_count}`
                        })
                    ])
                ]),

                bw.Div({
                    class: "col"
                }).append([
                    bw.Div({
                        class: "custom-control custom-checkbox"
                    }).append([
                        bw.Input({
                            class: "custom-control-input",
                            type: "checkbox",
                            id: `show-job-${params.juid}`,
                            def_extra: (params.loaded.has(params.juid)) ? "checked" : "",

                            onReady: () => {
                                $(`#show-job-${params.juid}`).on("change", (event) => {
                                    if (event.target.checked) {
                                        window.Emitter.Send("/job/load", {
                                            juid: params.juid,
                                            expected_count: params.expected_count,
                                            group: params.group
                                        });
                                    } else {
                                        window.Emitter.Send("/job/unload", {juid: params.juid});
                                    }
                                })
                            }
                        }),
                        bw.Label({
                            class: "custom-control-label",
                            for: `show-job-${params.juid}`,
                            text: "Show"
                        })
                    ])
                ])
            ])
        },
        
        /*
        juid:
        expected_count:
        actual_count:
        timestamp:
        group:
        loaded: {juid1, ...}
        skController: 
        */
        SkJobAdmin: (params) => {       
            return bw.Div({
                class: "row align-items-center mb-5",
                id: `job-${params.juid}`
            }).append([
                bw.Div({
                    class: "col-2"
                }).append([
                    bw.Header({
                        order: "5",
                        text: params.group
                    })
                ]),

                bw.Div({
                    class: "col-2"
                }).append([
                    bw.Header({
                        order: "6",
                        text: new Date(params.timestamp * 1000).toLocaleString()
                    })
                ]),

                bw.Div({
                    class: "col-5"
                }).append([
                    bw.Div({
                        class: "progress",
                        style: "height: 30px;"
                    }).append([
                        bw.Div({
                            class: "progress-bar progress-bar-striped " + ((params.actual_count != params.expected_count) ? "progress-bar-animated" : "bg-success"),
                            style: `width: ${params.actual_count/params.expected_count * 100}%`,
                            text: `${params.actual_count}/${params.expected_count}`
                        })
                    ])
                ]),

                bw.Div({
                    class: "col-3"
                }).append([
                    bw.Div({
                        class: "row"
                    }).append([                    
                        bw.Button({
                            class: "btn btn-danger",
                            text: "Delete Job",
                            id: `delete-job-${params.juid}`,
        
                            onReady: () => {
                                $(`#delete-job-${params.juid}`).on("click", () => {
                                    params.skController.ConfigureYesNoModal({
                                        title: `Delete ${params.group}?`,
                                        text: "Are you sure you want to delete this job? It cannot be undone.",
                                        cancel_text: "Cancel",
                                        continue_text: "Delete Job",
                                        continue_callback: () => {
                                            window.Emitter.Send("/job/delete", [params.juid]);
                                            $(`#job-${params.juid}`).remove();
                                        }
                                    });
                                    
                                    $("#yes-no-modal").modal("show");
                                });
                            }
                        }).append([
                            bw.Icon({
                                class: "fas fa-trash"
                            })
                        ])
                    ])                
                ])
            ])
        },

        /*
        items: [{
            id:
            checked:
            label:
            disabled: 
        }]
        */
        SkChartToggles: (params) => {
            return Object.keys(params.items).map(key => {
                return bw.Div({
                    class: "custom-control custom-switch row",
                    style: (params.items[key].disabled) ? "display: none;" : ""
                }).append([
                    bw.Input({
                        class: "custom-control-input",
                        id: `${key}Switch`,
                        type: "checkbox",
                        "data-updateCount": 0,
                        def_extra: ((params.items[key].checked) ? "checked" : "") + ((params.items[key].disabled) ? " disabled" : ""),

                        onReady: () => {
                            $(`#${key}Switch`).on("change", (item) => {
                                $(`#${key}Outer`).toggle();

                                if (item.target.checked) {                                
                                    window.Emitter.Send("/update/chart", {
                                        id: key,
                                        last_update_count: $(`#${key}Switch`)[0].dataset.updateCount
                                    });
                                }

                                return false;
                            });
                        }
                    }),
        
                    bw.Label({
                        class: "custom-control-label",
                        for: `${key}Switch`,
                        text: params.items[key].label
                    })
                ]); 
            });        
        },

        /*
        id:
        title:
        text:
        cancel_text:
        cancel_callback:
        continue_text:
        continue_callback:
        */
        SkYesNoModal: (params) => {
            return bw.Div({
                class: "modal fade",
                id: params.id
            }).append([
                bw.Div({
                    class: "modal-dialog modal-dialog-centered modal-danger modal-notify"
                }).append([
                    bw.Div({
                        class: "modal-content"
                    }).append([
                        bw.Div({
                            class: "modal-header d-flex justify-content-center text-white"
                        }).append([
                            bw.Header({
                                class: "modal-title",
                                order: "5",
                                text: "Title"
                            }),
                        ]),

                        bw.Div({
                            class: "modal-body row align-items-center"
                        }).append([
                            bw.Div({
                                class: "col-2"
                            }).append([
                                bw.Icon({
                                    class: "fas fa-times fa-4x animated rotateIn"
                                })
                            ]),                        
                            
                            bw.Div({
                                class: "col-10"
                            }).append([
                                bw.Anchor({
                                    text: "Text"
                                })
                            ])                        
                        ]),

                        bw.Div({
                            class: "modal-footer"
                        }).append([
                            bw.Button({
                                class: "btn btn-outline-danger",
                                type: "button",
                                "data-dismiss": "modal",
                                id: `${params.id}Cancel`,
                                text: "Cancel"
                            }),
                            bw.Button({
                                class: "btn btn-danger waves-effect",
                                type: "button",
                                "data-dismiss": "modal",
                                id: `${params.id}Continue`,
                                text: "Continue"
                            })
                        ])
                    ])
                ])
            ]);
        },

        /*
        headers: [header1, ...]
        rows: [[value1, ...], ...],
        is_first_column_header: [optional]
        */
        SkBasicTable: (params) => {
            return bw.Table({
                class: "table",
            }).append([
                bw.TableHeader({
                }).append([
                    bw.TableRow({                
                    }).append([
                        ...params.headers.map(value => {
                            return bw.TableHead({text: value});
                        })
                    ])
                ]),

                bw.TableBody({            
                }).append([
                    ...params.rows.map(row => {
                        return bw.TableRow({}).append([
                            ...row.map((value, index) => {
                                if (index == 0 && params["is_first_column_header"] != undefined && params.is_first_column_header)
                                    return bw.TableHead({text: value});
                                else
                                    return bw.TableData({text: value});
                            })
                        ])
                    })
                ])
            ])
        },

        /*
        icon:
        title:
        body:
        color:
        name: 
        callback:
        */
        SkCard: (params) => {
            return bw.Div({
                class: "col-lg-4 col-md-6 col-sm-12 text-center hoverable pt-3",
                style: "cursor: pointer;",
                id: `${params.name}Card`,

                onReady: () => {
                    $(`#${params.name}Card`).on("click", params.callback)
                }
            }).append([
                bw.Icon({
                    class: `fas fa-${params.icon} fa-3x ${params.color}-text`
                }),

                bw.Header({
                    class: "mt-4",
                    order: "4",
                    text: params.title
                }),

                bw.Paragraph({
                    text: params.body
                })
            ])
        },

        /*
        id:
        title:
        side:
        body: [optional], array of items to place in the body
        */
        SkEdgeModal: (params) => {
            return bw.Div({
                class: `modal fade ${params.side}`,
                id: params.id
            }).append([
                bw.Div({
                    class: `modal-dialog modal-full-height modal-${params.side}`
                }).append([
                    bw.Div({
                        class: "modal-content"
                    }).append([
                        bw.Div({
                            class: "modal-header"
                        }).append([
                            bw.Header({
                                class: "modal-title w-100",
                                order: "2",
                                text: params.title
                            }),
                            bw.Button({
                                class: "close",
                                type: "button",
                                "data-dismiss": "modal"
                            }).append([
                                bw.Span({
                                    text: "&times;"
                                })
                            ])
                        ]),

                        bw.Div({
                            class: "modal-body"
                        }).append(
                            (params["body"] != undefined) ? params.body : []
                        ),

                        bw.Div({
                            class: "modal-foot justify-content-center"
                        })
                    ])
                ])
            ])
        },
        
        /*
        id:
        type:
        icon:
        text:
        callback:
        */
        SkIconButton: (params) => {
            return bw.Button({
                class: `btn btn-${params.type}`,
                type: "button",
                text: params.text,
                id: params.id,

                onReady: () => {
                    $(`#${params.id}`).on("click", params.callback);
                }
            }).append([
                bw.Icon({
                    class: `fas fa-${params.icon}`
                })
            ])
        },

        /*
        id:
        input:
        label:
        */
        SkFilterRow: (params) => {
            return bw.Div({
                class: "col"
            }).append([
                bw.Div({
                    class: "row"
                }).append([
                    bw.Label({
                        class: "col col-form-label",
                        text: params.label,
                        for: params.id
                    })
                ]), 
                
                bw.Div({
                    class: "form-group row align-items-center"
                }).append([
                    params.input
                ])                    
            ]);
        },

        /*
        id:
        config:
        callback:
        */
        SkDateRangePicker: (params) => {
            return bw.Div({
                id: params.id,
                class: "form-control",
                onReady: () => {
                    $(`#${params.id}`).daterangepicker(params.config);
                    $(`#${params.id}`).on("apply.daterangepicker", params.callback);
                }
            }).append([
                bw.Icon({
                    class: "fas fa-calendar"
                }),
                bw.Span({
                    style: "margin-left: 1rem;"
                }),
            ])
        },

        /*
        id:
        text:
        callback:
        color:
        */
        SkChip: (params) => {
            return bw.Span({
                class: `chips pointer hoverable py-2 px-3 mr-2 mb-2 rounded-pill ${params.color}`,
                text: params.text,            
                id: params.id
            }).append([
                bw.Icon({
                    class: "fas fa-times pointer ml-2 hover-text-gray-darken-3",
                    onReady: () => {
                        $(`#${params.id} i`).on("click", (event) => {
                            $(`#${params.id}`).remove();
                            params.callback(event);
                        })
                    }
                })
            ])
        },

        /*
        id:
        callback: 
        */
        SkFileDragZone: (params) => {
            return bw.Div({
                class: "col p-0 rounded"
            }).append([
                bw.Div({
                    class: "row m-4 rounded align-items-center pointer grey lighten-3 drop-zone-dark drop-zone",
                    style: "border: 2px dashed; height: 20em;",
                    id: `${params.id}-dropzone`,

                    onReady: () => {
                        $(`#${params.id}-dropzone`).on("drop", (event) => {             
                            $(`#${params.id}`)[0].files = event.originalEvent.dataTransfer.files;                    
                            $(`#${params.id}`).trigger("change");
                        });

                        $(`#${params.id}-dropzone`).on("click", (event) => {
                            $(`#${params.id}`).click();                        
                        });

                        $(`#${params.id}-dropzone`).on("dragenter dragexit dragleave dragover drop", (event) => {
                            event.preventDefault();                        
                        });

                        $(`#${params.id}-dropzone`).on("dragenter", () => {
                            drag_counter++;
                            
                            if (drag_counter === 1) {
                                $(`#${params.id}-dropzone div, #${params.id}-dropzone`).removeClass("drop-zone-dark");
                                $(`#${params.id}-dropzone div, #${params.id}-dropzone`).addClass("drop-zone-light");
                            }
                        });

                        $(`#${params.id}-dropzone`).on("dragleave drop", () => {
                            drag_counter--;

                            if (drag_counter === 0) {
                                $(`#${params.id}-dropzone div, #${params.id}-dropzone`).removeClass("drop-zone-light");
                                $(`#${params.id}-dropzone div, #${params.id}-dropzone`).addClass("drop-zone-dark");                            
                            }
                        })
                    }
                }).append([
                    bw.Div({
                        class: "col text-center drop-zone-dark"
                    }).append([
                        bw.Icon({
                            class: "fas fa-cloud-upload-alt fa-3x"
                        }),

                        bw.Header({
                            order: "2",
                            class: "mt-2",
                            text: "Click or Drag File"
                        }),
        
                        bw.Anchor({
                            class: "lead",
                        })
                    ])                
                ]),

                bw.Input({
                    type: 'file',
                    id: params.id,
                    style: "display: none;",
                    
                    onReady: () => {
                        $(`#${params.id}`).on("change", () => {
                            params.callback(params.id);
                            return false;
                        });
                    }
                })
            ]);
        },

        /*
        id:
        type:
        title:
        body:
        */
        SkAlert: (params) => {
            return bw.Div({
                class: `alert fade show alert-${params.type} ${(params.dismissible) ? "alert-dismissible" : ""}`,
                id: params.id
            }).append([
                bw.Header({
                    class: "alert-heading",
                    order: "4",
                    text: params.title
                }),

                bw.Paragraph({
                    text: params.body
                }),

                bw.Button({
                    type: "button",
                    class: "close",
                    "data-dismiss": "alert",
                    style: (params.dismissible) ? "" : "display: none;"
                }).append([
                    bw.Span({
                        text: "&times;"
                    })
                ])
            ])
        },

        InfoPanel : function(params) {
            return bw.Div({
                class:'col-md-4 d-flex'
            }).append([
                bw.Div({
                    class:`card text-white bg-${params.color} mb-4 flex-fill`
                }).append([
                    bw.Div({
                        class:`card-body text-${params.color}`
                    }).append([
                        bw.Div({
                            class:'row'
                        }).append([
                            bw.Div({
                                class:'col-5'
                            }).append([
                                bw.Paragraph({}),
                                bw.Paragraph({
                                    class:'text-center'
                                }).append([
                                    bw.Icon({
                                        class:`fa fa-${params.icon} fa-3x text-white`
                                    })
                                ])
                            ]),
                            bw.Div({
                                class:'col-7'
                            }).append([
                                bw.Paragraph({}),
                                bw.Paragraph({
                                    class:'text-center text-white'
                                }).append([
                                    bw.Header({
                                        order:'3',
                                        text:`${params.value}`,
                                        id:`${params.id}`
                                    })
                                ])
                            ])
                        ])
                    ]),
                    bw.Div({
                        class:`card-footer text-center`,
                        text:`${params.title}`
                    })
                ])
            ]);
        },

        // new for data viz
        TopLevelSummary: (params) => {
            return bw.Div({
                class:'col-12'
            }).append([
                bw.Div({class:'row wow fadeIn'}).append([
                    self.InfoPanel({color:'dark', icon:'funnel-dollar', title:'Total Dollars', id:'dollar-summary', value:'0'}),
                    self.InfoPanel({color:'dark', icon:'search-dollar', title:'Total Activity', id:'activity-summary', value:'0'}),
                    self.InfoPanel({color:'dark', icon:'user-tag', title:'Unique Entities', id:'entity-summary', value:'0'})
                ]),
                bw.Div({class:'row wow fadeIn'}).append([
                    self.InfoPanel({color:'primary', icon:'flag-usa', title:'Largest Cumulative Recipient', id:'bigrecipient-summary', value:'0'}),                    
                    self.InfoPanel({color:'primary', icon:'donate', title:'Largest Single Transaction', id:'bigdonation-summary', value:'0'}),
                    self.InfoPanel({color:'primary', icon:'landmark', title:'Largest Cumulative Donor', id:'bigdonor-summary', value:'0'}),
                ])
            ])
        },

        /*
        id:
        options:
        callback:
        */
        SkSelect: (params) => {
            return bw.Select({
                id: params.id,
                class: "custom-select",
                onReady: () => {
                    $(`#${params.id}`).on("change", params.callback);
                }
            }).append([
                ...params.options.map(option => {
                    return bw.Option({
                        text: option,
                        value: option
                    })
                })
            ])
        }
    }
    return self;
}
