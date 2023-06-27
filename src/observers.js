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

export {ObserveCalculationStepFail, ObserveCalculationDone, ObserveCalculationModeDone, ObserveCalculationModeStart}