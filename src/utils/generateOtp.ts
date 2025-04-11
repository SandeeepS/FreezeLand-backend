
export interface IgenerateOTP {
  generateRandomOTP(): string 
}

export class GenerateOTP implements IgenerateOTP {
  generateRandomOTP(): string {
    const otpLength = 6;
    const min = Math.pow(10, otpLength - 1);
    const max = Math.pow(10, otpLength) - 1;
    const randomOTP = Math.floor(min + Math.random() * (max - min + 1));
    return randomOTP.toString();
  }
}
