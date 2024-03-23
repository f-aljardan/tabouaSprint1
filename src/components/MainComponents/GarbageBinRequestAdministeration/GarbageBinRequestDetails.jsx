import { useEffect, useState } from "react";
import { useParams , useNavigate} from "react-router-dom";
import { doc, getDoc , updateDoc, onSnapshot} from "firebase/firestore"; // Import the necessary Firebase functions
import { db, storage } from "../../../firebase";
import { Breadcrumbs , Card, Typography, Chip,Button, Textarea} from "@material-tailwind/react";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import SummaryHandleRequest from "../../utilityComponents/messages/SummaryHandleRequest"
import RequestGarbageMap from  "./RequestGarbageMap"
import Success from "../../utilityComponents/messages/Success"

  
  // Set the initial center
  const center = {
    lat: 24.7136,
    lng: 46.6753
  };

  const googleMapsLibraries = ["visualization"];

  
export default function GarbageBinRequestDetails() {
 
  const { id } = useParams();
  const [zoom, setZoom] = useState(10); // set the initial zoom level
  const [requestDetails, setRequestDetails] = useState(null);
  const [requesterInfo, setRequesterInfo] = useState(null);
  const [selectedBinSize, setSelectedBinSize] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [message, setMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [errorMessageStatus, setErrorMessageStatus] = useState(""); 
  const [editMode, setEditMode] = useState(false); // New state variable
  const [showSuccessProcess, setShowSuccessProcess] = useState(false);
  const [summeryRequestOpen, setSummeryRequestOpen] = useState(false);// State to manage the visibility of the summary center information
  const [showSuccessResponse, setShowSuccessResponse] = useState(false);
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [Id, setId] = useState("");
  
  const handleSuccessProcess = () => setShowSuccessProcess(!showSuccessProcess);
  const handleSuccessResponse = () => setShowSuccessResponse(!showSuccessResponse);
  
  const navigate = useNavigate();
  
  
  
 
  const responseData = {
    selectedStatus: selectedStatus,
    selectedBinSize: selectedBinSize,
    message: message,
  }

 // Fetch complaint details using the ID
 useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const requestDoc = doc(db, "requestedGarbageBin", id);
        
        // Subscribe to real-time updates for the specific complaint document
        const unsubscribe = onSnapshot(requestDoc, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setRequestDetails(data);
            setId(id);
            // Update other state as needed

            setZoom(20);
            center.lat = data.location._lat;
            center.lng = data.location._long;
          } else {
            // Handle case where complaint with the given ID doesn't exist
            console.log("request not found");
          }
        });

        // Cleanup function to unsubscribe when component unmounts
        return () => unsubscribe();
      } catch (error) {
        // Handle error during fetching
        console.error("Error fetching request details:", error);
      }
    };

    fetchRequestDetails();
  }, [id]);




  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Ensure that complaintDetails is available before accessing complainerId
        if (!requestDetails) {
          return;
        }
  
        const userDoc = doc(db, "users", requestDetails.requesterId);
        const docSnapshot = await getDoc(userDoc);
  
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setRequesterInfo(data);
        } else {
          // Handle case where user with the given ID doesn't exist
          console.log("User not found");
        }
      } catch (error) {
        // Handle error during fetching
        console.error("Error fetching user details:", error);
      }
    };
  
    fetchUserInfo();
  }, [requestDetails]);







  const handleUpdateRequestProcess = async()  => {
    try {
     
    if(selectedStatus===requestDetails.status){
      setErrorMessageStatus("   يجب أن يتم تغيير الحالة  ");
      return ;
  }
    setErrorMessageStatus("");
      
          await handleProcessRequest();
          setShowSuccessProcess(true);
          setMessage(""); 
        
         
        
      } catch (error) {
        console.error('Error updating request :', error);
      }
  }
  

  const handleUpdateRequest = ()  => {
    try {
     
    if(selectedStatus==="تم التنفيذ" && selectedBinSize===""){
          setSelectedBinSize(requestDetails.garbageSize);
  }
//     setErrorMessageStatus("");
      
       
         console.log("message "+message)
            if (message.trim() == ""){
                setErrorMessage("   يجب أن تتم تعبئة الرسالة  ");
                console.log("message false "+message)
                return false;
             } else{
                console.log("message true "+message)
                return true;
             } 
        
        
      } catch (error) {
        console.error('Error updating request :', error);
      }
  }


  const handleProcessRequest = async()  => {
    try {
      const requestRef = doc(db, 'requestedGarbageBin', id);
   
      await updateDoc(requestRef, {
        status: 'قيد التنفيذ',
        inprogressDate: new Date(),
      });
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  




  // all google map initilazation functions start here 
  // Load Google Maps JavaScript API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA_uotKtYzbjy44Y2IvoQFds2cCO6VmfMk",
    libraries: googleMapsLibraries
  })


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
      {requestDetails ? (
        <div className="m-5">
         
          <Breadcrumbs fullWidth className="mb-3">
                <span className="opacity-80 text-lg font-bold" onClick={() => navigate(-1)}>
                  الطلبات
                </span>
                <span className="text-lg font-bold">
                  رقم الطلب{" "}
                  {requestDetails ? (
                    <>{requestDetails.requestNo}</>
                  ) : null}
                </span>
              </Breadcrumbs>


              <div className="timeline-container ">
  <div className="timeline">
   
    { requestDetails.status === 'جديد'? ( <>
    <div className="timeline-item" data-status="inprogress">
    <div className="w-28">
    <Chip
                    size="sm"
                  
                    className="rounded-full text-sm text-white  font-bold text-center timeline-marker"
                    value={ <div>جديد</div>}
                    color={ "teal"}
                  /></div>
      <div className="timeline-content">
      <p>تاريخ إستلام الطلب</p>
        <p className="timeline-time">{requestDetails.requestDate?.toDate().toLocaleDateString() || 'N/A'}</p>
       
       
      </div>
      </div> 
      <div className="line" data-status="inprogress"></div>
    </>
    ) :(<>
    <div className="timeline-item" data-status="executed">
    <div className="w-28">
    <Chip
                    size="sm"
                    className="rounded-full text-sm text-white  font-bold text-center timeline-marker"
                
                    value={  <div>جديد</div>}
                    color={ "teal"}
                  /> </div>
      <div className="timeline-content">
      <p>تاريخ إستلام الطلب</p>
        <p className="timeline-time">{requestDetails.requestDate?.toDate().toLocaleDateString() || 'N/A'}</p>
       
       
      </div>
    </div>
     <div className="line" data-status="executed"></div> </>)
}

    {requestDetails.status === 'قيد التنفيذ'? (
     <> <div className="timeline-item" data-status="inprogress">
       <div className="w-28">
      <Chip
                  size="sm"
                  className="rounded-full text-sm text-white font-bold text-center timeline-marker"
                  value={<div>قيد التنفيذ</div>}
                  color={"gray"}
                /></div>
       <div className="timeline-content">
        <p>تاريخ بدء التنفيذ</p>
          <p className="timeline-time">{requestDetails.inprogressDate?.toDate().toLocaleDateString() || 'N/A'}</p>
       
      </div>
    </div>  <div className="line" data-status="inprogress"></div> </>
    ): requestDetails.status === 'جديد'? (
    <>  <div className="timeline-item" data-status="waiting">
       <div className="w-28">
        <Chip
                size="sm"
                
                    className="rounded-full text-sm text-white font-bold text-center timeline-marker"
                    value={<><div>قيد التنفيذ</div></>}
                    color={ "amber"}
                  /></div>
        <div className="timeline-content text-white ">
        <p>  .</p>
          <p className="timeline-time"> .</p>
          
          
        </div>
      </div>
 <div className="line" data-status="waiting"></div> </>
    ): (<>
      <div className="timeline-item" data-status="executed">
      <div className="w-28">
        <Chip
                 size="sm"
                  
                    className="rounded-full text-sm text-white font-bold text-center timeline-marker"
                    value={<div>قيد التنفيذ</div>}
                    color={ "amber"}
                  /> </div>
        <div className="timeline-content">
        <p>تاريخ بدء التنفيذ</p>
          <p className="timeline-time">{requestDetails.inprogressDate?.toDate().toLocaleDateString() || 'N/A'}</p>
          
          
        </div>
      </div>  <div className="line" data-status="executed"></div> </>
    )}

    
    {(requestDetails.status === 'مرفوض' || requestDetails.status === 'تم التنفيذ') ? (
      <div className="timeline-item" data-status={requestDetails.status === 'مرفوض' ? "rejected" : "approved"}>
         <div className="w-28">
        <Chip
                  size="sm"
                   
                    className="rounded-full text-sm text-white font-bold text-center timeline-marker "
                    value={<div className="flex items-center">  {requestDetails.status}</div>}
                    color={
                      requestDetails.status === "تم التنفيذ"
                        ? "green"
                        : requestDetails.status === "مرفوض"
                        ? "red"
                        : "teal"
                    }
                  /> </div>
        <div className="timeline-content">
        <p>تاريخ انتهاء التنفيذ</p>
          <p className="timeline-time">{requestDetails.responseDate?.toDate().toLocaleDateString() || 'N/A'}</p>
         
         
        </div>
      </div>
    ) :(
      <div className="timeline-item" data-status={"waiting"}>
         <div className="w-28">
        <Chip
               size="sm"
                  
                    className="rounded-full text-sm text-white font-bold text-center timeline-marker"
                    value={<div className="flex items-center"> انتهاء التنفيذ</div>}
                    color={"gray"}
                  /></div>
        <div className="timeline-content text-white">
        <p>  ...</p>
          <p className="timeline-time">...</p>
         
         
        </div>
      </div>
    )}
  </div>
</div> 


            <div style={{ overflowX: "auto", maxHeight: "220vh" }}>
            <Card className="max-w-4xl m-auto ">

            <div className=" pr-8 py-2 " style={{backgroundColor:'#07512D', color: "white" , borderRadius: "5px"}}>
            <Typography className="font-baloo text-right text-xl font-bold ">
                    بيانات الطلب
                  </Typography>
                  </div>

                      <hr/>


              <div className="flex flex-col gap-5 mt-5 p-8">
               

             

 
                <div className="flex justify-between ">
                {requesterInfo ? (
                  <div>
                    <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
                      بيانات العميل:
                    </Typography>
                    <hr/>
                    <Typography>
                      <span>
                        <span className="font-bold">اسم العميل:</span>{" "}
                        {requesterInfo.firstName} {requesterInfo.lastName}
                      </span>
                    </Typography>
{(calculateAge(requesterInfo.DateOfBirth)!=0 && requesterInfo.DateOfBirth)?
( <Typography>
  <span>
    <span className="font-bold">العمر:</span>{" "}
    {calculateAge(requesterInfo.DateOfBirth)}
  </span>
</Typography>) : null}
                   

                    <Typography>
                      <span>
                        <span className="font-bold">رقم الهاتف:</span>{" "}
                        <bdi dir="ltr">{requesterInfo.phoneNumber}</bdi>
                      </span>
                    </Typography>
                    <Typography>
                      <span>
                        <span className="font-bold">البريد الإلكتروني:</span>{" "}
                        {requesterInfo.email}
                      </span>
                    </Typography>
                  </div>
                ) : (
                  <div>تحميل معلومات العميل...</div>
                )}
         

  <div className="flex flex-col "> 

<Typography className="font-baloo text-right text-lg font-bold text-gray-700">
                            موقع الطلب:
                            </Typography> 
                            <hr className=" mb-1 "/>
                <Typography> 
                <span className="font-bold">الموقع : </span>
                <a
    href={`https://www.google.com/maps/search/?api=1&query=${requestDetails.location._lat},${requestDetails.location._long}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: 'teal', // Text color
      textDecoration: 'none' // Removes the underline from the link
    }}
    onMouseOver={(e) => e.target.style.textDecoration = 'underline'} // Underlines the text on hover
    onMouseOut={(e) => e.target.style.textDecoration = 'none'} // Removes the underline when not hovering
  >
    {requestDetails.localArea}
  </a>
                </Typography>
                   
                <RequestGarbageMap id={id} request={requestDetails} type={"show"} validation={handleUpdateRequest}  responseData={responseData} handleSuccessResponse={handleSuccessResponse} /> 

              
             
              </div>
                </div>


                    <div>

                        <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
                      تفاصيل الطلب:
                    </Typography>
                    <hr/>

               
                    <div className="flex flex-col gap-3">
                    <Typography>  <span><span className="font-bold"> رقم الطلب :</span>  {requestDetails.requestNo}</span></Typography>
                   
                    <Typography>  <span><span className="font-bold">حجم الحاوية المطلوب:</span> {requestDetails.garbageSize}</span></Typography>
                   

    <span className="flex flex-col">
    <span className="font-bold"> سبب الطلب :</span> 
    <span className="w-full max-w-[26rem]">{requestDetails.requestReason}</span> 
    </span>

                  
                        </div>
                        
                         </div>            



              </div>
  
              
            </Card>
          </div>

          <div style={{ overflowX: "auto", maxHeight: "200vh" }} className="mt-5">
            <Card className="max-w-4xl m-auto ">



            <div >
        {(requestDetails.status === "تم التنفيذ" || requestDetails.status === "مرفوض") ? (

           requestDetails.status === "تم التنفيذ" ? 
          (<div className=" pr-8 py-2 " style={{backgroundColor:'#97B980', color: "white", borderRadius: "5px"}}>
  
          <Typography className="font-baloo text-right text-xl font-bold ">
            تفاصيل تنفيذ الطلب
          </Typography>
          </div>) 
          : 
          (<div className=" pr-8 py-2 " style={{backgroundColor:'#FE5500', color: "white", borderRadius: "5px"}}>
  
          <Typography className="font-baloo text-right text-xl font-bold ">
            تفاصيل تنفيذ الطلب
          </Typography>
          </div>)
        
     
        ) : 
( 
  <div className=" pr-8 py-2 " style={{ borderRadius: "5px"}}>
<Typography className="font-baloo text-right text-xl font-bold text-gray-700">
الإجراء :
</Typography>
</div>
)}


        <hr  />


<div className="px-8 pb-8">
           
{ ( editMode || requestDetails.status == 'جديد' || requestDetails.status == 'قيد التنفيذ') && (

<>
<Typography className="font-baloo text-right text-md font-bold mt-5 mb-3">
    <span> تغيير حالة الطلب :</span>
</Typography>


<select
  value={selectedStatus || requestDetails.status }
  onChange={(e) => {setSelectedStatus(e.target.value); setErrorMessageStatus(""); console.log("select:"+ e.target.value); console.log("selected:"+ selectedStatus);}} 
  className="p-2 border border-gray-300 rounded mb-5"
>
  <option value="جديد" disabled={!requestDetails || requestDetails.status == "قيد التنفيذ"}>جديد</option>
  <option value="قيد التنفيذ">قيد التنفيذ</option>
  <option value="تم التنفيذ" disabled={!requestDetails || requestDetails.status == 'جديد'}> قبول</option>
  <option value="مرفوض" disabled={!requestDetails || requestDetails.status == 'جديد'}> رفض</option>
</select>

<Typography color="red"  className="font-semibold">
       <span>  {errorMessageStatus}</span>
</Typography>

{ (selectedStatus === 'تم التنفيذ' || requestDetails.status==='تم التنفيذ' )&&(selectedStatus != 'قيد التنفيذ') ? (
    <>
<div className='font-baloo text-right text-md font-bold mb-3'> 
<Typography className="font-baloo text-right text-md font-bold ">تحديد حجم الحاوية  :</Typography>
</div>

<select
  value={selectedBinSize || requestDetails.garbageSize }
  onChange={(e) => {setSelectedBinSize(e.target.value); setShowValidationMessage(false); }} 
  className="p-2 border border-gray-300 rounded mb-5"
>
  <option value='حاوية كبيرة' > حاوية كبيرة</option>
  <option value='حاوية صغيرة' > حاوية صغيرة</option>
</select>
              {showValidationMessage && (
                <div>
                  <p className="text-red-500 font-bold">
                    يرجى اختيار حجم الحاوية
                  </p>
                </div>
              )}
              </>

) : null }



       
        { (selectedStatus === 'تم التنفيذ' || selectedStatus === 'مرفوض' || requestDetails.status==='تم التنفيذ' || requestDetails.status==="مرفوض")&&(selectedStatus != 'قيد التنفيذ') ? (
<>
{selectedStatus == "مرفوض" && (
    <Typography className="font-baloo text-right text-md font-bold ">
    <span>  توضيح سبب الرفض :</span>
     </Typography>
)} 
     
     {selectedStatus =='تم التنفيذ'&& (
    <Typography className="font-baloo text-right text-md font-bold ">
    <span> التعليق :</span>
     </Typography>

 )} 
  

  <div className="grid ">
    
    <Textarea
      
      value={message || requestDetails.staffComment}
      onChange={(e) => {
        setMessage(e.target.value.slice(0, 500));
        setErrorMessage("");
      }}
      maxLength={500}
    />

   <div className="image-upload-instructions">
    <span>
      عدد الأحرف المتبقية: {500 - message.length}
    </span>
  </div>

  {errorMessage && (
      <Typography color="red"  className="font-semibold">
       <span> {errorMessage}</span>
      </Typography>
    )}

  </div>


  </> ) 
  
  : null}



{ (selectedStatus === 'تم التنفيذ' )&&(selectedStatus != 'قيد التنفيذ') ? (
     <div className="mt-3">
     <Typography className="font-baloo text-right text-md font-bold ">
      <span> تحديد موقع الحاوية :</span>
       </Typography>
       <Typography variant="small"><span>لتعديل موقع الحاوية قم بسحب المؤشر الى الموقع المحدد والالتزام بحدود الطرق ومدار الموقع</span></Typography>
      
  <RequestGarbageMap id={id} request={requestDetails} type={"accept"} validation={handleUpdateRequest} responseData={responseData} handleSuccessResponse={handleSuccessResponse}/> 
  </div>
  ) : null }


{(selectedStatus==="مرفوض") && (
    <RequestGarbageMap id={id} request={requestDetails} type={"reject"} validation={handleUpdateRequest} responseData={responseData} handleSuccessResponse={handleSuccessResponse}/> 
)}

{ selectedStatus==="" ? 
<span>  يجب أن يتم تغيير الحالة حتى تتمكن من تحديث الطلب  </span>
: (
selectedStatus==="قيد التنفيذ" ||selectedStatus==="جديد"  ? (
      <Button
                    size="sm"
                    variant="gradient"
                    style={{ background: '#97B980', color: '#ffffff' }}
                    onClick={handleUpdateRequestProcess}
                    className="text-sm mt-3 mb-3 "
                  >
                    <span>تحديث الطلب</span>
      </Button>)
:
        null ) }
                
</>
 )}

 </div>
</div>



{requestDetails.status === "تم التنفيذ" && (
  <div className="flex justify-between gap-2 px-8 pb-8">
   
   
     <div className="flex flex-col">
    <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
         حجم الحاوية المنفذ:
         <hr/>   
                    </Typography>  
                  
                    <span> {requestDetails.SelectedGarbageSize}</span>
       
                    <Typography className="flex flex-col mt-2"> 
    <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
    التعليق :
                    </Typography>
                    <hr/>
    <span className="w-full max-w-[48rem]">{requestDetails.staffComment}</span> 
 </Typography>
  </div>




<div className="flex flex-col">
  <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
       <span>  موقع الحاوية المنفذ:</span>
       <hr className="mb-2"/>
                    </Typography>
                 
                <Typography> 
                <span className="font-bold">الموقع : </span>
                <a
    href={`https://www.google.com/maps/search/?api=1&query=${requestDetails.newlocation?._lat},${requestDetails.newlocation?._long}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: 'teal', // Text color
      textDecoration: 'none' // Removes the underline from the link
    }}
    onMouseOver={(e) => e.target.style.textDecoration = 'underline'} // Underlines the text on hover
    onMouseOut={(e) => e.target.style.textDecoration = 'none'} // Removes the underline when not hovering
  >
    {requestDetails.newlocalArea}
  </a>
                </Typography>

  <RequestGarbageMap  id={id} request={requestDetails} type={false} validation={handleUpdateRequest} responseData={responseData} handleSuccessResponse={handleSuccessResponse}/> 
  
  </div>

    

</div>

 )}


{requestDetails.status === "مرفوض" && (
  <div className="flex flex-col gap-2 px-8 pb-8">

    <Typography className="flex flex-col "> 
    <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
    التعليق :
    </Typography>
                    <hr/>
    <span className="w-full max-w-[48rem]">{requestDetails.staffComment}</span> 
 </Typography>
    

</div>

 )}

            </Card>
            

        </div>


        </div>
      ) : (
        <div>تحميل تفاصيل الطلب...</div>
      )}



<Success open={showSuccessProcess} handler={handleSuccessProcess} message=" تم تحديث حالة الطلب إلى (قيد التنفيذ) بنجاح" />
{/* <SummaryHandleRequest  open={summeryRequestOpen} handler={handleSummeryRequest} complaintData={requestDetails} method={handleComplaintSubmit} responseData={responseData} handleEdit={handleSummeryRequestClose} /> */}
<Success open={showSuccessResponse} handler={handleSuccessResponse} message=" تم معالجة الطلب بنجاح" />
  

    </>
  );
  
      }  
