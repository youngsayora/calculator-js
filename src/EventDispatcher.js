export default class EventDispatcher {
    static #instance;
    constructor() {
        if (EventDispatcher.#instance) {
            return EventDispatcher.#instance;
        }
        EventDispatcher.#instance = this;
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
