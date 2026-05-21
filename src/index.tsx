import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { Messages } from "enmity/metro/common";
import { Filters } from "enmity/metro";

const WebpToPngProxy: Plugin = {
   name: "WebpToPngProxy",
   version: "1.0.0",
   description: "Rewrites WebP URLs to PNG so they display natively on iOS 13.",
   authors: [{ name: "LocalDev", id: "000000000000000000" }],

   onStart() {
      // Intercept message processing right before rendering
      this.patcher.before(Messages, "sendMessage", (args) => {
         const message = args[1];
         if (!message || !message.content) return;

         // Convert typed text links
         if (message.content.includes('.webp') || message.content.includes('format=webp')) {
            message.content = message.content
               .replace(/format=webp/g, 'format=png')
               .replace(/\.webp/g, '.png');
         }
      });

      // Patch incoming background network packets 
      this.patcher.after(Messages, "receiveMessage", (args, res) => {
         if (!res || !res.attachments) return res;

         // Convert uploaded image attachments globally
         res.attachments.forEach((attachment: any) => {
            if (attachment.url && (attachment.url.includes('.webp') || attachment.url.includes('format=webp'))) {
               attachment.url = attachment.url.replace(/format=webp/g, 'format=png').replace(/\.webp/g, '.png');
               attachment.proxyUrl = attachment.proxyUrl.replace(/format=webp/g, 'format=png').replace(/\.webp/g, '.png');
            }
         });
         return res;
      });
   },

   onStop() {
      this.patcher.unpatchAll();
   }
};

registerPlugin(WebpToPngProxy);
