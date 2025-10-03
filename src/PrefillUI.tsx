import { useState, useMemo } from "react"
import "./css/PrefillUI.css"

interface RawForm {
  id: string;
  name: string;
  field_schema: { properties: Record<string, any> };
}

interface RawNode {
  id: string;
  data: {
    name: string;
    component_id: string;
  };
}

interface Edge {
    source: string;
    target: string;
}

interface GraphData {
  nodes: RawNode[];
  forms: RawForm[];
  edges: Edge[];
}

interface ProcessedNode extends RawNode {
  form: RawForm | undefined;
}

interface MappingRule {
  sourceType: 'FORM_FIELD' | 'GLOBAL_DATA'; 
  sourceValue: string; 
  sourceLabel: string;
}

type PrefillMappings = Record<string, Record<string, MappingRule>>;

interface SourceField {
    groupName: string;
    fieldKey: string;
    sourceValue: string;
    sourceLabel: string;
    sourceType: 'FORM_FIELD' | 'GLOBAL_DATA';
}

const BoxIcon = ({ className = "box-icon", style }: { className?: string; style?: React.CSSProperties }) => (
    <div className={className} style={style} />
);

const processGraphData = (data: GraphData): ProcessedNode[] => {
  const formMap = new Map(data.forms.map(form => [form.id, form]));
  return data.nodes.map(node => ({
    ...node,
    form: formMap.get(node.data.component_id),
  }));
};

const findPredecessorNodeIds = (targetNodeId: string, data: GraphData): string[] => {
    if (!data.edges) return [];
    
    const predecessors = new Set<string>();
    const queue = [targetNodeId];

    while (queue.length > 0) {
        const currentId = queue.shift()!;
        
        const parents = data.edges.filter(edge => edge.target === currentId);
        
        parents.forEach(edge => {
            if (!predecessors.has(edge.source)) {
                predecessors.add(edge.source);
                queue.push(edge.source);
            }
        });
    }
    predecessors.delete(targetNodeId); 
    return Array.from(predecessors);
};

interface PrefillUIProps {
    graphData: GraphData | undefined;
    selectedNodeId: string | undefined;
    isOpen: boolean;
    onClose: () => void;
    updateNodeValue: (nodeId: string, fieldKey: string, value: any) => void;
}

const PrefillUI = ({ graphData, selectedNodeId, isOpen, onClose, updateNodeValue }: PrefillUIProps) => {
    const [prefillMappings, setPrefillMappings] = useState<PrefillMappings>({});
    const [fieldToMap, setFieldToMap] = useState<string | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [selectedSource, setSelectedSource] = useState<SourceField | null>(null);
    
    const processedNodes: ProcessedNode[] = useMemo(() => {
        if (!graphData) return [];
        return processGraphData(graphData);
    }, [graphData]);
    
    const selectedNode = processedNodes.find(n => n.id === selectedNodeId);

    const availableSources: SourceField[] = useMemo(() => {
        if (!graphData || !selectedNodeId) return [];

        const sourceFields: SourceField[] = [];
        const predecessorIds = findPredecessorNodeIds(selectedNodeId, graphData);

        predecessorIds.forEach(id => {
            const predecessorNode = processedNodes.find(n => n.id === id);
            if (predecessorNode && predecessorNode.form) {
                const { form } = predecessorNode;
                const fieldProperties = form.field_schema.properties;
                
                Object.keys(fieldProperties).forEach(fieldKey => {
                    sourceFields.push({
                        groupName: predecessorNode.data.name,
                        fieldKey: fieldKey,
                        sourceValue: `${predecessorNode.data.name}.${fieldKey}`,
                        sourceLabel: `${fieldKey}: ${predecessorNode.data.name}.${fieldKey}`,
                        sourceType: 'FORM_FIELD'
                    });
                });
            }
        });

        sourceFields.push(
            { groupName: "Global Data", fieldKey: "User ID", sourceValue: "Global.userId", sourceLabel: "User ID: Global.userId", sourceType: 'GLOBAL_DATA' },
            { groupName: "Global Data", fieldKey: "Timestamp", sourceValue: "Global.timestamp", sourceLabel: "Timestamp: Global.timestamp", sourceType: 'GLOBAL_DATA' }
        );

        return sourceFields;
    }, [graphData, selectedNodeId, processedNodes]);
    
    const handleMapField = (fieldId: string) => {
        if (!selectedNodeId) return;
        setSelectedSource(null)
        setFieldToMap(fieldId);
    };
    
    const handleSaveMapping = (targetFieldId: string, rule: MappingRule) => {
        if (!selectedNodeId) return;
        
        setPrefillMappings(prev => ({
            ...prev,
            [selectedNodeId]: {
                ...(prev[selectedNodeId] || {}),
                [targetFieldId]: rule,
            }
        }));
        setFieldToMap(null);
    };

    const handleClearMapping = (targetFieldId: string) => {
        if (!selectedNodeId) return;
        
        setPrefillMappings(prev => {
            const nodeMappings = { ...(prev[selectedNodeId] || {}) };
            delete nodeMappings[targetFieldId];
            return {
                ...prev,
                [selectedNodeId]: nodeMappings,
            };
        });
    };

    const renderMappingTable = () => {
        if (!selectedNode || !selectedNode.form) {
            return <p className="text-gray-600">No form data found for this node.</p>;
        }
        
        const targetFields = Object.keys(selectedNode.form.field_schema.properties);
        const currentMappings = prefillMappings[selectedNode.id] || {};
        
        return (
            <div className="mt-6">
                <div className="space-y-3">
                    {targetFields.map(fieldId => {
                        const mapping = currentMappings[fieldId];
                        const isMapped = !!mapping;

                        return (
                            <div 
                                key={fieldId}
                                className={`field-box ${isMapped ? 'mapped' : 'unmapped'}`}
                                onClick={() => !isMapped && handleMapField(fieldId)}
                            >
                                <BoxIcon style={{ width: '20px', height: '20px', marginRight: '12px' }} />
                                <div className="field-content">
                                    <div className="field-name">{fieldId}</div>
                                    {isMapped && (
                                        <div className="field-mapping">{mapping.sourceLabel}</div>
                                    )}
                                </div>
                                {isMapped && (
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation();
                                            handleClearMapping(fieldId); 
                                        }}
                                        className="remove-button"
                                        title="Remove mapping"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (!graphData || !isOpen) return null;

    return (
        <div className="main-modal-overlay">
            <div className="main-modal-container">
                <div className="main-modal-header">
                    <div>
                        <h2 className="main-modal-title">Configuring: {selectedNode?.data.name}</h2>
                        <p className="main-modal-subtitle">Linked Form: {selectedNode?.form?.name || 'Form Not Found'}</p>
                    </div>
                    <button onClick={onClose} className="main-modal-close">&times;</button>
                </div>

                                {renderMappingTable()}

                <div className="summary-box">
                    <h4 className="summary-title">Available Source Summary</h4>
                    <p className="summary-text">This form can be prefilled by {availableSources.length} source fields.</p>
                </div>
                
                {fieldToMap && (
                    <div className="modal-overlay">
                        <div className="modal-container">
                            <div className="modal-header">
                                <h3 className="modal-title">Select data element to map</h3>
                                <button 
                                    onClick={() => setFieldToMap(null)} 
                                    className="modal-close-button"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="modal-sidebar">
                                    <h4 className="sidebar-title">Available data</h4>
                                    <div className="sidebar-content">
                                        {Object.entries(
                                            availableSources.reduce<Record<string, SourceField[]>>((acc, s) => {
                                                acc[s.groupName] = acc[s.groupName] || []
                                                acc[s.groupName].push(s)
                                                return acc
                                            }, {})
                                        ).map(([group, items]) => (
                                            <div key={group} className="group-container">
                                                <button
                                                    className="group-button"
                                                    onClick={() => setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))}
                                                >
                                                    <span>{group}</span>
                                                    <span className="group-arrow">{expandedGroups[group] ? '▾' : '▸'}</span>
                                                </button>
                                                {expandedGroups[group] && (
                                                    <div className="group-items">
                                                        {items.map((item, idx) => {
                                                            const isActive = selectedSource?.sourceValue === item.sourceValue
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className={`group-item ${isActive ? 'active' : ''}`}
                                                                    onClick={() => setSelectedSource(item)}
                                                                >
                                                                    {item.fieldKey}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                </div>
                            ))}
                                    </div>
                        </div>

                                <div className="modal-main">
                                    {selectedSource ? (
                                        <div>
                                            <h4 className="detail-title">{selectedSource.fieldKey}</h4>
                                            <div className="detail-list">
                                                <div className="detail-item">
                                                    <span className="detail-label">Group:</span>
                                                    <span className="detail-value">{selectedSource.groupName}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Path:</span>
                                                    <span className="detail-value">{selectedSource.sourceLabel}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Type:</span>
                                                    <span className="detail-value">{selectedSource.sourceType === 'FORM_FIELD' ? 'Form Field' : 'Global'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <div className="empty-state-content">
                                                <div className="empty-state-title">Select an item on the left</div>
                                                <div className="empty-state-subtitle">to view details</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                        <button 
                                    onClick={() => setFieldToMap(null)} 
                                    className="modal-button cancel"
                        >
                            Cancel
                        </button>
                                <button
                                    disabled={!selectedSource}
                                    className={`modal-button select ${selectedSource ? 'enabled' : 'disabled'}`}
                                    onClick={() => selectedSource && handleSaveMapping(fieldToMap!, { sourceType: selectedSource.sourceType, sourceValue: selectedSource.sourceValue, sourceLabel: selectedSource.sourceLabel })}
                                >
                                    Select
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                </div>
        </div>
    );
};

export default PrefillUI;       