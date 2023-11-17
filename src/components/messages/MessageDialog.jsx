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
 
export default function MessageDialog({open , handler, method , status }) {
  
    const [message, setMessage] = useState(""); // State to store the message
    const [errorMessage, setErrorMessage] = useState(""); // State to store the error message
  
    // Function to handle sending the message
    const handleSendMessage = () => {

      if(status==="reject" ){
      if (message.trim() !== "") {
        // Check if the trimmed message is not empty
        method(message); // Pass the message to the method
        setMessage(""); // Clear the message input
        handler(); // Close the dialog
      } else {
        // Display an error message if the message is empty
        setErrorMessage("   يجب أن تتم تعبئة الرسالة  ");
      }
    }else if(status==="accept"){
      method(message); // Pass the message to the method
      handler(); // Close the dialog
    }

    };
  

  return (
    <>
    <Dialog open={open} size="xs" handler={handler}>
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            {" "}
            <Typography className="mb-1" variant="h4">
            {status=="reject" && (  <span> سبب الرفض </span>)}
            {status=="accept" && ( <span>  التعليق</span>)}
            </Typography>
          </DialogHeader>
         
        </div>

        <DialogBody>
          <Typography className="mb-10 -mt-7 " color="gray" variant="lead">
          {status=="reject" && ( <span> قم بتوضيح سبب الرفض ثم انقر على زر الإرسال.</span>)}
          {status=="accept" && ( <span>  قم بأضافة تعليق في حال الحاجةأو قم بالتخطي  </span>)}
          </Typography>
          <div className="grid gap-6">
            
            <Textarea
              label="التعليق"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                // Clear the error message when the message is edited
                setErrorMessage("");
              }}
            />
            {errorMessage && (
              <Typography color="red"  className="font-semibold">
               <span> {errorMessage}</span>
              </Typography>
            )}

          </div>
        </DialogBody>

        <DialogFooter className="space-x-2 flex gap-3">

          {status=="reject" && (<Button variant="outlined"   onClick={handler}>
          <span>  إلغاء</span>
          </Button> )}
          {status=="accept" && (<Button variant="outlined"   onClick={()=>{setMessage(null); handleSendMessage();}}>
          <span>  تخطي </span>
          </Button> )}

          <Button variant="gradient"  style={{background:"#97B980", color:'#ffffff'}} onClick={handleSendMessage}>
          <span>  إرسال</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}