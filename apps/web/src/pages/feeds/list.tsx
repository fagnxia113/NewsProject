import React from 'react';
import { trpc } from '@web/utils/trpc';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { Link } from '@nextui-org/link';
import { Spinner } from '@nextui-org/spinner';
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Checkbox } from '@nextui-org/react';

interface ArticleItem {
  id: string;
  title: string;
  content?: string;
  publishTime: number;
  mpId?: string;
  mpName?: string;
  mpCover?: string;
  industry?: string;
  newsType?: string;
  isProcessed?: boolean;
}

interface ArticleListProps {
  selectedArticles: string[];
  onArticleSelect: (articleId: string) => void;
  onSelectAll: (articleIds: string[]) => void;
}

const ArticleList = ({ selectedArticles, onArticleSelect, onSelectAll }: ArticleListProps) => {
  const { id } = useParams();
  const mpId = id || '';

  // API调用
  const { data, isLoading, hasNextPage } = 
    trpc.article.list.useInfiniteQuery(
      {
        limit: 20,
        mpId: mpId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  // Function to truncate text to a specific length
  const truncateText = (text: string, maxLength: number = 25): string => {
    if (!text || text.length <= maxLength) return text;
    
    // 移除HTML标签
    const plainText = text.replace(/<[^>]*>/g, '');
    
    // 截取指定长度并添加省略号
    return plainText.substring(0, maxLength) + '...';
  };

  const items = React.useMemo(() => {
    if (!data) return [];
    
    // 从分页数据中提取所有文章项
    const allItems: ArticleItem[] = [];
    data.pages.forEach(page => {
      // 确保page.items存在且为数组
      if (page && Array.isArray(page.items)) {
        page.items.forEach(item => {
          // 转换API返回的数据格式以匹配ArticleItem接口
          allItems.push({
            id: item.id,
            title: item.title,
            content: item.content || undefined, // 将null转换为undefined
            publishTime: item.publishTime,
            mpId: item.mpId || undefined,
            mpName: item.mpName || undefined,
            mpCover: item.picUrl || undefined, // 使用picUrl作为封面图片
            industry: item.industry || undefined,
            newsType: item.newsType || undefined,
            isProcessed: item.isProcessed || undefined,
          });
        });
      }
    });

    return allItems;
  }, [data]);

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedArticles.length === items.length) {
      onSelectAll([]);
    } else {
      const allArticleIds = items.map(item => item.id);
      onSelectAll(allArticleIds);
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="text-base"></div>
        <div className="text-sm text-muted-foreground"></div>
      </CardHeader>
      <CardBody>
        {isLoading && items.length === 0 ? (
          <Spinner />
        ) : items.length === 0 ? (
          <>
            <div className="text-gray-400 dark:text-gray-500 mb-2"></div>
            <div className="text-sm text-gray-500 dark:text-gray-600"></div>
          </>
        ) : (
          <Table aria-label="文章列表">
            <TableHeader>
              <TableColumn className="w-[50px]">
                <Checkbox
                  isSelected={selectedArticles.length === items.length && items.length > 0}
                  onValueChange={handleSelectAll}
                />
              </TableColumn>
              <TableColumn>标题</TableColumn>
              <TableColumn>发布时间</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      isSelected={selectedArticles.includes(item.id)}
                      onValueChange={() => onArticleSelect(item.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      isBlock
                      color="foreground"
                      target="_blank"
                      href={`https://mp.weixin.qq.com/s/${item.id}`}
                      className="visited:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item.title}
                    </Link>
                    {item.content && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm line-clamp-1">
                        {truncateText(item.content)}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {dayjs(item.publishTime * 1e3).format('YYYY-MM-DD HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {hasNextPage && !isLoading && (
          <div className="flex w-full justify-center py-4">
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ArticleList;
