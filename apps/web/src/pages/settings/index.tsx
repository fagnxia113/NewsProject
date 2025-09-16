import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Input,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Switch,
  Divider,
} from '@nextui-org/react';
import { trpc } from '@web/utils/trpc';
import { PlusIcon, TrashIcon, PencilIcon } from '@web/components/Icons';

interface Industry {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string | null;
}

interface NewsType {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string | null;
}

interface LLMConfig {
  id: string;
  model: string;
  apiKey: string;
  baseUrl?: string | null;
  maxTokens?: number | null;
  temperature?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

const Settings = () => {
  // 行业管理状态
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [newIndustry, setNewIndustry] = useState({ name: '', description: '' });
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const { isOpen: isIndustryModalOpen, onOpen: onIndustryModalOpen, onClose: onIndustryModalClose, onOpenChange: onIndustryModalChange } = useDisclosure();

  // 新闻类型管理状态
  const [newsTypes, setNewsTypes] = useState<NewsType[]>([]);
  const [newNewsType, setNewNewsType] = useState({ name: '', description: '' });
  const [editingNewsType, setEditingNewsType] = useState<NewsType | null>(null);
  const { isOpen: isNewsTypeModalOpen, onOpen: onNewsTypeModalOpen, onClose: onNewsTypeModalClose, onOpenChange: onNewsTypeModalChange } = useDisclosure();

  // LLM配置管理状态
  const [llmConfigs, setLlmConfigs] = useState<LLMConfig[]>([]);
  const [newLLMConfig, setNewLLMConfig] = useState({
    model: 'gpt-3.5-turbo',
    apiKey: '',
    baseUrl: undefined as string | undefined,
    maxTokens: 2000 as number | undefined,
    temperature: 0.7 as number | undefined,
    isActive: true,
  });
  const [editingLLMConfig, setEditingLLMConfig] = useState<LLMConfig | null>(null);
  const { isOpen: isLLMConfigModalOpen, onOpen: onLLMConfigModalOpen, onClose: onLLMConfigModalClose, onOpenChange: onLLMConfigModalChange } = useDisclosure();

  // TRPC查询和变更
  const listIndustries = trpc.settings.listIndustries.useQuery();
  const listNewsTypes = trpc.settings.listNewsTypes.useQuery();
  const listLLMConfigs = trpc.settings.listLLMConfigs.useQuery();
  
  const createIndustry = trpc.settings.createIndustry.useMutation();
  const updateIndustry = trpc.settings.updateIndustry.useMutation();
  const deleteIndustry = trpc.settings.deleteIndustry.useMutation();
  
  const createNewsType = trpc.settings.createNewsType.useMutation();
  const updateNewsType = trpc.settings.updateNewsType.useMutation();
  const deleteNewsType = trpc.settings.deleteNewsType.useMutation();
  
  const createLLMConfig = trpc.settings.createLLMConfig.useMutation();
  const updateLLMConfig = trpc.settings.updateLLMConfig.useMutation();
  const deleteLLMConfig = trpc.settings.deleteLLMConfig.useMutation();

  // 加载数据
  useEffect(() => {
    if (listIndustries.data) {
      setIndustries(listIndustries.data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description !== null ? item.description : undefined,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })));
    }
  }, [listIndustries.data]);

  useEffect(() => {
    if (listNewsTypes.data) {
      setNewsTypes(listNewsTypes.data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description !== null ? item.description : undefined,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })));
    }
  }, [listNewsTypes.data]);

  useEffect(() => {
    if (listLLMConfigs.data) {
      setLlmConfigs(listLLMConfigs.data.map(item => ({
        ...item,
        baseUrl: item.baseUrl !== null ? item.baseUrl : undefined,
        maxTokens: item.maxTokens !== null ? item.maxTokens : undefined,
        temperature: item.temperature !== null ? item.temperature : undefined
      })));
    }
  }, [listLLMConfigs.data]);

  useEffect(() => {
    if (listLLMConfigs.data) {
      setLlmConfigs(listLLMConfigs.data.map(item => ({
        ...item,
        baseUrl: item.baseUrl !== null ? item.baseUrl : undefined,
        maxTokens: item.maxTokens !== null ? item.maxTokens : undefined,
        temperature: item.temperature !== null ? item.temperature : undefined
      })));
    }
  }, [listLLMConfigs.data]);

  // 行业管理函数
  const handleCreateIndustry = async () => {
    if (!newIndustry.name.trim()) return;
    
    try {
      const result = await createIndustry.mutateAsync(newIndustry);
      setIndustries([...industries, result]);
      setNewIndustry({ name: '', description: '' });
      onIndustryModalClose();
    } catch (error) {
      console.error('创建行业失败:', error);
    }
  };

  const handleUpdateIndustry = async () => {
    if (!editingIndustry || !editingIndustry.name.trim()) return;
    
    try {
      const { id, ...data } = editingIndustry;
      const result = await updateIndustry.mutateAsync({ id, data });
      setIndustries(industries.map(industry => industry.id === id ? result : industry));
      setEditingIndustry(null);
      onIndustryModalClose();
    } catch (error) {
      console.error('更新行业失败:', error);
    }
  };

  const handleDeleteIndustry = async (id: string) => {
    try {
      await deleteIndustry.mutateAsync(id);
      setIndustries(industries.filter(industry => industry.id !== id));
    } catch (error) {
      console.error('删除行业失败:', error);
    }
  };

  // 新闻类型管理函数
  const handleCreateNewsType = async () => {
    if (!newNewsType.name.trim()) return;
    
    try {
      const result = await createNewsType.mutateAsync(newNewsType);
      setNewsTypes([...newsTypes, result]);
      setNewNewsType({ name: '', description: '' });
      onNewsTypeModalClose();
    } catch (error) {
      console.error('创建新闻类型失败:', error);
    }
  };

  const handleUpdateNewsType = async () => {
    if (!editingNewsType || !editingNewsType.name.trim()) return;
    
    try {
      const { id, ...data } = editingNewsType;
      const result = await updateNewsType.mutateAsync({ id, data });
      setNewsTypes(newsTypes.map(type => type.id === id ? result : type));
      setEditingNewsType(null);
      onNewsTypeModalClose();
    } catch (error) {
      console.error('更新新闻类型失败:', error);
    }
  };

  const handleDeleteNewsType = async (id: string) => {
    try {
      await deleteNewsType.mutateAsync(id);
      setNewsTypes(newsTypes.filter(type => type.id !== id));
    } catch (error) {
      console.error('删除新闻类型失败:', error);
    }
  };

  // LLM配置管理函数
  const handleCreateLLMConfig = async () => {
    if (!newLLMConfig.apiKey.trim()) return;
    
    try {
      const result = await createLLMConfig.mutateAsync(newLLMConfig);
      setLlmConfigs([...llmConfigs, result]);
      setNewLLMConfig({
        model: 'gpt-3.5-turbo',
        apiKey: '',
        baseUrl: '',
        maxTokens: 2000,
        temperature: 0.7,
        isActive: true,
      });
      onLLMConfigModalClose();
    } catch (error) {
      console.error('创建LLM配置失败:', error);
    }
  };

  const handleUpdateLLMConfig = async () => {
    if (!editingLLMConfig || !editingLLMConfig.apiKey.trim()) return;
    
    try {
      const { id, ...data } = editingLLMConfig;
      const result = await updateLLMConfig.mutateAsync({ id, data });
      setLlmConfigs(llmConfigs.map(config => config.id === id ? result : config));
      setEditingLLMConfig(null);
      onLLMConfigModalClose();
    } catch (error) {
      console.error('更新LLM配置失败:', error);
    }
  };

  const handleDeleteLLMConfig = async (id: string) => {
    try {
      await deleteLLMConfig.mutateAsync(id);
      setLlmConfigs(llmConfigs.filter(config => config.id !== id));
    } catch (error) {
      console.error('删除LLM配置失败:', error);
    }
  };

  const openEditIndustryModal = (industry: Industry) => {
    setEditingIndustry(industry);
    onIndustryModalOpen();
  };

  const openEditNewsTypeModal = (newsType: NewsType) => {
    setEditingNewsType(newsType);
    onNewsTypeModalOpen();
  };

  const openEditLLMConfigModal = (llmConfig: LLMConfig) => {
    setEditingLLMConfig(llmConfig);
    onLLMConfigModalOpen();
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:to-gray-800 rounded-3xl">
      <h1 className="text-2xl font-bold mb-6">设置中心</h1>
      
      <Tabs aria-label="设置选项">
        <Tab key="industries" title="行业管理">
          <Card className="mt-4">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">行业列表</h2>
              <Button
                color="primary"
                endContent={<PlusIcon />}
                onClick={() => {
                  setEditingIndustry(null);
                  onIndustryModalOpen();
                }}
              >
                添加行业
              </Button>
            </CardHeader>
            <CardBody>
              <Table aria-label="行业表格">
                <TableHeader>
                  <TableColumn>名称</TableColumn>
                  <TableColumn>描述</TableColumn>
                  <TableColumn>创建时间</TableColumn>
                  <TableColumn>操作</TableColumn>
                </TableHeader>
                <TableBody>
                  {industries.map((industry) => (
                    <TableRow key={industry.id}>
                      <TableCell>{industry.name}</TableCell>
                      <TableCell>{industry.description || '-'}</TableCell>
                      <TableCell>{new Date(industry.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="light"
                            onClick={() => openEditIndustryModal(industry)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="light"
                            color="danger"
                            onClick={() => handleDeleteIndustry(industry.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
        
        <Tab key="newsTypes" title="新闻类型管理">
          <Card className="mt-4">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">新闻类型列表</h2>
              <Button
                color="primary"
                endContent={<PlusIcon />}
                onClick={() => {
                  setEditingNewsType(null);
                  onNewsTypeModalOpen();
                }}
              >
                添加类型
              </Button>
            </CardHeader>
            <CardBody>
              <Table aria-label="新闻类型表格">
                <TableHeader>
                  <TableColumn>名称</TableColumn>
                  <TableColumn>描述</TableColumn>
                  <TableColumn>创建时间</TableColumn>
                  <TableColumn>操作</TableColumn>
                </TableHeader>
                <TableBody>
                  {newsTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>{type.name}</TableCell>
                      <TableCell>{type.description || '-'}</TableCell>
                      <TableCell>{new Date(type.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="light"
                            onClick={() => openEditNewsTypeModal(type)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="light"
                            color="danger"
                            onClick={() => handleDeleteNewsType(type.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
        
        <Tab key="llmConfigs" title="LLM配置管理">
          <Card className="mt-4">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">LLM配置列表</h2>
              <Button
                color="primary"
                endContent={<PlusIcon />}
                onClick={() => {
                  setEditingLLMConfig(null);
                  onLLMConfigModalOpen();
                }}
              >
                添加配置
              </Button>
            </CardHeader>
            <CardBody>
              <Table aria-label="LLM配置表格">
                <TableHeader>
                  <TableColumn>模型</TableColumn>
                  <TableColumn>状态</TableColumn>
                  <TableColumn>最大令牌数</TableColumn>
                  <TableColumn>温度</TableColumn>
                  <TableColumn>创建时间</TableColumn>
                  <TableColumn>操作</TableColumn>
                </TableHeader>
                <TableBody>
                  {llmConfigs.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell>{config.model}</TableCell>
                      <TableCell>
                        <Chip
                          color={config.isActive ? 'success' : 'default'}
                          variant="flat"
                          size="sm"
                        >
                          {config.isActive ? '启用' : '禁用'}
                        </Chip>
                      </TableCell>
                      <TableCell>{config.maxTokens || '-'}</TableCell>
                      <TableCell>{config.temperature || '-'}</TableCell>
                      <TableCell>{new Date(config.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="light"
                            onClick={() => openEditLLMConfigModal(config)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="light"
                            color="danger"
                            onClick={() => handleDeleteLLMConfig(config.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      {/* 行业管理模态框 */}
      <Modal isOpen={isIndustryModalOpen} onOpenChange={onIndustryModalChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingIndustry ? '编辑行业' : '添加行业'}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">行业名称</span>
                    <Input
                      placeholder="输入行业名称"
                      value={editingIndustry ? editingIndustry.name : newIndustry.name}
                      onChange={(e) => {
                        if (editingIndustry) {
                          setEditingIndustry({ ...editingIndustry, name: e.target.value });
                        } else {
                          setNewIndustry({ ...newIndustry, name: e.target.value });
                        }
                      }}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "h-12"
                      }}
                      radius="md"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">行业描述</span>
                    <Textarea
                      placeholder="输入行业描述（可选）"
                      value={editingIndustry ? (editingIndustry.description || '') : newIndustry.description}
                      onChange={(e) => {
                        const value = e.target.value || undefined;
                        if (editingIndustry) {
                          setEditingIndustry({ ...editingIndustry, description: value });
                        } else {
                          setNewIndustry({ ...newIndustry, description: value });
                        }
                      }}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "h-12"
                      }}
                      radius="md"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  color="primary"
                  onPress={editingIndustry ? handleUpdateIndustry : handleCreateIndustry}
                  className="font-medium"
                >
                  {editingIndustry ? '更新' : '创建'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 新闻类型管理模态框 */}
      <Modal isOpen={isNewsTypeModalOpen} onOpenChange={onNewsTypeModalChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingNewsType ? '编辑新闻类型' : '添加新闻类型'}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">类型名称</span>
                    <Input
                      placeholder="输入类型名称"
                      value={editingNewsType ? editingNewsType.name : newNewsType.name}
                      onChange={(e) => {
                        if (editingNewsType) {
                          setEditingNewsType({ ...editingNewsType, name: e.target.value });
                        } else {
                          setNewNewsType({ ...newNewsType, name: e.target.value });
                        }
                      }}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "h-12"
                      }}
                      radius="md"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">类型描述</span>
                    <Textarea
                      placeholder="输入类型描述（可选）"
                      value={editingNewsType ? (editingNewsType.description || '') : newNewsType.description}
                      onChange={(e) => {
                        const value = e.target.value || undefined;
                        if (editingNewsType) {
                          setEditingNewsType({ ...editingNewsType, description: value });
                        } else {
                          setNewNewsType({ ...newNewsType, description: value });
                        }
                      }}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "h-12"
                      }}
                      radius="md"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  color="primary"
                  onPress={editingNewsType ? handleUpdateNewsType : handleCreateNewsType}
                  className="font-medium"
                >
                  {editingNewsType ? '更新' : '创建'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* LLM配置管理模态框 */}
      <Modal isOpen={isLLMConfigModalOpen} onOpenChange={onLLMConfigModalChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingLLMConfig ? '编辑LLM配置' : '添加LLM配置'}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">模型ID</span>
                    <Input
                      placeholder="输入自定义模型ID"
                      value={editingLLMConfig ? editingLLMConfig.model : newLLMConfig.model}
                      onChange={(e) => {
                        if (editingLLMConfig) {
                          setEditingLLMConfig({ ...editingLLMConfig, model: e.target.value });
                        } else {
                          setNewLLMConfig({ ...newLLMConfig, model: e.target.value });
                        }
                      }}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "h-12"
                      }}
                      radius="md"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">API密钥</span>
                    <Input
                      placeholder="输入API密钥"
                      type="password"
                      value={editingLLMConfig ? editingLLMConfig.apiKey : newLLMConfig.apiKey}
                      onChange={(e) => {
                        if (editingLLMConfig) {
                          setEditingLLMConfig({ ...editingLLMConfig, apiKey: e.target.value });
                        } else {
                          setNewLLMConfig({ ...newLLMConfig, apiKey: e.target.value });
                        }
                      }}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "h-12"
                      }}
                      radius="md"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">基础URL</span>
                    <Input
                      placeholder="输入API基础URL（可选）"
                      value={editingLLMConfig ? editingLLMConfig.baseUrl || '' : newLLMConfig.baseUrl}
                      onChange={(e) => {
                        if (editingLLMConfig) {
                          setEditingLLMConfig({ ...editingLLMConfig, baseUrl: e.target.value });
                        } else {
                          setNewLLMConfig({ ...newLLMConfig, baseUrl: e.target.value });
                        }
                      }}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "h-12"
                      }}
                      radius="md"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground">最大令牌数</span>
                      <Input
                        placeholder="输入最大令牌数"
                        type="number"
                        value={editingLLMConfig ? editingLLMConfig.maxTokens?.toString() || '' : newLLMConfig.maxTokens?.toString() || ''}
                        onChange={(e) => {
                          const maxTokens = e.target.value ? parseInt(e.target.value) : undefined;
                          if (editingLLMConfig) {
                            setEditingLLMConfig({ ...editingLLMConfig, maxTokens });
                          } else {
                            setNewLLMConfig({ ...newLLMConfig, maxTokens });
                          }
                        }}
                        variant="bordered"
                        classNames={{
                          inputWrapper: "h-12"
                        }}
                        radius="md"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-foreground">温度</span>
                      <Input
                        placeholder="输入温度值 (0-1)"
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={editingLLMConfig ? editingLLMConfig.temperature?.toString() || '' : newLLMConfig.temperature?.toString() || ''}
                        onChange={(e) => {
                          const temperature = e.target.value ? parseFloat(e.target.value) : undefined;
                          if (editingLLMConfig) {
                            setEditingLLMConfig({ ...editingLLMConfig, temperature });
                          } else {
                            setNewLLMConfig({ ...newLLMConfig, temperature });
                          }
                        }}
                        variant="bordered"
                        classNames={{
                          inputWrapper: "h-12"
                        }}
                        radius="md"
                      />
                    </div>
                  </div>
                  
                  <Divider />
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-medium font-medium text-foreground">启用此配置</span>
                    <Switch
                      isSelected={editingLLMConfig ? editingLLMConfig.isActive : newLLMConfig.isActive}
                      onValueChange={(isSelected) => {
                        if (editingLLMConfig) {
                          setEditingLLMConfig({ ...editingLLMConfig, isActive: isSelected });
                        } else {
                          setNewLLMConfig({ ...newLLMConfig, isActive: isSelected });
                        }
                      }}
                      size="sm"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  color="primary"
                  onPress={editingLLMConfig ? handleUpdateLLMConfig : handleCreateLLMConfig}
                  className="font-medium"
                >
                  {editingLLMConfig ? '更新' : '创建'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Settings;
