

function isValidEmail(email : string) {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
}

function checkWhiteSpace(s : string){
    return s.trim() === "";
}


const LoginValidation = (email:string,password:string) => {
    console.log("email and password for validating in the validator funciton",email,password);
    if(!(isValidEmail(email))){
        console.log("email format is not proper");
        return false 
    }
    if(checkWhiteSpace(email)){
        console.log("white space is present in the email");
        return false ;
    }
    if(checkWhiteSpace(password)){
        console.log("white space is present in the password");
        return false 
    }
    return true;
}

export default LoginValidation;