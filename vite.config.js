import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "booking/index": resolve(__dirname, "booking/index.html"),
        "gift-card/index": resolve(__dirname, "gift-card/index.html"),
        "hair/index": resolve(__dirname, "hair/index.html"),
        "head-spa/index": resolve(__dirname, "head-spa/index.html"),
        "hydrafacial/index": resolve(__dirname, "hydrafacial/index.html"),
        "services/index": resolve(__dirname, "services/index.html"),
        "store/index": resolve(__dirname, "store/index.html")
      }
    }
  }
});
