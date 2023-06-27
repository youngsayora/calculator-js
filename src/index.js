import EventDispatcher from "./EventDispatcher.js";
import CalculationHandler from "./CalculationHandler.js";
import {DivisionStrategy, MultiplyStrategy, SumStrategy, SubtractionStrategy} from "./strategies.js";
import {
    ObserveCalculationModeStart,
    ObserveCalculationStepFail,
    ObserveCalculationDone,
    ObserveCalculationModeDone
} from "./observers.js";

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
