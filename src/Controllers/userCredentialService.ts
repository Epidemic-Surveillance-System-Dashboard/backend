import * as bcrypt from 'bcrypt'
import * as config from 'config'

export abstract class UserCredentialService {

   private static saltRounds = config.get("userCredentialConfig").saltRounds;

    public static encrypt(plaintextPassword: string): Promise<any> {
        return bcrypt.hash(plaintextPassword, this.saltRounds).then((hashedPassword) => {
            return hashedPassword;
        });
    }

    public static compare(plaintextPassword:string, hashedPassword: string): Promise<any> {
        console.log("compare");
        return bcrypt.compare(plaintextPassword, hashedPassword).then((result) => {
            return result;
        });
    }

}