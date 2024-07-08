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

function Catch({ rethrow }: { rethrow: boolean } = { rethrow: false }) {
    return (
        target: Object,
        _: string | symbol,
        descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
    ): TypedPropertyDescriptor<(...args: any[]) => any> | void => {
        const { value: method } = descriptor;

        descriptor.value = function (this: any, ...args: any[]) {
            try {
                return this
            } catch (e) {
                if (e instanceof Error) {
                    console.log(e.message);
                    if (rethrow) {
                        throw e;
                    }
                }
            }
        };
    };
}

function Validate(key: string){
    return (
        target: Object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
    ): TypedPropertyDescriptor<(...args: any[]) => any> | void => {
        const { value: method } = descriptor;

        descriptor.value = function(this: any, ...args: any[]){
            const [bodyOrkey, value] = args
        if (typeof bodyOrkey === 'object') {
            Object.assign(this[key], bodyOrkey);
        } else if (typeof bodyOrkey === 'string') {
            if (!value) {
                throw new Error('Значение не может быть пустым');
                // return this;
            }
            this[key][bodyOrkey] = value;
        }
        return this
        }
    }
}

class FetchBuilder {
    private url: string;
    private headers: Record<key, string> = {};
    private body: Record<key, string> = {};
    private method: keyof typeof FetchMethods;

    addMethod(method: keyof typeof FetchMethods) {
        this.method = FetchMethods[method];
        return this;
    }

    headerAppend(body: Record<string, string>): FetchBuilder;
    headerAppend(key: string, value: string): FetchBuilder;
    @Validate('headers')
    @Catch({rethrow: true})
    headerAppend() {
        return this;
    }
    bodyAppend(body: Record<key, string>): FetchBuilder;
    bodyAppend(key: string, value: string): FetchBuilder;
    @Validate('body')
    @Catch({rethrow: true})
    bodyAppend() {
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

type Products = Record<any, string>

interface IRequestAPI{
    sendRequestToDummy(id: number): Promise<Products[]> | undefined ;
}

class RequestAPI implements IRequestAPI{
    private products = [];
    private builder: FetchBuilder = new FetchBuilder();

    async sendRequestToDummy(id: number = 1): Promise<Products[]>  {
        const urlDefault = 'https://dummyjson.com/products/'
        this.products = await this.builder.clear().addMethod('GET').headerAppend('Content-Type', 'application/json').addUrl(urlDefault + id).exec()
        console.log({id, status: 'SUCCESS', data: this.products})
        return this.products
    }
}


class RequestAccessProxy implements IRequestAPI{
    constructor(private api: RequestAPI){

    }

    sendRequestToDummy(id: number): Promise<Products[]> | undefined {
        if(id > 10){
            console.log({id, status: 'FAILED', data: {statusText: `Извините, ID со значением ${id} - не подходит для запроса`}})
            return undefined
        }
        return this.api.sendRequestToDummy(id);
    }
}


const request = new RequestAccessProxy(new RequestAPI());
request.sendRequestToDummy(11)
request.sendRequestToDummy(8)