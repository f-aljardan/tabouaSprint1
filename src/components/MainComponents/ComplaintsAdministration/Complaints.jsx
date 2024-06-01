import { Link , useNavigate, useSearchParams} from "react-router-dom";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {Card, Typography, Chip,Input , IconButton} from "@material-tailwind/react";
import { db } from "../../../firebase";
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import Select from "react-select"; 
// import ViewRequestInfo from "../../utilityComponents/viewInfo/ViewRequestInfo"

export default function Complaints({directRoute,setDirectRoute, typeFilter, setTypeFilter, statusFilter, setStatusFilter, dateFilter ,setDateFilter , neighborhoodFilter, setNeighborhoodFilter }){


  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [neighborhoodOptions, setNeighborhoodOptions] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

const extractNeighborhood = (localArea) => {
  // Check if localArea starts with a postal code 
  const postalCodeRegex = /^\d+\s*,\s*/;
  if (postalCodeRegex.test(localArea)) {
    return localArea.replace(postalCodeRegex, '').trim();
  } else {
    //  first part is the neighborhood name
    return localArea.split(',')[0].trim();
  }
};

  //Fetching all complaints
  useEffect(() => {
    const q = query(collection(db, "complaints"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedComplaints = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });

      setComplaints(updatedComplaints);
      const neighborhoods = Array.from(new Set(updatedComplaints.map(complaint => extractNeighborhood(complaint.localArea)))).sort();
      setNeighborhoodOptions(neighborhoods.map(n => ({ value: n, label: n })));  
      // Set dataLoaded to true when complaints data is fetched
      setDataLoaded(true);
    });

        

    return () => {
      unsubscribe();
    };
    
  }, []);

  // Update searchResults when requests change
  useEffect(() => {
    if (searchQuery) {
      const filteredResults = complaints.filter((complaint) =>
        complaint.complaintNo.includes(searchQuery)
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, complaints]);

//options for the select component
  const statusOptions = [
    { value: "الكل", label: "الكل" },
    { value: "جديد", label: "جديد" },
    { value: "قيد التنفيذ", label: "قيد التنفيذ" },
    { value: 'تم التنفيذ', label: 'تم التنفيذ' },
    { value: "مرفوض", label: "مرفوض" },
  ];

//options for the select component
const typeOptions = [
  { value: "الكل", label: "الكل" },
  { value: "نظافة الحاوية", label: "نظافة الحاوية" },
  { value: "حاوية ممتلئة", label: "حاوية ممتلئة" },
  { value: 'موقع الحاوية', label: 'موقع الحاوية' },
  { value: 'مخلفات مهملة', label: 'مخلفات مهملة' },
  { value: 'مخلفات خطرة', label: 'مخلفات خطرة' },
  { value: 'وقت تفريغ الحاوية', label: 'وقت تفريغ الحاوية' },
  { value: "أخرى", label: "أخرى" },
];

// styling for the select component
  const reactSelectStyles = {
    container: (provided) => ({
      ...provided,
      width: "300px", 
    }),
  };
  
  const filteredComplaints = complaints
  .filter(
    (complaint) =>
      (statusFilter === "" || statusFilter === "الكل" || complaint.status === statusFilter) &&
      (typeFilter === "" || typeFilter === "الكل" || complaint.complaintType === typeFilter) &&
      (neighborhoodFilter === "" || neighborhoodFilter === "الكل" || extractNeighborhood(complaint.localArea) === neighborhoodFilter) &&
      (dateFilter === "" ? true :  `${complaint.complaintDate?.toDate().getFullYear()}-${complaint.complaintDate?.toDate().getMonth() + 1}` === dateFilter)
  )
  .sort((a, b) => a.complaintDate?.toDate() - b.complaintDate?.toDate());

  return (
    <> <div className="m-5"><div  style={{ overflowX: "auto",    maxHeight: "110vh",}}>
      <Card className="max-w-4xl m-auto p-8  "  >
        <div className="flex justify-between">

        <h2 className="text-2xl font-semibold mb-4">قائمة البلاغات</h2>
        
        {directRoute ? (
                <button onClick={() => {
                  navigate(-1); 
                  setDirectRoute(false);
                  setTypeFilter('');
                  setStatusFilter('');
                  setNeighborhoodFilter('');
                  setDateFilter(''); 
                }}
                className=" mb-4">

                  <IconButton variant="text" size="lg">
                  <i className="fas fa-arrow-left fa-lg" />
                  </IconButton>
                </button>
            ) : null}

        </div>
        <div className="mb-4 flex items-center gap-3">
          <Select
            placeholder="تصفية حسب حالة البلاغ"
            options={statusOptions}
            value={statusOptions.find((option) => option.value === statusFilter)}
            onChange={(selectedOption) => setStatusFilter(selectedOption.value)}
            styles={reactSelectStyles}
          />

          <Select
            placeholder="تصفية حسب نوع البلاغ"
            options={typeOptions}
            value={typeOptions.find((option) => option.value === typeFilter)}
            onChange={(selectedOption) => setTypeFilter(selectedOption.value)}
            styles={reactSelectStyles}
          />
          
          <Select
                placeholder="تصفية حسب الحي"
                options={[{ value: '', label: 'الكل' }, ...neighborhoodOptions]}
                value={neighborhoodOptions.find(option => option.value === neighborhoodFilter)}
                onChange={(selectedOption) => setNeighborhoodFilter(selectedOption.value)}
                styles={reactSelectStyles}
              />

          <div className="w-full md:w-72">
                <Input
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  placeholder="البحث برقم البلاغ"
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
          <span>رقم البلاغ</span>
        </Typography>
      </th>
      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal leading-none opacity-70 text-right"
          component={"span"}
        >
          <span>تاريخ البلاغ</span>
        </Typography>
      </th>
      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal leading-none opacity-70 text-right"
          component={"span"}
        >
          <span>نوع البلاغ</span>
        </Typography>
      </th>
      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal leading-none opacity-70 text-right"
          component={"span"}
        >
          <span> الحي</span>
        </Typography>
      </th>
      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal leading-none opacity-70 text-right"
          component={"span"}
        >
          <span>حالة البلاغ</span>
        </Typography>
      </th>
    </tr>
  </thead>
  <tbody>
    
  {searchQuery
    ? (searchResults.length === 0 ? (
        
      <tr>
      <td className="p-4 border-b border-blue-gray-50 text-center" colSpan="5">
        <Typography variant="small" color="red" className="font-bold">
        <span>لا يوجد أرقام مطابقة</span>  
        </Typography>
      </td>
    </tr>
      ) : (
        searchResults.filter(
          (complaint) =>
        (statusFilter === '' || statusFilter === 'الكل' || complaint.status === statusFilter) &&
        (typeFilter === '' || typeFilter === 'الكل' || complaint.complaintType === typeFilter)&&
        (neighborhoodFilter === '' || neighborhoodFilter === 'الكل' || extractNeighborhood(complaint.localArea) === neighborhoodFilter) &&
        (dateFilter === "" ? true :  `${complaint.complaintDate?.toDate().getFullYear()}-${complaint.complaintDate?.toDate().getMonth() + 1}` === dateFilter)
        )
        .sort(
          (a, b) =>
            a.complaintDate?.toDate() - b.complaintDate?.toDate()
        )
        .map((complaint) => (
            <tr key={complaint.id}>
        <td className="p-4 text-right cursor-pointer hover:text-red"
                  > 
                    <Link to={`${complaint.id}`}>
                      <Typography color="teal">
                        <span>{complaint.complaintNo}</span>
                      </Typography>
                    </Link>
                  </td>
              <td className="p-4 text-right">
                {complaint.complaintDate?.toDate().toISOString().slice(0,10) || 'N/A'}
              </td>    

              <td className="p-4 text-right">
              <span>{complaint.complaintType} </span>
              </td> 

              <td className="p-4 text-right">
              <span>{extractNeighborhood(complaint.localArea)} </span>
              </td>

              <td className="p-4 text-center">
                <div className="w-20">
                  <Chip
                  className="rounded-full  text-center"
                    size="sm"
                    variant="ghost"
                    value={complaint.status}
                    color={
                      complaint.status === "تم التنفيذ"
                        ? 'green'
                        : complaint.status === 'مرفوض'
                        ? 'red'
                        : complaint.status === 'قيد التنفيذ'
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
    : dataLoaded ? ( filteredComplaints.length === 0 ? (
      <tr>
        <td className="p-4 border-b border-blue-gray-50 text-center" colSpan="5">
          <Typography variant="small" color="red" className="font-bold">
            <span>لا يوجد بلاغات مطابقة للتصنيف</span>
          </Typography>
        </td>
      </tr>
    ) : (
      filteredComplaints.map((complaint) => (
        // Render your complaint row here
        <tr key={complaint.id}>
        <td
        className="p-4 text-right cursor-pointer hover:text-red"
        > 
          <Link to={`${complaint.id}`}>
<Typography color="teal">
<span>{complaint.complaintNo}</span>
</Typography>
</Link>
      </td>
      <td className="p-4 text-right">
        {complaint.complaintDate?.toDate().toISOString().slice(0,10) || 'N/A'}
      </td>

      <td className="p-4 text-right">
          <span>{complaint.complaintType} </span>
          </td> 
           
          <td className="p-4 text-right">
          <span>{extractNeighborhood(complaint.localArea)} </span>
          </td>

       <td className="p-4 text-center">
         <div className="w-20">
           <Chip
             className="rounded-full text-center"
             size="sm"
             variant="ghost"
             value={complaint.status}
             color={
               complaint.status === "تم التنفيذ"
                 ? 'green'
                 : complaint.status === 'مرفوض'
                 ? 'red'
                 : complaint.status === 'قيد التنفيذ'
                 ? 'amber'
                 : 'teal'
             }
           />
         </div>
       </td>
     </tr>
      ))
    ) ) : <tr>
    <td className="p-4 border-b border-blue-gray-50 text-center" colSpan="5">
      <Typography variant="small" color="gray" className="font-bold">
        <span> يتم تحميل البلاغات   </span>
      </Typography>
    </td>
  </tr> }
     
</tbody>



</table>

      </Card> 
      </div>
      </div>

    </>
  );
        }  