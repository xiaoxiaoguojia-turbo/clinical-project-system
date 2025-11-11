import React, { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { TransformRequirement, TransformRequirementTypeEnum, TransformRequirementProgressNodesMap } from '@/types'

/* ------------------------------------------------------------------------------------------ */

interface TransformRequirementsFormProps {
  value: TransformRequirement[]
  onChange: (requirements: TransformRequirement[]) => void
  errors?: string[]
  disabled?: boolean
}

/* ------------------------------------------------------------------------------------------ */

export default function TransformRequirementsForm({
  value,
  onChange,
  errors = [],
  disabled = false
}: TransformRequirementsFormProps) {
  
  /* ------------------------------------------------------------------------------------------ */
  // 状态管理
  
  const [localRequirements, setLocalRequirements] = useState<TransformRequirement[]>(value)

  /* ------------------------------------------------------------------------------------------ */
  // 副作用

  useEffect(() => {
    setLocalRequirements(value)
  }, [value])

  /* ------------------------------------------------------------------------------------------ */
  // 事件处理函数

  const handleAddRequirement = () => {
    const newRequirement: TransformRequirement = {
      type: 'pending',
      currentProgress: ''
    }
    const updated = [...localRequirements, newRequirement]
    setLocalRequirements(updated)
    onChange(updated)
  }

  const handleRemoveRequirement = (index: number) => {
    const updated = localRequirements.filter((_, i) => i !== index)
    setLocalRequirements(updated)
    onChange(updated)
  }

  const handleTypeChange = (index: number, type: string) => {
    const updated = [...localRequirements]
    updated[index] = {
      type: type as TransformRequirement['type'],
      currentProgress: '' // 重置进展节点
    }
    setLocalRequirements(updated)
    onChange(updated)
  }

  const handleProgressChange = (index: number, progress: string) => {
    const updated = [...localRequirements]
    updated[index] = {
      ...updated[index],
      currentProgress: progress
    }
    setLocalRequirements(updated)
    onChange(updated)
  }

  /* ------------------------------------------------------------------------------------------ */
  // 数据定义

  const typeOptions = [
    { value: TransformRequirementTypeEnum.INVESTMENT, label: '投资' },
    { value: TransformRequirementTypeEnum.COMPANY_OPERATION, label: '公司化运营' },
    { value: TransformRequirementTypeEnum.LICENSE_TRANSFER, label: '许可转让' },
    { value: TransformRequirementTypeEnum.PENDING, label: '待推进' }
  ]

  const getProgressOptions = (type: string) => {
    const nodes = TransformRequirementProgressNodesMap[type as keyof typeof TransformRequirementProgressNodesMap] || []
    return Array.from(nodes)
  }

  /* ------------------------------------------------------------------------------------------ */
  // JSX 界面

  return (
    <div className="transform-requirements-container">
      <div className="requirements-header">
        <label className="label">
          转化需求列表 <span className="required">*</span>
        </label>
        <button
          type="button"
          onClick={handleAddRequirement}
          disabled={disabled}
          className="add-button"
        >
          <PlusIcon className="w-4 h-4" />
          添加转化需求
        </button>
      </div>

      {/* 错误提示 */}
      {errors.length > 0 && (
        <div className="error-messages">
          <ExclamationCircleIcon className="w-5 h-5" />
          <div className="error-list">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        </div>
      )}

      {/* 转化需求列表 */}
      <div className="requirements-list">
        {localRequirements.length === 0 ? (
          <div className="empty-state">
            <p>暂无转化需求，请点击"添加转化需求"按钮</p>
          </div>
        ) : (
          localRequirements.map((requirement, index) => (
            <div key={index} className="requirement-item">
              <div className="requirement-number">#{index + 1}</div>
              
              <div className="requirement-fields">
                {/* 转化需求类型 */}
                <div className="field-group">
                  <label className="field-label">类型</label>
                  <select
                    value={requirement.type}
                    onChange={(e) => handleTypeChange(index, e.target.value)}
                    disabled={disabled}
                    className="field-select"
                  >
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 当前进展节点 */}
                <div className="field-group">
                  <label className="field-label">当前进展</label>
                  {requirement.type === 'pending' ? (
                    <input
                      type="text"
                      value="待推进"
                      disabled
                      className="field-input disabled"
                    />
                  ) : (
                    <select
                      value={requirement.currentProgress}
                      onChange={(e) => handleProgressChange(index, e.target.value)}
                      disabled={disabled}
                      className="field-select"
                    >
                      <option value="">请选择进展节点</option>
                      {getProgressOptions(requirement.type).map(node => (
                        <option key={node} value={node}>
                          {node}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* 删除按钮 */}
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                disabled={disabled || localRequirements.length === 1}
                className="delete-button"
                title={localRequirements.length === 1 ? '至少需要保留一个转化需求' : '删除此转化需求'}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .transform-requirements-container {
          width: 100%;
        }

        .requirements-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .required {
          color: #ef4444;
          margin-left: 2px;
        }

        .add-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .add-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .add-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .error-messages {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          margin-bottom: 16px;
          color: #991b1b;
        }

        .error-list {
          flex: 1;
        }

        .error-list p {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
        }

        .error-list p + p {
          margin-top: 4px;
        }

        .requirements-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .empty-state {
          padding: 32px;
          text-align: center;
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          color: #6b7280;
        }

        .empty-state p {
          margin: 0;
          font-size: 14px;
        }

        .requirement-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: border-color 0.2s;
        }

        .requirement-item:hover {
          border-color: #3b82f6;
        }

        .requirement-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .requirement-fields {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
        }

        .field-select,
        .field-input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          color: #374151;
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .field-select:focus,
        .field-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .field-select:disabled,
        .field-input:disabled,
        .field-input.disabled {
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .delete-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          color: #ef4444;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .delete-button:hover:not(:disabled) {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .delete-button:disabled {
          color: #d1d5db;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .requirements-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .add-button {
            width: 100%;
            justify-content: center;
          }

          .requirement-fields {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
