import React, {useEffect, useState} from "react";
import Axios from 'axios';
import {
  Form,
  Input,
  Button,
  Modal
} from 'antd';

function PasswordCheckModal(props) {
  const [Password, setPassword] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [form] = Form.useForm();
  const currentPassword = Form.useWatch('password', form);
  
  const showModal = () => {
    setOpen(true);
  };
  
  const handleOk = () => {
    if (!currentPassword) {
      alert("Password can't be empty.");
      return false;
    }

    props.values.currentPassword = currentPassword;
    props.handleSubmit(props.values);

    setConfirmLoading(true);
    setModalText('The modal will be closed after two seconds');
    
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };  

  
  
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal with async logic
      </Button>
      <Modal
        title="Write your current password."
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} method='post'>
          <Form.Item name="password"  label="Password" 
            rules={[{required : true, message: 'Please input your current password!'}]}>
            <Input type="password" />
          </Form.Item>
          {/* <Input type="password" name='password' onChange={(password) => setPassword({password})}/> */}
        </Form>
      </Modal>
    </>
  );
};


export default PasswordCheckModal
