function isValidEmail(email: string) {
  // Regular expression for a simple email validation
  const emailRegex = /^[^\s@]+@gmail\.com$/;
  return emailRegex.test(email);
}

function checkWhiteSpace(s: string) {
  return s.trim() === "";
}

const Phoneregx = /^[0-9]{10}$/;

export const LoginValidation = (email: string, password: string): boolean => {
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

export const EditUserDetailsValidator = (
  name: string,
  phone: number
): boolean => {
  console.log("entered name and phone are ", name, phone);
  if (name == null || name == undefined) {
    return false;
  }

  if (phone == null || phone == undefined) {
    console.log("phone number is null or undefined ");
    return false;
  }

  if (checkWhiteSpace(name)) {
    console.log("name contin white space ");
    return false;
  }

  if (!Phoneregx.test(phone.toString())) {
    console.log("phone number is not valid");
    return false;
  }

  return true;
};

export const SignUpValidation = (
  name: string,
  phone: string,
  email: string,
  password: string,
  cpassword: string
) => {
  if (name == null || name == undefined) {
    return false;
  }

  if (email == null || email == undefined) {
    console.log("email is null or undefined");
    return false;
  }
  if (phone == null || phone == undefined) {
    console.log("phone number is null or undefined ");
    return false;
  }

  if (password == null || password == undefined) {
    console.log("password is null or undefined");
    return false;
  }

  if (cpassword == null || cpassword == undefined) {
    console.log("cpasswordis null or undefined");
    return false;
  }

  if (!Phoneregx.test(phone)) {
    console.log("Phone number is ", phone);
    console.log("phone number is not valid");
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

  if (checkWhiteSpace(name)) {
    console.log("white space is present in the name");
    return false;
  }

  if (checkWhiteSpace(password)) {
    console.log("white space is present in the password");
    return false;
  }

  return true;
};

export const AddNewServiceValidation = (name: string, discription: string) => {
  if (name == null || name == undefined) {
    console.log("name is null or undefined ");
    return false;
  }

  if (discription == null || discription == undefined) {
    console.log("discritpion is null or undefined ");
    return false;
  }

  return true;
};

export const AddNewDeviceValidation = (name: string) => {
  if (name == null || name == undefined) {
    console.log("name is null or undefined ");
    return false;
  }
  return true;
};

export const AddressValidation = (
  userId: string,
  addressType: "Home" | "Work",
  fullAddress: string,
  houseNumber: string,
  longitude: number,
  latitude: number,
  landmark: string
): boolean => {
  const fields = {
    userId,
    addressType,
    fullAddress,
    houseNumber,
    longitude,
    latitude,
    landmark,
  };

  for (const [key, value] of Object.entries(fields)) {
    if (value == null || value == undefined) {
      console.log(`${key} is null or undefined`);
      return false;
    }
  }

  return true;
};

export const mechanicAddressValidation = (
  userId: string,
  fullAddress: string,
  houseNumber: string,
  longitude: number,
  latitude: number,
  landmark: string
): boolean => {
  const fields = {
    userId,
    fullAddress,
    houseNumber,
    longitude,
    latitude,
    landmark,
  };

  for (const [key, value] of Object.entries(fields)) {
    if (value == null || value == undefined) {
      console.log(`${key} is null or undefined`);
      return false;
    }
  }

  return true;
};
