import {useState} from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  Typography
} from "@material-tailwind/react";
import SummaryComplaintResponse from "../messages/SummaryComplaintResponse"

export default function ComplaintResponse({open , handler, method , complaintData, status }) {
  
    const [message, setMessage] = useState(""); 
    const [errorMessage, setErrorMessage] = useState(""); 
    const [summeryComplaintOpen, setSummeryComplaintOpen] = useState(false);// State to manage the visibility of the summary center information
 
    const handleSummeryComplaint = () =>setSummeryComplaintOpen(!summeryComplaintOpen); 
    const handleSummeryComplaintClose = () =>{ handler(); setSummeryComplaintOpen(false); }
  
    // Function to handle sending the message
    const handleSendMessage = () => {

      if (message.trim() !== "") {
        // Check if the trimmed message is not empty
        handleSummeryComplaint();
      } else {
        // Display an error message if the message is empty
        setErrorMessage("   يجب أن تتم تعبئة الرسالة  ");
      }
    };
  
   const sendResponse = () =>{
      method(message); // Pass the message to the method
      setMessage(""); // Clear the message input
    }

    const formInfo = {
        response: message,
        // attachment: attachment,
        status: status,
    }
  return (
    <>
    <Dialog open={open} size="xs" handler={handler}>
        
          <DialogHeader className="flex justify-center font-baloo text-right">
      
            <Typography className="mb-1" variant="h4">
           <span> الرد على البلاغ</span>
            </Typography>

          </DialogHeader>
         
       

        <DialogBody>
         
         {status=="reject" && (
            <Typography className="font-baloo text-right text-md font-bold ">
            <span>  توضيح سبب الرفض :</span>
             </Typography>
  
         )} 
             
             {status=="accept" && (
            <Typography className="font-baloo text-right text-md font-bold ">
            <span> التعليق:</span>
             </Typography>
  
         )} 
          

          <div className="grid gap-3">
            
            <Textarea
              label="التعليق"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value.slice(0, 100));
                // Clear the error message when the message is edited
                setErrorMessage("");
              }}
              maxLength={100}
            />
        
           <div className="text-right">
            <span>
              عدد الأحرف المتبقية: {100 - message.length}
            </span>
          </div>

            {errorMessage && (
              <Typography color="red"  className="font-semibold">
               <span> {errorMessage}</span>
              </Typography>
            )}

          </div>
        </DialogBody>

        <DialogFooter className="space-x-2 flex justify-center gap-3">

        <Button variant="outlined"   onClick={()=>{ setMessage(""); setErrorMessage(""); handler();}}>
          <span>  إلغاء</span>
       </Button>

          <Button variant="gradient"  style={{background:"#97B980", color:'#ffffff'}} onClick={handleSendMessage}>
          <span>  إرسال</span>
          </Button>

        </DialogFooter>
      </Dialog>

      <SummaryComplaintResponse open={summeryComplaintOpen} handler={handleSummeryComplaint} complaintData={complaintData} method={sendResponse} responseData={formInfo} handleEdit={handleSummeryComplaintClose}/>
      
    </>
  );
}