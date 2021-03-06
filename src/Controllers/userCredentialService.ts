import * as bcrypt from 'bcryptjs'
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
        return bcrypt.compare(plaintextPassword, hashedPassword).then((result) => {
            return result;
        });
    }

}