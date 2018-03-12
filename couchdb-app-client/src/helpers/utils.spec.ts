import {urlB64ToUint8Array,getFromDateISOStringToEnglish, nFirstWords,getDateISOString} from './utils'

const textData ='Lorem ipsum dolor sit amet, consectetur adipiscing elit. \
                Nullam blandit dolor libero, id scelerisque risus mollis ut.'

const array:Uint8Array = new Uint8Array([4, 27, 27, 225, 171, 185, 246, 148, 202, 23, 130, 10, 139, 230, 137,
                144, 64, 6, 61, 124, 109, 206, 207, 165, 110, 210, 249, 241, 12, 104,
                150, 196, 246, 79, 237, 221, 85, 2, 23, 77, 64, 130, 19, 84, 210, 99,
                200, 114, 82, 245, 203, 132, 145, 68, 82, 97, 251, 111, 148, 137, 125,
                36, 220, 79, 225]);
describe('utils', () => {
    it('should return an English Date', () => {
        const engDate: string = getFromDateISOStringToEnglish('2018-03-06T18:13:44.603Z');
        expect(engDate).toEqual('6 March 2018');
    });
    it('should return the fourth first words', () => {
        const text:string = nFirstWords(textData,4);
        expect(text).toEqual('Lorem ipsum dolor sit ...');
    });
    it('should return the seventh first words', () => {
        const text:string = nFirstWords(textData,7);
        expect(text).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing ...');
    });
    it('should return the date as ISO string', () => {
        const date:Date = new Date();
        const iso: string = getDateISOString(date);
        expect(iso).toEqual(date.toISOString());
    });
    it('should return Uint8Array from urlB64', () => {
        const publicServerKey: Uint8Array= urlB64ToUint8Array('BBsb4au59pTKF4IKi-aJkEAGPXxtzs-lbtL58QxolsT2T-3dVQIXTUCCE1TSY8hyUvXLhJFEUmH7b5SJfSTcT-E');
        expect(publicServerKey).toEqual(array);
    });


});




