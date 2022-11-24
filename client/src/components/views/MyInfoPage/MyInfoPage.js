import React, {useEffect, useState} from "react";
import moment from "moment";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import Axios from 'axios';
import PasswordCheckModal from "./PasswordCheckModal"

import {
  Form,
  Input,
  Button,
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function MyInfoPage(props) {
  const [Users, setUsers] = useState([]);
  const dispatch = useDispatch();
  
  const param =  {email : localStorage.getItem('rememberMe') }
  useEffect(() => {
    Axios.post('/api/users/getUserInfo', param)
      .then(res => {
        if(!res.data.success) {
          console.log(res);
          return alert(res.data.message);
        }

        setUsers(res.data.user);
        console.log("setUser : ", res.data.user);
      })
  }, [])

  if (!Users.name) {
    return <p>Loading user Info...</p>
  }

  return (
    <Formik
      enableReinitialize = {true}
      initialValues={{
        email: Users.email,
        lastname: Users.lastname,
        name: Users.name,
        password: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required('Name is required'),
        lastname: Yup.string()
          .required('Last Name is required'),
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm Password is required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {

          let dataToSubmit = {
            email: values.email,
            password: values.password,
            name: values.name,
            lastname: values.lastname,
            currentPassword: values.currentPassword
          };
          console.log("dataToSubmit : ", values);

          /**
           * 
           */
          Axios.post('/api/users/updateUserInfo', dataToSubmit)
            .then(res => {
              if(!res.data.success) {
                return alert(res.data.message)
              }

              alert("Info changed successfully.")
              props.history.push("/");
            })

          setSubmitting(false);
        }, 500);
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset
        } = props;
        return (
          <div className="app">
            <h3>My Info</h3>
            <Form style={{ minWidth: '375px' }} {...formItemLayout} onSubmit={handleSubmit} >

              <Form.Item required label="Name">
                <Input
                  id="name"
                  placeholder="Enter your name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.name && touched.name ? 'text-input error' : 'text-input'
                  }
                />
                {errors.name && touched.name && (
                  <div className="input-feedback">{errors.name}</div>
                )}
              </Form.Item>

              <Form.Item required label="Last Name">
                <Input
                  id="lastname"
                  placeholder="Enter your Last Name"
                  type="text"
                  value={values.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.lastname && touched.lastname ? 'text-input error' : 'text-input'
                  }
                />
                {errors.lastname && touched.lastname && (
                  <div className="input-feedback">{errors.lastname}</div>
                )}
              </Form.Item>

              <Form.Item required label="Email" validateStatus={errors.email && touched.email ? "error" : 'success'}>
                <Input
                  id="email"
                  type="email" readOnly disabled
                  value={values.email}
                />
              </Form.Item>

              <Form.Item required label="Password" validateStatus={errors.password && touched.password ? "error" : 'success'}>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password ? 'text-input error' : 'text-input'
                  }
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Item>

              <Form.Item required label="Confirm">
                <Input
                  id="confirmPassword"
                  placeholder="Enter your confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="input-feedback">{errors.confirmPassword}</div>
                )}
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <PasswordCheckModal handleSubmit={handleSubmit} values={values}/>
                {/* <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                  Submit
                </Button> */}
              </Form.Item>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};


export default MyInfoPage
