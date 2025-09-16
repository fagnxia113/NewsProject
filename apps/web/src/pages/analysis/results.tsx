import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Chip, 
  Pagination,
  Input,
  Select,
  SelectItem,
  DateRangePicker,
  Checkbox,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react';
import { Search, RefreshCw, Database, ChevronRight, CheckSquare, Square } from '@web/components/Icons';
import { trpc } from '@web/utils/trpc';
import dayjs from 'dayjs';
import type { DateValue } from '@nextui-org/react';


const AnalysisResultsPage = () => {
  // 状态管理
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState<{start: DateValue | null, end: DateValue | null}>({start: null, end: null});
  const [showDuplicates, setShowDuplicates] = useState(false);

  // 获取行业列表
  const { data: industries } = trpc.analysis.listIndustries.useQuery({ activeOnly: true });
  
  // 获取新闻类型列表
  const { data: newsTypes } = trpc.analysis.listNewsTypes.useQuery({ activeOnly: true });
  
  // 获取统计信息
  const { data: stats } = trpc.analysis.getStats.useQuery({ days: 30 });
  
  // 获取分析结果
  const { data: results, isLoading, refetch } = trpc.analysis.getClassifiedArticles.useQuery({
    page,
    pageSize,
    keyword: searchKeyword,
    industry: selectedIndustry === 'all' ? undefined : selectedIndustry,
    newsType: selectedType === 'all' ? undefined : selectedType,
    startDate: dateRange.start ? Math.floor(dayjs(dateRange.start.toString()).unix()) : undefined,
    endDate: dateRange.end ? Math.floor(dayjs(dateRange.end.toString()).unix()) : undefined,
    // showDuplicates,
    // sortBy,
    // sortOrder
  });

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedResults.length === (results?.data.length || 0)) {
      setSelectedResults([]);
    } else {
      const allResultIds = results?.data.map(result => result.id) || [];
      setSelectedResults(allResultIds);
    }
  };

  // 选择单个结果
  const handleSelectResult = (resultId: string) => {
    if (selectedResults.includes(resultId)) {
      setSelectedResults(selectedResults.filter(id => id !== resultId));
    } else {
      setSelectedResults([...selectedResults, resultId]);
    }
  };

  // 重置筛选条件
  const resetFilters = () => {
    setSearchKeyword('');
    setSelectedIndustry('all');
    setSelectedType('all');
    setDateRange({start: null, end: null});
    setShowDuplicates(false);
    setPage(1);
  };

  // 导出选中结果
  const handleExportSelected = () => {
    // 实现导出功能
    console.log('导出选中的结果:', selectedResults);
  };

  // 重新分析选中结果
  const handleReanalyzeSelected = () => {
    // 实现重新分析功能
    console.log('重新分析选中的结果:', selectedResults);
  };

  // 删除分析结果
  const { mutate: deleteAnalysisResults, isLoading: isDeleting } = trpc.analysis.deleteAnalysisResults.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedResults([]);
      // 显示成功消息
      console.log('分析结果已删除');
    },
    onError: (error) => {
      // 显示错误消息
      console.error('删除分析结果失败:', error);
    }
  });

  const handleDeleteSelected = () => {
    if (selectedResults.length === 0) return;
    
    if (window.confirm(`确定要删除选中的 ${selectedResults.length} 条分析结果吗？`)) {
      deleteAnalysisResults({ articleIds: selectedResults });
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:to-gray-800 rounded-3xl">
      <h1 className="text-2xl font-bold mb-6">分析结果</h1>
      
      {/* 分析进度展示 */}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
              <div className="text-sm text-blue-600 dark:text-blue-300 mb-1">总文章数</div>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {stats?.totalArticles || 0}
              </div>
              <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                投融资: {stats?.investmentCount || 0}
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
              <div className="text-sm text-green-600 dark:text-green-300 mb-1">已处理</div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                {stats?.processedArticles || 0}
              </div>
              <div className="text-xs text-green-500 dark:text-green-400 mt-1">
                政策: {stats?.policyCount || 0}
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
              <div className="text-sm text-purple-600 dark:text-purple-300 mb-1">拆分事件</div>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                {stats?.splitCount || 0}
              </div>
              <div className="text-xs text-purple-500 dark:text-purple-400 mt-1">
                投融资占比: {stats?.investmentProportion || 0}%
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-4">
              <div className="text-sm text-orange-600 dark:text-orange-300 mb-1">处理状态</div>
              <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                {stats ? (stats.articleGrowth >= 0 ? '增长' : '下降') : '稳定'}
              </div>
              <div className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                变化率: {stats?.articleGrowth || 0}%
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 筛选和操作区域 */}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="搜索标题或摘要"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              startContent={<Search className="h-4 w-4" />}
            />
            
            <Select
              placeholder="选择行业"
              selectedKeys={[selectedIndustry]}
              onSelectionChange={(keys) => setSelectedIndustry(Array.from(keys)[0] as string)}
            >
              <SelectItem key="all" value="all">全部行业</SelectItem>
              {industries?.map(industry => (
                <SelectItem key={industry.id} value={industry.id}>{industry.name}</SelectItem>
              ))}
            </Select>
            
            <Select
              placeholder="选择新闻类型"
              selectedKeys={[selectedType]}
              onSelectionChange={(keys) => setSelectedType(Array.from(keys)[0] as string)}
            >
              <SelectItem key="all" value="all">全部类型</SelectItem>
              {newsTypes?.map(type => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </Select>
            
            <DateRangePicker
              label="发布时间"
              value={dateRange}
              onChange={(value) => setDateRange(value || {start: null, end: null})}
            />
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <Checkbox
              isSelected={showDuplicates}
              onValueChange={setShowDuplicates}
            >
              显示重复项
            </Checkbox>
            
            <div className="flex gap-2 ml-auto">
              <Button
                variant="flat"
                onClick={resetFilters}
              >
                重置筛选
              </Button>
              
              <Button
                color="primary"
                variant="solid"
                onClick={handleSelectAll}
                startContent={selectedResults.length === (results?.data.length || 0) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                isDisabled={!results?.data.length}
              >
                {selectedResults.length === (results?.data.length || 0) ? '取消全选' : '全选'}
              </Button>
              
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    color="success"
                    variant="solid"
                    isDisabled={selectedResults.length === 0}
                    startContent={<Database className="h-4 w-4" />}
                  >
                    操作选中 ({selectedResults.length})
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="操作选中结果">
                  <DropdownItem key="reanalyze" onClick={handleReanalyzeSelected}>
                    重新分析
                  </DropdownItem>
                  <DropdownItem key="export" onClick={handleExportSelected}>
                    导出结果
                  </DropdownItem>
                  <DropdownItem key="mark" className="text-danger">
                    标记为重要
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              
              <Button
                variant="flat"
                onClick={() => refetch()}
                isLoading={isLoading}
                startContent={<RefreshCw className="h-4 w-4" />}
              >
                刷新
              </Button>
              
              <Button
                color="danger"
                variant="flat"
                onClick={handleDeleteSelected}
                isLoading={isDeleting}
                isDisabled={selectedResults.length === 0}
                startContent={<Database className="h-4 w-4" />}
              >
                删除选中
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 分析结果表格 */}
      <Card>
        <CardBody>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>加载分析结果中...</p>
              </div>
            </div>
          ) : results?.data && results.data.length > 0 ? (
            <>
              <Table 
                aria-label="分析结果表格"
                bottomContent={
                  <div className="flex w-full justify-center">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="primary"
                      page={page}
                      total={Math.ceil(results.total / pageSize)}
                      onChange={(page) => setPage(page)}
                    />
                  </div>
                }
              >
                <TableHeader>
                  <TableColumn className="w-[50px]">
                    <Checkbox
                      isSelected={selectedResults.length === results.data.length && results.data.length > 0}
                      onValueChange={handleSelectAll}
                    />
                  </TableColumn>
                  <TableColumn>标题</TableColumn>
                  <TableColumn>摘要</TableColumn>
                  <TableColumn>行业</TableColumn>
                  <TableColumn>类型</TableColumn>
                  <TableColumn>发布时间</TableColumn>
                  <TableColumn>置信度</TableColumn>
                  <TableColumn>操作</TableColumn>
                </TableHeader>
                <TableBody>
                  {results.data.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <Checkbox
                          isSelected={selectedResults.includes(result.id)}
                          onValueChange={() => handleSelectResult(result.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium max-w-xs truncate">
                          <a 
                            href={`https://mp.weixin.qq.com/s/${result.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {result.title}
                          </a>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {result.mpName || '未知来源'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm">
                          摘要信息...
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat">
                          {result.industry || '未分类'}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" color="primary">
                          {result.newsType || '未分类'}
                        </Chip>
                      </TableCell>
                      <TableCell className="text-sm">
                        {dayjs.unix(result.publishTime).format('YYYY-MM-DD')}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          size="sm" 
                          variant="flat" 
                          color={'default'}
                        >
                          {(0).toFixed(0)}%
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            onClick={() => {
                              // 查看详情
                              console.log('查看详情:', result.id);
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  共 {results.total} 条结果
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">每页显示:</span>
                  <Select
                    className="w-20"
                    size="sm"
                    selectedKeys={[String(pageSize)]}
                    onSelectionChange={(keys) => setPageSize(Number(Array.from(keys)[0]))}
                  >
                    <SelectItem key="10" value="10">10</SelectItem>
                    <SelectItem key="20" value="20">20</SelectItem>
                    <SelectItem key="50" value="50">50</SelectItem>
                    <SelectItem key="100" value="100">100</SelectItem>
                  </Select>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Database className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-1">暂无分析结果</h3>
              <p className="text-gray-500 dark:text-gray-400">
                请选择文章进行智能分析，或调整筛选条件
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AnalysisResultsPage;
