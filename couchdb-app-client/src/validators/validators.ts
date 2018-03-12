
let debouncer :any;

const validator = {
    async checkEmail(email:string, authProvider:any,deb_timeout:number): Promise<any> {
        clearTimeout(debouncer);
        return new Promise<any> ((resolve) => {
            debouncer = setTimeout(async() => {
                const data:any = await authProvider.validateEmail(email);
                if(data.status === 200) {
                    resolve({status:data.status});
                } else {
                    resolve({status:data.status,message:data.message});                        
                }
            }, deb_timeout); 
        });     
    },
    async checkUsername(username:string, authProvider:any,deb_timeout:number): Promise<any> {
        clearTimeout(debouncer);
        return new Promise<any> ((resolve) => {
            debouncer = setTimeout(async () => {
                const data:any = await authProvider.validateUsername(username);
                if(data.status === 200) {
                    resolve({status:data.status});
                } else {
                    resolve({status:data.status,message:data.message});                    
                }
            }, deb_timeout);
        });
    },
    async checkPassword(password:string,conf_password:string,deb_timeout:number): Promise<any> {
        clearTimeout(debouncer);
        return new Promise<any> ((resolve) => {
            debouncer = setTimeout(() => {
                if(conf_password === password) {
                    resolve({status:200});
                } else {
                    resolve({status:400,message:'Password Mismatch'});
                }
            }, deb_timeout);
        });
    },
    async checkRegExp(exp:string, reg_exp:string, reg_error:string, deb_timeout:number): Promise<any> {
        clearTimeout(debouncer);
        return new Promise<any> ((resolve) => {
            debouncer = setTimeout(() => {
                let re: RegExp = new RegExp(reg_exp);
                if(re.test(exp)) {
                    resolve({status:200});
                } else {
                    resolve({status:400,message:reg_error});
                }
            }, deb_timeout);
        });
    },
}

export {validator}