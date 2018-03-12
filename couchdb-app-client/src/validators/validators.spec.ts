import AppAuthMock from '../../__mocks__/app-auth';
import {validator} from './validators'
import { REGEXP_NAME, REGEXP_USERNAME, REGEXP_PASSWORD, REGEXP_EMAIL, ERROR_NAME, ERROR_USERNAME, ERROR_PASSWORD, ERROR_EMAIL } from '../global/constants';

describe('validators', () => {
    describe('RegExp', () => {
        it('should return 400 if name length < 3', async () => {
            let res: any = await validator.checkRegExp('jp',REGEXP_NAME,ERROR_NAME,10);
            expect(res.status).toEqual(400);
            expect(res.message).toEqual(ERROR_NAME);
        });
        it('should return 400 if name length > 25', async () => {
            let res: any = await validator.checkRegExp('Juan Carlos Hernandez Lopez',REGEXP_NAME,ERROR_NAME,10);
            expect(res.status).toEqual(400);
            expect(res.message).toEqual(ERROR_NAME);
        });
        it('should return 200 if name length [3-25]', async () => {
            let res: any = await validator.checkRegExp('Paul Smith',REGEXP_NAME,ERROR_NAME,10);
            expect(res.status).toEqual(200);
        });
        it('should return 400 if username length < 3', async () => {
            let res: any = await validator.checkRegExp('jp',REGEXP_USERNAME,ERROR_USERNAME,10);
            expect(res.status).toEqual(400);
            expect(res.message).toEqual(ERROR_USERNAME);
        });
        it('should return 400 if username includes special characters', async () => {
            let res: any = await validator.checkRegExp('Jeep?',REGEXP_USERNAME,ERROR_USERNAME,10);
            expect(res.status).toEqual(400);
            expect(res.message).toEqual(ERROR_USERNAME);
        });
        it('should return 200 if username length > 3 and does not includes special characters', async () => {
            let res: any = await validator.checkRegExp('Jeep',REGEXP_USERNAME,ERROR_USERNAME,10);
            expect(res.status).toEqual(200);
        });
        it('should return 200 if username length > 3 and includes number', async () => {
            let res: any = await validator.checkRegExp('Jeep1',REGEXP_USERNAME,ERROR_USERNAME,10);
            expect(res.status).toEqual(200);
        });
        it('should return 400 if password length < 6', async () => {
            let res: any = await validator.checkRegExp('jp',REGEXP_PASSWORD,ERROR_PASSWORD,10);
            expect(res.status).toEqual(400);
            expect(res.message).toEqual(ERROR_PASSWORD);
        });
        it('should return 400 if password does not have at least one Uppercase character', async () => {
            let res: any = await validator.checkRegExp('jeep2345',REGEXP_PASSWORD,ERROR_PASSWORD,10);
            expect(res.status).toEqual(400);
            expect(res.message).toEqual(ERROR_PASSWORD);
        });
        it('should return 400 if password does not have at least one Lowercase character', async () => {
            let res: any = await validator.checkRegExp('JEEP2345',REGEXP_PASSWORD,ERROR_PASSWORD,10);
            expect(res.status).toEqual(400);
            expect(res.message).toEqual(ERROR_PASSWORD);
        });
        it('should return 400 if password does not have at least one number', async () => {
            let res: any = await validator.checkRegExp('JeepGreen',REGEXP_PASSWORD,ERROR_PASSWORD,10);
            expect(res.status).toEqual(400);
            expect(res.message).toEqual(ERROR_PASSWORD);
        });
        it('should return 200 if password have at least one number,one Uppercase and one lowercase character and length > 6', async () => {
            let res: any = await validator.checkRegExp('Jeep123',REGEXP_PASSWORD,ERROR_PASSWORD,10);
            expect(res.status).toEqual(200);
        });
        it('should return 400 if emeil does not have a @ character', async () => {
            let res: any = await validator.checkRegExp('jeep2345',REGEXP_EMAIL,ERROR_EMAIL,10);
            expect(res.status).toEqual(400);
            expect(res.message).toEqual(ERROR_EMAIL);
        });
        it('should return 400 if emeil does not have a . after the @ character', async () => {
            let res: any = await validator.checkRegExp('jeep.green@2345',REGEXP_EMAIL,ERROR_EMAIL,10);
            expect(res.status).toEqual(400);
            expect(res.message).toEqual(ERROR_EMAIL);
        });
        it('should return 200 if emeil got a . after the @ character', async () => {
            let res: any = await validator.checkRegExp('jeep-green.brown@example.com',REGEXP_EMAIL,ERROR_EMAIL,10);
            expect(res.status).toEqual(200);
        });
        
    });
    describe('Password,Email,Username', () => {
        let appAuth: any;
        beforeEach(async () => {
            appAuth = new AppAuthMock();
        });
        afterEach(async() => {
            appAuth.resetMock();
            appAuth = null;
        });
        it('should return 400 if password and confirmed password mismatched', async () => {
            let res: any = await validator.checkPassword('Test12','Test13',10);
            expect(res.status).toEqual(400);
            expect(res.message).toEqual('Password Mismatch');
        });
        it('should return 200 if password and confirmed password identical', async () => {
            let res: any = await validator.checkPassword('Test12','Test12',10);
            expect(res.status).toEqual(200);
        });
        it('should return 409 if email already exists in couchdb', async () => {
            appAuth.responseMock({status:409,message:'Conflict: Email already in use'});
            let res: any = await validator.checkEmail('jeep@example.com',appAuth,10);
            expect(res.status).toEqual(409);
            expect(res.message).toEqual('Conflict: Email already in use');
        });
        it('should return 200 if email does not exist in couchdb', async () => {
            appAuth.responseMock({status:200});
            let res: any = await validator.checkEmail('jeep.green@example.com',appAuth,10);
            expect(res.status).toEqual(200);
        });
        it('should return 409 if username already exists in couchdb', async () => {
            appAuth.responseMock({status:409,message:'Username already in use'});
            let res: any = await validator.checkUsername('jeep',appAuth,10);
            expect(res.status).toEqual(409);
            expect(res.message).toEqual('Username already in use');
        });
        it('should return 200 if email does not exist in couchdb', async () => {
            appAuth.responseMock({status:200});
            let res: any = await validator.checkUsername('jeep-green',appAuth,10);
            expect(res.status).toEqual(200);
        });

    });
});
