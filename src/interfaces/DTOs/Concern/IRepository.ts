export interface getComplaintDetailsResponse {
    _id: string;
    name: string;
    image: [];
    serviceId: string;
    userId: string;
    defaultAddress: string;
    discription: string;
    locationName: object;
    isBlocked: boolean;
    isDeleted: boolean;
    userDetails: object;
    serviceDetails: object;
    detaultAddressDetails:object;
  }