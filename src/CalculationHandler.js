function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


export default class CalculationHandler {
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
            context.total = 0;

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