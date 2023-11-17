import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input,Textarea,Typography,Chip, IconButton} from "@material-tailwind/react";
import Select from 'react-select';
import { useState , useEffect} from 'react';
import makeAnimated from 'react-select/animated';
import { db } from "../../firebase";
import {
    collection,
    doc,
    onSnapshot,
    updateDoc,
    query,
    getDoc
  } from "firebase/firestore";
import RequestGarbageMap from  "../maps/RequestGarbageMap"


export default function ViewRequestInfo({ open, handler, requestInfo }) { 

//from requestInfo.requesterId fetch user info to display in the window
const [requesterInfo, setRequesterInfo] = useState(null);
// const [RequestInfo, setRequestInfo] = useState({requestInfo});


useEffect(() => {
    if (requestInfo && requestInfo.requesterId) {
      const fetchUserInfo = async () => {
        try {
          const userDoc = doc(db, 'users', requestInfo.requesterId);
          const unsubscribeUser = onSnapshot(userDoc, (userSnapshot) => {
            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              setRequesterInfo(userData);
            }
          });

          // Unsubscribe from the user snapshot listener when the component unmounts
          return () => unsubscribeUser();
        } catch (error) {
          console.error('Error fetching user information:', error);
        }
      };

      const requestDoc = doc(db, 'requestedGarbageBin', requestInfo.id);
      const unsubscribeRequest = onSnapshot(requestDoc, (requestSnapshot) => {
        if (requestSnapshot.exists()) {
          const requestData = requestSnapshot.data(); 

        }
      });

      // Unsubscribe from the request snapshot listener when the component unmounts
      return () => {
        unsubscribeRequest();
        fetchUserInfo();
      };
    }
  }, [requestInfo]);

  const handleRequestProcessing = async (request) => {
    try {
      const requestRef = doc(db, 'requestedGarbageBin', request.id);
      // Update request status to 'قيد التنفيذ' and store the in-progress date
      await updateDoc(requestRef, {
        status: 'قيد التنفيذ',
        inprogressDate: new Date(), // Set the current date as the in-progress date
      });
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };
    



return (
    <>
    <Dialog
        open={ open }
        size="xl"
        handler={handler}
      >
        <DialogHeader className="flex justify-between font-baloo text-right">
            
            <span>معلومات الطلب</span> 

        <IconButton
            variant="text"
            color="blue-gray"
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
          
<div className="flex justify-between">

 <div className="flex flex-col gap-5 ">
 {/* Display user info here: fullName, email */}
 {requesterInfo && (
            <div>
                 <Typography className="font-baloo text-right text-lg font-bold">
                      معلومات العميل:
                    </Typography>
                    <Typography> <span><span className="font-bold">اسم العميل:</span> {requesterInfo.firstName} {requesterInfo.lastName}</span> </Typography>
                    <Typography> <span><span className="font-bold">البريد الإلكتروني:</span>  {requesterInfo.email}</span> </Typography>
            </div>
          )}


{/* display request info here : requestNo , requestDate , garbageSize, requestReason . if the status is "قيدالتنفيذ" display the inprogressDate. if the status is "تم التنفيذ" or "مرفوض" display the inprogressDate, responseDate, staffComment*/}
{requestInfo && (  
                    <div>
                        <Typography className="font-baloo text-right text-lg font-bold">
                      تفاصيل الطلب:
                    </Typography>
                    <Typography> <span><span className="font-bold">رقم الطلب : </span>  {requestInfo.requestNo}</span></Typography>
                    <Typography>  <span><span className="font-bold">حجم الحاوية :</span> {requestInfo.garbageSize}</span></Typography>
                    <Typography> <span> <span className="font-bold"> سبب الطلب : </span> {requestInfo.requestReason}</span></Typography>
                    <Typography> <span><span className="font-bold">تاريخ الطلب : </span> {requestInfo.requestDate?.toDate().toLocaleDateString() || 'N/A'}</span></Typography>
                     
                       {requestInfo.status !== 'جديد' && (
                       <Typography> <span><span className="font-bold">تاريخ بدء التنفيذ : </span>{requestInfo.inprogressDate?.toDate().toLocaleDateString() || 'N/A'}</span></Typography>
                       )}
                       
                       {(requestInfo.status === 'مرفوض' || requestInfo.status ===  'تم التنفيذ' ) && (
  <>
    <Typography> <span><span className="font-bold">تاريخ انتهاء التنفيذ : </span>{requestInfo.responseDate?.toDate().toLocaleDateString() || 'N/A'}</span></Typography>
    {requestInfo.staffComment && (
  <Typography>
    <span>
      <span className="font-bold">تعليق :</span>{requestInfo.staffComment}
    </span>
  </Typography>
)}
 </>
)}
                    </div>               
)}

{/* Display request status here */}
{requestInfo && (
<div className="flex items-center justify-right gap-5">
<Typography className="font-baloo text-right text-lg font-bold">حالة الطلب: </Typography>
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

</div>     


<div className="flex flex-col gap-5 ">

      {/*here Display the requested garbage bin location*/}
    {  requestInfo  &&( <div ><RequestGarbageMap request={requestInfo}  /></div>)}

{/* display request prosseccing button here , if the request status is new , if not , display a dropdown menu that have the following values (قبول , رفض) */}
        {requestInfo && requestInfo.status === 'جديد' && (
               
                  <Button
                    size="sm"
                    fullWidth={true}
                    variant="gradient"
                    style={{ background: '#97B980', color: '#ffffff' }}
                    onClick={() => handleRequestProcessing(requestInfo)}
                    className="text-md font-bold"
                  >
                    <span>معالجة</span>
                  </Button>
                  )}

                  
</div>


</div>

        </DialogBody>
        {/* <DialogFooter>

          <Button
            variant="text"
            color="red"
            onClick={handler}
            className="mr-1"
          >
            <span>رجوع</span>
          </Button>

          
        
        </DialogFooter> */}
      </Dialog>
    </>
  );
}