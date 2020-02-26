let commUnit = require('eventemitter3');

module.exports = () => {
    var self = {
        Emitter : new commUnit(),
        AttachHandler: (topic, action, context=null) => {
            self.Emitter.on(topic, action, context);
        },

        Send: (topic, message) => {
            self.Emitter.emit(topic, message);
        },

        DetachHandler: (topic) => {
            self.Emitter.off(topic, {});
        },

        RemoveHandler: (topic, action) => {
            self.Emitter.removeListener(topic, action);
        },

        ListenOnce: (topic, action) => {
            self.Emitter.once(topic, action);
        }
    };
    return self;
};