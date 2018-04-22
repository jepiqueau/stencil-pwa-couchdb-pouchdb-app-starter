import { getRowInArray, isRowInArray, getValueFromKey, isKeyInArray, indexofKeyInArray,
         deleteKeyInArray, getKeysFromArray, getValuesFromArray, getHighestKey } from './utilities';

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
        const row: any = isRowInArray(arr,{key:1,value:{component:'app-profile',el:'HTMLAppProfileElement'}});
        expect(row).toBeTruthy();
    });
    it('should return false if row does not exist in an Array', async () => {
        const row: any = isRowInArray(arr,{key:4,value:{component:'app-pouchdb',el:'HTMLAppPouchdbElement'}});
        expect(row).toBeFalsy();
    });
    it('should return row 1 from an Array', async () => {
        const row: any = getRowInArray(arr,{key:1,value:{component:'app-profile',el:'HTMLAppProfileElement'}});
        expect(row).toEqual({key:1,value:{component:'app-profile',el:'HTMLAppProfileElement'}});
    });
    it('should return row 2 from an Array', async () => {
        const row: any = getRowInArray(arr,{"key":2,"value":{"component":'app-menu',"el":'HTMLAppMenuElement'}});
        expect(row).toEqual({"key":2,"value":{"component":'app-menu',"el":'HTMLAppMenuElement'}});
    });
    it('should return row 3 from an Array', async () => {
        const row: any = getRowInArray(arr,{"key":3,"value":{"component":'app-popover',"el":'HTMLAppPopoverElement'}});
        expect(row).toEqual({"key":3,"value":{"component":'app-popover',"el":'HTMLAppPopoverElement'}});
    });
    it('should return value for key = 1 from an Array', async () => {
        const value: any = getValueFromKey(arr,1);
        expect(value).toEqual({component:'app-profile',el:'HTMLAppProfileElement'});
    });
    it('should return true if a given Key exists in an Array', async () => {
        const res: any = isKeyInArray(arr,1);
        expect(res).toBeTruthy();
    });
    it('should return false if a given Key does not exist in an Array', async () => {
        const res: any = isKeyInArray(arr,5);
        expect(res).toBeFalsy();
    });
    it('should return the index of a given Key existing in an Array', async () => {
        const res: any = indexofKeyInArray(arr,2);
        expect(res).toEqual(1);
    });
    it('should return index -1 if a given Key does not exist in an Array', async () => {
        const res: any = indexofKeyInArray(arr,5);
        expect(res).toEqual(-1);
    });
    it('should return true when deleting Key=1 in an Array', async () => {
        const res: any = deleteKeyInArray(arr,1);
        expect(res).toBeTruthy();
    });
    it('should return true when deleting Key=2 in an Array', async () => {
        const res: any = deleteKeyInArray(arr,2);
        expect(res).toBeTruthy();
    });
    it('should return false when trying to delete a non-existing Key in an Array', async () => {
        const res: any = deleteKeyInArray(arr,5);
        expect(res).toBeFalsy();
    });
    it('should return Keys from Array', async () => {
        const res: any = getKeysFromArray(arr);
        expect(res.length).toEqual(3);
        expect(res[0]).toEqual(1);
        expect(res[1]).toEqual(2);
        expect(res[2]).toEqual(3);
    });
    it('should return Values from Array', async () => {
        const res: any = getValuesFromArray(arr);
        expect(res.length).toEqual(3);
        expect(res[0]).toEqual({"component":'app-profile',"el":'HTMLAppProfileElement'});
        expect(res[1]).toEqual({"component":'app-menu',"el":'HTMLAppMenuElement'});
        expect(res[2]).toEqual({"component":'app-popover',"el":'HTMLAppPopoverElement'});
    });
    it('should return 3 as the highest key from Array', async () => {
        const res: any = getHighestKey(arr);
        expect(res).toEqual(3);
    });
    it('should return 3 as the highest key from Array where key=2 has been deleted', async () => {
        arr.splice(1,1);
        const res: any = getHighestKey(arr);
        expect(res).toEqual(3);
    });
    it('should return 2 as the highest key from Array where last key has been deleted', async () => {
        arr.splice(-1);
        const res: any = getHighestKey(arr);
        expect(res).toEqual(2);
    });
    it('should return 1 as the highest key from Array where the two last keys have been deleted', async () => {
        arr.splice(-2);
        const res: any = getHighestKey(arr);
        expect(res).toEqual(1);
    });

});
