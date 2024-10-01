interface UserInterface {
    id?: string | undefined;
    name?: string;
    email?: string;
    phone?: Number;
    password?: string | Promise<string>;

}

export default UserInterface;