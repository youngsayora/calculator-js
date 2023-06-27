class EventDispatcher {
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


class CalculationHandler {
    modes = [];

    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }

    handle(context) {
        context.firstNumber = context.firstNumber ?? Math.floor(Math.random() * 100);
        context.secondNumber = context.secondNumber ?? Math.floor(Math.random() * 100);
        context.modeLog = [];
        context.failLog = [];

        this.beforeGenerate(context);
        this.generate(context);
        this.afterGenerate(context);
    }

    generate(context) {
        let countIterations = 0;

        while (countIterations < 30 && context.isResultSuccess === false) {
            countIterations++;
            let succeedModes = [];
            context.modeLog = [];

            this.dispatcher.emit('CALCULATION_STEP_START', { item: context, modes: this.modes });

            this.modes = shuffleArray(this.modes);

            for (let mode of this.modes) {
                try {
                    this.dispatcher.emit('CALCULATION_MODE_START', { item: context, mode });

                    mode.calculate(context);

                    this.dispatcher.emit('CALCULATION_MODE_DONE', { item: context, mode });

                    succeedModes.push(mode.name);

                } catch (e) {
                    break;
                }

            }

            if (succeedModes.length !== this.modes.length) {
                this.dispatcher.emit('CALCULATION_STEP_FAIL', { item: context, modes: this.modes });
            }

            context.isResultSuccess = succeedModes.length === this.modes.length;
            context.countIterations = countIterations;
        }
    }

    beforeGenerate(context) {
        this.dispatcher.emit('CALCULATION_START', { item: context, modes: this.modes });
    }

    afterGenerate(context) {
        this.dispatcher.emit('CALCULATION_DONE', { item: context, modes: this.modes });
    }

    addMode(mode) {
        this.modes.push(mode);
    }

    removeMode(name) {
        this.modes = this.modes.filter(mode => mode.name !== name);
    }
}

// Стратегии
class DivisionStrategy {
    name = 'деление';

    calculate(item) {
        if (item.total < 1000) {
            throw new Error('LogicException');
        }

        item.total = item.firstNumber / item.secondNumber;
    }
}

class MultiplyStrategy {
    name = 'умножение';

    calculate(item) {
        if (item.total < 10) {
            throw new Error('LogicException');
        }

        item.total = item.firstNumber * item.secondNumber;
    }
}

class SubtractionStrategy {
    name = 'вычитание';

    calculate(item) {
        if (item.total > 1000) {
            throw new Error('LogicException');
        }

        item.total = item.firstNumber - item.secondNumber;
    }
}

class SumStrategy {
    name = 'сложение';

    calculate(item) {
        if (item.total < 0) {
            throw new Error('LogicException');
        }

        item.total = item.firstNumber + item.secondNumber;
    }
}

class Observer {
    constructor(name) {
        this.name = name;
    }

    update(data) {
        console.log(`Observer ${this.name} received data:`, data);
    }
}

class ObserveCalculationDone extends Observer {
    constructor() {
        super('ObserveCalculationDone');
    }

    update(data) {
        if (data.item.isResultSuccess === false) {
            console.log('Удачная комбинация не найдена');
            return;
        }

        console.log('Найдена удачная комбинация: ');
        console.log(`Число 1 - ${data.item.firstNumber}`);
        console.log(`Число 2 - ${data.item.secondNumber}`);
        console.log('Последовательность действий: ');
        console.log(data.modes.map(obj => obj.name).join(', '));
        console.log(`Выполнено итераций ${data.item.countIterations}`);
        console.log('Лог выполнения: ');
        console.log(data.item.modeLog.join('\n'));
        console.log('Неудачные комбинации: ');
        console.log(data.item.failLog.join('\n'));
    }
}

class ObserveCalculationModeDone extends Observer {
    constructor() {
        super('ObserveCalculationModeDone');
    }

    update(data) {
        data.item.modeLog.push(`Выполнено действие: ${data.mode.name}. Результат ${data.item.total}`);
    }
}

class ObserveCalculationModeStart extends Observer {
    constructor() {
        super('ObserveCalculationModeStart');
    }

    update(data) {
        data.item.modeLog.push(`Текущий результат ${data.item.total}`);
    }
}

class ObserveCalculationStepFail extends Observer {
    constructor() {
        super('ObserveCalculationStepFail');
    }

    update(data) {
        data.item.failLog.push(data.modes.map(obj => obj.name).join(', '));
    }
}

let dispatcher = new EventDispatcher();
let handler = new CalculationHandler(dispatcher);

handler.addMode(new DivisionStrategy());
handler.addMode(new MultiplyStrategy());
handler.addMode(new SubtractionStrategy());
handler.addMode(new SumStrategy());

// Подписываем наблюдателей
dispatcher.subscribe('CALCULATION_MODE_START', new ObserveCalculationModeStart());
dispatcher.subscribe('CALCULATION_MODE_DONE', new ObserveCalculationModeDone());
dispatcher.subscribe('CALCULATION_STEP_FAIL', new ObserveCalculationStepFail());
dispatcher.subscribe('CALCULATION_DONE', new ObserveCalculationDone());

let context = {
    firstNumber: undefined,
    secondNumber: undefined,
    total: 0,
    isResultSuccess: false,
};

handler.handle(context);

$(document).ready(function() {
    $('#app').text('');
});