
import {
    AddServiceDTO,
    EmailExistResponse,
    EmailExitCheck,
    GetMechByIdDTO,
    GetMechByIdResponse,
    GetMechListDTO,
    GetMechListResponse,
    SaveMechDTO,
    SaveMechResponse,
    UpdateNewPasswordDTO,
    UpdateNewPasswordResponse,
  } from "../DTOs/Mech/IRepository.dto";

export interface IMechRepository{
    saveMechanic(mechData: SaveMechDTO): Promise<SaveMechResponse | null>;
    emailExistCheck(data: EmailExitCheck): Promise<EmailExistResponse | null>;
    updateNewPassword(data: UpdateNewPasswordDTO): Promise<UpdateNewPasswordResponse | null>;
    getMechById(data:GetMechByIdDTO): Promise<GetMechByIdResponse|null> ;
    getMechList(  data:GetMechListDTO): Promise<GetMechListResponse[]>;
    getMechCount(regex: RegExp): Promise<number>;
    AddService(data:AddServiceDTO):Promise<unknown>; 
}