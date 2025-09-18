import React, { useState, useEffect } from 'react';
import { Card, CardBody, Progress, Chip } from '@nextui-org/react';
import { trpc } from '@web/utils/trpc';

interface AnalysisProgressProps {
  taskId?: string;
  onCompleted?: () => void;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ taskId, onCompleted }) => {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('待处理');
  const [stats, setStats] = useState({
    totalArticles: 0,
    processedArticles: 0,
    successArticles: 0,
    failedArticles: 0,
  });

  // 轮询获取任务进度
  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      try {
        const task = await trpc.analysis.getTask.query({ id: taskId });
        
        if (task) {
          // 更新状态
          const statusMap: Record<number, string> = {
            0: '待处理',
            1: '处理中',
            2: '已完成',
            3: '失败',
          };
          
          setStatus(statusMap[task.status] || '未知');
          setStats({
            totalArticles: task.totalArticles || 0,
            processedArticles: task.processedArticles || 0,
            successArticles: task.successArticles || 0,
            failedArticles: task.failedArticles || 0,
          });
          
          // 计算进度百分比
          if (task.totalArticles > 0) {
            const progressPercent = Math.round((task.processedArticles / task.totalArticles) * 100);
            setProgress(progressPercent);
          }
          
          // 如果任务已完成，清除轮询并调用完成回调
          if (task.status === 2) {
            clearInterval(interval);
            onCompleted?.();
          }
          
          // 如果任务失败，清除轮询
          if (task.status === 3) {
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error('获取任务进度失败:', error);
      }
    }, 2000); // 每2秒轮询一次

    // 清除轮询
    return () => clearInterval(interval);
  }, [taskId, onCompleted]);

  if (!taskId) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardBody className="py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">分析进度</h3>
            <Chip 
              color={status === '已完成' ? 'success' : status === '失败' ? 'danger' : 'warning'} 
              variant="flat"
            >
              {status}
            </Chip>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span>处理进度</span>
              <span>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              color={status === '失败' ? 'danger' : 'primary'} 
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="border rounded-lg p-2">
              <div className="text-2xl font-bold">{stats.totalArticles}</div>
              <div className="text-sm text-gray-500">总计</div>
            </div>
            <div className="border rounded-lg p-2">
              <div className="text-2xl font-bold">{stats.processedArticles}</div>
              <div className="text-sm text-gray-500">已处理</div>
            </div>
            <div className="border rounded-lg p-2">
              <div className="text-2xl font-bold text-green-600">{stats.successArticles}</div>
              <div className="text-sm text-gray-500">成功</div>
            </div>
            <div className="border rounded-lg p-2">
              <div className="text-2xl font-bold text-red-600">{stats.failedArticles}</div>
              <div className="text-sm text-gray-500">失败</div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AnalysisProgress;
