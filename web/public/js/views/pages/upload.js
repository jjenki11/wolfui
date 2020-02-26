

module.exports = (skController, bw, aw, pg) => {

    pg('/upload', (event) => {
        window.Emitter.Send("/page/load", event.path);
        // test a get request
        $.get( "http://localhost:1337/test", function( data ) {
            alert( "TEST was performed." );
            console.log(data);
          });
    });

    var self = {

        render: (params) => {
            return bw.Div({'text':"Upload"})
        }
    };

    return self;

};