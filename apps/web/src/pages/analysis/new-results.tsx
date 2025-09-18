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
  Select,
  SelectItem,
  Checkbox,
  Spinner
} from '@nextui-org/react';
import { RefreshCw, Database, ChevronRight, CheckSquare, Square } from '@web/components/Icons';
import { trpc } from '@web/utils/trpc';
import dayjs from 'dayjs';
import AnalysisProgress from '@web/components/AnalysisProgress';


const AnalysisResultsPage = () => {
  // 状态管理
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [dateRange, setDateRange] = useState<any>({start: null, end: null});

  // 获取分析结果
  const { data: results, isLoading, refetch } = trpc.analysis.getClassifiedArticles.useQuery({
    page,
    pageSize,
    startDate: dateRange.start ? Math.floor(dayjs(dateRange.start.toString()).unix()) : undefined,
    endDate: dateRange.end ? Math.floor(dayjs(dateRange.end.toString()).unix()) : undefined
  });

  // 获取未处理文章数量
  const { data: unprocessedStats } = trpc.analysis.getStats.useQuery({ days: 30 });
  const unprocessedCount = (unprocessedStats?.totalArticles || 0) - (unprocessedStats?.processedArticles || 0);

  // 处理新文章
  const { mutate: processNewArticles, data: processResult, isLoading: isProcessing } = trpc.analysis.processNewArticles.useMutation();

  // 处理完成后的回调
  const handleProcessCompleted = () => {
    // 刷新数据
    refetch();
  };

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
    setDateRange({start: null, end: null});
    setPage(1);
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">分析结果</h1>
      
      {/* 分析进度展示 */}
      <Card className="mb-6">
        <CardBody className="py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">智能分析</h3>
                <p className="text-sm text-gray-500">
                  待分析文章: {unprocessedCount} 篇
                </p>
              </div>
              <Button 
                color="primary" 
                onClick={() => processNewArticles({ days: 30 })}
                isLoading={isProcessing}
              >
                开始分析
              </Button>
            </div>
            
            {/* 进度显示 */}
            {processResult?.taskId && (
              <AnalysisProgress 
                taskId={processResult.taskId} 
                onCompleted={handleProcessCompleted}
              />
            )}
          </div>
        </CardBody>
      </Card>

      {/* 筛选和操作区域 */}
      <Card className="mb-6">
        <CardBody className="py-4">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div className="flex gap-2">
              {/* 日期筛选图标按钮 */}
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                onClick={() => {
                  // 日期筛选逻辑
                  console.log('日期筛选');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </Button>
              
              <Button
                variant="flat"
                size="sm"
                onClick={resetFilters}
              >
                重置筛选
              </Button>
            </div>
            
            <div className="flex gap-2 ml-auto">
              <Button
                color="primary"
                variant="solid"
                size="sm"
                onClick={handleSelectAll}
                startContent={selectedResults.length === (results?.data.length || 0) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                isDisabled={!results?.data.length}
              >
                {selectedResults.length === (results?.data.length || 0) ? '取消全选' : '全选'}
              </Button>
              
              <Button
                variant="flat"
                size="sm"
                onClick={() => refetch()}
                isLoading={isLoading}
                startContent={<RefreshCw className="h-4 w-4" />}
              >
                刷新
              </Button>
              
              <Button
                color="danger"
                variant="flat"
                size="sm"
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
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Spinner className="mx-auto mb-2" />
                <p>加载分析结果中...</p>
              </div>
            </div>
          ) : results?.data && results.data.length > 0 ? (
            <>
              <Table 
                aria-label="分析结果表格"
                classNames={{
                  base: "max-h-[calc(100vh-300px)]",
                  table: "min-h-[400px]",
                }}
                bottomContent={
                  <div className="flex w-full justify-center py-2">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="primary"
                      page={page}
                      total={Math.ceil(results.total / pageSize)}
                      onChange={(page) => setPage(page)}
                      size="sm"
                    />
                  </div>
                }
              >
                <TableHeader>
                  <TableColumn className="w-[40px]">
                    <Checkbox
                      size="sm"
                      isSelected={selectedResults.length === results.data.length && results.data.length > 0}
                      onValueChange={handleSelectAll}
                    />
                  </TableColumn>
                  <TableColumn className="min-w-[200px]">标题</TableColumn>
                  <TableColumn className="min-w-[250px]">简要</TableColumn>
                  <TableColumn className="min-w-[100px]">原网址</TableColumn>
                  <TableColumn className="min-w-[150px]">分析完成时间</TableColumn>
                  <TableColumn className="w-[80px]">操作</TableColumn>
                </TableHeader>
                <TableBody>
                  {results.data.map((result) => (
                    <TableRow key={result.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                      <TableCell className="p-2">
                        <Checkbox
                          size="sm"
                          isSelected={selectedResults.includes(result.id)}
                          onValueChange={() => handleSelectResult(result.id)}
                        />
                      </TableCell>
                      <TableCell className="p-2">
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
                      <TableCell className="p-2">
                        <div className="max-w-xs truncate text-sm">
                          摘要信息... (这里应该显示从文章中提取的简要内容，字数控制在200字以内)
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <a 
                          href={`https://mp.weixin.qq.com/s/${result.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline dark:text-blue-400 text-sm"
                        >
                          查看原文
                        </a>
                      </TableCell>
                      <TableCell className="p-2 text-sm">
                        {result.publishTime ? dayjs.unix(result.publishTime).format('YYYY-MM-DD HH:mm') : '未知'}
                      </TableCell>
                      <TableCell className="p-2">
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
              
              <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
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
                请先开始分析文章，或调整筛选条件
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AnalysisResultsPage;
