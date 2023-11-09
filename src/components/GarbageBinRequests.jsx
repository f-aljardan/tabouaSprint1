
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button, Card, Typography, Chip,Input } from "@material-tailwind/react";
import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  query,
} from "firebase/firestore";
import { useNavigate } from 'react-router-dom'; 
import Success from "./messages/Success";
import Select from "react-select"; 

export default function GarbageBinRequests() {
    const navigate = useNavigate(); // Use a navigation hook
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);


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


  const handleRequestProcessing = async (request) => {
    try {
        const requestRef = doc(db, 'requestedGarbageBin', request.id);
        await updateDoc(requestRef, { status: 'قيد التنفيذ' });
        // After updating the status, initiate navigation to the GarbageBinMap page.
        navigateToGarbageBinMap(request.id); // You should implement this function.
      } catch (error) {
        console.error('Error updating request status:', error);
      }
  
  };

  const navigateToGarbageBinMap = (requestId) => {
    navigate(`/mainpage/garbage/${requestId}`); // Navigate to the GarbageBinMap page with the request ID as a route parameter
  };

  const statusOptions = [
    { value: "الكل", label: "الكل" },
    { value: "جديد", label: "جديد" },
    { value: "قيد التنفيذ", label: "قيد التنفيذ" },
    { value: "مقبول", label: "مقبول" },
    { value: "مرفوض", label: "مرفوض" },
  ];

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
          <span>الحالة</span>
        </Typography>
      </th>
      {statusFilter === "مقبول" || statusFilter === "مرفوض" ? (
        <>
          <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none opacity-70 text-right"
              component={"span"}
            >
              <span>تاريخ الرد</span>
            </Typography>
          </th>
          {statusFilter === "مرفوض" && (
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70 text-right"
                component={"span"}
              >
                <span>سبب الرفض</span>
              </Typography>
            </th>
          )}
        </>
      ) : null}
      {statusFilter === "جديد" && (
        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
          <Typography
            variant="small"
            color="blue-gray"
            className="font-normal leading-none opacity-70 text-right"
            component={"span"}
          >
            <span>الإجراء</span>
          </Typography>
        </th>
      )}
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
        searchResults.map((request) => {
          return (
            <tr key={request.id}>
              <td className="p-4 text-right">{request.requestNo}</td>
              <td className="p-4 text-right">
                {request.requestDate?.toDate().toLocaleDateString() || 'N/A'}
              </td>
              <td className="p-4 text-center">
                <div className="w-max">
                  <Chip
                    size="sm"
                    variant="ghost"
                    value={request.status}
                    color={
                      request.status === 'مقبول'
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
              {statusFilter === 'مقبول' || statusFilter === 'مرفوض' ? (
                <>
                  <td className="p-4 text-right">
                    {request.responseDate?.toDate().toLocaleDateString() || 'N/A'}
                  </td>
                  {statusFilter === 'مرفوض' && (
                    <td className="p-4 text-right">{request.rejectionComment}</td>
                  )}
                </>
              ) : null}
              {statusFilter === 'جديد' && (
                <td className="p-4 text-right">
                  <Button
                    size="md"
                    fullWidth={true}
                    variant="gradient"
                    style={{ background: '#97B980', color: '#ffffff' }}
                    onClick={() => handleRequestProcessing(request)}
                  >
                    <span>معالجة</span>
                  </Button>
                </td>
              )}
            </tr>
          );
        })
      ))
    : requests.map((request) => {
        if (statusFilter === '' || statusFilter === 'الكل' || request.status === statusFilter) {
          return (
            <tr key={request.id}>
              <td className="p-4 text-right">{request.requestNo}</td>
              <td className="p-4 text-right">
                {request.requestDate?.toDate().toLocaleDateString() || 'N/A'}
              </td>
              <td className="p-4 text-center">
                <div className="w-max">
                  <Chip
                    size="sm"
                    variant="ghost"
                    value={request.status}
                    color={
                      request.status === 'مقبول'
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
              {statusFilter === 'مقبول' || statusFilter === 'مرفوض' ? (
                <>
                  <td className="p-4 text-right">
                    {request.responseDate?.toDate().toLocaleDateString() || 'N/A'}
                  </td>
                  {statusFilter === 'مرفوض' && (
                    <td className="p-4 text-right">{request.rejectionComment}</td>
                  )}
                </>
              ) : null}
              {statusFilter === 'جديد' && (
                <td className="p-4 text-right">
                  <Button
                    size="md"
                    fullWidth={true}
                    variant="gradient"
                    style={{ background: '#97B980', color: '#ffffff' }}
                    onClick={() => handleRequestProcessing(request)}
                  >
                    <span>معالجة</span>
                  </Button>
                </td>
              )}
            </tr>
          );
        }
        return null;
      })}
</tbody>



</table>

      </Card> </div>
      </div>
    </>
  );
        }  