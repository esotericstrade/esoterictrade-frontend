import { Button, Modal } from "antd";
import { useState } from "react";

const AddNewActorModal: React.FC<{
  children: ({
    open,
    setOpen,
  }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {children({ open, setOpen })}

      {open && (
        <Modal
          title="Add New Actor"
          open={open}
          onCancel={() => setOpen(false)}
          footer={
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="primary"
                onClick={() => {
                  // Handle form submission
                  setOpen(false);
                }}
              >
                Submit
              </Button>
              <Button
                type="default"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          }
          width={600}
        >
          <p>Form to add new actor</p>
        </Modal>
      )}
    </>
  );
};

export default AddNewActorModal;
