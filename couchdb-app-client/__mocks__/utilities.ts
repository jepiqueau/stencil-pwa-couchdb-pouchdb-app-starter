export function getRowInArray(arr:Array<any> ,row:any): Promise<any> {
    // row is of type {key:key,value:value}
    return Promise.resolve(
        arr.find(x => {return JSON.stringify(x) === JSON.stringify(row)})
    );
}
export async function getValueFromKey(arr:Array<any>,key:any): Promise<any> { 
    let res: any = await arr.find(x => {return x.key === key});
    if(typeof res === 'undefined') return Promise.resolve(false);
    return Promise.resolve(res.value);
}
export async function isRowInArray(arr:Array<any> ,row:any): Promise<boolean> {
    // row is of type {key:key,value:value}
    let ret: boolean = true;
    let res = await arr.find(x => {return JSON.stringify(x) === JSON.stringify(row)})
    if(typeof res === 'undefined') ret = false;
    return Promise.resolve(ret);
}
export async function isKeyInArray(arr:Array<any> ,key:any): Promise<boolean> {
    // row is of type {key:key,value:value}
    let ret: boolean = true;
    let res:number = await indexofKeyInArray(arr,key);
    if(res < 0) ret = false;
    return Promise.resolve(ret);
}
export async function indexofKeyInArray(arr:Array<any> ,key:any): Promise<number> {
    // row is of type {key:key,value:value}
    return Promise.resolve(
        arr.findIndex(x => {return x.key === key})
    );
}
export async function deleteKeyInArray(arr:Array<any> ,key:any): Promise<boolean> {
    // row is of type {key:key,value:value}
    let ret:boolean = false;
    let n: number = arr.length;
    let index:number = await indexofKeyInArray(arr,key);
    if ( index >= 0 ) {
        arr.splice(index,1) 
        if(arr.length === n-1) ret = true; 
    }
    return Promise.resolve(ret);
}
export async function getKeysFromArray(arr:Array<any>): Promise<Array<any>> {
    let ret:Array<any> = [];
    arr.forEach((x) => ret = [...ret,x.key]);
    return Promise.resolve(ret);
}
export async function getValuesFromArray(arr:Array<any>): Promise<Array<any>> {
    let ret:Array<any> = [];
    arr.forEach(x => ret = [...ret,x.value]);
    return Promise.resolve(ret);
}
