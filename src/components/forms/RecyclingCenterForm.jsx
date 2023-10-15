import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

export default function RecyclingCenterForm({ open, handler, method }) { 
    const animatedComponents = makeAnimated();
  
    const options = [
      { value: 'بلاستيك', label: 'بلاستيك' },
      { value: 'ورق', label: 'ورق' },
      { value: 'كرتون', label: 'كرتون' },
      { value: 'إلكترونيات', label: 'إلكترونيات' },
    ];


  

    const [time, setTime] = useState(dayjs('2022-04-17T00:00'));
  
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      types: [],
      imageURL: '',
      openingHours: {
        fri: { from: '', to: '', isClosed: false },
        weekdays: { from: '', to: '' },
        sat: { from: '', to: '', isClosed: false },
      },
      phoneNo: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleTypeChange = (selectedOptions) => {
      const selectedTypes = selectedOptions.map((option) => option.value);
      setFormData({
        ...formData,
        types: selectedTypes,
      });
    };
  
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
    };

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
      


    
    
   
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Call the callback function to add the recycling center
  
      method(formData);
      // Clear the form fields after submission
      setFormData({
        name: '',
        description: '',
        types: [],
        imageURL: '',
        openingHours: {
            fri: { from: '', to: '', isClosed: false },
            weekdays: { from: '', to: '' },
            sat: { from: '', to: '', isClosed: false },
        },
        phoneNo: '',
      });
    };

  return (
    <>
    <Dialog size="xl" open={open} handler={handler}>
      <form onSubmit={handleSubmit}>
        <DialogHeader className="flex justify-center font-baloo text-right">
          أضف مركز إعادة تدوير جديد
        </DialogHeader>

        <DialogBody divider className="font-baloo text-right">
          <div className="grid gap-1 text-gray-900">
            <Input
              label="إسم المركز"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Typography className="font-baloo text-right text-lg "> أنواع النفايات المستقبلة:</Typography>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={options}
              value={options.filter((option) => formData.types.includes(option.value))}
              onChange={handleTypeChange}
              required
            />
            
<div className='flex items-center gap-5'>
<div className="  w-3/6">
            <Textarea
              label="وصف المركز"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className='mt-2'
            />
            </div>
<div className='flex flex-col gap-4 w-3/6'>
            <Input
              label="رابط صورة المركز"
              type="url"
              id="imageURL"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleChange}
              required
            />

            
<Input
              label="رقم التواصل"
              type="tel"
              id="phoneNo"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              required
            />
 </div>
</div>
            <Typography className="font-baloo text-right  text-lg">ساعات العمل خلال:</Typography>
            

<div className="flex gap-5 justify-center">


    <div className="flex flex-col gap-2">
    <span>أيام الأسبوع:</span>
    <div className="flex  gap-2">
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <TimePicker
    views={['hours']}
      label="من"
      value={formData.openingHours.weekdays.from || time}
      onChange={(time) => handleOpeningHoursChange(time, 'weekdays', 'from')}
    />
    <TimePicker
    views={['hours']}
      label="إلى"
      value={formData.openingHours.weekdays.to || time}
      onChange={(time) => handleOpeningHoursChange(time, 'weekdays', 'to')}
    />
  </LocalizationProvider>
  </div>
    </div>





      <div className="flex gap-5">
      <span>الجمعة:</span>
        <div className="flex flex-col gap-2">
        
  <LocalizationProvider dateAdapter={AdapterDayjs}>
       
          <div className='flex gap-2 justify-center'>
            <input
              type="checkbox"
              checked={formData.openingHours.fri.isClosed}
              onChange={(e) => handleDayClosedChange(e.target.checked, 'fri')}
            />
            <span>مغلق الجمعة</span>
          </div>
      
          <div className="flex  gap-2">
            <TimePicker
            views={['hours']}
              label="من"
              value={formData.openingHours.fri.from || time}
              onChange={(time) => handleOpeningHoursChange(time, 'fri', 'from')}
            />
            <TimePicker
            views={['hours']}
              label="إلى"
              value={formData.openingHours.fri.to || time}
              onChange={(time) => handleOpeningHoursChange(time, 'fri', 'to')}
            />
           </div>
  
       
          </LocalizationProvider>
      </div>
   </div>



   <div className="flex  gap-5">
    <span>السبت:</span>
     <div className="flex flex-col gap-2">
  
  <LocalizationProvider dateAdapter={AdapterDayjs}>
  <div className='flex gap-2 justify-center'>
            <input
              type="checkbox"
              checked={formData.openingHours.sat.isClosed}
              onChange={(e) => handleDayClosedChange(e.target.checked, 'sat')}
            />
            <span>مغلق السبت</span>
       </div>
       

      <div className="flex  gap-2">
            <TimePicker
            views={['hours']}
              label="من"
              value={formData.openingHours.sat.from || time}
              onChange={(time) => handleOpeningHoursChange(time, 'sat', 'from')}
            />
            <TimePicker
            views={['hours']}
              label="إلى"
              value={formData.openingHours.sat.to || time}
              onChange={(time) => handleOpeningHoursChange(time, 'sat', 'to')}
            />
         </div>
           
          </LocalizationProvider>
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
            onClick={handler}
          >
            <span>إضافة</span>
          </Button>
          <Button variant="outlined" onClick={handler}>
            <span>إلغاء</span>
          </Button>
          
        </DialogFooter>
      </form>
    </Dialog>



    </>
  ); 
} 
