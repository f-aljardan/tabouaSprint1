import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Chip ,
  } from "@material-tailwind/react";


export default function ViewCenterInfo({open, handler , Deletemethod, center}){


const types = center.type || [];
const typeList = types.map((type, index) => (
 
      <Chip  key={index} style={{background:"#FE9B00", color:'#ffffff'}} value={type} />  
  // <li key={index}>{type}</li>
));
    return(
        <Dialog size="md" open={open} handler={handler} >
                    
        <DialogHeader className="flex justify-center font-baloo text-center"> {center.name}</DialogHeader>
       
        <DialogBody divider className="font-baloo text-right">
        {center.description}
     <br/>
     <br/>
        <div className="flex gap-2 justify-end">
        {typeList}
        </div>
        </DialogBody>

        <DialogFooter  className="flex gap-3 justify-center ">

        <Button variant="outlined"  onClick={handler}>
            <span>إغلاق</span>
          </Button>

          <Button variant="gradient"  style={{background:"#FE5500", color:'#ffffff'}}  onClick={Deletemethod}>
            <span>حذف</span>
          </Button>
        </DialogFooter>
      </Dialog>

    )
}