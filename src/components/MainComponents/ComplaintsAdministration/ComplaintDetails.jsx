import { useEffect, useState } from "react";
import { useParams , useNavigate} from "react-router-dom";
import { doc, getDoc , updateDoc, onSnapshot} from "firebase/firestore"; // Import the necessary Firebase functions
import { db, storage } from "../../../firebase";
import { Breadcrumbs , Card, Typography, Chip,Button, Textarea, IconButton} from "@material-tailwind/react";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import SummaryComplaintResponse from "../../utilityComponents/messages/SummaryComplaintResponse"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Success from "../../utilityComponents/messages/Success"

// style size for the Google Map
const containerStyle = {
    width: '400px', 
    height: '20vh', 
  };
  
  // Set the initial center
  const center = {
    lat: 24.7136,
    lng: 46.6753
  };

  const googleMapsLibraries = ["visualization"];

export default function ComplaintDetails({directRouteComplaint, setDirectRouteComplaint}) {
  const { id } = useParams();

  const [zoom, setZoom] = useState(10); 
  const [complaintDetails, setComplaintDetails] = useState(null);
  const [complainerInfo, setComplainerInfo] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [message, setMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [errorMessageStatus, setErrorMessageStatus] = useState(""); 
  const [editMode, setEditMode] = useState(false); 
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageUploadError, setImageUploadError] = useState('');
  const [imagePreviews, setImagePreviews] = useState([])
  const [showSuccessProcess, setShowSuccessProcess] = useState(false);
  const [summeryComplaintOpen, setSummeryComplaintOpen] = useState(false);
  const [showSuccessResponse, setShowSuccessResponse] = useState(false);

  const handleSummeryComplaint = () =>setSummeryComplaintOpen(!summeryComplaintOpen); 
  const handleSummeryComplaintClose = () =>{  setSummeryComplaintOpen(false); }
  const handleSuccessProcess = () => setShowSuccessProcess(!showSuccessProcess);
  const handleSuccessResponse = () => setShowSuccessResponse(!showSuccessResponse);
  
  const navigate = useNavigate();
  
  const responseData = {
    selectedStatus: selectedStatus,
    message: message,
    imagePreviews: imagePreviews,
  }

 // Fetch complaint details using the ID
 useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const complaintDoc = doc(db, "complaints", id);
        
        const unsubscribe = onSnapshot(complaintDoc, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setComplaintDetails(data);
            setZoom(20);
            center.lat = data.location._lat;
            center.lng = data.location._long;
          } else {
            console.log("Complaint not found");
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching complaint details:", error);
      }
    };

    fetchComplaintDetails();
  }, [id]);


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // to ensure  complaintDetails is available before accessing complainerId
        if (!complaintDetails) {
          return;
        }

        const complaintDoc = doc(db, "users", complaintDetails.complainerId);
        const docSnapshot = await getDoc(complaintDoc);
  
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setComplainerInfo(data);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
  
    fetchUserInfo();
  }, [complaintDetails]);


  const handleUpdateComplaint = async()  => {
    try {
    
    if(selectedStatus===complaintDetails.status){
      setErrorMessageStatus("   يجب أن يتم تغيير الحالة  ");
      return ;
      }

    setErrorMessageStatus("");
      
    if (selectedStatus === 'قيد التنفيذ') {
          // Update complaint status to 'قيد التنفيذ' and add inprogressDate
          await handleProcessComplaint();
          setShowSuccessProcess(true);
          setMessage(""); 
        } 
    else {
            if (message.trim() !== ""){
              setSummeryComplaintOpen(true);
               } 
           else {
                // Display an error message if the message is empty
                setErrorMessage("   يجب أن تتم تعبئة الرسالة  ");
              }
         }
      } catch (error) {
        console.error('Error updating complaint status:', error);
      }
  }
  

  const handleProcessComplaint = async()  => {
    try {
      const complaintRef = doc(db, 'complaints', id);
      await updateDoc(complaintRef, {
        status: 'قيد التنفيذ',
        inprogressDate: new Date(),
      });
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };


const handleComplaintSubmit = async()=>{
  await handleComplaint(message, selectedStatus);
              setMessage(""); 
              setEditMode(false);
              setShowSuccessResponse(true);
}


  const handleComplaint = async(message, status) => {

    const imageUrls = await uploadImagesToFirestore(); // Upload images and get URLs
    
        try {
            const complaintRef = doc(db, 'complaints', id);
            await updateDoc(complaintRef, {
              status: status,
              responseDate: new Date(),
              staffResponse: message,
              ImagesOfStaffResponse: imageUrls, // Store image URLs in the complaint document
            });
          } catch (error) {
            console.error('Error updating complaint info:', error);
          }
  };

 
// Handle image selection
const handleImageSelection = (event) => {

  const files = event.target.files;
  if (files.length > 3) {
    setImageUploadError('يمكنك إرفاق ما يصل إلى 3 صور فقط.');
    return;
  }

  setImageUploadError('');
  setSelectedImages(Array.from(files)); 

   // creating image URLs for preview
   const fileArray = Array.from(files).map((file) =>
   URL.createObjectURL(file));
   setImagePreviews(fileArray);
};


const deleteImage = (index) => {
  const updatedImagePreviews = imagePreviews.filter((_, i) => i !== index);
  setImagePreviews(updatedImagePreviews);
  const updatedSelectedImages = selectedImages.filter((_, i) => i !== index);
  setSelectedImages(updatedSelectedImages);
};

const uploadImagesToFirestore = async () => {
  const imageUrls = [];
  for (const image of selectedImages) {
    const storageRef = ref(storage, `ImagesOfStaffResponse/${image.name}`);
    const snapshot = await uploadBytes(storageRef, image);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    imageUrls.push(downloadUrl);
  }
  return imageUrls; 
};
  

  function calculateAge(dateOfBirth) {
    var birthDate = new Date(dateOfBirth);
    var difference=Date.now() - birthDate.getTime(); 
    var  ageDate = new Date(difference); 
    var age = Math.abs(ageDate.getUTCFullYear() - 1970);
   return age;
 }


 const [activeIndex, setActiveIndex] = useState(0);
 const [activeIndexUser, setActiveIndexUser] = useState(0);

 useEffect(() => {

   // if there's no data stop the timer
  if (!complaintDetails || !complaintDetails.ImagesOfStaffResponse || complaintDetails.ImagesOfStaffResponse.length === 0) {
    return;
  }

   // stop auto slide when there's only one image
  if (complaintDetails.ImagesOfStaffResponse.length <= 1) return; 

  if(complaintDetails){
  const timer = setTimeout(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % complaintDetails.ImagesOfStaffResponse.length);
  }, 3000); 
  return () => clearTimeout(timer);
}

}, [activeIndex, complaintDetails?.ImagesOfStaffResponse?.length]); 

const moveSlide = (step) => {
  setActiveIndex(prev => (prev + step + complaintDetails.ImagesOfStaffResponse.length) % complaintDetails.ImagesOfStaffResponse.length);
};

//same goes for ImagesOfUserComplaints
useEffect(() => {

  if (!complaintDetails || !complaintDetails.ImagesOfUserComplaints || complaintDetails.ImagesOfUserComplaints.length === 0) {
    return;
  }

  if (complaintDetails.ImagesOfUserComplaints.length <= 1) {
    return;
  } 

  if(complaintDetails){
  const timer = setTimeout(() => {
    moveSlideUser(1);
  }, 3000); 

  return () => clearTimeout(timer);
}
}, [activeIndexUser, complaintDetails?.ImagesOfUserComplaints?.length]); // Safely access images.length

const moveSlideUser = (step) => {
  setActiveIndexUser(prev => (prev + step + complaintDetails.ImagesOfUserComplaints.length) % complaintDetails.ImagesOfUserComplaints.length);
};


  //  Google Maps JavaScript API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA_uotKtYzbjy44Y2IvoQFds2cCO6VmfMk",
    libraries: googleMapsLibraries
  })

  return (

    <>
      {complaintDetails ? (

      <div className="m-5">

  {directRouteComplaint? 
      <div className="flex justify-between">

  <Breadcrumbs fullWidth className="mb-3">
      <span className="opacity-80 text-lg font-bold" onClick={() => {navigate(-1);  setDirectRouteComplaint(false); }}>
        الخريطة الحرارية
      </span>
            <span className="text-lg font-bold">
              رقم البلاغ{" "}
              {complaintDetails ? (
                <>{complaintDetails.complaintNo}</>
              ) : null}
            </span>
  </Breadcrumbs>


  <button onClick={() => {navigate(-1);  setDirectRouteComplaint(false); }}
  className=" mb-4">
  <IconButton variant="text" size="lg">
  <i className="fas fa-arrow-left fa-lg" />
  </IconButton>
  </button>

      </div>

      :
          <Breadcrumbs fullWidth className="mb-3">
                <span className="opacity-80 text-lg font-bold" onClick={() => navigate(-1)}>
                  البلاغات
                </span>
                <span className="text-lg font-bold">
                  رقم البلاغ{" "}
                  {complaintDetails ? (
                    <>{complaintDetails.complaintNo}</>
                  ) : null}
                </span>
          </Breadcrumbs>

                  }

  <div className="timeline-container ">
     {!complaintDetails.inprogressDate && complaintDetails.status === "مرفوض" ? 
 <div className="timeline-reject">

  <>
    <div className="timeline-item" data-status="executed">
  <div className="w-28">
    <Chip
        size="sm"
        className="rounded-full text-sm text-white  font-bold text-center timeline-marker"
        value={  <div>جديد</div>}
        color={ "teal"}
    />
  </div>
      <div className="timeline-content">
         <p>تاريخ إستلام البلاغ</p>
         <p className="timeline-time">{complaintDetails.complaintDate?.toDate().toLocaleDateString() || 'N/A'}</p>
      </div>

    </div>
    <div className="line-reject" data-status="executed"></div> 
     </>

     <div className="timeline-item" data-status={"rejected"}>
         <div className="w-28">
        <Chip
             size="sm"
             className="rounded-full text-sm text-white font-bold text-center timeline-marker "
             value={<div className="flex items-center">  {complaintDetails.status}</div>}
             color={
                      complaintDetails.status === "تم التنفيذ"
                        ? "green"
                        : complaintDetails.status === "مرفوض"
                        ? "red"
                        : "teal"
                    }
                  /> 
        </div>
        <div className="timeline-content">
          <p>تاريخ انتهاء التنفيذ</p>
          <p className="timeline-time">{complaintDetails.responseDate?.toDate().toLocaleDateString() || 'N/A'}</p>
        </div>
      </div>
  </div>
  
 :

  <div className="timeline">
   
    { complaintDetails.status === 'جديد'? ( <>
    <div className="timeline-item" data-status="inprogress">
    <div className="w-28">
    <Chip
        size="sm"
        className="rounded-full text-sm text-white  font-bold text-center timeline-marker"
        value={ <div>جديد</div>}
        color={ "teal"}
     />
     </div>
      <div className="timeline-content">
      <p>تاريخ إستلام البلاغ</p>
      <p className="timeline-time">{complaintDetails.complaintDate?.toDate().toLocaleDateString() || 'N/A'}</p>
      </div>
      </div> 

      <div className="line" data-status="inprogress"></div>
    </>
    ) 
    :
    (
    <>
    <div className="timeline-item" data-status="executed">
    <div className="w-28">
    <Chip
        size="sm"
        className="rounded-full text-sm text-white  font-bold text-center timeline-marker"
        value={  <div>جديد</div>}
        color={ "teal"}
    /> 
    </div>
      <div className="timeline-content">
      <p>تاريخ إستلام البلاغ</p>
      <p className="timeline-time">{complaintDetails.complaintDate?.toDate().toLocaleDateString() || 'N/A'}</p> 
      </div>
    </div>

    {!complaintDetails.inprogressDate && complaintDetails.status === "مرفوض" ? 
    <div className="line-reject" data-status="executed"></div> :
    <div className="line" data-status="executed"></div> 
    }
     </>
    )
}

    {complaintDetails.status === 'قيد التنفيذ'? (
     <> 
     <div className="timeline-item" data-status="inprogress">
     <div className="w-28">
      <Chip
            size="sm"
            className="rounded-full text-sm text-white font-bold text-center timeline-marker"
            value={<div>قيد التنفيذ</div>}
            color={"gray"}
       />
      </div>
       <div className="timeline-content">
        <p>تاريخ بدء التنفيذ</p>
        <p className="timeline-time">{complaintDetails.inprogressDate?.toDate().toLocaleDateString() || 'N/A'}</p>
      </div>

      </div>  
      <div className="line" data-status="inprogress"></div>
     </>
    )
    : complaintDetails.status === 'جديد'? (
    <>  
    <div className="timeline-item" data-status="waiting">
    <div className="w-28">
        <Chip
            size="sm"
            className="rounded-full text-sm text-white font-bold text-center timeline-marker"
            value={<><div>قيد التنفيذ</div></>}
            color={ "amber"}
         />
    </div>
        <div className="timeline-content text-white ">
        <p>  .</p>
        <p className="timeline-time"> .</p>
        </div>
    </div>

 <div className="line" data-status="waiting"></div>
  </>
    )
    : complaintDetails.inprogressDate?
    (
    <>
      <div className="timeline-item" data-status="executed">
      <div className="w-28">
        <Chip
             size="sm"
             className="rounded-full text-sm text-white font-bold text-center timeline-marker"
             value={<div>قيد التنفيذ</div>}
             color={ "amber"}
         /> 
      </div>
      <div className="timeline-content">
        <p>تاريخ بدء التنفيذ</p>
        <p className="timeline-time">{complaintDetails.inprogressDate?.toDate().toLocaleDateString() || 'N/A'}</p> 
      </div>
      </div>  
      <div className="line" data-status="executed"></div> 
    </>
    ) 
    :
    null 
  }

    
    {(complaintDetails.status === 'مرفوض' || complaintDetails.status === 'تم التنفيذ') ? (
      <div className="timeline-item" data-status={complaintDetails.status === 'مرفوض' ? "rejected" : "approved"}>
         <div className="w-28">
        <Chip
             size="sm"
             className="rounded-full text-sm text-white font-bold text-center timeline-marker "
             value={<div className="flex items-center">  {complaintDetails.status}</div>}
             color={
                      complaintDetails.status === "تم التنفيذ"
                        ? "green"
                        : complaintDetails.status === "مرفوض"
                        ? "red"
                        : "teal"
                    }
           /> 
        </div>
        <div className="timeline-content">
        <p>تاريخ انتهاء التنفيذ</p>
        <p className="timeline-time">{complaintDetails.responseDate?.toDate().toLocaleDateString() || 'N/A'}</p>
        </div>
      </div>
    ) 
    :
    (
      <div className="timeline-item" data-status={"waiting"}>
         <div className="w-28">
        <Chip
             size="sm"
             className="rounded-full text-sm text-white font-bold text-center timeline-marker"
             value={<div className="flex items-center"> انتهاء التنفيذ</div>}
             color={"gray"}
         />
        </div>
        <div className="timeline-content text-white">
        <p>  ...</p>
        <p className="timeline-time">...</p>
        </div>
      </div>
    )}
  </div>
}
</div> 


            <div style={{ overflowX: "auto", maxHeight: "220vh" }}>
            <Card className="max-w-4xl m-auto ">

            <div className=" pr-8 py-2 " style={{backgroundColor:'#07512D', color: "white" , borderRadius: "5px"}}>
            <Typography className="font-baloo text-right text-xl font-bold ">
                    بيانات البلاغ
            </Typography>
            </div>

             <hr/>

            <div className="flex flex-col gap-5 mt-5 p-8">
              
                <div className="flex justify-between ">
                {complainerInfo ? (
                  <div>
                    <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
                      بيانات العميل:
                    </Typography>
                    <hr/>
                    <Typography>
                      <span>
                        <span className="font-bold">اسم العميل:</span>{" "}
                        {complainerInfo.firstName} {complainerInfo.lastName}
                      </span>
                    </Typography>

{(calculateAge(complainerInfo.DateOfBirth)!=0 && complainerInfo.DateOfBirth)?
( <Typography>
  <span>
    <span className="font-bold">العمر:</span>{" "}
    {calculateAge(complainerInfo.DateOfBirth)}
  </span>
</Typography>) 
: null}


                   
                    <Typography>
                      <span>
                        <span className="font-bold">رقم الهاتف:</span>{" "}
                        <bdi dir="ltr">{complainerInfo.phoneNumber}</bdi>
                      </span>
                    </Typography>
                    <Typography>
                      <span>
                        <span className="font-bold">البريد الإلكتروني:</span>{" "}
                        {complainerInfo.email}
                      </span>
                    </Typography>
                  </div>
               )
               :
               (
                  <div>تحميل معلومات العميل...</div>
               )}
         

  <div className="flex flex-col "> 

                <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
                    موقع البلاغ:
                </Typography> 
                    <hr className=" mb-1 "/>
                <Typography> 
                <span className="font-bold">الموقع : </span>
 <a
    href={`https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
    color: 'teal', // Text color
    textDecoration: 'none' // Removes the underline from the link
    }}
    onMouseOver={(e) => e.target.style.textDecoration = 'underline'} // Underlines the text on hover
    onMouseOut={(e) => e.target.style.textDecoration = 'none'} // Removes the underline when not hovering
  >
    {complaintDetails.localArea}
  </a>
                </Typography>
                   
{isLoaded ? (
  <GoogleMap
    mapContainerStyle={containerStyle}
    center={center}
    zoom={zoom}
  >
    <Marker
      position={{ lat: center.lat, lng: center.lng }}
      icon={{
        url: "/complaintMarker.png",
        scaledSize: new window.google.maps.Size(45, 45),
      }}
    />
  </GoogleMap>
) : null}

         </div>
         </div>

         <div>
  <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
    تفاصيل البلاغ:
  </Typography>
  <hr/>

  <div className="flex flex-col gap-3">
    <Typography>
      <span>
        <span className="font-bold">رقم البلاغ:</span> {complaintDetails.complaintNo}
      </span>
    </Typography>

    <span className="flex flex-col">
      <span className="font-bold">نوع البلاغ:</span>
      <span className="w-full max-w-[26rem]">
        {complaintDetails.complaintType}
        {complaintDetails.complaintType === "أخرى" ? <span>: {complaintDetails.complaintSubject}</span> : null}
      </span>
    </span>

    <span className="flex flex-col">
      <span className="font-bold">وصف البلاغ:</span>
      <span className="w-full max-w-[26rem]">
        {complaintDetails.description}
      </span>
    </span>
  </div>
</div>
 
<div>
<Typography className="font-baloo text-right text-lg font-bold text-gray-700">
            المرفقات :
</Typography> 
               <hr />
{complaintDetails.ImagesOfUserComplaints && complaintDetails.ImagesOfUserComplaints.length > 0 ? (
 <div className="carousel mt-3">
      <div className="carousel-items">
        {complaintDetails.ImagesOfUserComplaints.map((url, index) => (
          <div
            key={url}
            className={`carousel-item ${index === activeIndexUser ? 'active' : ''}`}
          >
            <img src={url} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
      {complaintDetails.ImagesOfUserComplaints.length > 1 && ( // Only show controls if there are more than one image
      <>
      <a className="carousel-control prev" onClick={() => moveSlideUser(-1)}>&#10095;</a>
      <a className="carousel-control next" onClick={() => moveSlideUser(1)}>&#10094;</a>
      </>
       )} 
    </div>
  ) :  
  <Typography color="red">
  <span style={{color: "dark-red"}}>لا توجد مرفقات</span>
  </Typography>
  }

</div>
       </div>
          </Card>
            </div>

          <div style={{ overflowX: "auto", maxHeight: "200vh" }} className="mt-5">
            <Card className="max-w-4xl m-auto ">

            <div >
        {(complaintDetails.status === "تم التنفيذ" || complaintDetails.status === "مرفوض") ? (

           complaintDetails.status === "تم التنفيذ" ? 
          (<div className=" pr-8 py-2 " style={{backgroundColor:'#97B980', color: "white", borderRadius: "5px"}}>
  
          <Typography className="font-baloo text-right text-xl font-bold ">
            تفاصيل تنفيذ البلاغ
          </Typography>
          </div>) 
          : 
          (<div className=" pr-8 py-2 " style={{backgroundColor:'#FE5500', color: "white", borderRadius: "5px"}}>
  
          <Typography className="font-baloo text-right text-xl font-bold ">
            تفاصيل رفض البلاغ
          </Typography>
          </div>)
    
        ) 
        : 
        ( 
  <div className=" pr-8 py-2 " style={{ borderRadius: "5px"}}>
<Typography className="font-baloo text-right text-xl font-bold text-gray-700">
الإجراء :
</Typography>
</div>
)}

        <hr  />

<div className="px-8 pb-8">
           
{ ( editMode || complaintDetails.status == 'جديد' || complaintDetails.status == 'قيد التنفيذ') && (

<>
<Typography className="font-baloo text-right text-md font-bold mt-5 mb-3">
    <span> تغيير حالة البلاغ:</span>
</Typography>


<select
  value={selectedStatus || complaintDetails.status }
  onChange={(e) => {setSelectedStatus(e.target.value); setErrorMessageStatus(""); console.log("select:"+ e.target.value); console.log("selected:"+ selectedStatus);}} 
  className="p-2 border border-gray-300 rounded mb-5"
>
  <option value="جديد" disabled={!complaintDetails || complaintDetails.status == "قيد التنفيذ"}>جديد</option>
  <option value="قيد التنفيذ">قيد التنفيذ</option>
  <option value="تم التنفيذ" disabled={!complaintDetails || complaintDetails.status == 'جديد'}> قبول</option>
  <option value="مرفوض" > رفض</option>
</select>

<Typography color="red"  className="font-semibold">
       <span>  {errorMessageStatus}</span>
</Typography>
   
        { (selectedStatus === 'تم التنفيذ' || selectedStatus === 'مرفوض' || complaintDetails.status==='تم التنفيذ' || complaintDetails.status==="مرفوض")&&(selectedStatus != 'قيد التنفيذ') ? (
<>
{selectedStatus == "مرفوض" && (
    <Typography className="font-baloo text-right text-md font-bold ">
    <span>  توضيح سبب الرفض :</span>
     </Typography>
)} 
     
     {selectedStatus =='تم التنفيذ'&& (
    <Typography className="font-baloo text-right text-md font-bold ">
    <span> التعليق:</span>
     </Typography>

 )} 
  
  <div className="grid gap-3">
    
    <Textarea
      label="التعليق"
      value={message || complaintDetails.staffResponse}
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

<div className="upload-images-section">
  <label htmlFor="image-upload" className="font-baloo text-right text-md font-bold mb-2">
     إرفاق صور:
  </label>
  <input
    type="file"
    id="image-upload"
    multiple
    onChange={handleImageSelection}
    accept="image/*"
    className="p-2 border border-gray-300 rounded mr-2"
  />
  <p className="image-upload-instructions">يمكنك إرفاق ما يصل إلى 3 صور.</p>
  {imageUploadError && (
    <p className="error-message">{imageUploadError}</p>
  )}
</div>

<div className="image-previews">
      {imagePreviews.map((url, index) => (
        <div key={index} className="image-preview">
          <img src={url} alt={`Preview ${index}`} />
          <button className="delete-btn" onClick={() => deleteImage(index)}>×</button>
        </div>
      ))}
    </div>

  </> ) 
  
  : null}

{  message.trim() == "" && selectedStatus==="" ? <span>  يجب أن يتم تغيير الحالة حتى تتمكن من تحديث البلاغ  </span>:
      <Button
                    size="sm"
                    variant="gradient"
                    style={{ background: '#97B980', color: '#ffffff' }}
                    onClick={handleUpdateComplaint}
                    className="text-sm mt-3 mb-3 "
                  >
                    <span>تحديث البلاغ</span>
      </Button>
}               
</>
)}
</div>
</div>

{(complaintDetails.status === "تم التنفيذ" || complaintDetails.status === "مرفوض" ) && (
  <div className="flex flex-col gap-2 px-8 pb-8">
    {(complaintDetails.status === "تم التنفيذ" || complaintDetails.status === "مرفوض") && (
  <>  
    <Typography className="flex flex-col "> 
    <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
    التعليق :
    </Typography>
      <hr/>
    <span className="w-full max-w-[48rem]">{complaintDetails.staffResponse}</span> 
    </Typography>
    
  <div>
  
  <Typography className="font-baloo text-right text-lg font-bold text-gray-700">
  المرفقات :
  </Typography>
              <hr/>
  {complaintDetails.ImagesOfStaffResponse && complaintDetails.ImagesOfStaffResponse.length > 0 ? (
<div className="carousel">
      <div className="carousel-items">
        {complaintDetails.ImagesOfStaffResponse.map((url, index) => (
          <div
            key={url}
            className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
          >
            <img src={url} alt={`Slide ${index}`} />
          </div>
        ))}
      </div> 
      {complaintDetails.ImagesOfStaffResponse.length > 1 && ( 
      <>
      <a className="carousel-control prev" onClick={() => moveSlide(-1)}>&#10095;</a>
      <a className="carousel-control next" onClick={() => moveSlide(1)}>&#10094;</a>
      </>
      )}

    </div>
  ) :  
  <Typography color="red">
  <span style={{color: "dark-red"}}>لا توجد مرفقات</span>
  </Typography>
  }
</div>

</>
    )}
</div>
 )}

    </Card>
    </div>
    </div>
      ) 
      : 
      (
        <div>تحميل تفاصيل البلاغ...</div>
      )}

<Success open={showSuccessProcess} handler={handleSuccessProcess} message=" تم تحديث حالة البلاغ إلى (قيد التنفيذ) بنجاح" />
<SummaryComplaintResponse  open={summeryComplaintOpen} handler={handleSummeryComplaint} complaintData={complaintDetails} method={handleComplaintSubmit} responseData={responseData} handleEdit={handleSummeryComplaintClose} imagePreviews={imagePreviews}/>
<Success open={showSuccessResponse} handler={handleSuccessResponse} message=" تم معالجة البلاغ بنجاح" />
    </>
     );
     }  
