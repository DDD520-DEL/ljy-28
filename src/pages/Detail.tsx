import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { useBoxStore } from '@/store/useBoxStore';
import { CATEGORY_LABELS, COMPLETENESS_LABELS } from '@/constants';
import CompareSlider from '@/components/CompareSlider';
import Timeline from '@/components/Timeline';
import { formatDate } from '@/utils';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecordById, deleteRecord, init, isLoaded, toggleFavorite, isFavorite } = useBoxStore();

  useEffect(() => {
    if (!isLoaded) {
      init();
    }
  }, [init, isLoaded]);

  const record = id ? getRecordById(id) : undefined;

  useEffect(() => {
    if (isLoaded && id && !record) {
      navigate('/');
    }
  }, [isLoaded, id, record, navigate]);

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
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-kraft-600 hover:text-kraft-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">返回</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => record && toggleFavorite(record.id)}
              className={`p-2 rounded-lg transition-colors ${
                record && isFavorite(record.id)
                  ? 'text-amber-500 hover:bg-amber-50'
                  : 'text-kraft-500 hover:text-amber-500 hover:bg-amber-50'
              }`}
              title={record && isFavorite(record.id) ? '取消收藏' : '收藏'}
            >
              <Star className={`w-5 h-5 ${record && isFavorite(record.id) ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => navigate(`/record/${record.id}`)}
              className="p-2 text-kraft-500 hover:text-kraft-700 hover:bg-kraft-100 rounded-lg transition-colors"
              title="编辑"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-kraft-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="删除"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container py-6 max-w-3xl">
        <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-kraft-100 text-kraft-700 border border-kraft-200 mb-3">
            {CATEGORY_LABELS[record.category]}
          </span>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <button
              onClick={() => navigate(`/record/${record.id}`)}
              className="btn-primary py-2 px-4 text-sm"
            >
              编辑记录
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
