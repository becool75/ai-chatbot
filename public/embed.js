(function () {
  // Get the script's source to determine the chatbot URL
  var scripts = document.getElementsByTagName("script");
  var currentScript = scripts[scripts.length - 1];
  var botUrl = currentScript.src.replace("/embed.js", "");

  // Create iframe
  var iframe = document.createElement("iframe");
  iframe.src = botUrl + "/widget";
  iframe.style.cssText =
    "position:fixed;bottom:0;right:0;width:420px;height:600px;border:none;z-index:99999;background:transparent;pointer-events:none;";
  iframe.id = "ai-chatbot-frame";
  iframe.allow = "clipboard-write";

  document.body.appendChild(iframe);

  // Listen for messages from iframe to toggle pointer events
  window.addEventListener("message", function (e) {
    if (e.data === "chatbot-open") {
      iframe.style.pointerEvents = "auto";
    } else if (e.data === "chatbot-close") {
      iframe.style.pointerEvents = "none";
      iframe.style.width = "80px";
      iframe.style.height = "80px";
    } else if (e.data === "chatbot-ready") {
      iframe.style.width = "80px";
      iframe.style.height = "80px";
      iframe.style.pointerEvents = "auto";
    }
  });
})();
