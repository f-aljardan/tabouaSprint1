/** @type {import('tailwindcss').Config} */

import withMT from "@material-tailwind/react/utils/withMT";


 
export default withMT({

  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx,mdx}",
    "./**/@material-tailwind/**/*.{html,js,ts,jsx,tsx,mdx}",

  
  ],
  theme: {
    extend: {      
      
  },
  },
  plugins: [
   
  ],

});

