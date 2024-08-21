import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import axios from 'axios';

const NormalForm = ({ onRegSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    nickname: '',
    tw_id: '',
    account: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    doubleCheck: ''
  });

  //正規表達驗證
  const validateForm = () => {
    let errors = [];

    if (!/^[a-zA-Z0-9]{8,12}$/.test(formData.account)) {
      errors.push('帳號需要 8-12 個英數字');
    }

    if (!/^[a-zA-Z0-9!@#$%^&*()]{8,12}$/.test(formData.password)) {
      errors.push('密碼需要 8-12 個字符');
    }

    if (formData.password !== formData.doubleCheck) {
      errors.push('密碼和確認密碼不相同');
    }

    if (!/^[\u4e00-\u9fa5]+$/.test(formData.first_name)) {
      errors.push('名字只能填寫中文');
    }

    if (!/^[\u4e00-\u9fa5]+$/.test(formData.last_name)) {
      errors.push('姓氏只能填寫中文');
    }

    if (!/^[\u4e00-\u9fa5]{1,8}$/.test(formData.nickname)) {
      errors.push('暱稱需要 1-8 個中文字');
    }

    if (!/^[A-Z](1|2)\d{8}$/.test(formData.tw_id)) {
      errors.push('請輸入有效的台灣身分證字號');
    }

    if (!/^09\d{8}$/.test(formData.phone)) {
      errors.push('請輸入有效的手機號碼');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('請輸入有效的電子信箱地址');
    }

    if (!formData.address) {
      errors.push('地址為必填項目');
    }

    return errors;
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const doChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const doSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (formData.password !== formData.doubleCheck) {
      setErrorMessage('密碼不相同');
      return;
    }

    const errors = validateForm();
    if (errors.length > 0) {
      setErrorMessage(errors.join(', '));
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post('http://localhost:3200/login/register/member', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 5000,
      });
      // console.log('註冊成功:', response.data);
      if (response.data.success) {
        onRegSuccess();
      } else {
        setErrorMessage(response.data.error || '註冊失敗，請稍後再試');
      }
    } catch (error) {
      console.error('註冊失敗:', error);
      let errorMsg = '發生錯誤，請稍後再試';
      if (error.response) {
        console.error('錯誤狀態:', error.response.status);
        console.error('錯誤數據:', error.response.data);
        errorMsg = `註冊失敗: ${error.response.data.message || '伺服器錯誤'} (狀態: ${error.response.status})`;
      } else if (error.request) {
        console.error('未收到回應:', error.request);
        errorMsg = '無法連接到伺服器，請檢查您的網絡連接';
      } else {
        console.error('錯誤:', error.message);
        errorMsg = `發生錯誤: ${error.message}`;
      }
      setErrorMessage(errorMsg); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={doSubmit}>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end" >
          會員姓名
        </Form.Label>
        <Col sm="3">
          <Form.Control type="text" placeholder="姓氏" name="last_name" value={formData.last_name} onChange={doChange} />
        </Col>
        <Col sm="5">
          <Form.Control type="text" placeholder="名字" name="first_name" value={formData.first_name} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          會員暱稱
        </Form.Label>
        <Col sm="8">
          <Form.Control type="text" placeholder="8個字以內" name="nickname" value={formData.nickname} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          身分字號
        </Form.Label>
        <Col sm="8">
          <Form.Control type="text" placeholder="開頭字母大寫" name="tw_id" value={formData.tw_id} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          會員帳號
        </Form.Label>
        <Col sm="8">
          <Form.Control type="text" placeholder="8~12個英數字組合" name="account" value={formData.account} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          手機號碼
        </Form.Label>
        <Col sm="8">
          <Form.Control type="tel" placeholder="手機號碼" name="phone" value={formData.phone} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          電子信箱
        </Form.Label>
        <Col sm="8">
          <Form.Control type="email" placeholder="電子信箱" name="email" value={formData.email} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-5">
        <Form.Label column sm="2" className="text-end">
          通訊地址
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="textarea"
            placeholder="免郵遞區號"
            name="address"
            value={formData.address}
            onChange={doChange}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          設定密碼
        </Form.Label>
        <Col sm="8">
          <Form.Control type="password" name="password" value={formData.password} onChange={doChange} />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-5">
        <Form.Label column sm="2" className="text-end">
          確認密碼
        </Form.Label>
        <Col sm="8">
          <Form.Control type="password" name="doubleCheck" value={formData.doubleCheck} onChange={doChange} />
        </Col>
      </Form.Group>
      <Row sm="8" className="justify-content-center">
        <Col className="d-flex justify-content-center">
          <Button
            className="bg-blueGray c-white me-3"
            variant="border border-2 rounded-pill px-4"
            type="submit"
            disabled={isLoading}
          >
           {isLoading ? '提交中...' : '確認'}
          </Button>
          <Button
            className="bg-gray c-white"
            variant="border border-2 rounded-pill px-4"
            type="button"
            onClick={() => setFormData({
              first_name: '',
              last_name: '',
              nickname: '',
              tw_id: '',
              account: '',
              phone: '',
              email: '',
              address: '',
              password: '',
              doubleCheck: ''
            })}
            disabled={isLoading}
          >
            取消
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default NormalForm;
