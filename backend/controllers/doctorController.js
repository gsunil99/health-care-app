import doctorModel from "../models/doctorModel.js";
export const changeAvailabitly = async(req,res) =>{
    try {
        const {docId} = req.body;
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available});
        res.json({success:true,message:`Doctor ${docData.name} availabilty is changed`})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}
export const doctorList = async(req,res) =>{
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}