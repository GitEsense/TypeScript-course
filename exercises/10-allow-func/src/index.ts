/*
    Написать декоратор, который при присвоении проверяет
    присваиваемое значение функцией. 
    Если она возвращает true - присваивание происходит,
    если она возвращает false - присваивание не происходит

    в git создать папку: 10-allow-func
*/

type Gender = 'male' | 'female';

function allowFunc(fn: (...args: any) => boolean) {
    return (target: Object, propertyKey: string | symbol) => {
        let value: number;
        const setter = function (newValue: number) {
            try {
                const checkResult = fn(newValue);
                if (!checkResult) {
                    throw new Error(`Не удалось записать в параметр "${String(propertyKey)}" значение равное "${newValue}"`);
                }
                console.log(`Новое значение записано: ${String(propertyKey)} = ${newValue}`);
                value = newValue;
            } catch (e) {
                if (e instanceof Error) {
                    console.log(e.message);
                }
            }
        };
        const getter = function () {
            return value;
        };

        Object.defineProperty(target, propertyKey, {
            set: setter,
            get: getter,
        });
    };
}

function checkPattern(num: number): boolean {
    if (num % 4 === 0 || num % 7 === 0 || num < 0 || num > 1000) {
        return false;
    }
    return true;
}

function isMale(sex: Gender): boolean {
    if (sex === 'female') {
        return false;
    }
    return true;
}

class User {
    @allowFunc(checkPattern)
    age: number;
    @allowFunc(isMale)
    sex: Gender;
}

const person = new User();

for (let i = 0; i < 5; i++) {
    const num = Math.ceil(Math.random() * 2000) + 1;
    person.age = num;
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    person.sex = gender;

    const message = [];
    if (person.age) {
        message.push({ age: person.age });
    }
    if (person.sex) {
        message.push({ sex: person.sex });
    }
    if (message.length > 0) {
        console.log('\nРезультат: ', Object.assign({}, ...message), '\n');
    }
}
