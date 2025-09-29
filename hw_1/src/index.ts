const name: string = "John";
const birthDate: string | Date = "1990-01-01";
let phoneNumber: string| number = "380999999999";
let address: string | undefined = undefined;

const printUserData = (name: string, birthDate: string | Date, phoneNumber: string | number, address?: string): void => {
  console.log("Name:", name);
  console.log("Birth Date:", birthDate);
  console.log("Phone Number:", phoneNumber);
  if (address) {
    console.log("Address:", address);
  } else {
    console.log("Address: Not provided");
  }
};

printUserData(name, birthDate, phoneNumber, address); 
