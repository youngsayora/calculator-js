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

export {DivisionStrategy, MultiplyStrategy, SubtractionStrategy, SumStrategy}