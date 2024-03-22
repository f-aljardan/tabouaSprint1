
import { useState, useEffect } from "react";
import { Link , useNavigate} from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {Card, Typography, Chip,Input } from "@material-tailwind/react";
import { db } from "../../../firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import Select from "react-select"; 





export default function GarbageBinRequests() {
 
  const [requests, setRequests] = useState([]);
  // const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState(""); 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // const [showRequestInfo, setShowRequestInfo] = useState(false);


  // const handleRequestInfo = () =>  setShowRequestInfo(!showRequestInfo);


  //function to open the request details window
  // const handleViewRequestClick = (request) => {
  //   const requestDoc = doc(db, 'requestedGarbageBin', request.id);
  //   const unsubscribe = onSnapshot(requestDoc, (requestSnapshot) => {
  //     if (requestSnapshot.exists()) {
  //       const requestData = requestSnapshot.data();
  //       // Update selectedRequest with the latest data from Firebase
  //       setSelectedRequest({ ...request, ...requestData });
  //       setShowRequestInfo(true);
  //     }
  //   });
    
  //   return () => {
  //     unsubscribe();
  //   };
  // };



  //Fetch all requests
  useEffect(() => {
    const q = query(collection(db, "requestedGarbageBin"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedRequests = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });

      setRequests(updatedRequests);
    });

    return () => {
      unsubscribe();
    };
    
  }, []);




  // Update searchResults when requests change
  useEffect(() => {
    if (searchQuery) {
      const filteredResults = requests.filter((request) =>
        request.requestNo.includes(searchQuery)
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, requests]);



//options for the select component
  const statusOptions = [
    { value: "الكل", label: "الكل" },
    { value: "جديد", label: "جديد" },
    { value: "قيد التنفيذ", label: "قيد التنفيذ" },
    { value: 'تم التنفيذ', label: 'تم التنفيذ' },
    { value: "مرفوض", label: "مرفوض" },
  ];

// styling for the select component
  const reactSelectStyles = {
    container: (provided) => ({
      ...provided,
      width: "100%", // Adjust the width as needed
    }),
  };
  
 

  return (
    <> <div className="m-5"><div  style={{ overflowX: "auto",    maxHeight: "110vh",}}>
      <Card className="max-w-4xl m-auto p-8  "  >
        <h2 className="text-2xl font-semibold mb-4">قائمة الطلبات</h2>
        
        <div className="mb-4 flex items-center gap-10">
          <Select
            placeholder="تصفية حسب حالة الطلب"
            options={statusOptions}
            value={statusOptions.find((option) => option.value === statusFilter)}
            onChange={(selectedOption) => setStatusFilter(selectedOption.value)}
            styles={reactSelectStyles}
          />

           <div className="w-full md:w-72">
                <Input
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  placeholder="البحث برقم الطلب"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="custom-placeholder"
                />
              </div>

        </div>

        <table className="  table-auto  mt-4  ">
        
  <thead>
    <tr>
      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal leading-none opacity-70 text-right"
          component={"span"}
        >
          <span>رقم الطلب</span>
        </Typography>
      </th>
      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal leading-none opacity-70 text-right"
          component={"span"}
        >
          <span>تاريخ الطلب</span>
        </Typography>
      </th>
      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal leading-none opacity-70 text-right"
          component={"span"}
        >
          <span>حالة الطلب</span>
        </Typography>
      </th>
    </tr>
  </thead>
  <tbody>
  {searchQuery
    ? (searchResults.length === 0 ? (
        
      <tr>
      <td className="p-4 border-b border-blue-gray-50 text-center" colSpan="3">
        <Typography variant="small" color="red" className="font-bold">
        <span>لا يوجد أرقام مطابقة</span>  
        </Typography>
      </td>
    </tr>
      ) : (
        searchResults.filter(
          (request) =>
            statusFilter === '' ||
            statusFilter === 'الكل' ||
            request.status === statusFilter
        )
        .sort(
          (a, b) =>
            a.requestDate?.toDate() - b.requestDate?.toDate()
        )
        .map((request) => (
          // .map((request) => {
          // return (
            <tr key={request.id}>
             {/* <td className="p-4 text-right cursor-pointer hover:text-red" onClick={() => handleViewRequestClick(request)}>
              <Typography  color="teal">
                 <span>{request.requestNo}</span>
               </Typography>
</td> */}
<td className="p-4 text-right cursor-pointer hover:text-red"
                  > 
                    <Link to={`${request.id}`}>
                      <Typography color="teal">
                        <span>{request.requestNo}</span>
                      </Typography>
                    </Link>
                  </td>


   <td className="p-4 text-right">
                {request.requestDate?.toDate().toLocaleDateString() || 'N/A'}
              </td>
              <td className="p-4 text-center">
                <div className="w-20">
                  <Chip
                  className="rounded-full  text-center"
                    size="sm"
                    variant="ghost"
                    value={request.status}
                    color={
                      request.status === "تم التنفيذ"
                        ? 'green'
                        : request.status === 'مرفوض'
                        ? 'red'
                        : request.status === 'قيد التنفيذ'
                        ? 'amber'
                        : 'teal'
                    }
                  />
                </div>
              </td>
            </tr>
         
        )
      )
      )) 
   
    : requests
      .filter(
        (request) =>
          statusFilter === '' ||
          statusFilter === 'الكل' ||
          request.status === statusFilter
      )
      .sort(
        (a, b) =>
          a.requestDate?.toDate() - b.requestDate?.toDate()
      )
      .map((request) => (
        <tr key={request.id}>
          {/* <td className="p-4 text-right cursor-pointer hover:text-red" onClick={() => handleViewRequestClick(request)}>
            <Typography  color="teal">
              <span>{request.requestNo}</span>
            </Typography>
          </td> */}
          <td
                    className="p-4 text-right cursor-pointer hover:text-red"
                  > 
                   <Link to={`${request.id}`}>
  <Typography color="teal">
    <span>{request.requestNo}</span>
  </Typography>
</Link>
                  </td>
          <td className="p-4 text-right">
            {request.requestDate?.toDate().toLocaleDateString() || 'N/A'}
          </td>
          <td className="p-4 text-center">
            <div className="w-20">
              <Chip
                className="rounded-full text-center"
                size="sm"
                variant="ghost"
                value={request.status}
                color={
                  request.status === "تم التنفيذ"
                    ? 'green'
                    : request.status === 'مرفوض'
                    ? 'red'
                    : request.status === 'قيد التنفيذ'
                    ? 'amber'
                    : 'teal'
                }
              />
            </div>
          </td>
        </tr>
      ))}
</tbody>



</table>

      </Card> 
      </div>
      </div>

      {/* <ViewRequestInfo  open={showRequestInfo} handler={handleRequestInfo} requestInfo={selectedRequest} /> */}
    </>
  );
        }  