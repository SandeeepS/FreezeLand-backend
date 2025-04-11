
import {
    EmailExistResponse,
    EmailExitCheckDTO,
    getAllAcceptedServiceResponse,
    GetAllMechanicResponse,
    GetAllMechanicsDTO,
    getComplaintDetailsResponse,
    MechLoginDTO,
    MechLoginResponse,
    SaveMechDTO,
    SaveMechResponse,
    SignUpMechDTO,
    SignUpMechResponse,
    UpdateNewPasswordDTO,
    UpdateNewPasswordResponse,
    VerifyMechanicDTO,
  } from "../DTOs/Mech/IService.dto";


export interface IMechServices{
    signupMech(mechData: SignUpMechDTO): Promise<SignUpMechResponse | null>;
    saveMech(mechData: SaveMechDTO): Promise<SaveMechResponse> ;
    mechLogin(data: MechLoginDTO): Promise<MechLoginResponse>;
    getUserByEmail(data: EmailExitCheckDTO):Promise<EmailExistResponse | null>;
    getAllMechanics(
        data: GetAllMechanicsDTO
    ): Promise<GetAllMechanicResponse | null>;
     VerifyMechanic (values:VerifyMechanicDTO):Promise<unknown>
    updateNewPassword(data: UpdateNewPasswordDTO):Promise<UpdateNewPasswordResponse | null>;
    getAllUserRegisteredServices(page: number, limit: number, searchQuery: string,userId:string): Promise<unknown>;
    getComplaintDetails(id:string) :Promise<getComplaintDetailsResponse[] >
    getAllAcceptedServices (mechanicId : string) : Promise<getAllAcceptedServiceResponse[]>

}