import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Package, Ruler, Layers, CheckCircle, Wrench } from 'lucide-react';
import { useBoxStore } from '@/store/useBoxStore';
import { CATEGORIES, COMPLETENESS_OPTIONS, CORRUGATE_LAYERS } from '@/constants';
import ImageUploader from '@/components/ImageUploader';
import { toast } from '@/components/Toast';
import type { CategoryType, CompletenessType, BoxRecord, MaterialItem } from '@/types';
import { cn } from '@/lib/utils';

export default function Record() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addRecord, updateRecord, getRecordById, init, isLoaded } = useBoxStore();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: 'storage' as CategoryType,
    description: '',
    beforeImage: '',
    afterImage: '',
    boxLength: 30,
    boxWidth: 20,
    boxHeight: 15,
    corrugateLayers: 5,
    completeness: 'good' as CompletenessType,
    expressSource: '',
    steps: [''] as string[],
    materials: [] as MaterialItem[],
  });

  useEffect(() => {
    if (!isLoaded) {
      init();
    }
  }, [init, isLoaded]);

  useEffect(() => {
    if (isEdit && id && isLoaded) {
      const record = getRecordById(id);
      if (record) {
        setFormData({
          name: record.name,
          category: record.category,
          description: record.description,
          beforeImage: record.beforeImage,
          afterImage: record.afterImage,
          boxLength: record.boxLength,
          boxWidth: record.boxWidth,
          boxHeight: record.boxHeight,
          corrugateLayers: record.corrugateLayers,
          completeness: record.completeness,
          expressSource: record.expressSource,
          steps: record.steps.length > 0 ? record.steps : [''],
          materials: record.materials || [],
        });
      } else {
        navigate('/');
      }
    }
  }, [isEdit, id, isLoaded, getRecordById, navigate]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    setFormData((prev) => ({ ...prev, steps: [...prev.steps, ''] }));
  };

  const removeStep = (index: number) => {
    if (formData.steps.length <= 1) return;
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const addMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, { name: '', quantity: 1, unit: '' }],
    }));
  };

  const removeMaterial = (index: number) => {
    const newMaterials = formData.materials.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, materials: newMaterials }));
  };

  const handleMaterialChange = (index: number, field: keyof MaterialItem, value: string | number) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    setFormData((prev) => ({ ...prev, materials: newMaterials }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.warning('请输入改造项目名称');
      return;
    }

    const validSteps = formData.steps.filter((s) => s.trim() !== '');
    const validMaterials = formData.materials.filter((m) => m.name.trim() !== '');

    const recordData = {
      ...formData,
      steps: validSteps,
      materials: validMaterials,
    };

    let success = false;
    if (isEdit && id) {
      success = updateRecord(id, recordData);
    } else {
      success = addRecord(recordData);
    }

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-paper-cream pb-24">
      <header className="sticky top-0 z-20 bg-paper-cream/80 backdrop-blur-md border-b border-kraft-100">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-kraft-600 hover:text-kraft-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">返回</span>
          </button>
          <h1 className="text-lg font-bold font-display text-kraft-800">
            {isEdit ? '编辑改造记录' : '新建改造记录'}
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="card-paper p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-kraft-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-kraft-600" />
              </div>
              <h2 className="text-lg font-bold font-display text-kraft-800">
                纸箱信息
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="label-text">
                  <Ruler className="w-3.5 h-3.5 inline mr-1" />
                  长度 (cm)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.boxLength}
                  onChange={(e) => handleInputChange('boxLength', Number(e.target.value))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-text">宽度 (cm)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.boxWidth}
                  onChange={(e) => handleInputChange('boxWidth', Number(e.target.value))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-text">高度 (cm)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.boxHeight}
                  onChange={(e) => handleInputChange('boxHeight', Number(e.target.value))}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label-text">
                  <Layers className="w-3.5 h-3.5 inline mr-1" />
                  瓦楞层数
                </label>
                <div className="flex gap-2">
                  {CORRUGATE_LAYERS.map((layers) => (
                    <button
                      key={layers}
                      type="button"
                      onClick={() => handleInputChange('corrugateLayers', layers)}
                      className={cn(
                        'flex-1 py-3 rounded-xl font-medium text-sm transition-all',
                        formData.corrugateLayers === layers
                          ? 'bg-kraft-400 text-white shadow-paper'
                          : 'bg-kraft-50 text-kraft-600 border border-kraft-200 hover:bg-kraft-100'
                      )}
                    >
                      {layers}层
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-text">快递来源</label>
                <input
                  type="text"
                  placeholder="如：顺丰、京东、菜鸟..."
                  value={formData.expressSource}
                  onChange={(e) => handleInputChange('expressSource', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label-text">纸箱完整度</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {COMPLETENESS_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleInputChange('completeness', opt.key)}
                    className={cn(
                      'p-3 rounded-xl text-left transition-all',
                      formData.completeness === opt.key
                        ? 'bg-kraft-400 text-white shadow-paper'
                        : 'bg-kraft-50 text-kraft-700 border border-kraft-200 hover:bg-kraft-100'
                    )}
                  >
                    <p className="font-medium text-sm mb-0.5">{opt.label}</p>
                    <p
                      className={cn(
                        'text-xs',
                        formData.completeness === opt.key
                          ? 'text-white/80'
                          : 'text-kraft-400'
                      )}
                    >
                      {opt.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="card-paper p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-forest-600" />
              </div>
              <h2 className="text-lg font-bold font-display text-kraft-800">
                改造方案
              </h2>
            </div>

            <div className="mb-4">
              <label className="label-text">改造类型</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {CATEGORIES.filter((c) => c.key !== 'all').map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => handleInputChange('category', cat.key as CategoryType)}
                    className={cn(
                      'p-3 rounded-xl text-center transition-all',
                      formData.category === cat.key
                        ? 'bg-kraft-400 text-white shadow-paper'
                        : 'bg-kraft-50 text-kraft-700 border border-kraft-200 hover:bg-kraft-100'
                    )}
                  >
                    <p className="font-medium text-sm">{cat.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="label-text">项目名称</label>
              <input
                type="text"
                placeholder="给你的改造作品起个名字吧"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input-field"
              />
            </div>

            <div className="mb-4">
              <label className="label-text">改造描述</label>
              <textarea
                rows={3}
                placeholder="描述一下你的改造思路、创意亮点..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="input-field resize-none"
              />
            </div>
          </section>

          <section className="card-paper p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-bold font-display text-kraft-800">
                  改造步骤
                </h2>
              </div>
              <button
                type="button"
                onClick={addStep}
                className="text-sm text-kraft-500 hover:text-kraft-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                添加步骤
              </button>
            </div>

            <div className="space-y-3">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-kraft-300 to-kraft-400 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-paper">
                    {index + 1}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <textarea
                      rows={2}
                      placeholder={`第 ${index + 1} 步...`}
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      className="input-field resize-none flex-1"
                    />
                    {formData.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="p-2 text-kraft-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card-paper p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-teal-600" />
                </div>
                <h2 className="text-lg font-bold font-display text-kraft-800">
                  所需材料
                </h2>
              </div>
              <button
                type="button"
                onClick={addMaterial}
                className="text-sm text-kraft-500 hover:text-kraft-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                添加材料
              </button>
            </div>

            {formData.materials.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-kraft-400 text-sm mb-3">暂未添加材料</p>
                <button
                  type="button"
                  onClick={addMaterial}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-50 text-teal-600 rounded-xl text-sm font-medium hover:bg-teal-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  添加第一项材料
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-300 to-teal-400 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-paper">
                      {index + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="材料名称"
                        value={material.name}
                        onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
                        className="input-field"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="数量"
                        value={material.quantity}
                        onChange={(e) => handleMaterialChange(index, 'quantity', Number(e.target.value))}
                        className="input-field"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="单位"
                          value={material.unit}
                          onChange={(e) => handleMaterialChange(index, 'unit', e.target.value)}
                          className="input-field flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeMaterial(index)}
                          className="p-2 text-kraft-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card-paper p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-bold font-display text-kraft-800">
                前后对比图
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploader
                label="改造前"
                value={formData.beforeImage}
                onChange={(v) => handleInputChange('beforeImage', v)}
                placeholder="上传改造前的纸箱照片"
              />
              <ImageUploader
                label="改造后"
                value={formData.afterImage}
                onChange={(v) => handleInputChange('afterImage', v)}
                placeholder="上传改造后的作品照片"
              />
            </div>
          </section>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-paper-white border-t border-kraft-100 p-4 z-20">
        <div className="container max-w-3xl flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary flex-1"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            保存记录
          </button>
        </div>
      </div>
    </div>
  );
}
