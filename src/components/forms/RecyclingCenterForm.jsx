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

    const [errors, setErrors] = useState({
      name: '',
      description: '',
     // openingHour: '',
      imageURL: '',
      phoneNo: '',
      types: '',
    });
  
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
      
      const validate = (e) => {

        e.preventDefault();
        const newErrors = {};
      
        if (!formData.name.trim()) {
          newErrors.name = 'يجب إدخال اسم المركز';
        }
      
        if (!formData.description.trim()) {
          newErrors.description = 'يجب إدخال وصف المركز';
        }
      

        /*
        if ( 
        
        formData.openingHours.weekdays.length == 0
         ) 
         
         {
          newErrors.openingHour = 'يجب إدخال ساعات العمل';
        }
      
        */
        if (!formData.imageURL.trim()) {
          newErrors.imageURL = 'يجب إدخال رابط صورة المركز';
        }
      
        if (!formData.phoneNo.trim()) {
          newErrors.phoneNo = 'يجب إدخال رقم التواصل';
        }
        else if (!/^\d+$/.test(formData.phoneNo)) {
          newErrors.phoneNo = 'رقم التواصل يجب أن يحتوي على أرقام فقط';
        }

        if (formData.types.length == 0) {
          newErrors.types = 'يجب تحديد نوع واحد على الأقل';
        }
      
        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some((error) => error);
      
        if (hasErrors) {
          setErrors(newErrors);
        } else {
          // No errors, you can handle the submission here
          console.log("Form data is valid:", formData);
          //handler(); // Close the dialog or perform any other desired action
          // handleSummeryStaff();
        }
      };
      
    
   
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
        method(formData);
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

     const handleCloseForm = () => {

      handler();
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

      setErrors({
        name: '',
        description: '',
        openingHour: '',
        imageURL: '',
        phoneNo: '',
        types: '',


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
{errors.name && <Typography color="red">{errors.name}</Typography>}
            

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
                  {errors.types && <Typography color="red">{errors.types}</Typography>}

            
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
{errors.description && <Typography color="red">{errors.description}</Typography>}

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
            {errors.imageURL && <Typography color="red">{errors.imageURL}</Typography>}

            
<Input
              label="رقم التواصل"
              type="tel"
              id="phoneNo"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              required
            />
                        {errors.phoneNo && <Typography color="red">{errors.phoneNo}</Typography>}

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
  {/*
  
    {errors.openingHour && <Typography color="red">{errors.openingHour}</Typography>}

  */}

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




    </>

  ); 
} 
