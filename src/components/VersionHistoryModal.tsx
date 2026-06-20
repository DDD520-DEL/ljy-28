import { useState, useEffect } from 'react';
import {
  X,
  History,
  Clock,
  RotateCcw,
  Eye,
  Package,
  Ruler,
  Layers,
  CheckSquare,
  Truck,
  Award,
  Calendar,
  User,
  CheckCircle,
  Wrench,
} from 'lucide-react';
import { useBoxStore } from '@/store/useBoxStore';
import { CATEGORY_LABELS, COMPLETENESS_LABELS, DIFFICULTY_OPTIONS, DIFFICULTY_LABELS, DIFFICULTY_ICONS } from '@/constants';
import { formatDate, formatDateRelative } from '@/utils';
import { cn } from '@/lib/utils';
import type { RecordVersion, BoxRecord } from '@/types';
import CompareSlider from '@/components/CompareSlider';
import Timeline from '@/components/Timeline';

interface VersionHistoryModalProps {
  open: boolean;
  onClose: () => void;
  recordId: string;
}

export default function VersionHistoryModal({ open, onClose, recordId }: VersionHistoryModalProps) {
  const { getVersionsByRecordId, restoreVersion } = useBoxStore();
  const [versions, setVersions] = useState<RecordVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<RecordVersion | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (open && recordId) {
      const v = getVersionsByRecordId(recordId);
      setVersions(v);
      setSelectedVersion(v.length > 0 ? v[0] : null);
    }
  }, [open, recordId, getVersionsByRecordId]);

  if (!open) return null;

  const handleRestore = async () => {
    if (!selectedVersion) return;
    if (!confirm('确定要恢复到此版本吗？当前版本会被保存为历史版本。')) return;

    setIsRestoring(true);
    const success = restoreVersion(selectedVersion.id);
    setIsRestoring(false);
    if (success) {
      const v = getVersionsByRecordId(recordId);
      setVersions(v);
      setSelectedVersion(v.length > 0 ? v[0] : null);
    }
  };

  const renderPreview = (record: BoxRecord) => (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-kraft-100 text-kraft-700 border border-kraft-200">
          {CATEGORY_LABELS[record.category]}
        </span>
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${DIFFICULTY_OPTIONS.find(d => d.key === record.difficulty)?.bgColor} ${DIFFICULTY_OPTIONS.find(d => d.key === record.difficulty)?.color} ${DIFFICULTY_OPTIONS.find(d => d.key === record.difficulty)?.borderColor}`}>
          <span>{DIFFICULTY_ICONS[record.difficulty]}</span>
          {DIFFICULTY_LABELS[record.difficulty]}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-kraft-100 flex items-center justify-center">
          <User className="w-5 h-5 text-kraft-500" />
        </div>
        <div>
          <p className="font-medium text-kraft-800">{record.authorName}</p>
          <p className="text-xs text-kraft-400">
            创建于 {formatDateRelative(record.createdAt)}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold font-display text-kraft-800 mb-2">
        {record.name}
      </h2>
      <p className="text-kraft-500 leading-relaxed text-sm">{record.description}</p>

      {record.beforeImage && record.afterImage && (
        <section>
          <h3 className="text-sm font-bold font-display text-kraft-800 mb-3 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-forest-500" />
            前后对比
          </h3>
          <CompareSlider
            beforeImage={record.beforeImage}
            afterImage={record.afterImage}
          />
        </section>
      )}

      <section>
        <h3 className="text-sm font-bold font-display text-kraft-800 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-kraft-500" />
          纸箱信息
        </h3>
        <div className="card-paper p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-1.5 rounded-xl bg-kraft-50 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-kraft-500" />
              </div>
              <p className="text-xs text-kraft-400 mb-0.5">尺寸</p>
              <p className="font-semibold text-kraft-700 text-sm">
                {record.boxLength}×{record.boxWidth}×{record.boxHeight}
                <span className="text-xs font-normal ml-0.5">cm</span>
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-1.5 rounded-xl bg-kraft-50 flex items-center justify-center">
                <Layers className="w-5 h-5 text-kraft-500" />
              </div>
              <p className="text-xs text-kraft-400 mb-0.5">层数</p>
              <p className="font-semibold text-kraft-700 text-sm">
                {record.corrugateLayers}层
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-1.5 rounded-xl bg-kraft-50 flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-kraft-500" />
              </div>
              <p className="text-xs text-kraft-400 mb-0.5">完整度</p>
              <p className="font-semibold text-kraft-700 text-sm">
                {COMPLETENESS_LABELS[record.completeness]}
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-1.5 rounded-xl bg-kraft-50 flex items-center justify-center">
                <Truck className="w-5 h-5 text-kraft-500" />
              </div>
              <p className="text-xs text-kraft-400 mb-0.5">快递</p>
              <p className="font-semibold text-kraft-700 text-sm">
                {record.expressSource || '未知'}
              </p>
            </div>
            <div className="text-center">
              <div className={`w-10 h-10 mx-auto mb-1.5 rounded-xl ${DIFFICULTY_OPTIONS.find(d => d.key === record.difficulty)?.bgColor} flex items-center justify-center`}>
                <Award className={`w-5 h-5 ${DIFFICULTY_OPTIONS.find(d => d.key === record.difficulty)?.color}`} />
              </div>
              <p className="text-xs text-kraft-400 mb-0.5">难度</p>
              <p className="font-semibold text-kraft-700 text-sm">
                {DIFFICULTY_LABELS[record.difficulty]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {record.steps.length > 0 && (
        <section>
          <h3 className="text-sm font-bold font-display text-kraft-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-forest-500" />
            改造步骤
          </h3>
          <Timeline
            steps={record.steps.map((step, index) => ({
              id: index,
              content: step,
            }))}
          />
        </section>
      )}

      {record.materials && record.materials.length > 0 && (
        <section>
          <h3 className="text-sm font-bold font-display text-kraft-800 mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-teal-500" />
            所需材料
          </h3>
          <div className="card-paper p-3">
            <div className="space-y-2">
              {record.materials.map((material, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-xl bg-teal-50/60">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-3.5 h-3.5 text-teal-500" />
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

      <section>
        <div className="card-paper p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-kraft-600" />
          </div>
          <div>
            <p className="text-xs text-kraft-500">记录时间</p>
            <p className="font-semibold text-kraft-700 text-sm">
              {formatDate(record.createdAt)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-kraft-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
              <History className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-kraft-800">历史版本</h3>
              <p className="text-sm text-kraft-500">
                共 {versions.length} 个版本，点击时间线查看详情
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-kraft-400 hover:text-kraft-600 hover:bg-kraft-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-72 border-r border-kraft-100 overflow-y-auto flex-shrink-0 bg-kraft-50/30">
            {versions.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-kraft-100 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-kraft-400" />
                </div>
                <p className="text-sm text-kraft-500">暂无历史版本</p>
                <p className="text-xs text-kraft-400 mt-1">编辑并保存记录后将自动保存版本</p>
              </div>
            ) : (
              <div className="p-4">
                <div className="space-y-1">
                  {versions.map((version, index) => (
                    <button
                      key={version.id}
                      onClick={() => setSelectedVersion(version)}
                      className={cn(
                        'w-full text-left rounded-xl p-3 transition-all duration-200',
                        selectedVersion?.id === version.id
                          ? 'bg-amber-50 border-2 border-amber-300 shadow-sm'
                          : 'bg-white border-2 border-transparent hover:bg-kraft-50 hover:border-kraft-200'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative flex flex-col items-center pt-0.5">
                          <div
                            className={cn(
                              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10 flex-shrink-0',
                              selectedVersion?.id === version.id
                                ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
                                : 'bg-gradient-to-br from-kraft-300 to-kraft-400 text-white'
                            )}
                          >
                            {index + 1}
                          </div>
                          {index < versions.length - 1 && (
                            <div className="w-0.5 flex-1 bg-gradient-to-b from-kraft-200 to-kraft-100 min-h-[24px]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Clock className="w-3 h-3 text-kraft-400" />
                            <p className="text-xs text-kraft-500">
                              {formatDateRelative(version.savedAt)}
                            </p>
                          </div>
                          <p className="font-medium text-kraft-800 text-sm truncate">
                            {version.snapshot.name}
                          </p>
                          <p className="text-xs text-kraft-400 mt-0.5">
                            {formatDate(version.savedAt)}
                          </p>
                        </div>
                        {selectedVersion?.id === version.id && (
                          <Eye className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto bg-paper-cream">
            {selectedVersion ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-sm font-medium text-kraft-600">
                      预览 - {formatDate(selectedVersion.savedAt)}
                    </span>
                  </div>
                  <button
                    onClick={handleRestore}
                    disabled={isRestoring}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      isRestoring
                        ? 'bg-kraft-300 text-white cursor-not-allowed'
                        : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm hover:shadow'
                    )}
                  >
                    {isRestoring ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        恢复中...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        恢复到此版本
                      </>
                    )}
                  </button>
                </div>
                {renderPreview(selectedVersion.snapshot)}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-kraft-100 flex items-center justify-center">
                    <Eye className="w-10 h-10 text-kraft-400" />
                  </div>
                  <p className="text-kraft-500">选择左侧时间线中的版本</p>
                  <p className="text-sm text-kraft-400 mt-1">即可预览该版本的完整内容</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
