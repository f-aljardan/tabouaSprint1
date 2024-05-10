import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";

export default function Confirm({open, handler , method, message}){
  // show confirm message
    return(
        <Dialog size = "xs" open={open} handler={handler} >
                    
        <DialogHeader className="font-baloo flex justify-center" >تأكيد</DialogHeader>
       
        <DialogBody divider className="font-baloo text-right">

        {message} 
        </DialogBody>

        <DialogFooter className="flex gap-3 justify-center ">

        <Button variant="gradient"  style={{background:"#97B980", color:'#ffffff'}}   onClick={method}>
            <span>تأكيد</span>
          </Button>
          
          <Button  
            variant="gradient"
           style={{background:"#FE5500", color:'#ffffff'}}
            onClick={handler}
            className="mr-1"
          >
            <span>إلغاء</span>
          </Button>
         
        </DialogFooter>
      </Dialog>

    )
}