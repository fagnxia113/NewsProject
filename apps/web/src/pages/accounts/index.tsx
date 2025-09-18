import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
} from '@nextui-org/react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { PlusIcon } from '@web/components/PlusIcon';
import dayjs from 'dayjs';
import { StatusDropdown } from '@web/components/StatusDropdown';
import { trpc } from '@web/utils/trpc';
import { statusMap } from '@web/constants';

const AccountPage = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // 添加加载状态

  const { refetch, data, isFetching } = trpc.account.list.useQuery({});

  const queryUtils = trpc.useUtils();

  const { mutateAsync: updateAccount } = trpc.account.edit.useMutation({});

  const { mutateAsync: deleteAccount } = trpc.account.delete.useMutation({});

  const { mutateAsync: addAccount } = trpc.account.add.useMutation({
    onError(error) {
      console.error('addAccount error:', error);
      toast.error('添加账号失败', {
        description: error.message || '请稍后重试',
      });
      setIsLoading(false);
    },
  });

  const { mutateAsync, data: loginData } = trpc.platform.createLoginUrl.useMutation({
    onSuccess(data) {
      console.log('createLoginUrl success:', data);
      if (!data?.uuid || !data?.scanUrl) {
        toast.error('获取二维码数据不完整', {
          description: JSON.stringify(data),
        });
        setIsLoading(false);
        return;
      }
      setCount(60);
      setIsLoading(false);
    },
    onError(error) {
      console.error('createLoginUrl error:', error);
      toast.error('获取二维码失败', {
        description: error.message || '请检查网络连接或授权码是否正确',
      });
      setIsLoading(false);
    },
  });

  const { mutateAsync: getLoginResult, data: loginResult } = trpc.platform.getLoginResult.useMutation({
    onSuccess(data) {
      if (data.vid && data.token) {
        const name = data.username!;
        addAccount({ id: `${data.vid}`, name, token: data.token })
          .then(() => {
            onClose();
            toast.success('添加成功', {
              description: `用户名：${name}(${data.vid})`,
            });
            refetch();
            // 重置状态
            setCount(0);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('添加账号失败:', error);
            // 不需要在这里显示错误提示，因为addAccount的onError已经处理了
          });
      } else if (data.message) {
        toast.error(`登录失败: ${data.message}`);
        setIsLoading(false);
      }
    },
    onError(error) {
      console.error('getLoginResult error:', error);
      toast.error('获取登录结果失败', {
        description: error.message || '请稍后重试',
      });
      setIsLoading(false);
    },
  });

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isOpen && loginData?.uuid && !loginResult?.vid) {
      timerId = setInterval(() => {
        getLoginResult({ id: loginData.uuid });
      }, 2000);
    }
    return () => timerId && clearInterval(timerId);
  }, [isOpen, loginData?.uuid, loginResult?.vid, getLoginResult]);

  useEffect(() => {
    let timerId;
    if (count > 0 && isOpen && !loginResult?.vid) {
      timerId = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    } else if (count === 0 && isOpen && !loginResult?.vid) {
      // 二维码过期
      toast.error('二维码已过期', {
        description: '请重新获取二维码',
      });
      setIsLoading(false); // 重置加载状态
    }
    return () => timerId && clearTimeout(timerId);
  }, [count, isOpen, loginResult?.vid]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">账号管理</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">共{data?.items.length || 0}个账号</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onPress={async () => {
                    try {
                      onOpen();
                      setIsLoading(true); // 开始加载
                      toast.info('正在获取二维码...');
                       
                      const result = await mutateAsync();
                      console.log('API响应:', result);
                       
                      if (!result?.scanUrl) {
                        throw new Error('未获取到有效的二维码URL');
                      }
                    } catch (error: any) {
                      console.error('获取二维码失败:', error);
                      toast.error('获取二维码失败', {
                        description: error.message || '请检查网络连接',
                      });
                      onClose();
                      setIsLoading(false);
                    }
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  endContent={<PlusIcon />}
                >
                  添加读书账号
                </Button>
              </div>
            </div>
          </div>
        </div>
         
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <Table aria-label="账号列表" className="min-w-full">
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</TableColumn>
              <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">用户名</TableColumn>
              <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">状态</TableColumn>
              <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">更新时间</TableColumn>
              <TableColumn className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">操作</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={<div className="py-12 text-center text-gray-500 dark:text-gray-400">暂无账号数据</div>}
              isLoading={isFetching}
              loadingContent={<div className="py-12 flex justify-center"><Spinner /></div>}
            >
              {data?.items.map((item) => {
                const isBlocked = data?.blocks.includes(item.id);

                return (
                  <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.id}</TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {isBlocked ? (
                        <Chip className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 capitalize" size="sm" variant="flat">
                          今日小黑屋
                        </Chip>
                      ) : (
                        <Chip
                          className={`capitalize ${statusMap[item.status].color === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : statusMap[item.status].color === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'}`}
                          size="sm"
                          variant="flat"
                        >
                          {statusMap[item.status].label}
                        </Chip>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {dayjs(item.updatedAt).format('YYYY-MM-DD')}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <StatusDropdown
                        value={item.status}
                        onChange={(value) => {
                          updateAccount({
                            id: item.id,
                            data: { status: value },
                          }).then(() => {
                            toast.success('更新成功!');
                            refetch();
                          });
                        }}
                      ></StatusDropdown>

                      <Button
                        size="sm"
                        className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium py-1 px-3 rounded-md transition duration-200"
                        onPress={() => {
                          deleteAccount(item.id).then(() => {
                            toast.success('删除成功!');
                            refetch();
                          });
                        }}
                      >
                        删除
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }) || []}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={async (isOpen) => {
          if (!isOpen) {
            // 取消所有未完成的请求
            await Promise.all([
              queryUtils.account.list.cancel(),
              (queryUtils.platform as any).getLoginResult.cancel()
            ]);
            setIsLoading(false); // 重置加载状态
            setCount(0); // 重置倒计时
          }
          onOpenChange();
        }}
        size="lg"
        placement="center"
        scrollBehavior="inside"
        className="rounded-2xl"
        backdrop="blur"
        classNames={{ base: "max-w-lg w-full" }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          }
        }}
      >
        <ModalContent className="py-0">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-2xl px-6 py-4">
                <h3 className="text-xl font-bold">添加读书账号</h3>
                <p className="text-blue-100 text-sm">使用微信扫码登录</p>
              </ModalHeader>
              <ModalBody className="px-6 py-8">
                <div className="flex flex-col items-center justify-center">
                  {isLoading && !loginData?.scanUrl ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                      <Spinner size="lg" className="text-blue-500 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 text-lg">正在获取二维码...</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">请稍候</p>
                    </div>
                  ) : loginData?.scanUrl ? (
                    <div className="text-center">
                      <div className="relative inline-block">
                        {loginResult?.message && (
                          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 rounded-lg flex items-center justify-center z-10">
                            <div className="text-xl font-medium text-gray-800 dark:text-white">
                              {loginResult?.message}
                            </div>
                          </div>
                        )}
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-600">
                          <div className="mb-4">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">请使用微信扫码</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">扫描二维码完成登录</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-700 inline-block">
                            <QRCodeSVG 
                              size={220} 
                              value={loginData.scanUrl} 
                              level="H" // 提高二维码容错率
                              includeMargin={true}
                              onError={(e) => {
                                console.error('生成二维码失败:', e);
                                toast.error('生成二维码失败', {
                                  description: '请检查二维码URL是否有效'
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">
                          微信扫码登录
                        </p>
                        {!loginResult?.message && count > 0 && (
                          <div className="mt-3">
                            <p className="text-red-500 dark:text-red-400 font-medium">
                              二维码将在 <span className="font-bold text-2xl">{count}</span> 秒后过期
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              过期后请重新获取
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center">
                      <Spinner size="lg" className="text-blue-500 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">二维码加载中...</p>
                    </div>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AccountPage;
