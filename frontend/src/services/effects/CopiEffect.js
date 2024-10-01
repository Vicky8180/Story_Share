import checkIcon from "../../assets/checkIcon.png";

const CopiedEffect = (element, top, left) => {
  if (element) {
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.display = "flex";
    container.style.justifyContent = "space-between";
    container.style.alignItems = "center";
    container.style.borderRadius = "20px";
    container.style.height = "47px";
    container.style.width = "257px";
    container.style.top = top;

    container.style.left = left;
    container.style.borderBottom = "3px solid rgba(96, 184, 75, 1)";
    container.style.backgroundColor = "white";

    const img = document.createElement("img");
    img.src = checkIcon;
    img.style.width = "20px";
    img.style.height = "20px";

    img.style.marginLeft = "20px";

    const copiedText = document.createElement("div");
    copiedText.innerText = "Link copied to Clipboard";
    copiedText.style.position = "absolute";
    copiedText.style.width = "200px";
    copiedText.style.height = "47px";
    copiedText.style.fontWeight = "bold";
    copiedText.style.top = "50%";
    copiedText.style.left = "50%";
    copiedText.style.transform = "translate(-50%, -50%)";
    copiedText.style.color = " rgba(255, 0, 0, 1)";
    copiedText.style.padding = "5px 10px";
    copiedText.style.borderRadius = "5px";
    copiedText.style.fontSize = "14px";
    copiedText.style.textAlign = "center";
    copiedText.style.lineHeight = "47px";

    copiedText.style.opacity = "0";
    copiedText.style.transition = "opacity 0.3s ease";

    container.appendChild(img);
    container.appendChild(copiedText);

    element.appendChild(container);

    setTimeout(() => {
      copiedText.style.opacity = "1";
    }, 100);

    setTimeout(() => {
      copiedText.style.opacity = "0";
      setTimeout(() => {
        element.removeChild(container);
      }, 100);
    }, 2000);
  }
};

export default CopiedEffect;
