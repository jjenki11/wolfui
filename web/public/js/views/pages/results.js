

module.exports = (skController, bw, aw, pg) => {



    pg('/results', (event) => {
        window.Emitter.Send("/page/load", event.path)               
    });

    let self = {        
        render: (params) => {
            return bw.Div({'text':"Results"})
        }
    };

    return self;
}