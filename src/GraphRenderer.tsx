import {useEffect, useState, useCallback} from "react"
import {ReactFlow, Node, Edge,} from '@xyflow/react'; 
import '@xyflow/react/dist/style.css'
import "./css/Graphrenderer.css"

const API_URL = "http://localhost:3000/api/v1/123/actions/blueprints/bp_456/bpv_123/graph";

export const fetchGraphData = async (): Promise<any> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};

const processGraphData = (data: any): { nodes: Node[], edges: Edge[] } => {
	const edgesRaw: Array<{ source: string; target: string }> = data.edges || []

	const nodes: Node[] = (data.nodes || []).map((node: any) => ({
		id: node.id,
		data: { 
			label: node?.data?.name,
			formFields: node?.data?.formFields || {}, // Store form field values
			componentId: node?.data?.component_id
		},
		position: node.position
	}))

	const edges: Edge[] = edgesRaw.map((edge: any, index: number) => ({
		id: `e-${edge.source}-${edge.target}-${index}`,
		source: edge.source,
		target: edge.target,
	}))
	
	return { nodes, edges };
};

interface GraphRenderProps {
    graphData?: any;
    onSelectNode?: (nodeId: string) => void;
    onUpdateNodeField?: (nodeId: string, fieldKey: string, value: any) => void;
}

const GraphRender = ({ graphData, onSelectNode, onUpdateNodeField }: GraphRenderProps) => {
    const [nodes, addNode] = useState<Node[]>([])
    const [edges, addEdge] = useState<Edge[]>([])

    // Suppress ResizeObserver errors comprehensively
    useEffect(() => {
        const handleResizeObserverError = (e: ErrorEvent) => {
            if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
                e.stopImmediatePropagation();
                e.preventDefault();
                return false;
            }
        };

        const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
            if (e.reason && e.reason.message === 'ResizeObserver loop completed with undelivered notifications.') {
                e.preventDefault();
                return false;
            }
        };

        // Add multiple event listeners to catch all possible error paths
        window.addEventListener('error', handleResizeObserverError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        
        // Also suppress console errors for this specific case
        const originalConsoleError = console.error;
        console.error = (...args) => {
            if (args[0] && typeof args[0] === 'string' && 
                args[0].includes('ResizeObserver loop completed with undelivered notifications')) {
                return; // Suppress this specific error
            }
            originalConsoleError.apply(console, args);
        };

        return () => {
            window.removeEventListener('error', handleResizeObserverError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            console.error = originalConsoleError;
        };
    }, []);

    const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        if (onSelectNode) {
            onSelectNode(node.id);
        }
    }, [onSelectNode]);

    useEffect(() => {
        // Debounce updates to prevent rapid ResizeObserver triggers
        const timeoutId = setTimeout(() => {
            if (graphData) {
                const { nodes, edges } = processGraphData(graphData)
                addNode(nodes)
                addEdge(edges)
                return
            }

            (async () => {  
                try {
                    const data = await fetchGraphData()
                    const { nodes, edges } = processGraphData(data);
                    addNode(nodes)
                    addEdge(edges)
                } catch (error) {
                    console.error("Error fetching DAG: ", error); 
                }
            })()
        }, 100); // 100ms debounce

        return () => clearTimeout(timeoutId);
    }, [graphData])

    return (
        <>
            <h1>Graph Visualization</h1>
            <div className="graph-container">
                <ReactFlow 
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={handleNodeClick}
                    fitView 
                    fitViewOptions={{ padding: 0.1 }}
                    minZoom={0.1}
                    maxZoom={2}
                    deleteKeyCode={null}
                    multiSelectionKeyCode={null}
                    selectionKeyCode={null}
                    preventScrolling={false}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={true}
                />
            </div>
        </>
    )
}

export default GraphRender;