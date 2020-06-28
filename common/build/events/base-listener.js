"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Listener = /** @class */ (function () {
    function Listener(client) {
        this.ackWait = 5 * 1000;
        this.client = client;
    }
    Listener.prototype.subscriptionOptions = function () {
        return (this.client
            .subscriptionOptions()
            // setManualAckMode we have to run some processing to inform NATS that everything is fine. Otherwise NATS will send it back 30 sec later
            .setManualAckMode(true)
            // setDeliverAllAvailable get the event saved by NATS previously. Cool but can be messy after weeks or month of use :)
            .setDeliverAllAvailable()
            // Number of second before a message is unacked
            .setAckWait(this.ackWait)
            // setDurableName make sure we do not send same message several time to same service. As sson as it's acked, the message will never be send again
            .setDurableName('account-service'));
    };
    Listener.prototype.listen = function () {
        var _this = this;
        var subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on('message', function (msg) {
            console.log("Message Received: " + _this.subject + " / " + _this.queueGroupName);
            var parsedData = _this.parseMessage(msg);
            _this.onMessage(parsedData, msg);
        });
    };
    Listener.prototype.parseMessage = function (msg) {
        var data = msg.getData();
        return typeof data == 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    };
    return Listener;
}());
exports.Listener = Listener;
