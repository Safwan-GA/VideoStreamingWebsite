export default function UserCredentialValidation(email,password){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return 'Please enter the proper email.'              
    }
    let message=""
    if(!/[A-Z]/.test(password)){
        message+="Uppercase Letter, "
    }
    if(!/[a-z]/.test(password)){
        message+="LowerCase Letter, "
    }
    if(!/[0-9]/.test(password)){
        message+="digit, "
    }
    if(!/[^A-Za-z0-9]/.test(password)){
        message+="Specail Character, "
    }
    
    return (message!=='')?`Password should have ${message.slice(0,-2)}`:message;
}