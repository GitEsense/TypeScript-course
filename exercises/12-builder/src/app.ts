enum FetchMethods {
    GET = 'GET',
    POST = 'POST',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    PUT = 'PUT',
}

interface IFetchOptions {
    method: FetchMethods;
    body: Record<string, string>;
    headers: Record<string, string>;
}
type key = string | number | symbol;

class GererateFetch {
    private url: string;
    private headers: Record<key, string> = {};
    private body: Record<key, string> = {};
    private method: keyof typeof FetchMethods;

    addMethod(method: keyof typeof FetchMethods) {
        this.method = FetchMethods[method];
        return this;
    }

    headerAppend(body: Record<string, string>): GererateFetch;
    headerAppend(key: string, value: string): GererateFetch;
    headerAppend(bodyOrkey: Record<string, string> | string, value?: string) {
        if (typeof bodyOrkey === 'object') {
            Object.assign(this.headers, bodyOrkey);
        } else if (typeof bodyOrkey === 'string') {
            if (!value) {
                console.log('Значение не может быть пустым');
                return this;
            }
            this.headers[bodyOrkey] = value;
        }
        return this;
    }
    bodyAppend(body: Record<key, string>): GererateFetch;
    bodyAppend(key: string, value: string): GererateFetch;
    bodyAppend(bodyOrkey: Record<key, string> | string, value?: string) {
        if (typeof bodyOrkey === 'object') {
            Object.assign(this.body, bodyOrkey);
        } else if (typeof bodyOrkey === 'string') {
            if (!value) {
                console.log('Значение не может быть пустым');
                return this;
            }
            this.body[bodyOrkey] = value;
        }
        return this;
    }

    addUrl(url: string) {
        if (!url) {
            console.log('URL не может быть пустым');
            return this;
        }
        this.url = url;
        return this;
    }
    clear() {
        (this.method = 'GET'), (this.headers = {}), (this.body = {});
        return this;
    }
    async exec() {
        const options: RequestInit = {
            method: this.method,
            headers: this.headers,
        };

        if (this.method !== 'GET') {
            options.body = JSON.stringify(this.body);
        }
        console.log(`fetch('${this.url}',`, options);
        const res = await fetch(this.url, options);
        const data = await res.json();
        return data;
    }
}
const fetchParam = new GererateFetch();

fetchParam
    .addMethod('GET')
    .addUrl('https://dummyjson.com/users')
    .headerAppend({ 'Content-Type': 'application/json' })
    .exec()
    .then((data) => {
        const { username, password } = data.users[0];
        fetchParam
            .clear()
            .addUrl('https://dummyjson.com/auth/login')
            .bodyAppend({ username, password })
            .addMethod('POST')
            .headerAppend('Content-Type', 'application/json')
            .exec()
            .then(console.log);
    });
