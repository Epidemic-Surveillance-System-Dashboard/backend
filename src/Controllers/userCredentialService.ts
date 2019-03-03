import * as bcrypt from 'bcrypt'
import * as config from 'config'

export class UserCredentialService {

   private saltRounds = config.get("userCredentialConfig").saltRounds;

   constructor(){};

    public encrypt(plaintextPassword: string): Promise<any> {
        return bcrypt.hash(plaintextPassword, this.saltRounds).then((hashedPassword) => {
            return hashedPassword;
        });
    }

    public compare(plaintextPassword:string, hashedPassword: string): Promise<any> {
        console.log("compare");
        return bcrypt.compare(plaintextPassword, hashedPassword).then((result) => {
            console.log("comparing: " + result);
            return result;
        });
    }

}