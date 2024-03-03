import {useState, useEffect} from "react"
import { Button, Dialog, DialogHeader, DialogBody, Typography,Chip, IconButton} from "@material-tailwind/react";
import { db } from "../../../firebase";
import {
    doc,
    onSnapshot,
    updateDoc,
  } from "firebase/firestore";
import RequestGarbageMap from  "../../MainComponents/GarbageBinRequestAdministeration/RequestGarbageMap"


export default function ViewRequestInfo({ open, handler, requestInfo }) { 


const [requesterInfo, setRequesterInfo] = useState(null);



useEffect(() => {
  let unsubscribeUser;
  let unsubscribeRequest;

  if (requestInfo && requestInfo.requesterId) {

    const fetchUserInfo = async () => {
      try {
        const userDoc = doc(db, 'users', requestInfo.requesterId);
        unsubscribeUser = onSnapshot(userDoc, (userSnapshot) => {
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setRequesterInfo(userData);
          }
        });
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    const requestDoc = doc(db, 'requestedGarbageBin', requestInfo.id);
    unsubscribeRequest = onSnapshot(requestDoc, (requestSnapshot) => {
      if (requestSnapshot.exists()) {
        const requestData = requestSnapshot.data();
      }
    });
    // Call fetchUserInfo and return the cleanup function
    fetchUserInfo();
  }
  // Unsubscribe from the snapshots when the component is unmounted
  return () => {
    if (unsubscribeUser) {
      unsubscribeUser();
    }
    if (unsubscribeRequest) {
      unsubscribeRequest();
    }
  };
}, [requestInfo?.id]);
  



  const handleProcessRequest = async (request) => {
    try {
      const requestRef = doc(db, 'requestedGarbageBin', request.id);
      // Update request status to 'قيد التنفيذ' and store the in-progress date
      await updateDoc(requestRef, {
        status: 'قيد التنفيذ',
        inprogressDate: new Date(),
      });
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };


    

  function calculateAge(dateOfBirth) {
    
     // convert dateOfBirth value into date object
   var birthDate = new Date(dateOfBirth);
  
  // get difference from current date;
  var difference=Date.now() - birthDate.getTime(); 
     
  var  ageDate = new Date(difference); 
  var age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age;
  }

  

return (
    <>
    <Dialog
        open={ open }
        size="xl"
        handler={handler}
      >
        <DialogHeader className="flex justify-between font-baloo text-right " style={{ backgroundColor: '#97B980' ,  color: '#ffffff' }}>
    
        {requestInfo && (     <span> معلومات الطلب رقم {requestInfo.requestNo}</span> )}
         
            <IconButton
            variant="text"
            color="white"
            onClick={handler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
          
        </DialogHeader>   
                
     
        <DialogBody>
          
<div className="flex justify-between items-center">

 <div className="flex flex-col gap-3 ">

 <div className="flex gap-5">    

            
{/*  request status  */}
{requestInfo && (
<div className="flex items-center justify-right gap-5">
<Typography className="font-baloo text-right text-lg font-bold text-gray-700">حالة الطلب: </Typography>
<Chip
                    size="lg"
                    variant="ghost"
                    className="rounded-full text-md font-bold text-center"
                    value={requestInfo.status}
                    color={
                        requestInfo.status === "تم التنفيذ"
                              ? 'green'
                              : requestInfo.status === 'مرفوض'
                              ? 'red'
                              : requestInfo.status === 'قيد التنفيذ'
                              ? 'amber'
                              : 'teal'
                          }
                        />

                    </div>

)}

{requestInfo && requestInfo.status === 'جديد' && (
               
               <Button
                size="sm"
                 variant="gradient"
                 style={{ background: '#97B980', color: '#ffffff' }}
                 onClick={() => handleProcessRequest(requestInfo)}
                 className="text-sm "
               >
                 <span>معالجة الطلب</span>
               </Button>
               )}

</div>

<hr/> 

 {/* Display user info */}
 {requesterInfo && (
            <div>
                 <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
                      معلومات العميل:
                    </Typography>
                    <Typography> <span><span className="font-bold">اسم العميل:</span> {requesterInfo.firstName} {requesterInfo.lastName}</span> </Typography>
                    <Typography>
      <span>
        <span className="font-bold">العمر:</span>{' '}
        {calculateAge(requesterInfo.DateOfBirth)}
      </span>
    </Typography>
    <Typography>
      <span >
        <span  className="font-bold">رقم الهاتف:</span>{' '}
            <bdi>{requesterInfo.phoneNumber}</bdi> {/*Bidirectional Isolate) designed when text directionality cause unexpected rendering*/}
      </span>
    </Typography>
    <Typography> <span><span className="font-bold">البريد الإلكتروني:</span>  {requesterInfo.email}</span> </Typography>
            </div>
          )}

<hr/> 
{/* this section display request info. if the status is "قيدالتنفيذ" it display the inprogressDate. if the status is "تم التنفيذ" or "مرفوض" it display the inprogressDate, responseDate*/}
{requestInfo && (  
                  <div>
                        <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
                      تفاصيل الطلب:
                    </Typography>
                    {/* <Typography> <span><span className="font-bold">رقم الطلب : </span>  {requestInfo.requestNo}</span></Typography> */}
                    <Typography>  <span><span className="font-bold">حجم الحاوية :</span> {requestInfo.garbageSize}</span></Typography>
                    <Typography> <span><span className="font-bold">موقع الطلب : </span>  {requestInfo.localArea}</span></Typography>
                    <Typography> <span> <span className="font-bold"> سبب الطلب : </span> {requestInfo.requestReason}</span></Typography>
                    <Typography> <span><span className="font-bold">تاريخ الطلب : </span> {requestInfo.requestDate?.toDate().toLocaleDateString() || 'N/A'}</span></Typography>
                     
                       {requestInfo.status !== 'جديد' && (
                       <Typography> <span><span className="font-bold">تاريخ بدء التنفيذ : </span>{requestInfo.inprogressDate?.toDate().toLocaleDateString() || 'N/A'}</span></Typography>
                       )}
                       
                       {(requestInfo.status === 'مرفوض' || requestInfo.status ===  'تم التنفيذ' ) && (
                       <>
                        <Typography> <span><span className="font-bold">تاريخ انتهاء التنفيذ : </span>{requestInfo.responseDate?.toDate().toLocaleDateString() || 'N/A'}</span></Typography>
                       </>
                        )}
                          {/* if it processed, Display the staffComment*/}
{requestInfo && requestInfo.staffComment && (
  <Typography >
    <span >
    {requestInfo.status === 'مرفوض' && ( <span className="font-bold">سبب الرفض :</span>)}
    {requestInfo.status ==="تم التنفيذ" && ( <span className="font-bold">التعليق:  </span>)}
    <span>{requestInfo.staffComment}</span>
  
    </span>
  </Typography>
)}
                    </div>               
)}


</div>     





      {/*Display the requested garbage bin location*/}
    {  requestInfo  &&( <div className="flex flex-col "> 

    <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
                               معاينة الموقع:
                                </Typography> 

                  <RequestGarbageMap request={requestInfo}  /> 

                  {requestInfo && requestInfo.status == 'قيد التنفيذ' && ( 
       <Typography variant="small"><span>لتعديل موقع الحاوية قم بسحب المؤشر الى الموقع المحدد والالتزام بحدود الطرق ومدار الموقع</span></Typography>
        )}
                  </div>)}

       
     



</div>

        </DialogBody>
       
      </Dialog>
    </>
  );
}