import { 
  Button, 
  Divider, 
  Listbox, 
  ListboxItem, 
  ListboxSection, 
  Modal, 
  ModalBody, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  Switch, 
  Textarea, 
  Tooltip, 
  useDisclosure, 
  Link, 
  Avatar
} from '@nextui-org/react';
import { PlusIcon } from '@web/components/PlusIcon';
import { trpc } from '@web/utils/trpc';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import ArticleList from './list';

const Feeds = () => {
  const { id } = useParams();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { refetch: refetchFeedList, data: feedData } = trpc.feed.list.useQuery(
    {},
    {
      refetchOnWindowFocus: true,
    },
  );

  const navigate = useNavigate();

  const queryUtils = trpc.useUtils();

  const { mutateAsync: getMpInfo, isLoading: isGetMpInfoLoading } = trpc.platform.getMpInfo.useMutation({});
  const { mutateAsync: updateMpInfo } = trpc.feed.edit.useMutation({});

  const { mutateAsync: addFeed, isLoading: isAddFeedLoading } = trpc.feed.add.useMutation({});
  const { mutateAsync: refreshMpArticles, isLoading: isGetArticlesLoading } = trpc.feed.refreshArticles.useMutation();
  const { mutateAsync: getHistoryArticles, isLoading: isGetHistoryArticlesLoading } = trpc.feed.getHistoryArticles.useMutation();

  const { data: inProgressHistoryMp, refetch: refetchInProgressHistoryMp } = trpc.feed.getInProgressHistoryMp.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchInterval: 10 * 1e3,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const { data: isRefreshAllMpArticlesRunning } = trpc.feed.isRefreshAllMpArticlesRunning.useQuery();

  const { mutateAsync: deleteFeed, isLoading: isDeleteFeedLoading } = trpc.feed.delete.useMutation({});
  const { mutateAsync: batchProcessArticles, isLoading: isBatchProcessing } = trpc.analysis.batchProcessArticles.useMutation({});

  const [wxsLink, setWxsLink] = useState('');
  const [currentMpId, setCurrentMpId] = useState(id || '');
  
  // 文章选择和分析相关状态
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing'>('idle');


  const handleConfirm = async () => {
    console.log('wxsLink', wxsLink);
    // TODO show operation in progress
    const wxsLinks = wxsLink.split('\n').filter((link) => link.trim() !== '');
    for (const link of wxsLinks) {
      console.log('add wxsLink', link);
      const res = await getMpInfo({ wxsLink: link });
      if (res[0]) {
        const item = res[0];
        await addFeed({
          id: item.id,
          mpName: item.name,
          mpCover: item.cover,
          mpIntro: item.intro,
          updateTime: item.updateTime,
          status: 1,
        });
        await refreshMpArticles({ mpId: item.id });
        toast.success('添加成功', {
          description: `公众号 ${item.name}`,
        });
        await queryUtils.article.list.reset();
      } else {
        toast.error('添加失败', { description: '请检查链接是否正确' });
      }
    }
    refetchFeedList();
    setWxsLink('');
    onClose();
  };

  const isActive = (key: string) => {
    return currentMpId === key;
  };

  const currentMpInfo = useMemo(() => {
    return feedData?.items.find((item) => item.id === currentMpId);
  }, [currentMpId, feedData?.items]);

  const handleExportOpml = async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!feedData?.items?.length) {
      console.warn('没有订阅源');
      return;
    }

    let opmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <opml version="2.0">
      <head>
        <title>WeWeRSS 所有订阅源</title>
      </head>
      <body>
    `;

    feedData?.items.forEach((sub) => {
      opmlContent += `    <outline text="${sub.mpName}" type="rss" xmlUrl="${window.location.origin}/feeds/${sub.id}.atom" htmlUrl="${window.location.origin}/feeds/${sub.id}.atom"/>
`;
    });

    opmlContent += `    </body>
    </opml>`;

    const blob = new Blob([opmlContent], { type: 'text/xml;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'WeWeRSS-All.opml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 全选/取消全选
  const handleSelectAll = (articleIds: string[]) => {
    if (selectedArticles.length === articleIds.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articleIds);
    }
  };

  // 选择单个文章
  const handleSelectArticle = (articleId: string) => {
    if (selectedArticles.includes(articleId)) {
      setSelectedArticles(selectedArticles.filter(id => id !== articleId));
    } else {
      setSelectedArticles([...selectedArticles, articleId]);
    }
  };

  // 分析选中的文章
  const handleAnalyzeSelected = async () => {
    if (selectedArticles.length === 0) {
      toast.error('请至少选择一篇文章');
      return;
    }

    setProcessingStatus('processing');
    try {
      const result = await batchProcessArticles({
        articleIds: selectedArticles
      });
      
      // 显示成功消息
      toast.success('已提交分析任务', {
        description: `任务ID: ${result.taskId}`
      });
      
      // 清空选择
      setSelectedArticles([]);
      setProcessingStatus('idle');
      
      // 刷新文章列表
      await queryUtils.article.list.reset();
    } catch (error) {
      console.error('分析选中文章失败:', error);
      setProcessingStatus('idle');
      toast.error('分析失败', {
        description: '请重试'
      });
    }
  };

  return (
    <>
<div className="h-full flex flex-col md:flex-row bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="pb-4 flex justify-between items-center">
            <Button
              color="primary"
              size="sm"
              onPress={onOpen}
              endContent={<PlusIcon />}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              添加
            </Button>
            <div className="font-normal text-sm text-gray-600 dark:text-gray-400">
              共{feedData?.items.length || 0}个订阅
            </div>
          </div>

          {feedData?.items ? (
            <Listbox
              aria-label="订阅源"
              emptyContent="暂无订阅"
              onAction={(key) => setCurrentMpId(key as string)}
              className="bg-transparent flex-1"
            >
              <ListboxSection showDivider className="mb-2">
                <ListboxItem
                  key={''}
                  onClick={() => {setCurrentMpId(''); navigate('/feeds');}}
                  className={`py-3 px-2 rounded-lg ${isActive('') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  startContent={
                    <Avatar name="ALL" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-6 h-6 min-w-6 min-h-6" size="sm" />
                  }
                >
                  <span className="font-medium ml-2">全部</span>
                </ListboxItem>
              </ListboxSection>

              <ListboxSection className="overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                {feedData?.items.map((item) => {
                  return (
                    <ListboxItem
                      onClick={() => {setCurrentMpId(item.id); navigate(`/feeds/${item.id}`);}}
                      className={`py-3 px-2 rounded-lg mb-1 ${isActive(item.id) ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                      key={item.id}
                      startContent={<Avatar src={item.mpCover} className="flex-shrink-0 w-6 h-6 min-w-6 min-h-6" size="sm" />}
                    >
                      <span className="font-medium truncate ml-2">{item.mpName}</span>
                    </ListboxItem>
                  );
                }) || []}
              </ListboxSection>
            </Listbox>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              暂无订阅源
            </div>
          )}
        </div>
        <div className="flex-1 h-full flex flex-col">
          <div className="p-4 pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white truncate">
              {currentMpInfo?.mpName || '全部'}
            </h3>
            {currentMpInfo ? (
              <div className="flex flex-wrap gap-2 items-center text-sm">
                <div className="text-gray-500 dark:text-gray-400">
                  最后更新: {dayjs(currentMpInfo.syncTime * 1e3).format('YYYY-MM-DD HH:mm')}
                </div>
                <Divider orientation="vertical" className="h-4" />
                <Tooltip
                  content="频繁调用可能会导致一段时间内不可用"
                  color="danger"
                >
                  <Link
                    size="sm"
                    href="#"
                    isDisabled={isGetArticlesLoading}
                    onClick={async (ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      await refreshMpArticles({ mpId: currentMpInfo.id });
                      await refetchFeedList();
                      await queryUtils.article.list.reset();
                    }}
                    className="text-blue-600 dark:text-blue-400"
                  >
                    {isGetArticlesLoading ? '更新中...' : '立即更新'}
                  </Link>
                </Tooltip>
                <Divider orientation="vertical" className="h-4" />
                {currentMpInfo.hasHistory === 1 && (
                  <>
                    <Tooltip
                      content={
                        inProgressHistoryMp?.id === currentMpInfo.id
                          ? `正在获取第${inProgressHistoryMp.page}页...`
                          : `历史文章需要分批次拉取，请耐心等候，频繁调用可能会导致一段时间内不可用`
                      }
                      color={
                        inProgressHistoryMp?.id === currentMpInfo.id
                          ? 'primary'
                          : 'danger'
                      }
                    >
                      <Link
                        size="sm"
                        href="#"
                        isDisabled={
                          (inProgressHistoryMp?.id
                            ? inProgressHistoryMp?.id !== currentMpInfo.id
                            : false) ||
                          isGetHistoryArticlesLoading ||
                          isGetArticlesLoading
                        }
                        onClick={async (ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();

                          if (inProgressHistoryMp?.id === currentMpInfo.id) {
                            await getHistoryArticles({
                              mpId: '',
                            });
                          } else {
                            await getHistoryArticles({
                              mpId: currentMpInfo.id,
                            });
                          }

                          await refetchInProgressHistoryMp();
                        }}
                        className="text-blue-600 dark:text-blue-400"
                      >
                        {inProgressHistoryMp?.id === currentMpInfo.id
                          ? `停止获取历史文章`
                          : `获取历史文章`}
                      </Link>
                    </Tooltip>
                    <Divider orientation="vertical" className="h-4" />
                  </>
                )}

                <Tooltip content="启用服务端定时更新">
                  <div>
                    <Switch
                      size="sm"
                      onValueChange={async (value) => {
                        await updateMpInfo({
                          id: currentMpInfo.id,
                          data: {
                            status: value ? 1 : 0,
                          },
                        });

                        await refetchFeedList();
                      }}
                      isSelected={currentMpInfo?.status === 1}
                    ></Switch>
                  </div>
                </Tooltip>
                <Divider orientation="vertical" className="h-4" />
                <Tooltip content="仅删除订阅源，已获取的文章不会被删除">
                  <Link
                    href="#"
                    color="danger"
                    size="sm"
                    isDisabled={isDeleteFeedLoading}
                    onClick={async (ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();

                      if (window.confirm('确定删除吗？')) {
                        await deleteFeed(currentMpInfo.id);
                        navigate('/feeds');
                        await refetchFeedList();
                      }
                    }}
                  >
                    删除
                  </Link>
                </Tooltip>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 items-center w-full">
                <div className="flex gap-2 items-center">
                  <Tooltip
                    content="频繁调用可能会导致一段时间内不可用"
                    color="danger"
                  >
                    <Link
                      size="sm"
                      href="#"
                      isDisabled={
                        isRefreshAllMpArticlesRunning || isGetArticlesLoading
                      }
                      onClick={async (ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        await refreshMpArticles({});
                        await refetchFeedList();
                        await queryUtils.article.list.reset();
                      }}
                      className="text-blue-600 dark:text-blue-400"
                    >
                      {isRefreshAllMpArticlesRunning || isGetArticlesLoading
                        ? '更新中...'
                        : '更新全部'}
                    </Link>
                  </Tooltip>
                  <Link
                    href="#"
                    color="foreground"
                    onClick={handleExportOpml}
                    size="sm"
                    className="text-blue-600 dark:text-blue-400"
                  >
                    导出OPML
                  </Link>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    已选: {selectedArticles.length}
                  </span>
                  <Button
                    color="success"
                    variant="solid"
                    onClick={handleAnalyzeSelected}
                    isDisabled={selectedArticles.length === 0 || processingStatus === 'processing'}
                    isLoading={isBatchProcessing || processingStatus === 'processing'}
                    size="sm"
                    className="font-medium"
                  >
                    分析新闻
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="p-2 md:p-4 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-900/20">
            <ArticleList 
              selectedArticles={selectedArticles}
              onArticleSelect={handleSelectArticle}
              onSelectAll={handleSelectAll}
            />
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="rounded-2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-2xl">
            添加公众号源
          </ModalHeader>
          <ModalBody className="py-6">
            <Textarea
              value={wxsLink}
              onValueChange={setWxsLink}
              autoFocus
              label="分享链接"
              placeholder="输入公众号文章分享链接，一行一条，如 https://mp.weixin.qq.com/s/xxxxxx https://mp.weixin.qq.com/s/xxxxxx"
              variant="bordered"
              minRows={4}
              className="dark:text-white"
            />
          </ModalBody>
          <ModalFooter className="pt-0">
            <Button color="danger" variant="flat" onClick={onClose}>
              取消
            </Button>
            <Button
              color="primary"
              isDisabled={
                !wxsLink.startsWith('https://mp.weixin.qq.com/s/')
              }
              onClick={handleConfirm}
              isLoading={
                isAddFeedLoading ||
                isGetMpInfoLoading ||
                isGetArticlesLoading
              }
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              确定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Feeds;
