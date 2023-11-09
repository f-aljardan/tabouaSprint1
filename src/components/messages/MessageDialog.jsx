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
 
export default function MessageDialog({open , handler, method}) {
  
    const [message, setMessage] = useState(""); // State to store the message
    const [errorMessage, setErrorMessage] = useState(""); // State to store the error message
  
    // Function to handle sending the message
    const handleSendMessage = () => {
      if (message.trim() !== "") {
        // Check if the trimmed message is not empty
        method(message); // Pass the message to the method
        setMessage(""); // Clear the message input
        handler(); // Close the dialog
      } else {
        // Display an error message if the message is empty
        setErrorMessage("   يجب أن تتم تعبئة الرسالة  ");
      }
    };
  

  return (
    <>
    <Dialog open={open} size="xs" handler={handler}>
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            {" "}
            <Typography className="mb-1" variant="h4">
           <span> سبب الرفض</span>
            </Typography>
          </DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={handler}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <DialogBody>
          <Typography className="mb-10 -mt-7 " color="gray" variant="lead">
         <span> قم بتوضيح سبب الرفض ثم انقر على زر الإرسال.</span>
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
              <Typography color="red" variant="caption" className="font-semibold">
               <span> {errorMessage}</span>
              </Typography>
            )}

          </div>
        </DialogBody>

        <DialogFooter className="space-x-2 flex gap-3">
          <Button variant="gradient"  style={{background:"#FE5500", color:'#ffffff'}} onClick={handler}>
          <span>  إلغاء</span>
          </Button>
          <Button variant="gradient"  style={{background:"#97B980", color:'#ffffff'}} onClick={handleSendMessage}>
          <span>  إرسال</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}