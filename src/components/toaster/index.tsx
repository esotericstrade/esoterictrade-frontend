import { CircleWavyCheck, XCircle } from "@phosphor-icons/react";
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
      icon: (
        <CircleWavyCheck className="text-emerald-600" size={20} weight="fill" />
      ),

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
      icon: <XCircle className="text-rose-600" size={20} weight="fill" />,
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
