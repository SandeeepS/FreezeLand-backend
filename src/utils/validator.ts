function isValidEmail(email: string) {
  // Regular expression for a simple email validation
  const emailRegex = /^[^\s@]+@gmail\.com$/;
  return emailRegex.test(email);
}

function checkWhiteSpace(s: string) {
  return s.trim() === "";
}

const Phoneregx = /(\+91[\s]?)?[0]?(91)?[789]\d{9}$/;

export const  LoginValidation = (email: string, password: string) : boolean  => {
  console.log(
    "email and password for validating in the validator funciton",
    email,
    password
  );
  if (email == null || email == undefined) {
    console.log("email is null or undefined");
    return false;
  }

  if (password == null || password == undefined) {
    console.log("password is null or undefined");
    return false;
  }

  if (!isValidEmail(email)) {
    console.log("email format is not proper");
    return false;
  }
  if (checkWhiteSpace(email)) {
    console.log("white space is present in the email");
    return false;
  }
  if (checkWhiteSpace(password)) {
    console.log("white space is present in the password");
    return false;
  }
  return true;
};

export const  EditUserDetailsValidator = (name:string,phone:number) : boolean => {
  console.log("entered name and phone are ", name , phone);
  if(name == null || name == undefined){
    return false ;
  }

  if(phone == null || phone == undefined){
    console.log("phone number is null or undefined ")
    return false ;
  }

  if(checkWhiteSpace(name)){
    console.log("name contin white space ")
    return false ;
  }

  if(!(Phoneregx.test(phone.toString()))){
    console.log("phone number is nor valid");
    return false ;
  }

  return true;
}




