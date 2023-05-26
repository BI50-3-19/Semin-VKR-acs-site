import { defineConfig } from "vite";

import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import checker from "vite-plugin-checker";
import paths from "vite-tsconfig-paths";

export default defineConfig({
    resolve: {
        alias: [{
            find: /^@vkontakte\/vkui$/, replacement: "@vkontakte/vkui/dist/cssm" 
        }],
    },
    plugins: [
        react(),
        basicSsl(),
        checker({
            typescript: true,
            overlay: false
        }),
        paths()
    ],
    build: {
        outDir: "./dist"
    },
    css: {
        modules: {
            localsConvention: "camelCase"
        }
    },
    server: {
        https: true,
        host: true
    }
});
