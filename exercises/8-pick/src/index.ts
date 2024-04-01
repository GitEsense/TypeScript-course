/*
    Написать функцию получения нужных данных из объектов
    В git создать папку: 8-pick
*/
interface IUser {
    name: string;
    age: number;
    skills: string[];
    roles: string[];
}

const user: IUser = {
    name: 'Vasiliy',
    age: 8,
    skills: ['typescript', 'javascript'],
    roles: ['new', 'admin'],
};

type key = string | symbol | number;
interface IReduce<T> {
    [Key: key]: T[keyof T];
}
function pickObjectKeys<T extends IUser, K extends Array<keyof T>>(user: T, pattern: K) {
    return pattern.reduce((result: IReduce<T>, item) => {
        const currentItem = user[item];
        result[item] = currentItem;
        return result;
    }, {}) as Pick<T, K[number]>;
}

const res = pickObjectKeys(user, ['age', 'skills']);
console.log(res.skills);
