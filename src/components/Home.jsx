
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import logo from '/tabouaNo.png';
import { TrashIcon } from '@heroicons/react/24/solid';
import { FaRecycle } from 'react-icons/fa';
import { AiOutlineHeatMap } from 'react-icons/ai';
import { TbMessageReport } from 'react-icons/tb';
import { MdManageAccounts } from 'react-icons/md';
import { Button } from '@material-tailwind/react';

export default function Home({ authorized, userData, setShowSidebar, setActiveItem }) {
  const navigate = useNavigate(); // to handle user navigation through diffrent pages

  // to route user to diffrent page
  useEffect(() => setShowSidebar(false), []);

  const handleClick = (item) => {
    setShowSidebar(true);
    navigate(item);
    setActiveItem(item);
  };

  // to show home page icon
  return (
    <>
      <ProfileMenu userData={userData} />

      <div className="flex justify-around items-center">
        <div className="control-panel flex gap-10 flex-col justify-center items-center min-h-screen">
          {/* Common CSS class for button style */}
          <style>
            {`
              .custom-button {
                background: #07512D;
                color: #ffffff;
                font-size: 14px;
                padding: 17px 30px;
                border-radius: 50px;
                text-align: right;
              }
              .custom-button:hover {
                background:#97B980;
              }
            `}
          </style>

          <Button
            className="flex items-center justify-start gap-2 rounded-full custom-button"
            size="sm"
            fullWidth={true}
            variant="gradient"
            onClick={() => handleClick('garbage')}
          >
            <TrashIcon className="w-5 h-5" />
            <span>   إدارة حاويات النفايات</span>
          </Button>

          <Button
            className="flex items-center justify-start gap-2 rounded-full custom-button"
            size="sm"
            fullWidth={true}
            variant="gradient"
            onClick={() => handleClick('recycle')}
          >
            <FaRecycle className="w-5 h-5" />
            <span>  إدارة مراكز إعادة التدوير</span>
          </Button>

          <Button
            className="flex items-center justify-start gap-2 rounded-full custom-button"
            size="sm"
            fullWidth={true}
            variant="gradient"
            onClick={() => handleClick('complaints')}
          >
            <TbMessageReport className="w-5 h-5" />
            <span>إدارة البلاغات</span>
          </Button>

          <Button
            className="flex items-center justify-start gap-2 rounded-full custom-button"
            size="sm"
            fullWidth={true}
            variant="gradient"
            onClick={() => handleClick('heatmap')}
          >
            <AiOutlineHeatMap className="w-5 h-5" />
            <span> الخريطة الحرارية</span>
          </Button>

          {authorized && (
            <Button
              className="flex items-center justify-start gap-2 rounded-full custom-button"
              size="sm"
              fullWidth={true}
              variant="gradient"
              onClick={() => handleClick('manage')}
            >
              <MdManageAccounts className="w-5 h-5" />
             <span> إدارة صلاحيات الموظفين</span>
            </Button>
          )}
        </div>

        <div className="vertical-line" style={{ width: '1px', background: '#333', height: '500px', margin: '0 20px' }}></div>

        <div className="flex justify-center items-center min-h-screen">
          <div style={{ textAlign: 'center' }}>
            <img src={logo} className="h-60 w-60" style={{ marginRight: '25%' }} />
            <div style={{ color: '#333', fontSize: '25px', marginTop: '10%' }}>
              (وَكَذَٰلِكَ مَكَّنَّا لِيُوسُفَ فِى ٱلْأَرْضِ يَتَبَوَّأُ مِنْهَا حَيْثُ يَشَآءُ ۚ<br /> نُصِيبُ بِرَحْمَتِنَا مَن نَّشَآءُ ۖ وَلَا نُضِيعُ أَجْرَ ٱلْمُحْسِنِينَ)<br />(يوسف - 56)
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
