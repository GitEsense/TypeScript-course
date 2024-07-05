declare module 'sort-by' {
    type Map = (key: string, value: any) => any
    type Sort<T> = (a: T, b: T) => number;

    function sortBy<T> (...args: string[]): Sort<T>
    function sortBy<T> (...args: Array<string | Map>): Sort<T>

    export default sortBy
}