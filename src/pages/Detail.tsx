import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Ruler,
  Layers,
  Package,
  Truck,
  CheckSquare,
  Calendar,
  Star,
  Wrench,
  Award,
  Share2,
  Heart,
  User,
} from 'lucide-react';
import { useBoxStore } from '@/store/useBoxStore';
import { CATEGORY_LABELS, COMPLETENESS_LABELS, DIFFICULTY_OPTIONS, DIFFICULTY_LABELS, DIFFICULTY_ICONS } from '@/constants';
import CompareSlider from '@/components/CompareSlider';
import Timeline from '@/components/Timeline';
import { formatDate, formatDateRelative } from '@/utils';
import { cn } from '@/lib/utils';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromCommunity = searchParams.get('from') === 'community';
  const { records, likedRecords, deleteRecord, init, isLoaded, toggleFavorite, favorites, togglePublish, toggleLike, currentUserId } = useBoxStore();

  useEffect(() => {
    if (!isLoaded) {
      init();
    }
  }, [init, isLoaded]);

  const record = id ? records.find(r => r.id === id) : undefined;
  const isOwner = record && record.authorId === currentUserId;
  const liked = record ? likedRecords.includes(record.id) : false;
  const isFavorited = record ? favorites.includes(record.id) : false;
  const isPublished = !!record?.isPublished;

  useEffect(() => {
    if (isLoaded && id && !record) {
      navigate(fromCommunity ? '/discover' : '/');
    }
  }, [isLoaded, id, record, navigate, fromCommunity]);

  const handleBack = () => {
    if (fromCommunity) {
      navigate('/discover');
    } else {
      navigate(-1);
    }
  };

  const handlePublishToggle = () => {
    if (!record) return;
    togglePublish(record.id);
  };

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-kraft-500">加载中...</p>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('确定要删除这条改造记录吗？')) {
      deleteRecord(record.id);
      navigate('/');
    }
  };

  const timelineSteps = record.steps.map((step, index) => ({
    id: index,
    content: step,
  }));

  return (
    <div className="min-h-screen bg-paper-cream pb-16">
      <header className="sticky top-0 z-20 bg-paper-cream/80 backdrop-blur-md border-b border-kraft-100">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-kraft-600 hover:text-kraft-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">返回</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => record && toggleLike(record.id)}
              className={cn(
                'p-2 rounded-lg transition-colors flex items-center gap-1.5',
                liked
                  ? 'text-rose-500 bg-rose-50'
                  : 'text-kraft-500 hover:text-rose-500 hover:bg-rose-50'
              )}
              title={liked ? '取消点赞' : '点赞'}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{record.likes}</span>
            </button>
            <button
              onClick={() => record && toggleFavorite(record.id)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorited
                  ? 'text-amber-500 hover:bg-amber-50'
                  : 'text-kraft-500 hover:text-amber-500 hover:bg-amber-50'
              }`}
              title={isFavorited ? '取消收藏' : '收藏'}
            >
              <Star className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            {isOwner && (
              <button
                onClick={() => navigate(`/record/${record.id}`)}
                className="p-2 text-kraft-500 hover:text-kraft-700 hover:bg-kraft-100 rounded-lg transition-colors"
                title="编辑"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            {isOwner && (
              <button
                onClick={handleDelete}
                className="p-2 text-kraft-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="删除"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-6 max-w-3xl">
        <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-kraft-100 text-kraft-700 border border-kraft-200">
              {CATEGORY_LABELS[record.category]}
            </span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${DIFFICULTY_OPTIONS.find(d => d.key === record.difficulty)?.bgColor} ${DIFFICULTY_OPTIONS.find(d => d.key === record.difficulty)?.color} ${DIFFICULTY_OPTIONS.find(d => d.key === record.difficulty)?.borderColor}`}>
              <span>{DIFFICULTY_ICONS[record.difficulty]}</span>
              {DIFFICULTY_LABELS[record.difficulty]}
            </span>
            {record.isPublished && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-forest-50 text-forest-700 border border-forest-200">
                <Share2 className="w-3.5 h-3.5" />
                已发布
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-kraft-100 flex items-center justify-center">
              <User className="w-5 h-5 text-kraft-500" />
            </div>
            <div>
              <p className="font-medium text-kraft-800">{record.authorName}</p>
              <p className="text-xs text-kraft-400">
                {record.publishedAt ? `发布于 ${formatDateRelative(record.publishedAt)}` : `创建于 ${formatDateRelative(record.createdAt)}`}
              </p>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-kraft-800 mb-2">
            {record.name}
          </h1>
          <p className="text-kraft-500 leading-relaxed">{record.description}</p>
        </div>

        <section className="mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-bold font-display text-kraft-800 mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-forest-500" />
            前后对比
          </h2>
          {record.beforeImage && record.afterImage ? (
            <CompareSlider
              beforeImage={record.beforeImage}
              afterImage={record.afterImage}
            />
          ) : (
            <div className="card-paper p-12 text-center">
              <p className="text-kraft-400">暂无对比图片</p>
            </div>
          )}
        </section>

        <section className="mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-bold font-display text-kraft-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-kraft-500" />
            纸箱信息
          </h2>
          <div className="card-paper p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-kraft-50 flex items-center justify-center">
                  <Ruler className="w-6 h-6 text-kraft-500" />
                </div>
                <p className="text-xs text-kraft-400 mb-1">尺寸</p>
                <p className="font-semibold text-kraft-700">
                  {record.boxLength}×{record.boxWidth}×{record.boxHeight}
                  <span className="text-xs font-normal ml-0.5">cm</span>
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-kraft-50 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-kraft-500" />
                </div>
                <p className="text-xs text-kraft-400 mb-1">瓦楞层数</p>
                <p className="font-semibold text-kraft-700">
                  {record.corrugateLayers}层
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-kraft-50 flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-kraft-500" />
                </div>
                <p className="text-xs text-kraft-400 mb-1">完整度</p>
                <p className="font-semibold text-kraft-700">
                  {COMPLETENESS_LABELS[record.completeness]}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-kraft-50 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-kraft-500" />
                </div>
                <p className="text-xs text-kraft-400 mb-1">快递来源</p>
                <p className="font-semibold text-kraft-700">
                  {record.expressSource || '未知'}
                </p>
              </div>
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-xl ${DIFFICULTY_OPTIONS.find(d => d.key === record.difficulty)?.bgColor} flex items-center justify-center`}>
                  <Award className={`w-6 h-6 ${DIFFICULTY_OPTIONS.find(d => d.key === record.difficulty)?.color}`} />
                </div>
                <p className="text-xs text-kraft-400 mb-1">改造难度</p>
                <p className="font-semibold text-kraft-700">
                  {DIFFICULTY_ICONS[record.difficulty]} {DIFFICULTY_LABELS[record.difficulty]}
                </p>
              </div>
            </div>
          </div>
        </section>

        {record.steps.length > 0 && (
          <section className="mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-lg font-bold font-display text-kraft-800 mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-forest-500" />
              改造步骤
            </h2>
            <Timeline steps={timelineSteps} />
          </section>
        )}

        {record.materials && record.materials.length > 0 && (
          <section className="mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            <h2 className="text-lg font-bold font-display text-kraft-800 mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-teal-500" />
              所需材料
            </h2>
            <div className="card-paper p-4">
              <div className="space-y-2.5">
                {record.materials.map((material, index) => (
                  <div key={index} className="flex items-center gap-3 p-2.5 rounded-xl bg-teal-50/60">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-4 h-4 text-teal-500" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-kraft-700">{material.name}</span>
                    <span className="text-sm text-kraft-500">
                      {material.quantity}
                      <span className="ml-0.5 text-xs text-kraft-400">{material.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {isOwner && (
          <section className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.48s' }}>
            <div className="card-paper p-5 border-2 border-dashed border-forest-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-forest-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-kraft-800 flex items-center gap-2">
                      发布到社区广场
                      {isPublished && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-forest-100 text-forest-700">
                          已开启
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-kraft-500 mt-0.5">
                      {isPublished
                        ? '你的创意正在社区广场展示，其他用户可以浏览和点赞'
                        : '开启后，这条改造记录将对所有用户可见'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handlePublishToggle}
                  className={cn(
                    'relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2',
                    isPublished ? 'bg-forest-500' : 'bg-kraft-200'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200',
                      isPublished ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="card-kraft p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-kraft-600" />
              </div>
              <div>
                <p className="text-sm text-kraft-500">记录时间</p>
                <p className="font-semibold text-kraft-700">
                  {formatDate(record.createdAt)}
                </p>
              </div>
            </div>
            {isOwner && (
              <button
                onClick={() => navigate(`/record/${record.id}`)}
                className="btn-primary py-2 px-4 text-sm"
              >
                编辑记录
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
