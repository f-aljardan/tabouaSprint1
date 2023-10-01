
import { 
    MdAccountCircle
 } from 'react-icons/md';

function Account(){
    return(
<nav className="accountContainer">
    <div className='accountContaineritem1'><div>احمد محمد</div><div>مدير</div></div>
    <div className='accountContaineritem2'><MdAccountCircle className="h-8 w-8" /></div>
</nav> )
}

export default Account;