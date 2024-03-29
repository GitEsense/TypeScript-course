/*
    Необходимо написать функцию, 
    которая удаляет все ключи из первого объекта, 
    которые есть во втором объекте

    в git создать папку: 9-difference
*/

interface IA {
    a: number;
    b: string;
    c: boolean;
    d: number;
    e: boolean;
}

interface IB {
    a: number;
    b: string;
    e: number;
}

type IDifference<T, K> = {
    [key in keyof Omit<T, keyof K>]: T[key];
};

type key = number | string | symbol;

function diff<T extends Record<key, any>, K extends Record<key, any>>(a: T, b: K): IDifference<T, K> {
    return Object.entries(a)
        .filter(([f]) => !Object.keys(b).includes(f))
        .reduce<IDifference<T, K>>((map, [key, value]) => {
            map[key as keyof IDifference<T, K>] = value;
            return map;
        }, {} as IDifference<T, K>);
}

let a0: IA = { a: 10, b: 'str', c: false, d: 5, e: true };
let b0: IB = { a: 10, b: 'num', e: 5 };
const v0 = diff(a0, b0);

let a1: IA = { a: 10, b: 'str', c: false, d: 5, e: true };
let b1: IB = { a: 10, b: 'num', e: 5 };
const v1 = diff(a1, b1);
console.log(v1);
