import { Spinner } from "@phosphor-icons/react";
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
    requiredMark: (labelNode, { required }) => (
      <>
        {labelNode}
        {required && <span className="text-rose-600 ms-0.5">*</span>}
      </>
    ),

    colon: false,
    className: "tradeco-form",
  },
  menu: {
    className: "tradeco-menu",
  },
  message: {
    className: "tradeco-message",
  },
  notification: {
    className: "tradeco-notification",
  },

  table: {
    className: "tradeco-table",
  },
  modal: {
    className: "tradeco-modal",
  },
  spin: {
    indicator: <Spinner className="animate-spin" />,
  },
};
