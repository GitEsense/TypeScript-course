const data = {
    id: 1,
    count: 225,
    price: 3000,
};

type functionType = <T extends Record<string, number>>(params: T) => Record<number, string>;

const swapKeysAndValues: functionType = function (obj) {
    // const array = Object.entries(obj);
    const array: [string, number][] = Object.keys(obj).map((k) => [k, obj[k]]); // IF ERROR: "entries" не существует в типе "ObjectConstructor"
    const reversedArray: [number, string][] = array.map(([key, value]) => [value, key]);
    const result = reversedArray.reduce((obj: Record<number, string>, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});

    return result;
};

const res = swapKeysAndValues(data);
console.log(res);
