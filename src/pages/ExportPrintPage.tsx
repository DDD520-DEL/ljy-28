import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Printer, Package, Leaf } from 'lucide-react';
import { CATEGORY_LABELS, COMPLETENESS_LABELS, DIFFICULTY_LABELS, DIFFICULTY_ICONS } from '@/constants';
import type { BoxRecord, CategoryType } from '@/types';
import { toast } from '@/components/Toast';

interface ExportData {
  records: BoxRecord[];
  exportedAt: string;
  categories: (CategoryType | 'all')[];
}

const APP_NAME = '纸箱创意日志';
const ECO_SLOGAN = '🌿 每一个纸箱的重生，都是对地球的一份温柔守护';

export default function ExportPrintPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [exportData, setExportData] = useState<ExportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = decodeURIComponent(dataParam);
        const parsed = JSON.parse(decoded) as ExportData;
        setExportData(parsed);
      } catch {
        toast.error('导出数据解析失败，请重试');
        navigate('/settings');
      }
    } else {
      toast.error('未找到导出数据');
      navigate('/settings');
    }
    setIsLoading(false);
  }, [searchParams, navigate]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const groupedRecords = useMemo(() => {
    if (!exportData) return {};
    
    const groups: Record<string, BoxRecord[]> = {};
    exportData.records.forEach(record => {
      const category = record.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(record);
    });
    
    return groups;
  }, [exportData]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !exportData) {
    return (
      <div className="min-h-screen bg-paper-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-kraft-300 border-t-forest-500 rounded-full mx-auto mb-4" />
          <p className="text-kraft-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-cream">
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-page {
            background: white !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 20px !important;
          }
          .record-card {
            page-break-inside: avoid;
            break-inside: avoid;
            border: 1px solid #e5e7eb !important;
          }
          .category-section {
            page-break-before: always;
            break-before: always;
          }
          .category-section:first-of-type {
            page-break-before: auto;
            break-before: auto;
          }
          .print-header {
            position: running(header);
          }
          .print-footer {
            position: running(footer);
          }
          @page {
            margin: 2cm;
            @top-center {
              content: element(header);
            }
            @bottom-center {
              content: element(footer);
            }
          }
        }
      `}</style>

      <div className="no-print sticky top-0 z-40 bg-paper-cream/95 backdrop-blur-sm border-b border-kraft-100">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-kraft-600 bg-kraft-100 rounded-lg hover:bg-kraft-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回设置
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-kraft-500">
              共 {exportData.records.length} 条记录
            </span>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-forest-500 rounded-lg hover:bg-forest-600 transition-colors shadow-md hover:shadow-lg"
            >
              <Printer className="w-4 h-4" />
              打印 / 保存为PDF
            </button>
          </div>
        </div>
      </div>

      <div className="print-page container py-8 max-w-4xl mx-auto">
        <div className="print-header text-center mb-8 pb-6 border-b-2 border-kraft-200">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kraft-400 to-kraft-500 flex items-center justify-center shadow-md">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-display text-kraft-800">{APP_NAME}</h1>
          </div>
          <p className="text-lg text-kraft-600 mb-2">改造记录导出报告</p>
          <div className="flex items-center justify-center gap-4 text-sm text-kraft-500">
            <span>导出时间：{formatDateTime(exportData.exportedAt)}</span>
            <span>•</span>
            <span>记录总数：{exportData.records.length} 条</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-forest-600">
            <Leaf className="w-4 h-4" />
            <span>{ECO_SLOGAN}</span>
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedRecords).map(([category, records]) => (
            <div key={category} className="category-section">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-1.5 rounded-full bg-forest-500" />
                <h2 className="text-xl font-bold text-kraft-800">
                  {CATEGORY_LABELS[category as CategoryType]}
                </h2>
                <span className="px-3 py-1 bg-kraft-100 rounded-full text-sm font-medium text-kraft-600">
                  {records.length} 条
                </span>
              </div>

              <div className="space-y-6">
                {records.map((record, index) => (
                  <div key={record.id} className="record-card bg-white rounded-xl border border-kraft-100 overflow-hidden shadow-sm">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-kraft-800 mb-1">
                            {index + 1}. {record.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-kraft-500">
                            <span className="inline-flex items-center gap-1">
                              <span>{DIFFICULTY_ICONS[record.difficulty]}</span>
                              <span>{DIFFICULTY_LABELS[record.difficulty]}</span>
                            </span>
                            <span>•</span>
                            <span>完整度：{COMPLETENESS_LABELS[record.completeness]}</span>
                            <span>•</span>
                            <span>创建时间：{formatDate(record.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-kraft-700 mb-4 leading-relaxed">
                        {record.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-kraft-600 mb-2">改造前</p>
                          {record.beforeImage ? (
                            <img
                              src={record.beforeImage}
                              alt="改造前"
                              className="w-full h-48 object-cover rounded-lg border border-kraft-100"
                            />
                          ) : (
                            <div className="w-full h-48 bg-kraft-50 rounded-lg border border-dashed border-kraft-200 flex items-center justify-center text-kraft-400">
                              暂无图片
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-kraft-600 mb-2">改造后</p>
                          {record.afterImage ? (
                            <img
                              src={record.afterImage}
                              alt="改造后"
                              className="w-full h-48 object-cover rounded-lg border border-kraft-100"
                            />
                          ) : (
                            <div className="w-full h-48 bg-kraft-50 rounded-lg border border-dashed border-kraft-200 flex items-center justify-center text-kraft-400">
                              暂无图片
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-kraft-50 rounded-lg">
                        <div>
                          <p className="text-xs text-kraft-500 mb-1">纸箱尺寸</p>
                          <p className="font-medium text-kraft-800">
                            {record.boxLength} × {record.boxWidth} × {record.boxHeight} cm
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-kraft-500 mb-1">瓦楞层数</p>
                          <p className="font-medium text-kraft-800">{record.corrugateLayers} 层</p>
                        </div>
                        <div>
                          <p className="text-xs text-kraft-500 mb-1">快递来源</p>
                          <p className="font-medium text-kraft-800">{record.expressSource || '未记录'}</p>
                        </div>
                      </div>

                      {record.materials && record.materials.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-kraft-700 mb-2">所需材料</p>
                          <div className="flex flex-wrap gap-2">
                            {record.materials.map((material, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-forest-50 text-forest-700 rounded-full text-sm"
                              >
                                {material.name}
                                <span className="text-forest-500">
                                  {material.quantity}{material.unit}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium text-kraft-700 mb-3">制作步骤</p>
                        <div className="space-y-3">
                          {record.steps.filter(s => s.trim()).map((step, idx) => (
                            <div key={idx} className="flex gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-forest-500 text-white text-sm font-medium flex items-center justify-center">
                                {idx + 1}
                              </div>
                              <p className="text-kraft-700 leading-relaxed pt-0.5">
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="print-footer text-center mt-12 pt-6 border-t border-kraft-200 text-sm text-kraft-500">
          <p>由 {APP_NAME} 生成 | {formatDateTime(exportData.exportedAt)}</p>
          <p className="mt-1">{ECO_SLOGAN}</p>
        </div>
      </div>
    </div>
  );
}
