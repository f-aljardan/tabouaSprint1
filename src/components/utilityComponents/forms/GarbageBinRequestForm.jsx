import { useState } from 'react';
import { Button, Dialog,Textarea, DialogHeader, DialogBody, DialogFooter,Typography} from "@material-tailwind/react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import SummaryHandleRequest from "../messages/SummaryHandleRequest"

export default function GarbageBinForm({ open, handler, AddMethod , Acceptmethod , requestProcessedData}) {
    const animatedComponents = makeAnimated();
    const [message, setMessage] = useState(""); // State to store the message
    const [summeryRequestOpen, setSummeryRequestOpen] = useState(false);// State to manage the visibility of the summary center information
 

  const handleSummeryRequest = () =>setSummeryRequestOpen(!summeryRequestOpen); 
  const handleSummeryRequestClose = () =>{ handler(); setSummeryRequestOpen(false); }


    const options = [
      { value: 'حاوية كبيرة', label: 'حاوية كبيرة' },
      { value: 'حاوية صغيرة', label: 'حاوية صغيرة' },
    ];
  
    // Form state
    const [formData, setFormData] = useState({
      size: '',
    });
  
     // Validation state
    const [showValidationMessage, setShowValidationMessage] = useState(false);
  
    // Handle selecting an option in the dropdown
    const handleChange = (selectedOption) => {
      if (selectedOption) {
        const selectedValue = selectedOption.value;
        setFormData({
          ...formData,
          size: selectedValue,
        });
        setShowValidationMessage(false); // Hide the validation message when a selection is made
      } else {
        // Reset the size field
        setFormData({
          ...formData,
          size: '', 
        });
        setShowValidationMessage(true); // Show the validation message when no selection is made
      }
    };
  

    // Handle form submission
    const handleSubmit = () => {
    
        AddMethod(formData);
        Acceptmethod(message);

        // Reset the size field
        setFormData({
          size: '', 
        });
        setMessage(""); 
        setShowValidationMessage(false); // Hide the validation message after successful submission
    };


    function validate(){
        if(!formData.size){
        setShowValidationMessage(true);
        }
        else{
            // handler();
            handleSummeryRequest();
        }
    }
  

    const formInfo = {
        size: formData.size,
        message: message,
    }
    return (

        <>
      <Dialog open={open} handler={handler}>
        
          <DialogHeader className="flex justify-center font-baloo text-right">
            أضف حاوية النفاية المطلوبة
          </DialogHeader>
  
          <DialogBody divider className="font-baloo text-right">
            <div className="grid gap-6">

            <div> 
            <div className='flex gap-2'> <Typography className="font-baloo text-right text-md font-bold ">حجم الحاوية المطلوب :</Typography>{requestProcessedData.Request.garbageSize}</div>
              <Select
               placeholder=" أختر نوع الحاوية ..."
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

            </div>
           
            <Typography className="font-baloo text-right text-md font-bold mt-5">
            <span>  إضافة تعليق: </span>
           </Typography>
            

           <Textarea
              label="قم بأضافة تعليق في حال الحاجة أو قم بالتخطي ..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value.slice(0, 100));
              }}
              maxLength={100}
            />
           <div className="text-right">
            <span>
              عدد الأحرف المتبقية: {100 - message.length}
            </span>
          </div>

          </DialogBody>
  
          <DialogFooter className="flex gap-3 justify-center font-baloo text-right">
          <Button
              variant="gradient"
              style={{ background: '#97B980', color: '#ffffff' }}
              onClick={validate}
            >
              <span>إضافة</span>
            </Button>

            <Button
             variant="outlined" 
             onClick={()=>{ 
                 setFormData({
                 size: '', 
                }); 
                setMessage(""); 
                handler();}}>
              <span>إلغاء</span>
            </Button>
          
          </DialogFooter>
   
      </Dialog>

      <SummaryHandleRequest open={summeryRequestOpen} handler={handleSummeryRequest} requestProcessedData={requestProcessedData} method={handleSubmit} formInfo={formInfo} status="قبول"  handleEdit={handleSummeryRequestClose}/>
    </>
    );
  }
  