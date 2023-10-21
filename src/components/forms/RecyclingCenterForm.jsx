import { useState } from 'react';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input,Textarea,Typography,} from "@material-tailwind/react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import SummaryCenterMessage from "../messages/SummaryCenterMessage"
import { getDownloadURL, ref, uploadBytes }  from '@firebase/storage';
import { storage } from "../../firebase";

export default function RecyclingCenterForm({ open, handler, method }) { 
    const animatedComponents = makeAnimated();

   // Define the available options for waste types
    const options = [
      { value: 'بلاستيك', label: 'بلاستيك' },
      { value: 'ورق', label: 'ورق' },
      { value: 'زجاج', label: 'زجاج' },
      { value: 'كرتون', label: 'كرتون' },
      { value: 'معدن', label: 'معدن' },
      { value: 'إلكترونيات', label: 'إلكترونيات' },
      { value: 'أخرى', label: 'أخرى' },
    ];


  const [summeryCenterOpen, setSummeryCenterOpen] = useState(false);// State to manage the visibility of the summary center information
  const [time, setTime] = useState(dayjs('2022-04-17T00:00'));
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null); 
 
  const handleSummeryCenter = () =>setSummeryCenterOpen(!summeryCenterOpen); // Function to toggle the visibility of the summary center
  const handleSummeryCenterClose = () =>{ handler(); setSummeryCenterOpen(!summeryCenterOpen); }// Function to close the form and show the summary center information

 

    const [formData, setFormData] = useState({
      name: '',
      description: '',
      types: [],
      imageURL: '',
      logoURL: '',
      websiteURL:'',
      openingHours: {
        fri: { from: '', to: '', isClosed: false },
        weekdays: { from: '', to: '' },
        sat: { from: '', to: '', isClosed: false },
      },
      phoneNo: '',
    });

    const [errors, setErrors] = useState({
      name: '',
      description: '',
      openingHour: '',
      imageURL: '',
      logoURL: '',
      websiteURL:'',
      phoneNo: '',
      types: '',
    });
  

    // Handle changes in input fields
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });

      setErrors({
        ...errors,
        [name]: '',
      });
    };
  
    // Handle changes in the selected waste types
    const handleTypeChange = (selectedOptions) => {
      const selectedTypes = selectedOptions.map((option) => option.value);
      setFormData({
        ...formData,
        types: selectedTypes,
      });
      setErrors({
        ...errors,
        types: '',
      });

    };
  
    // Handle changes in opening hours time fields
    const handleOpeningHoursChange = (time, category, field) => {
      setFormData((prevData) => ({
        ...prevData,
        openingHours: {
          ...prevData.openingHours,
          [category]: {
            ...prevData.openingHours[category],
            [field]: time,
          },
        },
      }));

      setErrors({
        ...errors,
        openingHour: '',
      });
    };

    // Handle changes in the "Closed" checkbox for specific days
    const handleDayClosedChange = (isClosed, day) => {
        setFormData((prevData) => ({
          ...prevData,
          openingHours: {
            ...prevData.openingHours,
            [day]: {
              ...prevData.openingHours[day],
              isClosed: isClosed,
            },
          },
        }));
      };

       // Handle the upload of images for the center
      const handleImageUpload = async (file) => {
        if (file) {
          try {
            const imageName = Date.now().toString();
            const storageRef = ref(storage, `images/${imageName}`);
            await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(storageRef);
    
            setFormData((prevData) => ({
              ...prevData,
              imageURL: imageUrl,
            }));
          } catch (error) {
            console.error('Error uploading image:', error);
            setErrors((prevErrors) => ({
              ...prevErrors,
              imageURL: 'Error uploading image',
            }));
          }
        }
      };
    
      
     // Handle the upload of the center's logo
      const handleLogoUpload = async (file) => {
        if (file) {
          try {
            const logoName = Date.now().toString();
            const storageRef = ref(storage, `logos/${logoName}`);
            await uploadBytes(storageRef, file);
            const logoUrl = await getDownloadURL(storageRef);
    
            setFormData((prevData) => ({
              ...prevData,
              logoURL: logoUrl,
            }));
          } catch (error) {
            console.error('Error uploading logo image:', error);
            setErrors((prevErrors) => ({
              ...prevErrors,
              logoURL: 'Error uploading logo image',
            }));
          }
        }
      };
    
      // Handle changes in the selected image for the center
      const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        handleImageUpload(file);
      };
    
      // Handle changes in the selected logo for the center
      const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setSelectedLogo(file);
        handleLogoUpload(file);
      };
    

      // Validate the form data before submission
      const validate = (e) => {
        e.preventDefault();
        const newErrors = {};
    
        if (!formData.name.trim()) {
          newErrors.name = 'يجب إدخال اسم المركز';
        }
    
        if (!formData.description.trim()) {
          newErrors.description = 'يجب إدخال وصف المركز';
        }
    
        if (!formData.openingHours || !formData.openingHours.weekdays || !formData.openingHours.weekdays.from || !formData.openingHours.weekdays.to ||
            (!formData.openingHours.fri.isClosed && (!formData.openingHours.fri.from || !formData.openingHours.fri.to)) ||
            (!formData.openingHours.sat.isClosed && (!formData.openingHours.sat.from || !formData.openingHours.sat.to))) {
          newErrors.openingHour = 'يجب إدخال ساعات العمل';
        }
    
        if (!formData.imageURL.trim()) {
          newErrors.imageURL = 'يجب إدخال صورة المركز';
        }
    
        if (!formData.logoURL.trim() || !selectedLogo) {
          newErrors.logoURL = 'يجب إدخال شعار المركز';
        }

        if (!formData.phoneNo.trim()) {
          newErrors.phoneNo = 'يجب إدخال رقم التواصل';
        } else if (!/^\d+$/.test(formData.phoneNo)) {
          newErrors.phoneNo = 'رقم التواصل يجب أن يحتوي على أرقام فقط';
        }
    
        if (formData.types.length === 0) {
          newErrors.types = 'يجب تحديد نوع واحد على الأقل';
        }

      
  if (!formData.websiteURL.trim() || !isValidURL(formData.websiteURL)) {
    newErrors.websiteURL = 'رابط الموقع غير صحيح';
  }
    
        const hasErrors = Object.values(newErrors).some((error) => error);
    
        if (hasErrors) {
          setErrors(newErrors);
        } else {
          handleSummeryCenter();
        }
      };
      

 // Helper function to validate a URL
const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
    
   
  
    const handleSubmit = () => {
     
      method(formData);
      setFormData({
        name: '',
        description: '',
        types: [],
        imageURL: '',
        logoURL: '',
        websiteURL:'',
        openingHours: {
          fri: { from: '', to: '', isClosed: false },
          weekdays: { from: '', to: '' },
          sat: { from: '', to: '', isClosed: false },
        },
        phoneNo: '',
      });
    
      setErrors({
        name: '',
        description: '',
        openingHour: '',
        imageURL: '',
        logoURL: '',
        websiteURL:'',
        phoneNo: '',
        types: '',


      });
       
    };


     const handleCloseForm = () => {

      handler();
      setFormData({
        name: '',
        description: '',
        types: [],
        imageURL: '',
        logoURL: '',
        websiteURL:'',
        openingHours: {
          fri: { from: '', to: '', isClosed: false },
          weekdays: { from: '', to: '' },
          sat: { from: '', to: '', isClosed: false },
        },
        phoneNo: '',
      });

      setErrors({
        name: '',
        description: '',
        openingHour: '',
        imageURL: '',
        logoURL: '',
        websiteURL:'',
        phoneNo: '',
        types: '',


      });


    };

    return (
      <>
        <div>
          <Dialog size="xl" open={open} handler={handler}>
            <form>
              <DialogHeader className="flex justify-center font-baloo text-right">
                أضف مركز إعادة تدوير جديد
              </DialogHeader>
              <DialogBody divider className="font-baloo text-right">
                <div className='flex justify-between'>
                  <div className='w-100'>
                    <Typography className="font-baloo text-right text-md font-bold">
                      معلومات المركز:
                    </Typography>
                    <div>
                      <Input
                        label="إسم المركز"
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      {errors.name && <Typography color="red">{errors.name}</Typography>}
                    </div>
                    <div>
                      <Textarea
                        label="وصف المركز"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className='mt-2'
                      />
                      {errors.description && <Typography color="red">{errors.description}</Typography>}
                    </div>
                    <div>
                      <Select
                        placeholder="أنواع النفايات المستقبلة..."
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={options}
                        value={options.filter((option) => formData.types.includes(option.value))}
                        onChange={handleTypeChange}
                        required
                      />
                      {errors.types && <Typography color="red">{errors.types}</Typography>}
                    </div>
                    <div className='flex  items-center gap-2 mt-2 '>
                      <div>
                        <Input
                          label="رقم التواصل"
                          type="tel"
                          id="phoneNo"
                          name="phoneNo"
                          value={formData.phoneNo}
                          onChange={handleChange}
                          required
                        />
                        {errors.phoneNo && <Typography color="red"  className=' '>{errors.phoneNo}</Typography>}
                      </div>
                      <div>
                        <Input
                          label="رابط الموقع الإلكتروني"
                          type="url"
                          id="websiteURL"
                          name="websiteURL"
                          value={formData.websiteURL}
                          onChange={handleChange}
                          required
                        />
                        {errors.websiteURL && <Typography color="red" className=' '>{errors.websiteURL}</Typography>}
                      </div>
                    </div>
                    <div className='flex items-center'></div>
                  </div>
                  <div>
                    <div className="flex flex-col gap-5 items-start w-100">
                      <Typography className="font-baloo text-right text-md font-bold">
                        ساعات عمل المركز:
                      </Typography>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1 items-center">
                          <span>أيام الأسبوع:</span>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              className='w-32'
                              views={['hours']}
                              label="من"
                              value={formData.openingHours.weekdays.from || time}
                              onChange={(time) => handleOpeningHoursChange(time, 'weekdays', 'from')}
                            />
                            <TimePicker
                              className='w-32'
                              views={['hours']}
                              label="إلى"
                              value={formData.openingHours.weekdays.to || time}
                              onChange={(time) => handleOpeningHoursChange(time, 'weekdays', 'to')}
                            />
                          </LocalizationProvider>
                        </div>
                        <div className="flex gap-5 items-center">
                          <span>الجمعة:</span>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="flex gap-2">
                              <TimePicker
                                className='w-32'
                                views={['hours']}
                                label="من"
                                value={formData.openingHours.fri.from || time}
                                onChange={(time) => handleOpeningHoursChange(time, 'fri', 'from')}
                              />
                              <TimePicker
                                className='w-32'
                                views={['hours']}
                                label="إلى"
                                value={formData.openingHours.fri.to || time}
                                onChange={(time) => handleOpeningHoursChange(time, 'fri', 'to')}
                              />
                              <div className='flex gap-1 items-center'>
                                <input
                                  type="checkbox"
                                  checked={formData.openingHours.fri.isClosed}
                                  onChange={(e) => handleDayClosedChange(e.target.checked, 'fri')}
                                />
                                <span>مغلق الجمعة</span>
                              </div>
                            </div>
                          </LocalizationProvider>
                        </div>
                        <div className="flex gap-5 items-center">
                          <span>السبت:</span>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="flex  gap-2">
                              <TimePicker
                                className='w-32'
                                views={['hours']}
                                label="من"
                                value={formData.openingHours.sat.from || time}
                                onChange={(time) => handleOpeningHoursChange(time, 'sat', 'from')}
                              />
                              <TimePicker
                                className='w-32'
                                views={['hours']}
                                label="إلى"
                                value={formData.openingHours.sat.to || time}
                                onChange={(time) => handleOpeningHoursChange(time, 'sat', 'to')}
                              />
                              <div className='flex gap-1 items-center'>
                                <input
                                  type="checkbox"
                                  checked={formData.openingHours.sat.isClosed}
                                  onChange={(e) => handleDayClosedChange(e.target.checked, 'sat')}
                                />
                                <span>مغلق السبت</span>
                              </div>
                            </div>
                          </LocalizationProvider>
                        </div>
                        {errors.openingHour && <Typography color="red">{errors.openingHour}</Typography>}
                      </div>
                      <div className='flex flex-col gap-2 '>
                        <Typography className="font-baloo text-right text-md font-bold">
                          المرفقات:
                        </Typography>
                        <div className='flex items-center gap-2'>
                          <label htmlFor="logo">اختر شعار المركز:</label>
                          <input
                            type="file"
                            id="logo"
                            accept="image/*"
                            onChange={handleLogoChange}
                          />
                          {errors.logoURL && (<Typography color="red">{errors.logoURL}</Typography>)}
                        </div>
                        <div className='flex items-center gap-2'>
                          <label htmlFor="image">اختر صورة المركز:</label>
                          <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          {errors.imageURL && (<Typography color="red">{errors.imageURL}</Typography>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogBody>
              <DialogFooter className="flex gap-3 justify-center font-baloo text-right">
                <Button
                  type="submit"
                  variant="gradient"
                  style={{ background: '#97B980', color: '#ffffff' }}
                  onClick={validate}
                >
                  <span>إضافة</span>
                </Button>
                <Button variant="outlined" onClick={handleCloseForm}>
                  <span>إلغاء</span>
                </Button>
              </DialogFooter>
            </form>
          </Dialog>
          <SummaryCenterMessage
            open={summeryCenterOpen}
            handler={handleSummeryCenter}
            formData={formData}
            addMethod={handleSubmit}
            handleEdit={handleSummeryCenterClose}
          />
        </div>
      </>
    );
    
} 
