/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#16A34A",
                secondary: "#EAB308",
                "card-light": "#FFFFFF",
            },
            borderRadius: {
                'ios': '20px',
            }
        },
    },
    plugins: [],
}
