export default class EventDispatcher {
    constructor() {
        this.events = {};
    }

    subscribe(eventType, observer) {
        if (this.events[eventType]) {
            this.events[eventType].push(observer);
        } else {
            this.events[eventType] = [observer];
        }
    }

    unsubscribe(eventType, observer) {
        if (this.events[eventType]) {
            this.events[eventType] = this.events[eventType].filter(obs => obs !== observer);
        }
    }

    emit(eventType, data) {
        if (this.events[eventType]) {
            this.events[eventType].forEach(observer => observer.update(data));
        }
    }
}
