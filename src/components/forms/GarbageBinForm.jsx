import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
export default function GarbageBinForm({ open, handler, method, message }) {
    const animatedComponents = makeAnimated();
  
    const options = [
      { value: 'كبير', label: 'كبير' },
      { value: 'صغير', label: 'صغير' },
    ];
  
    const [formData, setFormData] = useState({
      size: '',
      date: '',
    });
  
    const [showValidationMessage, setShowValidationMessage] = useState(false);
  
    const handleChange = (selectedOption) => {
      if (selectedOption) {
        const selectedValue = selectedOption.value;
        setFormData({
          ...formData,
          size: selectedValue,
        });
        setShowValidationMessage(false); // Hide the validation message when a selection is made
      } else {
        setFormData({
          ...formData,
          size: '', // Reset the size field
        });
        setShowValidationMessage(true); // Show the validation message when no selection is made
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Check if a size is selected
      if (formData.size) {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();
        const updatedFormData = {
          ...formData,
          date: formattedDate, // Store the formatted date
        };
        method(updatedFormData);
        setFormData({
          size: '',
          date: '', // Reset the date field
        });
        setShowValidationMessage(false); // Hide the validation message after successful submission
      } else {
        setShowValidationMessage(true); // Show the validation message if no size is selected
      }
    };

    function validate(){
        if(!formData.size){
        setShowValidationMessage(true);
        }else{
            handler();
        }
    }
  
    return (
      <Dialog open={open} handler={handler}>
        <form onSubmit={handleSubmit}>
          <DialogHeader className="flex justify-center font-baloo text-right">
            أضف حاوية نفايات جديدة
          </DialogHeader>
  
          <DialogBody divider className="font-baloo text-right">
            <div className="grid gap-6">
              <Typography className="font-baloo text-right">
                أختر نوع الحاوية :
              </Typography>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={options}
                value={options.find((option) => option.value === formData.size)}
                onChange={handleChange}
                required
              />
  
              {showValidationMessage && (
                <div>
                  <p className="text-red-500 font-bold">
                    يرجى اختيار حجم الحاوية
                  </p>
                </div>
              )}
            </div>
          </DialogBody>
  
          <DialogFooter className="flex gap-3 justify-center font-baloo text-right">
            <Button variant="outlined" onClick={handler}>
              <span>إلغاء</span>
            </Button>
            <Button
              type="submit"
              variant="gradient"
              style={{ background: '#97B980', color: '#ffffff' }}
              onClick={validate}
             // Disable the "Add" button when no size is selected
            >
              <span>إضافة</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    );
  }
  