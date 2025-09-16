import { Button, Input, Card, CardBody, CardHeader } from '@nextui-org/react';
import { setAuthCode } from '@web/utils/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [codeValue, setCodeValue] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-center justify-center pb-0 pt-6 px-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">WW</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">WeWe RSS</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">请输入授权码以继续</p>
        </CardHeader>
        <CardBody className="px-6 py-8">
          <div className="space-y-4">
            <Input
              value={codeValue}
              onValueChange={setCodeValue}
              label="授权码"
              placeholder="请输入授权码"
              variant="bordered"
              size="lg"
              className="dark:text-white"
              startContent={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            <Button
              color="primary"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              onPress={() => {
                setAuthCode(codeValue);
                navigate('/');
              }}
              isDisabled={!codeValue.trim()}
            >
              确认登录
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;