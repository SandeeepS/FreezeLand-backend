export interface comRepository<T> {
    getById?(id: string): Promise<T | null>;
    save?(data: T): Promise<T | null>;
    findByEmail?(email: string): Promise<T | null>;
    emailExistCheck?(email: string): Promise<T | null>;
    getAdminById?(id: string): Promise<T | null>;
    isAdminExist?(email: string): Promise<T | null>;
    saveMechanic?(data: T): Promise<T | null>;

  }


  