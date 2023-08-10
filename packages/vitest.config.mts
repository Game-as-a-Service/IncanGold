import { configDefaults,defineConfig } from "vitest/dist/config";

export default defineConfig({
    test: {
        globals:true,
        testTimeout:100000,
    }
})