/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      spacing: {
        'top-80': '248px',
        'top-md': '248px'
      },
      scale: {
        "30": ".30"
      },
      transformOrigin: {
        '50-250': '50% -250%', // Adjusted value for md breakpoint
        '50-150': '50% -150%',
      },
      fontFamily: {
        custom: ['FarmFont', 'sans-serif'],
      },
      fontSize: {
        '3xs': ['.625rem', '.625rem']
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
],
};
