import { useState, useMemo, useEffect } from "react"
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
    formFields?: Record<string, any>;
  };
}

interface GraphData {
  nodes: RawNode[];
  forms: RawForm[];
  edges: Array<{ source: string; target: string }>;
}

interface ProcessedNode extends RawNode {
  form: RawForm | undefined;
}

interface PrefillMapping {
  sourceType: 'NODE_FIELD' | 'GLOBAL_DATA';
  sourceNodeId?: string;
  sourceFieldKey?: string;
  globalDataKey?: string;
}

interface NodeInfoProps {
    graphData: GraphData | undefined;
    selectedNodeId: string | undefined;
    isOpen: boolean;
    onClose: () => void;
    onUpdateNodeField: (nodeId: string, fieldKey: string, value: any) => void;
    globalData: Record<string, any>;
}

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

const traverseUpstreamForData = (currentNodeId: string, fieldKey: string, graphData: GraphData, processedNodes: ProcessedNode[]): any => {
    // Find direct upstream nodes (immediate predecessors)
    const upstreamEdges = graphData.edges.filter(edge => edge.target === currentNodeId);
    
    for (const edge of upstreamEdges) {
        const upstreamNode = processedNodes.find(n => n.id === edge.source);
        if (!upstreamNode) continue;
        
        // Check if upstream node has data for this field
        const upstreamValue = upstreamNode.data.formFields?.[fieldKey];
        if (upstreamValue !== undefined && upstreamValue !== null && upstreamValue !== '') {
            return upstreamValue; // Found data, return it
        }
        
        // If no data found, recursively check further upstream
        const deeperValue = traverseUpstreamForData(edge.source, fieldKey, graphData, processedNodes);
        if (deeperValue !== undefined && deeperValue !== null && deeperValue !== '') {
            return deeperValue; // Found data deeper upstream
        }
    }
    
    return null; // No data found in entire upstream chain
};

const findUpstreamSourceNode = (currentNodeId: string, fieldKey: string, graphData: GraphData, processedNodes: ProcessedNode[]): string | null => {
    // Find direct upstream nodes (immediate predecessors)
    const upstreamEdges = graphData.edges.filter(edge => edge.target === currentNodeId);
    
    for (const edge of upstreamEdges) {
        const upstreamNode = processedNodes.find(n => n.id === edge.source);
        if (!upstreamNode) continue;
        
        // Check if upstream node has data for this field
        const upstreamValue = upstreamNode.data.formFields?.[fieldKey];
        if (upstreamValue !== undefined && upstreamValue !== null && upstreamValue !== '') {
            return edge.source; // Found data, return the source node ID
        }
        
        // If no data found, recursively check further upstream
        const deeperSource = findUpstreamSourceNode(edge.source, fieldKey, graphData, processedNodes);
        if (deeperSource) {
            return deeperSource; // Found data deeper upstream
        }
    }
    
    return null; // No data found in entire upstream chain
};

const NodeInfo = ({ graphData, selectedNodeId, isOpen, onClose, onUpdateNodeField, globalData }: NodeInfoProps) => {
    const [prefillMappings, setPrefillMappings] = useState<Record<string, Record<string, PrefillMapping>>>({});
    const [fieldToMap, setFieldToMap] = useState<string | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [autoPrefillEnabled, setAutoPrefillEnabled] = useState<Record<string, boolean>>({});
    
    const processedNodes: ProcessedNode[] = useMemo(() => {
        if (!graphData) return [];
        return processGraphData(graphData);
    }, [graphData]);
    
    const selectedNode = processedNodes.find(n => n.id === selectedNodeId);

    // Auto-prefill by traversing upstream chain when form is clicked
    useEffect(() => {
        if (!graphData || !selectedNodeId || !selectedNode) return;

        const currentMappings = prefillMappings[selectedNodeId] || {};
        const targetFields = Object.keys(selectedNode.form?.field_schema.properties || {});

        targetFields.forEach(targetFieldKey => {
            const mapping = currentMappings[targetFieldKey];
            let sourceValue: any = null;

            if (mapping) {
                // Use existing mapping (always works regardless of auto-prefill toggle)
                if (mapping.sourceType === 'NODE_FIELD' && mapping.sourceFieldKey) {
                    sourceValue = traverseUpstreamForData(selectedNodeId, mapping.sourceFieldKey, graphData, processedNodes);
                } else if (mapping.sourceType === 'GLOBAL_DATA' && mapping.globalDataKey) {
                    sourceValue = globalData[mapping.globalDataKey];
                }
            } else if (autoPrefillEnabled[selectedNodeId]) {
                // No mapping exists - automatically check upstream for same field name (only if auto-prefill enabled)
                sourceValue = traverseUpstreamForData(selectedNodeId, targetFieldKey, graphData, processedNodes);
                
                // If we found data upstream, create an automatic mapping with source node ID
                if (sourceValue !== undefined && sourceValue !== null && sourceValue !== '') {
                    const sourceNodeId = findUpstreamSourceNode(selectedNodeId, targetFieldKey, graphData, processedNodes);
                    if (sourceNodeId) {
                        setPrefillMappings(prev => ({
                            ...prev,
                            [selectedNodeId]: {
                                ...(prev[selectedNodeId] || {}),
                                [targetFieldKey]: {
                                    sourceType: 'NODE_FIELD',
                                    sourceNodeId: sourceNodeId,
                                    sourceFieldKey: targetFieldKey
                                }
                            }
                        }));
                    }
                }
            }

            if (sourceValue !== undefined && sourceValue !== null && sourceValue !== '') {
                // Only update if the current value is different to prevent infinite loops
                const currentValue = selectedNode.data.formFields?.[targetFieldKey];
                if (currentValue !== sourceValue) {
                    onUpdateNodeField(selectedNodeId, targetFieldKey, sourceValue);
                }
            }
        });
    }, [graphData, selectedNodeId, selectedNode?.id, prefillMappings, globalData, onUpdateNodeField, autoPrefillEnabled]);

    // Check upstream sources and clear fields when sources are invalid
    useEffect(() => {
        if (!graphData || !selectedNodeId || !selectedNode) return;

        const currentMappings = prefillMappings[selectedNodeId] || {};
        const targetFields = Object.keys(selectedNode.form?.field_schema.properties || {});

        targetFields.forEach(targetFieldKey => {
            const mapping = currentMappings[targetFieldKey];
            if (!mapping) return;

            if (mapping.sourceType === 'NODE_FIELD' && mapping.sourceFieldKey) {
                // Check if upstream chain has data
                const sourceValue = traverseUpstreamForData(selectedNodeId, mapping.sourceFieldKey, graphData, processedNodes);
                const currentValue = selectedNode.data.formFields?.[targetFieldKey];
                
                if (!sourceValue || sourceValue === '') {
                    // No data found in upstream chain, clear the field only if it has data
                    if (currentValue && currentValue !== '') {
                        onUpdateNodeField(selectedNodeId, targetFieldKey, '');
                    }
                }
            }
        });
    }, [graphData, selectedNodeId, selectedNode?.id, prefillMappings, processedNodes, onUpdateNodeField]);

    const availableSources = useMemo(() => {
        if (!graphData || !selectedNodeId) return {};

        const predecessorIds = findPredecessorNodeIds(selectedNodeId, graphData);
        const sources: Record<string, Array<{ nodeId?: string; fieldKey: string; value: any; sourceType: 'NODE_FIELD' | 'GLOBAL_DATA'; globalDataKey?: string }>> = {};

        // Add global data sources
        sources['Global Data'] = Object.entries(globalData).map(([key, value]) => ({
            fieldKey: key,
            value: value,
            sourceType: 'GLOBAL_DATA' as const,
            globalDataKey: key
        }));

        // Add predecessor node sources
        predecessorIds.forEach(predecessorId => {
            const predecessorNode = processedNodes.find(n => n.id === predecessorId);
            if (predecessorNode && predecessorNode.form) {
                const nodeName = predecessorNode.data.name;
                const formFields = predecessorNode.data.formFields || {};
                
                Object.keys(predecessorNode.form.field_schema.properties).forEach(fieldKey => {
                    if (!sources[nodeName]) sources[nodeName] = [];
                    sources[nodeName].push({
                        nodeId: predecessorId,
                        fieldKey: fieldKey,
                        value: formFields[fieldKey] || '',
                        sourceType: 'NODE_FIELD' as const
                    });
                });
            }
        });

        return sources;
    }, [graphData, selectedNodeId, processedNodes, globalData]);

    const handleMapField = (fieldId: string) => {
        setFieldToMap(fieldId);
    };

    const handleSaveMapping = (targetFieldId: string, sourceType: 'NODE_FIELD' | 'GLOBAL_DATA', sourceNodeId?: string, sourceFieldKey?: string, globalDataKey?: string) => {
        if (!selectedNodeId) return;
        
        setPrefillMappings(prev => ({
            ...prev,
            [selectedNodeId]: {
                ...(prev[selectedNodeId] || {}),
                [targetFieldId]: {
                    sourceType,
                    sourceNodeId,
                    sourceFieldKey,
                    globalDataKey
                }
            }
        }));
        setFieldToMap(null);
    };

    const handleClearMapping = (targetFieldId: string) => {
        if (!selectedNodeId) return;
        
        setPrefillMappings(prev => {
            const newMappings = { ...prev };
            if (newMappings[selectedNodeId]) {
                const nodeMappings = { ...newMappings[selectedNodeId] };
                delete nodeMappings[targetFieldId];
                newMappings[selectedNodeId] = nodeMappings;
            }
            return newMappings;
        });
        
        // Disable auto-prefill when mapping is cleared
        setAutoPrefillEnabled(prev => ({
            ...prev,
            [selectedNodeId]: false
        }));
        
        // Clear the field value when mapping is removed
        if (selectedNodeId) {
            onUpdateNodeField(selectedNodeId, targetFieldId, '');
        }
    };

    const handleFieldValueChange = (fieldKey: string, value: any) => {
        if (selectedNodeId) {
            onUpdateNodeField(selectedNodeId, fieldKey, value);
        }
    };

    const getActualSourceInfo = (targetFieldKey: string, mapping: PrefillMapping) => {
        if (mapping.sourceType === 'GLOBAL_DATA' && mapping.globalDataKey) {
            return `Global.${mapping.globalDataKey}`;
        }
        
        if (mapping.sourceType === 'NODE_FIELD' && mapping.sourceFieldKey) {
            // Find the actual source by traversing upstream
            const sourceValue = traverseUpstreamForData(selectedNodeId!, mapping.sourceFieldKey, graphData!, processedNodes);
            if (sourceValue !== null) {
                // Find which upstream node has this data
                const upstreamEdges = graphData!.edges.filter(edge => edge.target === selectedNodeId);
                for (const edge of upstreamEdges) {
                    const upstreamNode = processedNodes.find(n => n.id === edge.source);
                    if (upstreamNode && upstreamNode.data.formFields?.[mapping.sourceFieldKey] === sourceValue) {
                        return `${upstreamNode.data.name}.${mapping.sourceFieldKey}`;
                    }
                }
            }
            return `Upstream.${mapping.sourceFieldKey}`;
        }
        
        return 'Unknown source';
    };

    const renderFormFields = () => {
        if (!selectedNode || !selectedNode.form) {
            return <p>No form data available for this node.</p>;
        }
        
        const targetFields = Object.keys(selectedNode.form.field_schema.properties);
        const currentMappings = selectedNodeId ? (prefillMappings[selectedNodeId] || {}) : {};
        const formFields = selectedNode.data.formFields || {};
        
        return (
            <div className="form-fields-container">
                <div className="form-fields-header">
                    <h3>Form Fields</h3>
                    <div className="auto-prefill-toggle">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={selectedNodeId ? (autoPrefillEnabled[selectedNodeId] || false) : false}
                                onChange={(e) => selectedNodeId && setAutoPrefillEnabled(prev => ({
                                    ...prev,
                                    [selectedNodeId]: e.target.checked
                                }))}
                                className="toggle-checkbox"
                            />
                            <span className="toggle-text">Auto Prefill</span>
                        </label>
                    </div>
                </div>
                <div className="fields-list">
                    {targetFields.map(fieldKey => {
                        const mapping = currentMappings[fieldKey];
                        const isMapped = !!mapping;
                        const fieldValue = formFields[fieldKey] || '';

                        return (
                            <div key={fieldKey} className="field-container">
                                <div className="field-header">
                                    <label className="field-label">{fieldKey}</label>
                                    <div className="field-actions">
                                        {!isMapped ? (
                                            <button 
                                                onClick={() => handleMapField(fieldKey)}
                                                className="map-button"
                                            >
                                                Map Prefill
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleClearMapping(fieldKey)}
                                                className="clear-button"
                                            >
                                                Clear Mapping
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <input
                                    type="text"
                                    value={fieldValue}
                                    readOnly
                                    className={`field-input ${isMapped ? 'mapped' : ''}`}
                                    placeholder={`Enter ${fieldKey}...`}
                                />
                                
                                {isMapped && (
                                    <div className="mapping-info">
                                        <small>
                                            Prefilled from: {getActualSourceInfo(fieldKey, mapping)}
                                        </small>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderPrefillModal = () => {
        if (!fieldToMap) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-container">
                    <div className="modal-header">
                        <h3>Select Prefill Source for: {fieldToMap}</h3>
                        <button 
                            onClick={() => setFieldToMap(null)} 
                            className="modal-close-button"
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className="modal-body">
                        <div className="sources-list">
                            {Object.entries(availableSources).map(([nodeName, fields]) => (
                                <div key={nodeName} className="source-group">
                                    <button
                                        className="group-header"
                                        onClick={() => setExpandedGroups(prev => ({ 
                                            ...prev, 
                                            [nodeName]: !prev[nodeName] 
                                        }))}
                                    >
                                        <span>{nodeName}</span>
                                        <span className="group-arrow">
                                            {expandedGroups[nodeName] ? '▾' : '▸'}
                                        </span>
                                    </button>
                                    
                                    {expandedGroups[nodeName] && (
                                        <div className="group-fields">
                                            {fields.map((field, idx) => (
                                                <div
                                                    key={idx}
                                                    className="source-field"
                                                    onClick={() => handleSaveMapping(
                                                        fieldToMap, 
                                                        field.sourceType, 
                                                        field.nodeId, 
                                                        field.fieldKey, 
                                                        field.globalDataKey
                                                    )}
                                                >
                                                    <div className="field-name">{field.fieldKey}</div>
                                                    <div className="field-value">{field.value || '(empty)'}</div>
                                                    <div className="field-type">{field.sourceType === 'GLOBAL_DATA' ? 'Global' : 'Node'}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="modal-footer">
                        <button 
                            onClick={() => setFieldToMap(null)} 
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                    </div>
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
                        <h2 className="main-modal-title">Node: {selectedNode?.data.name}</h2>
                        <p className="main-modal-subtitle">Form: {selectedNode?.form?.name || 'No Form Linked'}</p>
                    </div>
                    <button onClick={onClose} className="main-modal-close">&times;</button>
                </div>

                {renderFormFields()}
                {renderPrefillModal()}
            </div>
        </div>
    );
};

export default NodeInfo;