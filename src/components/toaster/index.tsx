import { message } from "antd";
import React, { createContext, useContext } from "react";

type TToasterContext = {
  success: (content: string, { duration, onClose }?: IToastType) => void;
  error: (content: string, { duration, onClose }?: IToastType) => void;
};

type IToastType = {
  duration?: number;
  description?: string;
  onClose?: () => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  icon?: React.ReactNode;
  key?: string | number;
};

const ToasterContext = createContext<TToasterContext | undefined>(undefined);

const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [api, contextProvider] = message.useMessage();

  const success = (
    content: string,
    { duration = 3, onClose }: IToastType = {}
  ) => {
    api.success(content, duration, onClose);
  };

  const error = (
    content: string,
    { duration = 3, onClose }: IToastType = {}
  ) => {
    api.error(content, duration, onClose);
  };

  return (
    <ToasterContext.Provider
      value={{
        success,
        error,
      }}
    >
      {contextProvider}
      {children}
    </ToasterContext.Provider>
  );
};

export default ToasterProvider;

export const useToaster = () => {
  const context = useContext(ToasterContext);

  if (context === undefined) {
    throw new Error("useToaster must be within Toaster");
  }
  return context;
};
