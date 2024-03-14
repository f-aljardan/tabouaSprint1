/** @type {import('tailwindcss').Config} */

import withMT from "@material-tailwind/react/utils/withMT";
import flowbitePlugin from 'flowbite/plugin';


 
export default withMT({

  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx,mdx}",
    "./**/@material-tailwind/**/*.{html,js,ts,jsx,tsx,mdx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  
  ],
  theme: {
    extend: {      
      
  },
  },
  plugins: [
    flowbitePlugin,
  ],

});

