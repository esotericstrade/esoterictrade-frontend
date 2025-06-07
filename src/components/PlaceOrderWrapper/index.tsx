import { actorService } from "@/utils/api/actor/service";
import {
  EXCHANGE_TYPE,
  PRODUCT_TYPE,
  TRADE_TYPE,
} from "@/utils/api/webhook/constant";
import { webhookService } from "@/utils/api/webhook/service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { App, Button, Form, Modal, Select, Tag } from "antd";
import { useForm } from "antd/es/form/Form";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import useToaster from "../toaster";

type PlaceOrderWrapperProps = {
  children: ({
    open,
    setOpen,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
  }) => React.ReactNode;
};

type TFormValues = BaseWebhookPayload;

const PAGE_LIMIT = 500;

const PlaceOrderWrapper = ({ children }: PlaceOrderWrapperProps) => {
  const [open, setOpen] = useState(false);
  const [form] = useForm<TFormValues>();
  const toast = useToaster();

  const { modal } = App.useApp();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const initialValues = {
    type: TRADE_TYPE.LE,
    symbol: "",
    exchange: EXCHANGE_TYPE.NFO,
    product: PRODUCT_TYPE.NRML,
  };

  const onClickPlaceOrder = () => {
    form.validateFields().then(() => {
      modal.confirm({
        title: "Confirm Order",
        content: "Are you sure you want to place this order?",
        onOk: form.submit,
      });
    });
  };

  const {
    data: { data: actors },
    isFetching,
  } = useQuery({
    queryKey: ["actors"],
    queryFn: () =>
      actorService.getAllActors({
        page: 1,
        limit: PAGE_LIMIT,
      }),
    enabled: open,
    initialData: {
      pagination: {
        pages: 0,
        total: 0,
        page: 1,
        limit: PAGE_LIMIT,
      },
      data: [],
    },
  });

  const triggerEmaSmaSlopeMutation = useMutation({
    mutationFn: (data: TFormValues) =>
      webhookService.triggerEmaSmaSlope({
        exchange: data.exchange,
        symbol: data.symbol,
        product: data.product,
        type: data.type,
      }),
    onSuccess: () => {
      toast.success("Order placed successfully!");
      setOpen(false);
    },
    onError: (error: AxiosError) => {
      const description =
        (error?.response?.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? (error.response.data as { message?: string }).message
          : undefined) ||
        error?.message ||
        "An unknown error occurred";
      toast.error(`Failed to place order`, { description });
    },
  });

  return (
    <>
      {children({
        open,
        setOpen,
      })}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={onClickPlaceOrder}>
              Place Order
            </Button>
          </div>
        }
        width={550}
        title="Place Order"
        destroyOnClose
      >
        <Form
          initialValues={initialValues}
          form={form}
          onFinish={triggerEmaSmaSlopeMutation.mutate}
          layout="vertical"
          className="grid"
        >
          <Form.Item label="Type" name="type">
            <Select>
              {Object.values(TRADE_TYPE).map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Instrument Name"
            name="symbol"
            rules={[
              { required: true, message: "Please input instrument name!" },
            ]}
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.["data-search"] ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              loading={isFetching}
              placeholder="Search instrument from actors"
              options={actors.map((actor) => ({
                label: (
                  <div className="flex items-center gap-2 justify-between">
                    <span>{actor.instrument_name}</span>
                    <span className="flex items-center gap-1">
                      <Tag color="red" className="!text-xs !px-1 !me-0">
                        {actor.parameters.stoploss}
                      </Tag>
                      <Tag color="green" className="!text-xs !px-1 !me-0">
                        {actor.parameters.target}
                      </Tag>
                    </span>
                  </div>
                ),
                value: actor.instrument_name,
                "data-search": actor.instrument_name + "_" + actor.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Exchange" name="exchange">
            <Select>
              {Object.values(EXCHANGE_TYPE).map((exchange) => (
                <Select.Option key={exchange} value={exchange}>
                  {exchange}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Product" name="product">
            <Select>
              {Object.values(PRODUCT_TYPE).map((product) => (
                <Select.Option key={product} value={product}>
                  {product}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PlaceOrderWrapper;
