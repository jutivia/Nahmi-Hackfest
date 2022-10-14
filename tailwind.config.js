/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            width: {
                "screen-width": "1440px",
            },
        },
        fontFamily: {
            body: ["Poppins"],
        },
        colors: {
            white: "#fff",
            black: "#000",
            nickel: "#697278",
            silverFoil: "#ABB0B3",
            gunMetal: "#222F38",
            greenBlue: "#0E67AB",
            cerulean: "#00A3DE",
            richBlack: "#02062B",
            cobalt: "#2C338A",
            purple: "#68299A",
            violet: "#902784",
            deepCerise: "#DC398C",
        },
        screens: {
            sm: "640px",
            // => @media (min-width: 640px) { ... }

            md: "768px",
            // => @media (min-width: 768px) { ... }

            lg: "1024px",
            // => @media (min-width: 1024px) { ... }

            xl: "1280px",
            // => @media (min-width: 1280px) { ... }

            "2xl": "1536px",
            // => @media (min-width: 1536px) { ... }
        },
    },
    plugins: [require("tailwind-scrollbar-hide")],
};
