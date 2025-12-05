const { EventEmitter } = require("events");

var instance = null;
class Emitter {

    constructor() {
        if(!instance){
            this.emitter ={};
            instance = this;
        }
    }
    getEmitter(name) {
        return this.emitter[name];

    }

    addEmitter(name) {
        this.emitter[name] = new EventEmitter();
        return this.emitter[name];
    }

}

module.exports = new Emitter();