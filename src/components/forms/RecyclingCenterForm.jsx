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


export default function RecyclingCenterForm({ open, handler, method }) {

    const animatedComponents = makeAnimated();

    const options = [
        { value: 'بلاستيك', label: 'بلاستيك' },
        { value: 'ورق', label: 'ورق' },
        { value: 'كرتون', label: 'كرتون' },
        { value: 'إلكترونيات', label: 'إلكترونيات' },
      ]
      
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    types: [],
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the callback function to add the recycling center
    method(formData);
    // Clear the form fields after submission
    setFormData({
      name: '',
      description: '',
      types: [],
    });
  };

  return (
    <Dialog open={open} handler={handler}>
    <form onSubmit={handleSubmit}>
       
       <DialogHeader className="flex justify-center font-baloo text-right">أضف مركز إعادة تدوير جديد</DialogHeader>
    
       <DialogBody divider className="font-baloo text-right">
          <div className="grid gap-6">

        <Input label="إسم المركز" type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required/>

 <Typography className='font-baloo text-right'> :النفايات المستقبلة</Typography>
 <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      options={options}
      value={options.filter((option) => formData.types.includes(option.value))}
      onChange={handleTypeChange}
    />

<Textarea label="وصف المركز"  
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required/>

          </div>
        </DialogBody>
     
      

      <DialogFooter className="flex gap-3 justify-center font-baloo text-right">
          <Button variant="outlined"  onClick={handler}>
            <span>إلغاء</span>
          </Button>
          <Button type="submit" variant="gradient"  style={{background:"#97B980", color:'#ffffff'}} onClick={handler}>
            <span>إضافة</span>
          </Button>
        </DialogFooter>

    </form>
    </Dialog>
  );
}


 
