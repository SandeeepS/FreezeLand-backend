interface Service {
  name: string;
  imageKey:string;
  discription: string[];
  serviceCharge: number;
  createdAt:Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export default Service;
