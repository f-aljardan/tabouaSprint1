import  {useState, useEffect} from "react"
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography
  } from "@material-tailwind/react";

  export default function SummaryComplaintResponse({ open, handler, complaintData, method, responseData, handleEdit , imagePreviews}) {
   // Local state to manage image previews
   const [localImagePreviews, setLocalImagePreviews] = useState(imagePreviews);

   // Effect to update local state when imagePreviews prop changes
   useEffect(() => {
     setLocalImagePreviews(imagePreviews);
   }, [imagePreviews]);
 
    // Perform necessary actions before confirming
    const handleConfirm = () => {
      method();
      handler(); // handle close dialog

    };
  
    return (
        <>
      <Dialog size="sm" open={open} handler={handler}>
        <DialogHeader className="font-baloo flex justify-center">
          تأكيد {(responseData?.selectedStatus) == "تم التنفيذ"? "قبول" : "رفض"} البلاغ
        </DialogHeader>
  
        <DialogBody divider className="font-baloo text-right h-[20rem] overflow-y-scroll" >
            {complaintData ? (
                <div className="flex flex-col gap-3 ">
                {/* <Typography className="font-baloo text-right text-lg font-bold">تفاصيل البلاغ:</Typography>
      
                <Typography>
                  <span>
                    <span className="font-bold">رقم البلاغ :</span> {complaintData?.complaintNo}
                  </span>
                </Typography>
                <Typography>
                  <span>
                    <span className="font-bold">وصف البلاغ:</span> {complaintData?.description}
                  </span>
                </Typography> */}
      
                <Typography className="font-baloo text-right text-lg font-bold mt-3">تفاصيل التنفيذ:</Typography>
      <hr/>
                <Typography>
                  <span>
                    <span className="font-bold">حالةالبلاغ : </span> {responseData?.selectedStatus}
                  </span>
                </Typography>
      
               
                  <Typography>
                    <span className="flex flex-col">
                      <span className="font-bold">الرد على البلاغ : </span> <span>{responseData?.message}</span>
                    </span>
                  </Typography>

                
                      <div className="font-bold"> المرفقات  : 
                      {localImagePreviews?.length > 0 ? 
(
<div className="image-previews">
  {localImagePreviews?.map((url, index) => (
    <div key={index} className="image-preview">
      <img src={url} alt={`Preview ${index}`} />

    </div>
  ))}
</div>
): 
(<Typography color="red">
  <span style={{color: "dark-red"}}>لا توجد مرفقات</span>
  </Typography>
  ) }
  </div> 
                   




                  
             
              </div>
            ): <div>loading</div>}
          
        </DialogBody>
  
        <DialogFooter className="flex gap-3 justify-center ">
          <Button variant="gradient" style={{ background: "#97B980", color: '#ffffff' }} onClick={handleConfirm}>
            <span>تأكيد التنفيذ</span>
          </Button>
  
          <Button variant="text" style={{ background: "#FE5500", color: '#ffffff' }} className="mr-1" onClick={handleEdit}>
            <span aria-hidden="true">تعديل</span>
          </Button>
        </DialogFooter>
      </Dialog>


</>
    );
  }
  