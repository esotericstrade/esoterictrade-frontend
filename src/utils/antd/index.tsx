import { ConfigProviderProps } from "antd";
import "./style.scss";

export const antdConfig: ConfigProviderProps = {
  theme: {
    token: {
      colorPrimary: "#604dd7",
    },
  },
  layout: {
    style: {
      height: "100vh",
    },
  },
  button: {
    className: "tradeco-button",
  },
  input: {
    classNames: {
      input: "tradeco-input",
      wrapper: "tradeco-input-wrapper",
    },
  },
  form: {
    requiredMark: false,
    colon: false,
    className: "tradeco-form",
  },
  menu: {
    className: "tradeco-menu",
  },
  message: {
    className: "tradeco-message",
  },
  table: {
    className: "tradeco-table",
  },
};
