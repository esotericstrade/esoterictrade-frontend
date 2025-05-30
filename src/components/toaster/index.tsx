import { App } from "antd";
import React from "react";

type IToastType = {
  duration?: number;
  description?: string;
  onClose?: () => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  icon?: React.ReactNode;
  key?: string | number;
};

const useToaster = () => {
  const { notification: api } = App.useApp();

  const success = (
    message: string,
    { duration = 3, onClose, description }: IToastType = {}
  ) => {
    api.success({
      message,
      description,
      duration,
      onClose,
    });
  };

  const error = (
    message: string,
    { duration = 3, onClose, description }: IToastType = {}
  ) => {
    api.error({
      message,
      description,
      duration,
      onClose,
    });
  };

  return {
    success,
    error,
  };
};

export default useToaster;
