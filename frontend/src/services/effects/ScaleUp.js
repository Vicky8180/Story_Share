const ScaleUp = (elementId) => {
  const element = document.getElementById(elementId);

  console.log(elementId);
  if (element) {
    const style = document.createElement("style");
    style.type = "text/css";

    style.innerHTML = `
        @keyframes scale-up {
          0% { transform: scale(1); }
          50% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .scale-up {
          animation: scale-up 0.5s ease-in-out;
        }
      `;

    document.head.appendChild(style);

    element.classList.add("scale-up");

    setTimeout(() => {
      element.classList.remove("scale-up");
      document.head.removeChild(style);
    }, 500);
  }
};

export default ScaleUp;
