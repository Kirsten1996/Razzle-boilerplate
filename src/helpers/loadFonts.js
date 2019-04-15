import axios from "axios";

export default url => {
  axios.get(url).then(function(response) {
    // handle success
    let css = response.data;
    css = css.replace(/}/g, "font-display: swap; }");

    const head = document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  });
};
