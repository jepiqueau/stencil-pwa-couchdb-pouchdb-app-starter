export function getHighestKey(arr: Array<{key:number,value:any}>): number {
    let minimum: number = -1;
    arr.forEach((item) => {
      if (item.key > minimum) {
        minimum = item.key;
      }
    });
    return minimum;
}
export function getRowInArray(arr:Array<any> ,row:any): any {
    // row is of type {key:key,value:value}
    return arr.find(x => {return JSON.stringify(x) === JSON.stringify(row)})
}
export function getValueFromKey(arr:Array<any>,key:any): any { 
    let res: any = arr.find(x => {return x.key === key});
    if(typeof res === 'undefined') return false;
    return res.value;
}
export function isRowInArray(arr:Array<any> ,row:any): boolean {
    // row is of type {key:key,value:value}
    let ret: boolean = true;
    let res = arr.find(x => {return JSON.stringify(x) === JSON.stringify(row)})
    if(typeof res === 'undefined') ret = false;
    return ret;
}
export function isKeyInArray(arr:Array<any> ,key:any): boolean {
    // row is of type {key:key,value:value}
    let ret: boolean = true;
    let res:number = indexofKeyInArray(arr,key);
    if(res < 0) ret = false;
    return ret;
}
export function indexofKeyInArray(arr:Array<any> ,key:any): number {
    // row is of type {key:key,value:value}
    return arr.findIndex(x => {return x.key === key})
}
export function deleteKeyInArray(arr:Array<any> ,key:any): boolean {
    // row is of type {key:key,value:value}
    let ret:boolean = false;
    let n: number = arr.length;
    let index:number = indexofKeyInArray(arr,key);
    if ( index >= 0 ) {
        arr.splice(index,1) 
        if(arr.length === n-1) ret = true; 
    }
    return ret;
}
export function getKeysFromArray(arr:Array<any>): Array<any> {
    let ret:Array<any> = [];
    arr.forEach((x) => ret = [...ret,x.key]);
    return ret;
}
export function getValuesFromArray(arr:Array<any>): Array<any> {
    let ret:Array<any> = [];
    arr.forEach(x => ret = [...ret,x.value]);
    return ret;
}
