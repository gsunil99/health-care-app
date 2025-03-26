import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props)=>{

    const currency = '$'
     
    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        
        let age = today.getFullYear() - birthDate.getFullYear();
        
        // Adjust age if birth date hasn't occurred yet this year
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
    
        return age >= 0 ? age : 0; // Ensure age is not negative
    };
    const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const slotDateFormat = (slotDate)=>{
    const dateArray = slotDate.split('_')
    return dateArray[0]+ " " + months[Number(dateArray[1])]+" "+dateArray[2]
  }
    const value = {
        calculateAge,
        slotDateFormat,
        currency
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;