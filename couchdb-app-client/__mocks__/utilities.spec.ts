import { getRowInArray, isRowInArray, getValueFromKey, isKeyInArray, indexofKeyInArray,
         deleteKeyInArray, getKeysFromArray, getValuesFromArray } from './utilities';

describe('utilities', () => {
    let arr: Array<any>;
    beforeEach(() => {
        arr = [
            {"key":1,"value":{"component":'app-profile',"el":'HTMLAppProfileElement'}},
            {"key":2,"value":{"component":'app-menu',"el":'HTMLAppMenuElement'}},
            {"key":3,"value":{"component":'app-popover',"el":'HTMLAppPopoverElement'}}      
        ]
    });
    afterEach(() => {
        arr = [];
    });

    it('should return true if row 1 exists in an Array', async () => {
        const row: any = await isRowInArray(arr,{key:1,value:{component:'app-profile',el:'HTMLAppProfileElement'}});
        expect(row).toBeTruthy();
    });
    it('should return false if row does not exist in an Array', async () => {
        const row: any = await isRowInArray(arr,{key:4,value:{component:'app-pouchdb',el:'HTMLAppPouchdbElement'}});
        expect(row).toBeFalsy();
    });
    it('should return row 1 from an Array', async () => {
        const row: any = await getRowInArray(arr,{key:1,value:{component:'app-profile',el:'HTMLAppProfileElement'}});
        expect(row).toEqual({key:1,value:{component:'app-profile',el:'HTMLAppProfileElement'}});
    });
    it('should return row 2 from an Array', async () => {
        const row: any = await getRowInArray(arr,{"key":2,"value":{"component":'app-menu',"el":'HTMLAppMenuElement'}});
        expect(row).toEqual({"key":2,"value":{"component":'app-menu',"el":'HTMLAppMenuElement'}});
    });
    it('should return row 3 from an Array', async () => {
        const row: any = await getRowInArray(arr,{"key":3,"value":{"component":'app-popover',"el":'HTMLAppPopoverElement'}});
        expect(row).toEqual({"key":3,"value":{"component":'app-popover',"el":'HTMLAppPopoverElement'}});
    });
    it('should return value for key = 1 from an Array', async () => {
        const value: any = await getValueFromKey(arr,1);
        expect(value).toEqual({component:'app-profile',el:'HTMLAppProfileElement'});
    });
    it('should return true if a given Key exists in an Array', async () => {
        const res: any = await isKeyInArray(arr,1);
        expect(res).toBeTruthy();
    });
    it('should return false if a given Key does not exist in an Array', async () => {
        const res: any = await isKeyInArray(arr,5);
        expect(res).toBeFalsy();
    });
    it('should return the index of a given Key existing in an Array', async () => {
        const res: any = await indexofKeyInArray(arr,2);
        expect(res).toEqual(1);
    });
    it('should return index -1 if a given Key does not in an Array', async () => {
        const res: any = await indexofKeyInArray(arr,5);
        expect(res).toEqual(-1);
    });
    it('should return true when deleting Key=1 in an Array', async () => {
        const res: any = await deleteKeyInArray(arr,1);
        expect(res).toBeTruthy();
    });
    it('should return true when deleting Key=2 in an Array', async () => {
        const res: any = await deleteKeyInArray(arr,2);
        expect(res).toBeTruthy();
    });
    it('should return false when trying to delete a non-existing Key in an Array', async () => {
        const res: any = await deleteKeyInArray(arr,5);
        expect(res).toBeFalsy();
    });
    it('should return Keys from Array', async () => {
        const res: any = await getKeysFromArray(arr);
        expect(res.length).toEqual(3);
        expect(res[0]).toEqual(1);
        expect(res[1]).toEqual(2);
        expect(res[2]).toEqual(3);
    });
    it('should return Values from Array', async () => {
        const res: any = await getValuesFromArray(arr);
        expect(res.length).toEqual(3);
        expect(res[0]).toEqual({"component":'app-profile',"el":'HTMLAppProfileElement'});
        expect(res[1]).toEqual({"component":'app-menu',"el":'HTMLAppMenuElement'});
        expect(res[2]).toEqual({"component":'app-popover',"el":'HTMLAppPopoverElement'});
    });
});
