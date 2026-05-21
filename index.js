(function () {
   const Messages = enmity.modules.getByProps("sendMessage", "receiveMessage");

   const WebpToPngProxy = {
      name: "WebpToPngProxy",
      version: "1.0.0",
      description: "Rewrites WebP URLs to PNG so they display natively on iOS 13.",
      authors: [{ name: "LocalDev", id: "000000000000000000" }],

      onStart() {
         enmity.patcher.before(Messages, "sendMessage", (args) => {
            const message = args[1];
            if (!message || !message.content) return;
            if (message.content.includes('.webp') || message.content.includes('format=webp')) {
               message.content = message.content.replace(/format=webp/g, 'format=png').replace(/\.webp/g, '.png');
            }
         });

         enmity.patcher.after(Messages, "receiveMessage", (args, res) => {
            if (!res || !res.attachments) return res;
            res.attachments.forEach((attachment) => {
               if (attachment.url && (attachment.url.includes('.webp') || attachment.url.includes('format=webp'))) {
                  attachment.url = attachment.url.replace(/format=webp/g, 'format=png').replace(/\.webp/g, '.png');
                  attachment.proxyUrl = attachment.proxyUrl.replace(/format=webp/g, 'format=png').replace(/\.webp/g, '.png');
               }
            });
            return res;
         });
      },

      onStop() {
         enmity.patcher.unpatchAll();
      }
   };

   enmity.plugins.registerPlugin(WebpToPngProxy);
})();
