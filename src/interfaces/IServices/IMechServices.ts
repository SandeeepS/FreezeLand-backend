
import {
    EmailExistResponse,
    EmailExitCheckDTO,
    GetAllMechanicResponse,
    GetAllMechanicsDTO,
    MechLoginDTO,
    MechLoginResponse,
    SaveMechDTO,
    SaveMechResponse,
    SignUpMechDTO,
    SignUpMechResponse,
    UpdateNewPasswordDTO,
    UpdateNewPasswordResponse,
  } from "../DTOs/Mech/IService.dto";


export interface IMechServices{
    signupMech(mechData: SignUpMechDTO): Promise<SignUpMechResponse | null>;
    saveMech(mechData: SaveMechDTO): Promise<SaveMechResponse> ;
    mechLogin(data: MechLoginDTO): Promise<MechLoginResponse>;
    getUserByEmail(data: EmailExitCheckDTO):Promise<EmailExistResponse | null>;
    getAllMechanics(
        data: GetAllMechanicsDTO
    ): Promise<GetAllMechanicResponse | null>;
    updateNewPassword(data: UpdateNewPasswordDTO):Promise<UpdateNewPasswordResponse | null>;
}