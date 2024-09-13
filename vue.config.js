const PrerenderSpaPlugin = require("prerender-spa-plugin");
const path = require("path");
const PuppeteerRenderer = PrerenderSpaPlugin.PuppeteerRenderer;

module.exports = {
  // css: {
  //     loaderOptions: {
  //         sass: {
  //             additionalData: `@import "@/assets/scss/main.scss";`
  //         }
  //     }
  // }
  transpileDependencies: ["vue-meta"],
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Đây nè | Chia sẻ phần mềm";
      return args;
    });
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV !== "production") return;
    return {
      plugins: [
        new PrerenderSpaPlugin(
          {
            // Absolute path to compiled SPA
            staticDir: path.join(__dirname, "dist"),
            // List of routes to prerender
            routes: [
              "/",
              "/home",
              "/game",
              "/office",
              "/graphic",
              "/technique",
              "/os",
              "/common",
              "/detail/download-office-2016-professional-plus-full",
              "/detail/download-office-2019-professional-plus-full",
              "/detail/download-adobe-acrobat-pro-dc-2021",
              "/detail/download-abbyy-fine-reader-14",
              "/detail/download-microsoft-office-2013",
              "/detail/download-visio-2019-professional-full",
              "/detail/download-visio-2016-professional-plus",
              "/detail/download-visio-2013-full",
              "/detail/foxit-pdf-editor-pro-11-2-full",
              "/detail/download-nitro-pro-12",
              "/detail/download-phan-mem-math-type-7-4-4",
              "/detail/download-game-forza-horizon-5",
              "/detail/kms-pico-11",
              "/detail/chicken-invaders-4",
              "/detail/photoshop-2021",
              "/detail/huong-dan-tat-windows-defender",
              "/detail/auto-cad-2020",
              "/detail/adobe-photoshop-cc-2019",
              "/detail/adobe-illustrator-2022-v26-0-0-73-x64",
              "/detail/lightroom-classic-2023-v12-1-0",
              "/detail/abbyy-fine-reader-15",
              "/detail/photoshop-2023-full",
              "/detail/fix-unlicensed-adobe",
              "/detail/nhung-tua-game-choi-2-nguoi",
            ],
            renderer: new PuppeteerRenderer({
              maxConcurrentRoutes: 2,
            }),
          }
          // SQL get list detail
          // select concat('"/detail/', post.code, '",')
          // from post
          // order by id asc
        ),
      ],
    };
  },
};
