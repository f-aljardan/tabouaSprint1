import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography
  } from "@material-tailwind/react";


  export default function SummaryHandleRequest({open, handler , requestProcessedData, method, status, handleEdit}){
   
    // Perform necessary actions before confirming
    const handleConfirm = () => {
        method(); 
        handler(); // handle close dialog
      };

  return(
    <Dialog size = "xs" open={open} handler={handler} >
                
    <DialogHeader className="font-baloo flex justify-center" > تأكيد {status} الطلب</DialogHeader>
   
    <DialogBody divider className="font-baloo text-right">
    <div className="flex flex-col gap-3 ">
    {status === 'قبول' && ( <>

 <Typography className="font-baloo text-right text-lg font-bold">
 تفاصيل الطلب:
</Typography>

<Typography> <span><span className="font-bold">رقم الطلب : </span>  {requestProcessedData.Request.requestNo}</span></Typography>
<Typography>  <span><span className="font-bold">حجم الحاوية المطلوب:</span> {requestProcessedData.Request.garbageSize}</span></Typography>
<Typography> <span><span className="font-bold">موقع الطلب : </span>  {requestProcessedData.Request.localArea}</span></Typography>


<Typography className="font-baloo text-right text-lg font-bold mt-3">
 تفاصيل التنفيذ:
</Typography>

<Typography>  <span><span className="font-bold">حجم الحاوية المنفذ:</span> {requestProcessedData.responseData.selectedBinSize}</span></Typography>
<Typography> <span><span className="font-bold">الموقع المنفذ: </span>  {requestProcessedData.Address}</span></Typography>

    <Typography> <span><span className="font-bold">  التعليق: </span>  {requestProcessedData.responseData.message}</span></Typography>

</>
    )}


{status === 'رفض' && ( <>
    <Typography className="font-baloo text-right text-lg font-bold">
 تفاصيل الطلب:
</Typography>

<Typography> <span><span className="font-bold">رقم الطلب : </span>  {requestProcessedData.Request.requestNo}</span></Typography>
<Typography>  <span><span className="font-bold">حجم الحاوية المطلوب:</span> {requestProcessedData.Request.garbageSize}</span></Typography>
<Typography> <span><span className="font-bold">موقع الطلب : </span>  {requestProcessedData.Request.localArea}</span></Typography>

<Typography className="font-baloo text-right text-lg font-bold mt-3">
 تفاصيل التنفيذ:
</Typography>
<Typography> <span><span className="font-bold">  سبب الرفض: </span>  {requestProcessedData.responseData.message}</span></Typography>
    </>
    )}
    </div>
    </DialogBody>

    <DialogFooter className="flex gap-3 justify-center ">

    <Button variant="gradient"  style={{background:"#97B980", color:'#ffffff'}}   onClick={handleConfirm}>
        <span>تأكيد التنفيذ</span>
      </Button>
      
      <Button
              variant="text"
              style={{ background: "#FE5500", color: '#ffffff' }}
              className="mr-1"
              onClick={handleEdit}
            >
              <span aria-hidden="true">تعديل</span>
      </Button>
     
    </DialogFooter>
  </Dialog>

)
  }